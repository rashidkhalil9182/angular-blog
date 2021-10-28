import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Album } from 'src/app/shared/types/album';
import { Photo } from 'src/app/shared/types/photo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private _url = environment.API_URL + "albums";

  constructor(private _http: HttpClient) { }

  getAlbums(filter?: any) {

    var url = this._url;

    if (filter && filter.userId && parseInt(filter.userId) != 0) {
      url += "?userId=" + filter.userId;
    }

    return this._http.get<Album[]>(url)
  }


  getAlbumDetail(albumId: number) {
    return this._http.get<Album>(this._url + "/" + albumId)
  }

  getPhotoAgainstAlbum(albumId: number) {
    return this._http.get<Photo[]>(this._url + "/" + albumId + '/photos')
  }
}
