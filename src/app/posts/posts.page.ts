import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MenuComponent } from '../components/menu/menu.component';
import { User } from '../models/user.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
})
export class PostsPage implements OnInit {
  user: User;

  constructor(
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {

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
