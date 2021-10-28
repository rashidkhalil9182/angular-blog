import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumRoutingModule } from './album-routing.module';
import { AlbumListComponent } from './album-list/album-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlbumDetailComponent } from './album-detail/album-detail.component';
import { SharedModuleModule } from 'src/app/shared/shared-module/shared-module.module';


@NgModule({
  declarations: [
    AlbumListComponent,
    AlbumDetailComponent
  ],
  imports: [
    CommonModule,
    AlbumRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SharedModuleModule
  ]
})
export class AlbumModule { }
