import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhotoRoutingModule } from './photo-routing.module';
import { PhotoListComponent } from './photo-list/photo-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';
import { SharedModuleModule } from 'src/app/shared/shared-module/shared-module.module';


@NgModule({
  declarations: [
    PhotoListComponent,
    PhotoDetailComponent
  ],
  imports: [
    CommonModule,
    PhotoRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SharedModuleModule
  ]
})
export class PhotoModule { }
