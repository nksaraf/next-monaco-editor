import * as monaco from 'monaco-editor';

export interface IWordRange {
	/**
	 * The index where the word starts.
	 */
	readonly start: number;
	/**
	 * The index where the word ends.
	 */
	readonly end: number;
}

export interface IMirrorModel {
  readonly uri: monaco.Uri;
  readonly version: number;
	readonly eol: string;
	getValue(): string;
	getLinesContent(): string[];
	getLineCount(): number;
	getLineContent(lineNumber: number): string;
	getLineWords(lineNumber: number, wordDefinition: RegExp): monaco.editor.IWordAtPosition[];
	createWordIterator(wordDefinition: RegExp): Iterator<string>;
	getWordUntilPosition(position: monaco.IPosition, wordDefinition: RegExp): monaco.editor.IWordAtPosition;
	getValueInRange(range: monaco.IRange): string;
	getWordAtPosition(position: monaco.IPosition, wordDefinition: RegExp): monaco.Range | null;
	offsetAt(position: monaco.IPosition): number;
	positionAt(offset: number): monaco.IPosition;
  getValue(): string;
  getFullModelRange(): monaco.IRange;
}

export interface IWorkerContext<H = undefined> {
  /**
   * A proxy to the main thread host object.
   */
  host: H;
  /**
   * Get all available mirror models in this worker.
   */
  getMirrorModels(): IMirrorModel[];
}
