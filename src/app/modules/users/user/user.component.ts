import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Album } from 'src/app/shared/types/album';
import { Post } from 'src/app/shared/types/post';
import { User } from 'src/app/shared/types/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  usersLoading: boolean = false;
  postLoading: boolean = false;
  albumLoading: boolean = false;
  users: User[] = [];
  user: User = <any>null;
  id: number = 0;

  posts: Post[] = [];
  albums: Album[] = [];
  constructor(private _userService: UserService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params) //log the entire params object
      console.log(params['id']) //log the value of id
      this.id = params['id'];
      this.getUser();
      this.getUserPosts();
      this.getUserPhotos();
    });
  }

  getUser() {
    this.usersLoading = true;
    this._userService.getUser(this.id).subscribe(res => {
      console.log(res);
      this.user = res;
      this.usersLoading = false;
    }, error => { console.log(error); this.usersLoading = false; });
  }


  getUserPosts() {
    this.postLoading = true;
    this._userService.getUserPost(this.id).subscribe(res => {
      console.log("getUserPosts", res);
      this.posts = res;
      this.postLoading = false;
    }, error => { console.log(error); this.postLoading = false; });
  }

  getUserPhotos() {
    this.albumLoading = true;
    this._userService.getUserPhoto(this.id).subscribe(res => {
      console.log("getUserPhotos", res);
      this.albums = res;
      this.albumLoading = false;
    }, error => { console.log(error); this.albumLoading = false; });
  }
}
