import { Injectable, NgZone } from '@angular/core';
import { BlobDeleteOptions, BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { uploadBlobProgressAction } from '../actions';
import { UploadBlobProgress } from '../models/upload-blob-progress.model';


@Injectable({
    providedIn: 'root'
})

export class AzureFileStorageService {

    private blobService!: BlobServiceClient;
    private containerClient!: ContainerClient;


    constructor(private ngZone: NgZone, private store: Store) {

        if (environment.azure_storageAccountName && environment.azure_sasToken) {
            
            this.blobService = new BlobServiceClient(`https://${environment.azure_storageAccountName}.blob.core.windows.net/?${environment.azure_sasToken}`);

            this.containerClient = this.blobService.getContainerClient(environment.azure_storageContainerName);
        }
    }

    public async getBlobsFromStorageContainer() {
        const returnedBlobUrls: string[] = [];
        for await (const blob of this.containerClient.listBlobsFlat()) {
            returnedBlobUrls.push(`https://${environment.azure_storageAccountName}.blob.core.windows.net/${environment.azure_storageContainerName}/${blob.name}`);
        }
        return returnedBlobUrls;
    }

    public async uploadFileToBlob(file: File | null) {
        if (!file) return;

        // await this.containerClient.createIfNotExists({
        //     access: 'container',
        // });

        const blockBlobClient = await this.containerClient.getBlockBlobClient(file?.name);

        const uploadFileByteSize = file?.size;


        const bufferSize = file?.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
        const maxConcurrency = 8;

        const options = {
            blobHTTPHeaders: { blobContentType: file?.type },
            maxSingleShotSize: bufferSize,
            concurrency: maxConcurrency,
            onProgress: (data: UploadBlobProgress) => this.onUploadProgress(data, uploadFileByteSize),
        };

        await blockBlobClient.uploadData(file, options);

    };


    public async deleteBlobIfItExists(blobName: string) {

        const options: BlobDeleteOptions = {
            deleteSnapshots: 'include'
        };

        const blockBlobClient = await this.containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.deleteIfExists(options);

    }


    public onUploadProgress(progress: UploadBlobProgress, fileSize: number) {
        const percentage = Math.round(progress.loadedBytes / fileSize * 100);
        this.ngZone.run(() => {
            this.store.dispatch(uploadBlobProgressAction.uploadBlobProgress({ uploadBlobProgressVal: percentage }));
        });

    }

}