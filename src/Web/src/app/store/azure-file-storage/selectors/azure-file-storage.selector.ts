import { createFeatureSelector, createSelector } from '@ngrx/store';
import { featurekey } from '../azure-file-storage.keys';
import { AzureFileStorageState } from '../states';

const featureStateSelector = createFeatureSelector<AzureFileStorageState>(featurekey);

export const blobsInContainer = createSelector(featureStateSelector, (fs) => fs.blobsInContainer);

export const uploadBlobProgress = createSelector(featureStateSelector, (fs) => fs.uploadBlobProgress);