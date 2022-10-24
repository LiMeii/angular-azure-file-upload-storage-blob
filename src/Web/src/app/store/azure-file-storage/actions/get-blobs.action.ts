import { createAction, props } from '@ngrx/store';
import { actionKey } from '../azure-file-storage.keys';

const actionPrefix = `${actionKey}[API]`;

export const getBlobsList = createAction(`${actionPrefix} Get Blobs List`);

export const getBlobsListSuccess = createAction(`${actionPrefix} Get Blobs List Success`, props<{ blobsInContainer: string[] }>());

export const getBlobsListFailed = createAction(`${actionPrefix} Get Blobs List Failed`, props<{ error: string }>());