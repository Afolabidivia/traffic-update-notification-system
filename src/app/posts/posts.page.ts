import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MenuComponent } from '../components/menu/menu.component';
import { User } from '../models/user.model';
import { PostsService } from '../services/posts.service';

import * as moment from 'moment';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {
  user: User;
  trafficUpdates = [];
  isLoading: boolean;

  constructor(
    private popoverController: PopoverController,
    private postService: PostsService
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.postService.fetchPosts().subscribe(posts => {
      Object.keys(posts).map(elem => {
        this.isLoading = false;
        posts[elem].fd = moment(posts[elem].date, ['YYYY-M-D']).format('dddd, MMMM Do YYYY')
        posts[elem].pid = elem;
        this.trafficUpdates.push(posts[elem]);
      });
      console.log(this.trafficUpdates);
    });
  }

  async openMenu(ev: any) {
    const popover = await this.popoverController.create({
      component: MenuComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

}
