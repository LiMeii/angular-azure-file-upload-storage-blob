import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map } from 'rxjs/operators';
import { from, of } from 'rxjs';

import { deleteBlobAction, getBlobsAction } from '../actions';
import { AzureFileStorageService } from '../services/azure-file-storage.service';

@Injectable()
export class DeleteBlobEffects {
    constructor(
        private actions$: Actions,
        private azureFileStorageService: AzureFileStorageService,
    ) { }

    readonly deleteBlob$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteBlobAction.deleteBlob),
            switchMap((action) => {
                return from(this.azureFileStorageService.deleteBlobIfItExists(action.blobName)).pipe(
                    map(() => getBlobsAction.getBlobsList()),
                    catchError(() => of(deleteBlobAction.deleteBlobFailed({ error: 'failed to delete blob' })))
                );
            }),
        ),
    );
}
