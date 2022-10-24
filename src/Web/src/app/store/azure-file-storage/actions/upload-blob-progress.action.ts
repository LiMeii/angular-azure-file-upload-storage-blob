import { createAction, props } from '@ngrx/store';
import { actionKey } from '../azure-file-storage.keys';

const actionPrefix = `${actionKey}[API]`;

export const uploadBlobProgress = createAction(`${actionPrefix} Upload Blob Progress`, props<{ uploadBlobProgressVal: number }>());