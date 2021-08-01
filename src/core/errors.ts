/* eslint-disable max-classes-per-file */

export class ContentNotFound extends Error {}
export class ContentNotPlural extends Error {}
export class PluralNotSupport extends Error {}
export class InvalidTranslate extends Error {}
export class InvalidPath extends Error {}
export class InvalidErrorMode extends Error {}

export type TransError = InvalidTranslate | ContentNotFound | ContentNotPlural;
