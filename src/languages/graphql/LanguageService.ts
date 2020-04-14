/**
 *  Copyright (c) 2020 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

// import { loadSchema } from '@graphql-toolkit/core';
// import { UrlLoader } from '@graphql-toolkit/url-loader';

import { getIntrospectionQuery, buildClientSchema, print, printSchema } from 'graphql';
import { isWebUri } from 'valid-url';
import { fetch } from 'cross-fetch';
import { makeRemoteExecutableSchema } from 'graphql-tools-fork';
import { Loader, SingleFileOptions } from '@graphql-toolkit/common';
import { parse, GraphQLSchema, ParseOptions } from 'graphql';
import { Position } from 'graphql-language-service-types';
import * as graphqlLS from 'graphql-language-service-interface';

class UrlLoader {
    loaderId() {
        return 'url';
    }
    async canLoad(pointer, options) {
        return this.canLoadSync(pointer, options);
    }
    canLoadSync(pointer, _options) {
        return !!isWebUri(pointer);
    }
    async load(pointer, options) {
        let headers = {};
        let fetch$1 = fetch;
        let method = 'POST';
        if (options) {
            if (Array.isArray(options.headers)) {
                headers = options.headers.reduce((prev, v) => ({ ...prev, ...v }), {});
            }
            else if (typeof options.headers === 'object') {
                headers = options.headers;
            }
            // if (options.customFetch) {
            //     if (typeof options.customFetch === 'string') {
            //         const [moduleName, fetchFnName] = options.customFetch.split('#');
            //         fetch$1 = await import(moduleName).then(module => (fetchFnName ? module[fetchFnName] : module));
            //     }
            // }
            if (options.method) {
                method = options.method;
            }
        }
        let extraHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...headers,
        };
        const fetcher = async ({ query: queryDocument, variables, operationName }: any) => {
            const fetchResult = await fetch$1(pointer, {
                method,
                ...(method === 'POST'
                    ? {
                        body: JSON.stringify({ query: print(queryDocument), variables, operationName }),
                    }
                    : {}),
                headers: extraHeaders,
            });
            return fetchResult.json();
        };
        const body = await fetcher({
            query: parse(getIntrospectionQuery({ descriptions: true, ...options })),
            variables: {},
            operationName: 'IntrospectionQuery',
            // context: {},
        });
        let errorMessage;
        if (body.errors && body.errors.length > 0) {
            errorMessage = body.errors.map((item) => item.message).join(', ');
        }
        else if (!body.data) {
            errorMessage = JSON.stringify(body, null, 2);
        }
        if (errorMessage) {
            throw new Error('Unable to download schema from remote: ' + errorMessage);
        }
        if (!body.data.__schema) {
            throw new Error('Invalid schema provided!');
        }
        const clientSchema = buildClientSchema(body.data, options);
        const remoteExecutableSchema = makeRemoteExecutableSchema({
            schema: printSchema(clientSchema, options),
            fetcher,
        });
        return {
            location: pointer,
            schema: remoteExecutableSchema,
        };
    }
    loadSync() {
        throw new Error('Loader Url has no sync mode');
    }
}


type LSPConfig = {
  uri: string;
  parser?: typeof parse;
  // schemaLoaders?: Loader<string, SingleFileOptions>[];
};

export class LanguageService {
  private _parser: typeof parse;
  private _uri: string;
  private _schema: GraphQLSchema | null;
  // private _schemaLoaders: Loader<string, SingleFileOptions>[];

  constructor({ uri, parser, schemaLoaders }: LSPConfig) {
    this._uri = uri;
    this._parser = parser || parse;
    this._schema = null;
        // this._schemaLoaders = schemaLoaders || [new UrlLoader()];
  }

  public get schema() {
    return this._schema as GraphQLSchema;
  }

  async getSchema() {
    if (this.schema) {
      return this.schema;
    }
    return this.loadSchema();
  }

  async loadSchema() {
    if (!this._uri) {
      throw new Error('uri missing');
    }
    // const schema = await loadSchema(this._uri, {
    //   // load from endpoint
    //   loaders: this._schemaLoaders,
    // });
    const loaded = await new UrlLoader().load(this._uri, {});
    this._schema = loaded.schema;
    return loaded.schema;
  }

  async parse(text: string, options?: ParseOptions) {
    return this._parser(text, options);
  }

  getCompletion = async (
    documentText: string,
    position: Position,
  ) =>
    graphqlLS.getAutocompleteSuggestions(
      await this.getSchema(),
      documentText,
      position,
    );

  getDiagnostics = async (documentText: string) =>
    graphqlLS.getDiagnostics(documentText, await this.getSchema());

  getHover = async (documentText: string, position: Position) =>
    graphqlLS.getHoverInformation(
      await this.getSchema(),
      documentText,
      position,
    );
}
