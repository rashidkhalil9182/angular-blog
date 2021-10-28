import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/shared/types/user';
import { Post } from 'src/app/shared/types/post';
import { Album } from 'src/app/shared/types/album';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _url = environment.API_URL + "users";

  constructor(private _http: HttpClient) { }

  getUsers() {
    return this._http.get<User[]>(this._url)
  }

  addUser(user: User) {
    return this._http.post(this._url, JSON.stringify(user))
  }

  getUserUrl(id: number) {
    return this._url + "/" + id;
  }

  getUser(id: number) {
    return this._http.get<User>(this.getUserUrl(id))
  }

  updateUser(user: User) {
    return this._http.put(this.getUserUrl(user.id), JSON.stringify(user))
  }

  deleteUser(userId: number) {
    return this._http.delete(this.getUserUrl(userId))
  }

  getUserPhoto(userId: number) {
    return this._http.get<Album[]>(
      environment.API_URL + 'photos?_start=0&_limit=20&userId=' + userId
    );
  }

  getUserPost(userId: number) {
    return this._http.get<Post[]>(
      environment.API_URL + 'posts??_start=0&_limit=20&userId=' + userId
    );
  }
}
