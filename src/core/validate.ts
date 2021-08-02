import { ErrorsMode } from './types';
import { InvalidErrorMode } from './errors';

export const validate = (errorsMode: ErrorsMode, callback: () => string, extra = ''): string | never => {
  try {
    return callback();
  } catch (e) {
    const error = new Error([`${e.message}`, extra].filter(Boolean).join('. '));
    if (errorsMode === 'ignore') return '';
    if (errorsMode === 'throw') throw error;
    if (typeof errorsMode === 'function') return errorsMode(error);
    throw new InvalidErrorMode(`errorsMode: "${errorsMode}"; as a json: ${JSON.stringify(errorsMode)}`);
  }
};
