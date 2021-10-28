import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Photo } from 'src/app/shared/types/photo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private _url = environment.API_URL + "photos";

  constructor(private _http: HttpClient) { }

  getAllPhotos(filter?: any) {

    var url = this._url;

    if (filter && filter.albumId && parseInt(filter.albumId) != 0) {
      url += "?albumId=" + filter.albumId;
    }

    return this._http.get<Photo[]>(url)
  }


  getPhotoDetail(photoId: number) {
    return this._http.get<Photo>(this._url + "/" + photoId)
  }

  getPhotoAgainstAlbum(albumId: number) {
    return this._http.get<Photo[]>(this._url + "/" + albumId + '/photos')
  }



}
