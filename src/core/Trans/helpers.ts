import { Content } from '../types';
import { InvalidPath } from '../errors';

export type PathArray = string[];

export const preparePath = (path: string): PathArray => path.split('.');

export const parsePath = (path: string | TemplateStringsArray): string => {
  if (Array.isArray(path)) return path[0];
  if (typeof path === 'string') return path;
  throw new InvalidPath(`invalid path: ${path}, path as json: ${JSON.stringify(path)}`);
};

export const getContentRecursive = (content: Content, pathArray: PathArray): Content | string => {
  if (!content) return content;
  const path = pathArray.shift();
  if (pathArray.length) {
    return getContentRecursive((content as Record<string, Content>)[path], pathArray);
  }
  if (path) {
    return content[path] as Content | string;
  }
  return content;
};

export const getContent = (content: Content, path: string): Content | string => {
  if (!content || typeof content !== 'object') return content;
  const pathArray = preparePath(path);
  return getContentRecursive(content, pathArray);
};
