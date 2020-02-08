import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Plugins } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

const { Storage } = Plugins;

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject(null);
  loginState = new BehaviorSubject<boolean>(false);
  token = new BehaviorSubject<string>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loginState.next(false);
  }

  async checkAuthenticatedState() {
    const ret = await Storage.get({ key: 'tunsData' });
    const user = JSON.parse(ret.value);
    if (user) {
      this.loginState.next(true);
      this.token.next(user.token);
      this.user.next(user);
      return;
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
          environment.firebaseConfig.apiKey
        }`,
        { email, password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this.user.next(null);
    this.token.next(null);
    this.loginState.next(false);
    Plugins.Storage.remove({ key: 'tunsData' });
    this.router.navigateByUrl('/login');
  }

  private setUserData(userData: AuthResponseData) {
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
    );
    this.token.next(userData.idToken);
    this.loginState.next(true);
    this.user.next(user);
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      userData.email
    );
  }

  async storeAuthData(
    id: string,
    token: string,
    email: string
  ) {
    const data = JSON.stringify({
      id,
      token,
      email
    });
    await Storage.set({
      key: 'tunsData',
      value: data
    });
  }
}
