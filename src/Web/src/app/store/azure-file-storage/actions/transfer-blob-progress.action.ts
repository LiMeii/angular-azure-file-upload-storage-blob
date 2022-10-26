import { createAction, props } from '@ngrx/store';
import { actionKey } from '../azure-file-storage.keys';

const actionPrefix = `${actionKey}[API]`;

export const transferBlobProgress = createAction(`${actionPrefix} Transfer Blob Progress`, props<{ transferBlobProgressVal: number }>());