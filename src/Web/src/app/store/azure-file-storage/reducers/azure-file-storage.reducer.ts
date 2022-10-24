import { Action, createReducer, on } from '@ngrx/store';
import { initialState, AzureFileStorageState } from '../states';
import {
    getBlobsAction,
    uploadBlobAction,
    uploadBlobProgressAction,
    deleteBlobAction
} from '../actions';

const _reducer = createReducer<AzureFileStorageState>(
    initialState,
  on(getBlobsAction.getBlobsListSuccess, (state, action) => ({
    ...state,
    blobsInContainer: action.blobsInContainer
  })),

  on(uploadBlobProgressAction.uploadBlobProgress, (state, action) => ({
    ...state,
    uploadBlobProgress: action.uploadBlobProgressVal
  })),


);

export function reducer(
  state: AzureFileStorageState | undefined,
  action: Action,
): AzureFileStorageState {
  return _reducer(state, action);
}
