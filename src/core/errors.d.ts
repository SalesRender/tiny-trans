export declare class ContentNotFound extends Error {
}
export declare class ContentNotPlural extends Error {
}
export declare class PluralNotSupport extends Error {
}
export declare class InvalidTranslate extends Error {
}
export declare class InvalidPath extends Error {
}
export declare class InvalidErrorMode extends Error {
}
export declare type TransError = InvalidTranslate | ContentNotFound | ContentNotPlural;
