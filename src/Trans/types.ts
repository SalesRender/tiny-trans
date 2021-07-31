import { TransError } from './errors';

export type Content = Record<string, unknown>;
export type DynamicContent<T extends Content> = () => Promise<{ default: T }>;
export type Variable = Record<string, string>;

export type TranslateOptions<Variables extends Variable = Variable> = {
  /**
   * ignore the error, handle error or throw error (by default)
   * */
  errorsMode?: 'ignore' | 'throw' | ((error: TransError) => string);
  /**
   * it uses for the plural if it exists
   * */
  count?: number;
  /**
   * for replaced the variable patters - {#variable}
   * */
  variables?: Variables;
};

export type Translate = <Variables extends Variable = Variable>(
  path: string | TemplateStringsArray,
  options?: TranslateOptions<Variables>
) => string;
