import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/shared/types/album';
import { Photo } from 'src/app/shared/types/photo';
import { isEmpty } from 'underscore';
import { AlbumService } from '../album.service';
import * as _ from 'underscore';
import { Location } from '@angular/common';
@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.scss']
})
export class AlbumDetailComponent implements OnInit {

  filterForm: FormGroup = new FormGroup({});
  id: number = 0;
  albumDetail: Album = <any>{};
  pagedPhotos: Photo[] = [];
  photos: Photo[] = [];
  pageSize = 10;
  searchTerm: string = '';
  page = 1;
  total: number = 0;
  albumLoading: boolean = false;
  photoLoading: boolean = false;
  constructor(private _albumService: AlbumService, private location: Location,
    private route: ActivatedRoute, private fb: FormBuilder, private _router: Router,) {
    this.initializeForm();
    this.route.params.subscribe(params => {
      console.log(params) //log the entire params object
      console.log(params['id']) //log the value of id
      this.id = params['id'];
    });
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      search: ''
    })
  }

  ngOnInit(): void {
    if (this.id) {
      this.getAlbumDetail();
      console.log('Called ngOnInit');
      this.route.queryParams.subscribe(params => {
        console.log('queryParams')
        this.filterForm.patchValue(
          {
            search: params['search']
          }
        )

        this.page = params['page'] || 1;
        this.pageSize = params['pageSize'] || 50;
        this.getPhotoAgainstAlbum();
      });


    }
  }

  getAlbumDetail() {
    this.albumLoading = true;
    this._albumService.getAlbumDetail(this.id).subscribe(res => {
      console.log("🚀 ~ file: album-detail.component.ts ~ line 32 ~ AlbumDetailComponent ~ this._albumService.getAlbumDetail ~ res", res)
      this.albumDetail = res;
      this.albumLoading = false;
    }, error => {
      console.log(error);
      this.albumLoading = false;
    })
  }

  getPhotoAgainstAlbum() {
    this.photoLoading = true;
    this._albumService.getPhotoAgainstAlbum(this.id).subscribe(res => {
      console.log("🚀 ~ file: album-detail.component.ts ~ line 32 ~ AlbumDetailComponent ~ this._albumService.getAlbumDetail ~ res", res)
      this.photos = res;
      this.photoLoading = false;
      this.setPageWiseData()
    }, error => {
      this.photoLoading = false;
      console.log(error);
    })
  }

  onPageChanged(page: number) {
    this.page = page;
    this.setPageWiseData();
    // var startIndex = (page - 1) * this.pageSize;
    // // _.rest offsets the array and then take grabs first n records
    // this.pagedPosts = _.take(_.rest(this.posts, startIndex), this.pageSize);
  }



  onChange() {
    this.setPageWiseData();
  }

  pageSizeChange() {
    this.setPageWiseData();
  }


  setPageWiseData() {
    console.log("setPageWiseData");
    let data = this.photos;
    if (!isEmpty(this.filterForm.value.search)) {
      let search = this.filterForm.value.search;
      data = data.filter((v, i) => {
        return ((v["title"].includes(search)));
      })
    }

    if (isEmpty(this.filterForm.value.search)) {
      data = this.photos;
    }



    var startIndex = (this.page - 1) * this.pageSize;
    // _.rest offsets the array and then take grabs first n records
    this.pagedPhotos = _.take(_.rest(data, startIndex), this.pageSize);
    this.total = data?.length;
    console.log("🚀 ~ file: album-detail.component.ts ~ line 116 ~ AlbumDetailComponent ~ setPageWiseData ~ this.total ", this.total, '====== ', this.pagedPhotos)
    this.appendQueryParams();
    // this.pagedPosts = _.take(this.pagedPosts, this.pageSize);
  }


  appendQueryParams() {
    // changes the route without moving from the current view or
    // triggering a navigation event,
    let queryParams = this.removeEmpty({ page: this.page, pageSize: this.pageSize, search: this.filterForm.value.search, user_id: this.filterForm.value.user_id });
    console.log("appendQueryParams", queryParams);

    const urlTree = this._router.createUrlTree([], {
      queryParams: queryParams,
      // queryParamsHandling: "merge",
      preserveFragment: true
    });

    // this._router.navigateByUrl(urlTree);
    this.location.go(urlTree.toString());
  }


  removeEmpty(obj: any) {
    return Object.keys(obj)
      .filter(function (k) {
        return obj[k] != null && obj[k] != "" && obj[k] != undefined;
      })
      .reduce(function (acc: any, k) {
        acc[k] = obj[k];
        return acc;
      }, {});
  }
}
