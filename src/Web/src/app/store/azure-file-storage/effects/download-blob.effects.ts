import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map } from 'rxjs/operators';
import { from, of } from 'rxjs';

import { downloadBlobAction } from '../actions';
import { AzureFileStorageService } from '../services/azure-file-storage.service';

@Injectable()
export class DownloadBlobEffects {
    constructor(
        private actions$: Actions,
        private azureFileStorageService: AzureFileStorageService,
    ) { }

    readonly downloadBlob$ = createEffect(() =>
        this.actions$.pipe(
            ofType(downloadBlobAction.downloadBlob),
            switchMap((action) => {
                return from(this.azureFileStorageService.downloadBlobToString(action.blobName)).pipe(
                    map(() => downloadBlobAction.downloadBlobSuccess()),
                    catchError(() => of(downloadBlobAction.downloadBlobFailed({ error: 'failed to download blob' })))
                );
            }),
        ),
    );
}
