import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(
    private authService: AuthService,
    private navCtrl: NavController
    ) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.loginState.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          this.navCtrl.navigateRoot('/home');
        } else {
          return of(isAuthenticated);
        }
      })
    );
  }
}
