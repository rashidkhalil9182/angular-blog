import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from 'src/app/shared/types/post';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private _url = environment.API_URL + "posts";

  constructor(private _http: HttpClient) { }

  getPosts(filter?: any) {

    var url = this._url;

    if (filter && filter.userId && parseInt(filter.userId) != 0) {
      url += "?userId=" + filter.userId;
    }

    return this._http.get<Post[]>(url)
  }


  getPostsComments(postId: number) {
    return this._http.get(this._url + "/" + postId + "/comments")
  }

  getPostDetail(postId: number) {
    return this._http.get<Post>(this._url + "/" + postId)
  }
}
