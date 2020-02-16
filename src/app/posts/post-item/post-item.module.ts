import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostItemPageRoutingModule } from './post-item-routing.module';

import { PostItemPage } from './post-item.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PostItemPageRoutingModule
  ],
  declarations: [PostItemPage]
})
export class PostItemPageModule {}
