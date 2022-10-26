import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { blobsInContainer, transferBlobProgress } from 'src/app/store/azure-file-storage/selectors/azure-file-storage.selector';
import { getBlobsAction, uploadBlobAction, transferBlobProgressAction, deleteBlobAction, downloadBlobAction } from 'src/app/store/azure-file-storage/actions';
import { environment } from 'src/environments/environment';
import { BlobsInContainer } from 'src/app/store/azure-file-storage/models/azure-file-storage.model';


@Component({
    templateUrl: './azure-file-storage.component.html',
    styleUrls: ['azure-file-storage.component.scss']
})

export class AzureFileStorageComponent implements OnInit, AfterViewInit {
    @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
    file: File = {} as File;
    isStorageConfigured: boolean = true;
    showTransferProgress: boolean = false;

    public blobsInContainer$ = this.store.select(blobsInContainer);
    public transferBlobProgress$ = this.store.select(transferBlobProgress)


    constructor(private store: Store, private ngZone: NgZone) { }

    ngOnInit(): void {
        this.isStorageConfigured = this.checkStorageConfig();

        if (this.isStorageConfigured) {
            this.ngZone.run(() => {
                this.store.dispatch(getBlobsAction.getBlobsList());
            });
        }

    }

    ngAfterViewInit(): void {
        this.transferBlobProgress$.subscribe({
            next: (val: number) => {
                this.displayTransferProgress(val)
            }
        });
    }

    private checkStorageConfig() {
        return (!environment?.azure_sasToken || !environment?.azure_storageAccountName) ? false : true;
    }


    private displayTransferProgress(transferProgressVal: number) {
        if (transferProgressVal > 0 && transferProgressVal < 100) {
            this.showTransferProgress = true;
        } else {
            setTimeout(() => {
                this.showTransferProgress = false;
                this.ngZone.run(() => {
                    this.store.dispatch(transferBlobProgressAction.transferBlobProgress({ transferBlobProgressVal: 0 }));
                });
            }, 1000);
        }

        const transferProgressBarEle = document.getElementById('processProgressBar');
        if (transferProgressBarEle) {
            transferProgressBarEle.style.width = transferProgressVal + '%';
            transferProgressBarEle.innerHTML = transferProgressVal + '%';
        }

    }

    public showFileDialog(): void {
        this.fileInput?.nativeElement?.click();
    }

    public onFileSelected(event: any) {
        this.file = event.target.files[0];
        this.ngZone.run(() => {
            this.store.dispatch(uploadBlobAction.uploadBlob({ file: this.file }));
        });

    }

    public deleteBlobFile(file: string) {
        const fileName = file.split('/').pop();
        if (fileName) {
            this.ngZone.run(() => {
                this.store.dispatch(deleteBlobAction.deleteBlob({ blobName: fileName }))
            });
        }
    }

    public downloadBlobFile(blob: BlobsInContainer) {

        const fileName = blob?.blobUrls?.split('/')?.pop();
        if (fileName) {
            this.ngZone.run(() => {
                this.store.dispatch(downloadBlobAction.downloadBlob({ blobName: fileName, downloadFileByteSize: blob?.sizeInBytes }))
            });
        }

    }


}