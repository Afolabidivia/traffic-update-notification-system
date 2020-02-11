import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MenuComponent } from '../components/menu/menu.component';
import { User } from '../models/user.model';
import { PostsService } from '../services/posts.service';

import * as moment from 'moment';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {
  user: User;
  trafficUpdates = [];
  isLoading: boolean;
  isLogin: boolean;

  constructor(
    private popoverController: PopoverController,
    private postService: PostsService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.loginState.subscribe(
      val => {
        this.isLogin = val;
      }
    );
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.trafficUpdates = [];
    this.postService.fetchPosts().subscribe(posts => {
      Object.keys(posts).map(elem => {
        this.isLoading = false;
        posts[elem].fd = moment(posts[elem].date, ['YYYY-M-D']).format('dddd, MMMM Do YYYY');
        posts[elem].pid = elem;
        this.trafficUpdates.push(posts[elem]);
      });
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

  navigateToPost(pageUrl: string) {
    this.router.navigateByUrl(`posts/${pageUrl}`);
  }

}
