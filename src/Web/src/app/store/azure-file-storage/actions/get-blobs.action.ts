import { createAction, props } from '@ngrx/store';
import { actionKey } from '../azure-file-storage.keys';
import { BlobsInContainer } from '../models/azure-file-storage.model';

const actionPrefix = `${actionKey}[API]`;

export const getBlobsList = createAction(`${actionPrefix} Get Blobs List`);

export const getBlobsListSuccess = createAction(`${actionPrefix} Get Blobs List Success`, props<{ blobsInContainer: BlobsInContainer[] }>());

export const getBlobsListFailed = createAction(`${actionPrefix} Get Blobs List Failed`, props<{ error: string }>());