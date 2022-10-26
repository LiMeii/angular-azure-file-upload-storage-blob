import { BlobsInContainer } from "../models/azure-file-storage.model";


export interface AzureFileStorageState {
    blobsInContainer: BlobsInContainer[];
    transferBlobProgressVal: number;
}

export const initialState: AzureFileStorageState = {
    blobsInContainer: [],
    transferBlobProgressVal: 0
}