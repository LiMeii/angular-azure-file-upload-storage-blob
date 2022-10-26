import { Action, createReducer, on } from '@ngrx/store';
import { initialState, AzureFileStorageState } from '../states';
import {
    getBlobsAction,
    transferBlobProgressAction,
} from '../actions';

const _reducer = createReducer<AzureFileStorageState>(
    initialState,
  on(getBlobsAction.getBlobsListSuccess, (state, action) => ({
    ...state,
    blobsInContainer: action.blobsInContainer
  })),

  on(transferBlobProgressAction.transferBlobProgress, (state, action) => ({
    ...state,
    transferBlobProgressVal: action.transferBlobProgressVal
  })),


);

export function reducer(
  state: AzureFileStorageState | undefined,
  action: Action,
): AzureFileStorageState {
  return _reducer(state, action);
}
