import { Component, OnInit } from '@angular/core';
import { PopoverController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  loginState: boolean;
  constructor(
    private popoverController: PopoverController,
    private navCtrl: NavController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.loginState.subscribe(
      val => {
        this.loginState = val;
      }
    );
  }

  onLogout() {
    this.closePopover();
    this.authService.logout();
  }

  navigateTo(pageTitle: string) {
    this.closePopover();
    this.navCtrl.navigateRoot(pageTitle);
  }

  async closePopover() {
    await this.popoverController.dismiss();
  }

}
