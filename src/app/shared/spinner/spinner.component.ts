import { Component, Input } from '@angular/core';

@Component({
  selector: 'spinner',
  template: `
    <div class="lds-dual-ring" *ngIf="visible"></div>
`,
})
export class SpinnerComponent {

  @Input() visible = true;

}
