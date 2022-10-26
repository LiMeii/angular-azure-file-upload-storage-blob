import { createAction, props } from '@ngrx/store';
import { actionKey } from '../azure-file-storage.keys';

const actionPrefix = `${actionKey}[API]`;

export const deleteBlob = createAction(`${actionPrefix} Delete Blob`, props<{ blobName: string }>());

export const deleteBlobSuccess = createAction(`${actionPrefix} Delete Blob Success`);

export const deleteBlobFailed = createAction(`${actionPrefix} Delete Blob Failed`, props<{ error: string }>());