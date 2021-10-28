import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Post } from 'src/app/shared/types/post';
import { User } from 'src/app/shared/types/user';
import { UserService } from '../../users/user.service';
import { PostService } from '../service/post.service';
import * as _ from 'underscore';
import { NgbdSortableHeader, SortEvent } from 'src/app/shared/directive/sortable.directive';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isEmpty } from 'underscore';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  filterForm: FormGroup = new FormGroup({});
  posts: Post[] = [];
  postsLoading: boolean = false;
  pagedPosts: Post[] = [];
  commentsLoading = false;;
  currentPost: any = null;
  users: User[] = [];
  pageSize = 50;
  searchTerm: string = '';
  page = 1;
  total: number = 0;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader> = <any>null;
  sortDirection: string = '';
  sortColumn: string = '';
  subscriptions: Subscription[] = [];

  constructor(private _postsService: PostService, private _userService: UserService,
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

  ngOnInit() {
    this.postsLoading = true;

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


    this.subscriptions.push(this._userService.getUsers().subscribe(res => {
      this.users = res;
    }));
  }

  updateMasterDetailPost(post: Post) {
    this.currentPost = post;
    if (post.comments == undefined) {
      this.commentsLoading = true;
      this._postsService.getPostsComments(post.id).subscribe(res => {
        this.commentsLoading = false;
        // this.currentPost?.comments = res;
      });
    }
  }

  private loadPosts(filter?: any) {
    this.postsLoading = true;

    this.subscriptions.push(this._postsService.getPosts(filter).subscribe(res => {
      this.posts = res;
      this.total = res.length;
      this.pagedPosts = _.take(this.posts, this.pageSize);
      this.postsLoading = false;
      this.headers.forEach(header => {
        if (header.sortable == this.sortColumn) {
          header.direction = this.sortDirection;
        }
      });
      // this.setPageWiseData();
      this.filterAndCalculateData();
    }));
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
      this.pagedPosts = this.posts.sort((a: any, b: any) => (<any>a[this.sortColumn] > b[this.sortColumn]) ? 1 : -1);
    } else {
      this.pagedPosts = this.posts.sort((a: any, b: any) => (<any>a[this.sortColumn] < b[this.sortColumn]) ? 1 : -1);
    }
    this.setPageWiseData();
    this.appendQueryParams();
  }

  onChange() {
    this.setPageWiseData();
  }
  filterAndCalculateData() {
    // this.postsLoading = true;
    console.log("setPageWiseData");
    let data = this.posts;
    if (!isEmpty(this.filterForm.value.search)) {
      let search = this.filterForm.value.search;
      data = data.filter((v, i) => {
        return ((v["title"].includes(search) || v["body"].includes(search)));
      })
    }
    if (!isEmpty(this.filterForm.value.user_id) && parseInt(this.filterForm.value.user_id) != 0) {
      let userId = this.filterForm.value.user_id;
      data = data.filter((v, i) => {
        return ((v["userId"] == userId));
      })
    }
    if (isEmpty(this.filterForm.value.search) && isEmpty(this.filterForm.value.user_id)) {
      data = this.posts;
    }
    if (this.sortDirection == "asc") {
      this.pagedPosts = data.sort((a: any, b: any) => (<any>a[this.sortColumn] > b[this.sortColumn]) ? 1 : -1);
    } else if (this.sortDirection == "desc") {
      this.pagedPosts = data.sort((a: any, b: any) => (<any>a[this.sortColumn] < b[this.sortColumn]) ? 1 : -1);
    }


    var startIndex = (this.page - 1) * this.pageSize;

    this.pagedPosts = _.take(_.rest(data, startIndex), this.pageSize);
    this.total = data?.length;
  }

  setPageWiseData() {
    this.filterAndCalculateData();
    this.appendQueryParams();
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

  pageSizeChange() {
    this.setPageWiseData();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      });
    }
  }
}
