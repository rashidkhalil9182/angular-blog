import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-blog';
  name: string = '';
  menu: Array<any> = [];
  breadcrumbList: Array<any> = [];

  route: string = '';
  routeLinks: number = 0;
  count: number = 0;
  constructor(private _router: Router, location: Location,) {
    _router.events.subscribe((val) => {
      if (location.path() !== '') {
        this.route = location.path();
        this.breadcrumbList = ('dashboard/' + this.route).split(/[?#]/)[0].split('/').filter(x => x != '');
        this.breadcrumbList = [...new Set(this.breadcrumbList)];
        this.count = this.breadcrumbList.length;
      } else {
        this.route = 'Dashboard';
      }

    });

  }


}
