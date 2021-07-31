/* eslint-disable max-classes-per-file */

export class ContentNotFound extends Error {}
export class InvalidContent extends Error {}

export type TransError = InvalidContent | ContentNotFound;
