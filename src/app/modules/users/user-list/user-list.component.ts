import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Post } from 'src/app/shared/types/post';
import { User } from 'src/app/shared/types/user';
import { UserService } from '../../users/user.service';
import * as _ from 'underscore';
import { NgbdSortableHeader, SortEvent } from 'src/app/shared/directive/sortable.directive';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isEmpty } from 'underscore';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  filterForm: FormGroup = new FormGroup({});

  usersLoading: boolean = false;
  pagedUsers: User[] = [];
  commentsLoading = false;;
  currentPost: any = null;
  users: User[] = [];
  pageSize = 5;
  searchTerm: string = '';
  page = 1;
  total: number = 0;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader> = <any>null;
  sortDirection: string = '';
  sortColumn: string = '';

  constructor(private _userService: UserService,
    private fb: FormBuilder, private _router: Router, private _route: ActivatedRoute, private location: Location
  ) {
    this.initializeForm();
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      search: '',
      user_id: 0
    })
  }

  pageSizeChange() {
    console.log('pageSizeChange');
    this.setPageWiseData();
  }

  ngOnInit() {
    this.usersLoading = true;

    console.log('Called Constructor');
    this._route.queryParams.subscribe(params => {
      console.log('queryParams')
      this.filterForm.patchValue(
        {
          search: params['search'],
          user_id: params['user_id'] ? parseInt(params['user_id']) : 0,
        }
      )

      this.sortDirection = params['sort_direction'];
      this.sortColumn = params['sort_column'];
      this.page = params['page'] || 1;
      this.pageSize = parseInt(params['pageSize']) || this.pageSize;
      this.loadPosts();
    });

  }

  updateMasterDetailPost(post: Post) {

  }

  private loadPosts(filter?: any) {
    this.usersLoading = true;

    this._userService.getUsers().subscribe(res => {
      this.users = res;
      this.total = res.length;
      this.pagedUsers = _.take(this.users, this.pageSize);
      this.usersLoading = false;
      this.headers.forEach(header => {
        if (header.sortable == this.sortColumn) {
          header.direction = this.sortDirection;
        }
      });
      this.filterAndCalculateData();
    }, error => { console.log(error); this.usersLoading = false; });
  }

  updateFilter(filter: any) {
    this.currentPost = null;
    this.loadPosts(filter);
  }

  onPageChanged(page: number) {
    this.page = page;
    this.setPageWiseData();
  }

  unsetDirect(column: string) {
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
  }

  onSort(event: any) {
    this.unsetDirect(event.column);
    this.sortDirection = event.direction;
    this.sortColumn = <any>event.column;
    if (this.sortDirection == "asc") {
      this.pagedUsers = this.users.sort((a: any, b: any) => (<any>a[this.sortColumn] > b[this.sortColumn]) ? 1 : -1);
    } else {
      this.pagedUsers = this.users.sort((a: any, b: any) => (<any>a[this.sortColumn] < b[this.sortColumn]) ? 1 : -1);
    }
    this.setPageWiseData();
    this.appendQueryParams();
  }

  onChange() {
    this.setPageWiseData();
  }


  filterAndCalculateData() {
    let data = this.users;
    if (!isEmpty(this.filterForm.value.search)) {
      let search = this.filterForm.value.search;
      data = data.filter((v, i) => {
        return ((v["name"].toLowerCase().includes(search.toLowerCase()) || v["username"].toLowerCase().includes(search.toLowerCase()) || v["email"].toLowerCase().includes(search.toLowerCase()) || v["phone"].toLowerCase().includes(search.toLowerCase())));
      })
    }

    if (isEmpty(this.filterForm.value.search)) {
      data = this.users;
    }
    if (this.sortDirection == "asc") {
      this.pagedUsers = data.sort((a: any, b: any) => (<any>a[this.sortColumn] > b[this.sortColumn]) ? 1 : -1);
    } else if (this.sortDirection == "desc") {
      this.pagedUsers = data.sort((a: any, b: any) => (<any>a[this.sortColumn] < b[this.sortColumn]) ? 1 : -1);
    }


    var startIndex = (this.page - 1) * this.pageSize;
    // _.rest offsets the array and then take grabs first n records
    this.pagedUsers = _.take(_.rest(data, startIndex), this.pageSize);
    this.total = data?.length;
  }

  setPageWiseData() {
    console.log("setPageWiseData");
    this.filterAndCalculateData();
    this.appendQueryParams();
    // this.pagedPosts = _.take(this.pagedPosts, this.pageSize);
  }


  appendQueryParams() {
    // changes the route without moving from the current view or
    // triggering a navigation event,
    let queryParams = this.removeEmpty({ page: this.page, pageSize: this.pageSize, search: this.filterForm.value.search, user_id: this.filterForm.value.user_id, sort_direction: this.sortDirection, sort_column: this.sortColumn });
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
