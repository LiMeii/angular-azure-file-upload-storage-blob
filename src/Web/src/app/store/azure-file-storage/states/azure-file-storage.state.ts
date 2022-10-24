

export interface AzureFileStorageState {
    blobsInContainer: string[];
    uploadBlobProgress: number;
}

export const initialState: AzureFileStorageState = {
    blobsInContainer: [],
    uploadBlobProgress: 0
}