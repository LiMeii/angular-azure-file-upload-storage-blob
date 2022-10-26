import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { blobsInContainer, uploadBlobProgress } from 'src/app/store/azure-file-storage/selectors/azure-file-storage.selector';
import { getBlobsAction, uploadBlobAction, uploadBlobProgressAction, deleteBlobAction, downloadBlobAction } from 'src/app/store/azure-file-storage/actions';
import { environment } from 'src/environments/environment';


@Component({
    templateUrl: './azure-file-storage.component.html',
    styleUrls: ['azure-file-storage.component.scss']
})

export class AzureFileStorageComponent implements OnInit, AfterViewInit {
    @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
    file: File = {} as File;
    isStorageConfigured: boolean = true;
    showUploadProgress: boolean = false;

    public blobsInContainer$ = this.store.select(blobsInContainer);
    public uploadBlobProgress$ = this.store.select(uploadBlobProgress)


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
        this.uploadBlobProgress$.subscribe({
            next: (val: number) => {
                this.displayUploadProgress(val)
            }
        });
    }

    private checkStorageConfig() {
        return (!environment?.azure_sasToken || !environment?.azure_storageAccountName) ? false : true;
    }


    private displayUploadProgress(uploadProgressVal: number) {
        if (uploadProgressVal > 0 && uploadProgressVal < 100) {
            this.showUploadProgress = true
        } else {
            setTimeout(() => {
                this.showUploadProgress = false
            }, 1000);
        }

        const uploadProgressBarEle = document.getElementById('uploadProgressBar');
        if (uploadProgressBarEle) {
            uploadProgressBarEle.style.width = uploadProgressVal + '%';
            uploadProgressBarEle.innerHTML = uploadProgressVal + '%';
        }

    }

    public showFileDialog(): void {
        this.ngZone.run(() => {
            this.store.dispatch(uploadBlobProgressAction.uploadBlobProgress({ uploadBlobProgressVal: 0 }));
        });
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

    public downloadBlobFile(file: string) {
        const fileName = file.split('/').pop();
        if (fileName) {
            this.ngZone.run(() => {
                this.store.dispatch(downloadBlobAction.downloadBlob({ blobName: fileName }))
            });
        }

    }


}