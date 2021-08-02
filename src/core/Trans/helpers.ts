import { Content, ErrorsMode, PluralFn, Variables } from '../types';
import { InvalidPath } from '../errors';
import { ContentPreparer } from '../ContentPreparer';

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

export const getContent = (content: Content | string, path: string): Content | string => {
  if (!content || typeof content !== 'object') return content;
  const pathArray = preparePath(path);
  return getContentRecursive(content, pathArray);
};

export const getResult = ({
  path,
  content,
  count,
  variables,
  errorsMode,
  pluralRecord,
  locale,
}: {
  path: string | TemplateStringsArray;
  content: Content | string;
  errorsMode: ErrorsMode;
  locale: string;
  count: number;
  pluralRecord: Record<string, PluralFn>;
  variables: Variables;
}): Content | string => {
  const $parsedPath = parsePath(path);
  const $content = getContent(content, $parsedPath);
  return new ContentPreparer($content, {
    errorsMode,
    locale,
    pluralFn: (pluralRecord || {})[locale],
  })
    .setCount(count)
    .setVariables(variables).content;
};
