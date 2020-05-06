/**
 *  Copyright (c) 2020 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

// import { loadSchema } from '@graphql-toolkit/core';
// import { UrlLoader } from '@graphql-toolkit/url-loader';

import { parse, GraphQLSchema, ParseOptions } from 'graphql';
import { Position } from 'lib/plugins/graphql/language-service/graphql-language-service-types/src';
import * as graphqlLS from 'lib/plugins/graphql/language-service/graphql-language-service-interface/src';
import { UrlLoader } from './url-schema-loader';

export class LanguageService {
  private _uri: string;
  private _headers: any;
  private _schema: GraphQLSchema | null;

  constructor({ schema, headers }: any) {
    this._uri = schema;
    this._headers = headers;
    this._schema = null;
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
    const loaded = await new UrlLoader().load(this._uri, {
      headers: this._headers,
    });
    this._schema = loaded.schema;
    return loaded.schema;
  }

  async parse(text: string, options?: ParseOptions) {
    return parse(text, options);
  }

  getCompletion = async (documentText: string, position: Position) =>
    graphqlLS.getAutocompleteSuggestions(
      await this.getSchema(),
      documentText,
      position
    );

  getDiagnostics = async (documentText: string) =>
    graphqlLS.getDiagnostics(documentText, await this.getSchema());

  getHover = async (documentText: string, position: Position) =>
    graphqlLS.getHoverInformation(
      await this.getSchema(),
      documentText,
      position
    );
}
