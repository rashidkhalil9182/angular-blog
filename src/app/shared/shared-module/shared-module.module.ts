import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgbdSortableHeader } from '../directive/sortable.directive';




@NgModule({
  declarations: [PaginationComponent,
    SpinnerComponent, NgbdSortableHeader],
  imports: [
    CommonModule
  ],
  exports: [PaginationComponent, SpinnerComponent, NgbdSortableHeader],
  providers: []
})
export class SharedModuleModule { }
