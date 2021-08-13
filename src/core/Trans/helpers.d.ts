import { Content, ErrorsMode } from '../types';
export declare type PathArray = string[];
export declare const preparePath: (path: string) => PathArray;
export declare const parsePath: (path: string | TemplateStringsArray) => string;
export declare const getContentRecursive: (content: Content, pathArray: PathArray) => Content | string;
export declare const getContent: (content: Content | string, path: string) => Content | string;
export declare const validate: (callback: () => string, errorsMode?: ErrorsMode, extra?: string) => string | never;
