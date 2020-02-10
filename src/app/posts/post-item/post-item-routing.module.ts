import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostItemPage } from './post-item.page';

const routes: Routes = [
  {
    path: '',
    component: PostItemPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostItemPageRoutingModule {}
