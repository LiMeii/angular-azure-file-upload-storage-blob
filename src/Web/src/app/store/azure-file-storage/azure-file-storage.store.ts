import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { featurekey } from './azure-file-storage.keys';
import { reducer } from './reducers/azure-file-storage.reducer';
import { GetBlobsEffects, DeleteBlobEffects, UploadBlobEffects } from './effects/index';

@NgModule({
    declarations: [],
    imports: [
        StoreModule.forFeature(featurekey, reducer),
        EffectsModule.forFeature([GetBlobsEffects, DeleteBlobEffects, UploadBlobEffects])
    ],
    providers: []
})

export class AzureFileStorageStoreModule { }