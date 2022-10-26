import { createAction, props } from '@ngrx/store';
import { actionKey } from '../azure-file-storage.keys';

const actionPrefix = `${actionKey}[API]`;

export const downloadBlob = createAction(`${actionPrefix} Download Blob`, props<{ blobName: string }>());

export const downloadBlobSuccess = createAction(`${actionPrefix} Download Blob Success`);

export const downloadBlobFailed = createAction(`${actionPrefix} Download Blob Failed`, props<{ error: string }>());