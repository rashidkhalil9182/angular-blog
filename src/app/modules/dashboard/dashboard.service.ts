import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Post } from 'src/app/shared/types/post';
import { Photo } from 'src/app/shared/types/photo';
@Injectable()
export class DashboardService {

  constructor(private http: HttpClient) { }

  getRecentPost() {
    return this.http.get<Post[]>(
      environment.API_URL + 'posts?_start=0&_limit=20'
    );
  }


  getRecentPhoto() {
    return this.http.get<Photo[]>(
      environment.API_URL + 'photos?_start=0&_limit=20'
    );
  }
}
