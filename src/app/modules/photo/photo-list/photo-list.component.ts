import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/shared/types/album';
import { Photo } from 'src/app/shared/types/photo';
import { isEmpty } from 'underscore';
import { AlbumService } from '../../album/album.service';
import * as _ from 'underscore';
import { Location } from '@angular/common';
import { PhotoService } from '../photo.service';
@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})
export class PhotoListComponent implements OnInit {

  filterForm: FormGroup = new FormGroup({});
  albumLoading: boolean = false;
  photos: Photo[] = [];
  total: number = 0;
  pagedPhotos: Photo[] = [];
  commentsLoading = false;
  albums: Album[] = [];
  pageSize = 20;
  searchTerm: string = '';
  page = 1;
  currentAlbum: any = <any>null;

  constructor(private fb: FormBuilder, private _router: Router, private _route: ActivatedRoute,
    private location: Location, private photoService: PhotoService,
    private albumService: AlbumService) {
    this.initializeForm();
  }

  ngOnInit(): void {

    console.log('Called Constructor');
    this._route.queryParams.subscribe(params => {
      console.log('queryParams')
      this.filterForm.patchValue(
        {
          search: params['search'],
          user_id: params['album_id'] ? parseInt(params['album_id']) : 0,
        }
      )

      this.page = params['page'] || 1;
      this.pageSize = parseInt(params['pageSize']) || this.pageSize;
      this.loadPosts();
    });

    this.albumService.getAlbums().subscribe(res => {
      this.albums = res;
    });
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      search: '',
      user_id: 0
    })
  }


  private loadPosts(filter?: any) {
    this.albumLoading = true;

    this.photoService.getAllPhotos(filter).subscribe(res => {
      this.photos = res;
      this.total = res.length;
      this.pagedPhotos = _.take(this.photos, this.pageSize);
      this.albumLoading = false;

      this.filterAndCalculateData();
    }, err => { console.log(err); this.albumLoading = false; });
  }


  updateFilter(filter: any) {
    this.currentAlbum = null;
    this.loadPosts(filter);
    this.setPageWiseData();
  }

  onPageChanged(page: number) {
    this.page = page;
    this.setPageWiseData();
  }

  pageSizeChange() {
    this.setPageWiseData();
  }

  onChange() {
    this.setPageWiseData();
  }

  filterAndCalculateData() {
    console.log("setPageWiseData");
    let data = this.photos;
    if (!isEmpty(this.filterForm.value.search)) {
      let search = this.filterForm.value.search;
      data = data.filter((v, i) => {
        return ((v["title"].includes(search)));
      })
    }
    if (!isEmpty(this.filterForm.value.user_id) && parseInt(this.filterForm.value.user_id) != 0) {
      let userId = this.filterForm.value.user_id;
      data = data.filter((v, i) => {
        return ((v["albumId"] == userId));
      })
    }
    if (isEmpty(this.filterForm.value.search) && isEmpty(this.filterForm.value.user_id)) {
      data = this.photos;
    }



    let startIndex = (this.page - 1) * this.pageSize;
    this.pagedPhotos = _.take(_.rest(data, startIndex), this.pageSize);
    this.total = data?.length;
  }

  setPageWiseData() {
    this.filterAndCalculateData();
    this.appendQueryParams();
  }


  appendQueryParams() {
    let queryParams = this.removeEmpty({ page: this.page, pageSize: this.pageSize, search: this.filterForm.value.search, album_id: this.filterForm.value.album_id });
    console.log("appendQueryParams", queryParams);

    const urlTree = this._router.createUrlTree([], {
      queryParams: queryParams,
      preserveFragment: true
    });

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
