import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map } from 'rxjs/operators';
import { from, of } from 'rxjs';

import { getBlobsAction } from '../actions';
import { AzureFileStorageService } from '../services/azure-file-storage.service';
import { BlobsInContainer } from '../models/azure-file-storage.model';

@Injectable()
export class GetBlobsEffects {
    constructor(
        private actions$: Actions,
        private azureFileStorageService: AzureFileStorageService,
    ) { }

    readonly getBlobs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(getBlobsAction.getBlobsList),
            switchMap((action) => {
                return from(this.azureFileStorageService.getBlobsFromStorageContainer()).pipe(
                    map((blobsInContainer: BlobsInContainer[]) => getBlobsAction.getBlobsListSuccess({ blobsInContainer })),
                    catchError(() => of(getBlobsAction.getBlobsListFailed({ error: 'failed to get blobs' })))
                );
            }),
        ),
    );
}
