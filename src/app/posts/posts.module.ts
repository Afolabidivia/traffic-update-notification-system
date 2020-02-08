import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostsPageRoutingModule } from './posts-routing.module';

import { PostsPage } from './posts.page';
import { MenuComponent } from '../components/menu/menu.component';
import { MenuModule } from '../modules/menu/menu.module';

@NgModule({
  entryComponents: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
    IonicModule,
    PostsPageRoutingModule
  ],
  declarations: [PostsPage]
})
export class PostsPageModule {}
