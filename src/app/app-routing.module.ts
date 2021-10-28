import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'posts', loadChildren: () => import('./modules/post/post.module').then(m => m.PostModule) },
  { path: 'albums', loadChildren: () => import('./modules/album/album.module').then(m => m.AlbumModule) },
  { path: 'photos', loadChildren: () => import('./modules/photo/photo.module').then(m => m.PhotoModule) },
  { path: 'users', loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
