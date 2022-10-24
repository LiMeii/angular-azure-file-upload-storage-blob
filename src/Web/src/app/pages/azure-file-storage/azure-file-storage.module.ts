import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AzureFileStorageStoreModule } from 'src/app/store/azure-file-storage/azure-file-storage.store';

import { AzureFileStorageComponent } from './azure-file-storage.component';


const routes: Route[] = [{ path: '', component: AzureFileStorageComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, AzureFileStorageStoreModule],
    declarations: [AzureFileStorageComponent]
})

export class AzureFileStorageModule {

}
