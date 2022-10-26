import { Injectable, NgZone } from '@angular/core';
import { BlobDeleteOptions, BlobDownloadOptions, BlobServiceClient, BlockBlobParallelUploadOptions, ContainerClient } from '@azure/storage-blob';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { transferBlobProgressAction } from '../actions';
import { BlobsInContainer, TransferBlobProgress } from '../models/azure-file-storage.model';


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
        const returnedBlobs: BlobsInContainer[] = [];
        for await (const blob of this.containerClient.listBlobsFlat()) {
            returnedBlobs.push({
                blobUrls: `https://${environment.azure_storageAccountName}.blob.core.windows.net/${environment.azure_storageContainerName}/${blob.name}`,
                sizeInBytes: blob?.properties?.contentLength ? blob?.properties?.contentLength : 0
            })
        }
        return returnedBlobs;
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

        const options: BlockBlobParallelUploadOptions = {
            blobHTTPHeaders: { blobContentType: file?.type },
            maxSingleShotSize: bufferSize,
            concurrency: maxConcurrency,
            onProgress: (data: TransferBlobProgress) => this.onTransferBlobProgress(data, uploadFileByteSize),
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


    public async downloadBlobToString(blobName: string, downloadFileByteSize: number) {

        const options: BlobDownloadOptions = {
            onProgress: (data: TransferBlobProgress) => this.onTransferBlobProgress(data, downloadFileByteSize)
        }

        const blobClient = await this.containerClient.getBlobClient(blobName);
        const downloadResponse = await blobClient.download(0, 0, options);

        if (downloadResponse?.blobBody) {
            downloadResponse?.blobBody.then(blob => {
                let objectURL = URL.createObjectURL(blob);
                var anchor = document.createElement("a");
                anchor.download = blobName;
                anchor.href = objectURL;
                anchor.click();
                anchor.remove();
            });
        }

    }

    public onTransferBlobProgress(progress: TransferBlobProgress, fileSize: number) {
        const percentage = Math.round(progress.loadedBytes / fileSize * 100);
        this.ngZone.run(() => {
            this.store.dispatch(transferBlobProgressAction.transferBlobProgress({ transferBlobProgressVal: percentage }));
        });

    }

}