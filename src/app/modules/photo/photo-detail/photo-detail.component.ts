import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Photo } from 'src/app/shared/types/photo';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss']
})
export class PhotoDetailComponent implements OnInit {


  id: number = 0;
  photoDetail: Photo = <any>{};
  photoLoading: boolean = false;
  constructor(private photoService: PhotoService, private route: ActivatedRoute) {
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
    this.photoLoading = true;
    this.photoService.getPhotoDetail(this.id).subscribe(res => {
      console.log("🚀 ~ file: photo-detail.component.ts ~ line 32 ~ PhotoDetailComponent ~ this.photoService.getPhotoDetail ~ res", res)
      this.photoDetail = res;
      this.photoLoading = false;
    }, error => {
      console.log(error);
      this.photoLoading = false;
    })
  }
}
