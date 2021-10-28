import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Album } from 'src/app/shared/types/album';
import { User } from 'src/app/shared/types/user';
import { AlbumService } from '../album.service';
import * as _ from 'underscore';
import { Location } from '@angular/common';
import { isEmpty } from 'underscore';
import { UserService } from '../../users/user.service';
@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.scss']
})
export class AlbumListComponent implements OnInit {
  filterForm: FormGroup = new FormGroup({});
  albumLoading: boolean = false;
  albums: Album[] = [];
  total: number = 0;
  pagedAlbums: Album[] = [];
  commentsLoading = false;
  users: User[] = [];
  pageSize = 20;
  searchTerm: string = '';
  page = 1;
  currentAlbum: any = <any>null;
  constructor(private fb: FormBuilder, private _router: Router, private _route: ActivatedRoute, private _userService: UserService,
    private location: Location,
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
          user_id: params['user_id'] ? parseInt(params['user_id']) : 0,
        }
      )

      this.page = params['page'] || 1;
      this.pageSize = parseInt(params['pageSize']) || this.pageSize;
      this.loadPosts();
    });

    // this.loadPosts();
    this._userService.getUsers().subscribe(res => {
      this.users = res;
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

    this.albumService.getAlbums(filter).subscribe(res => {
      this.albums = res;
      this.total = res.length;
      this.pagedAlbums = _.take(this.albums, this.pageSize);
      this.albumLoading = false;
      // this.headers.forEach(header => {
      //   if (header.sortable == this.sortColumn) {
      //     header.direction = this.sortDirection;
      //   }
      // });
      this.filterAndCalculateData();
    });
  }


  updateFilter(filter: any) {
    this.currentAlbum = null;
    this.loadPosts(filter);
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

  filterAndCalculateData() {
    console.log("setPageWiseData");
    let data = this.albums;
    if (!isEmpty(this.filterForm.value.search)) {
      let search = this.filterForm.value.search;
      data = data.filter((v, i) => {
        return ((v["title"].includes(search)));
      })
    }
    if (!isEmpty(this.filterForm.value.user_id) && parseInt(this.filterForm.value.user_id) != 0) {
      let userId = this.filterForm.value.user_id;
      data = data.filter((v, i) => {
        return ((v["userId"] == userId));
      })
    }
    if (isEmpty(this.filterForm.value.search) && isEmpty(this.filterForm.value.user_id)) {
      data = this.albums;
    }



    var startIndex = (this.page - 1) * this.pageSize;
    // _.rest offsets the array and then take grabs first n records
    this.pagedAlbums = _.take(_.rest(data, startIndex), this.pageSize);
    this.total = data?.length;
  }
  setPageWiseData() {
    this.filterAndCalculateData();
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
  pageSizeChange() {
    this.setPageWiseData();
  }
}
