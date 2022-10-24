import { createAction, props } from '@ngrx/store';
import { actionKey } from '../azure-file-storage.keys';

const actionPrefix = `${actionKey}[API]`;

export const uploadBlob = createAction(`${actionPrefix} Upload Blob`, props<{ file: File }>());

export const uploadBlobSuccess = createAction(`${actionPrefix} Upload Blob Success`);

export const uploadBlobFailed = createAction(`${actionPrefix} Upload Blob Failed`, props<{ error: string }>());