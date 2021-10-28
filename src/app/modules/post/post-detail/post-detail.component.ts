import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/shared/types/post';
import { PostService } from '../service/post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {

  id: number = 0;
  postDetail: Post = <any>{};
  postLoading: boolean = false;
  constructor(private _postsService: PostService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      console.log(params) //log the entire params object
      console.log(params['id']) //log the value of id
      this.id = params['id'];
    });
  }

  ngOnInit(): void {
    if (this.id) {
      this.getPostDetail();
    }
  }

  getPostDetail() {
    this.postLoading = true;
    this._postsService.getPostDetail(this.id).subscribe(res => {
      this.postDetail = res;
      this.postLoading = false;
    }, error => {
      this.postLoading = false;
      console.log(error);
    })
  }
}
