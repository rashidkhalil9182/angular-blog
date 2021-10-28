import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Photo } from 'src/app/shared/types/photo';
import { Post } from 'src/app/shared/types/post';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  posts: Post[] = []
  photos: Photo[] = [];
  postLoading: boolean = true;
  photoLoading: boolean = true;
  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getRecentPost();
    this.getRecentPhoto();
  }

  getRecentPost() {
    this.postLoading = true;
    this.subscriptions.push(this.dashboardService.getRecentPost().subscribe(data => {
      console.log(data);
      this.postLoading = false;
      this.posts = data;
    }, err => { console.log(err); this.postLoading = false; }))
  }

  getRecentPhoto() {
    this.photoLoading = true;
    this.subscriptions.push(this.dashboardService.getRecentPhoto().subscribe(data => {
      console.log(data);
      this.photoLoading = false;
      this.photos = data;
    }, err => { console.log(err); this.photoLoading = false; }))
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      });
    }
  }
}
