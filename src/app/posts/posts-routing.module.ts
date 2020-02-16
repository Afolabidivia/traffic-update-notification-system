import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostsPage } from './posts.page';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PostsPage
  },
  {
    path: 'new-post',
    loadChildren: () => import('./new-post/new-post.module').then( m => m.NewPostPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'edit-post/:postId',
    loadChildren: () => import('./edit-post/edit-post.module').then( m => m.EditPostPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: ':postId',
    loadChildren: () => import('./post-item/post-item.module').then( m => m.PostItemPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostsPageRoutingModule {}
