import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map } from 'rxjs/operators';
import { from, of } from 'rxjs';

import { getBlobsAction, uploadBlobAction } from '../actions';
import { AzureFileStorageService } from '../services/azure-file-storage.service';

@Injectable()
export class UploadBlobEffects {
    constructor(
        private actions$: Actions,
        private azureFileStorageService: AzureFileStorageService,
    ) { }

    readonly uploadBlob$ = createEffect(() =>
        this.actions$.pipe(
            ofType(uploadBlobAction.uploadBlob),
            switchMap((action) => {
                return from(this.azureFileStorageService.uploadFileToBlob(action.file)).pipe(
                    map(() => getBlobsAction.getBlobsList()),
                    catchError(() => of(uploadBlobAction.uploadBlobFailed({ error: 'failed to upload blob' })))
                );
            }),
        ),
    );
}
