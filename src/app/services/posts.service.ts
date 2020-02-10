import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private http: HttpClient
  ) { }

  fetchPosts() {
    return this.http.get(
      `${environment.firebaseConfig.databaseURL}/traffic-updates.json`
    );
  }

  addPost(title: string, desc: string, user: string) {
    const date = moment().format();
    return this.http.post<{ name: string }>(
      `${environment.firebaseConfig.databaseURL}/traffic-updates.json`,
      {
        id: null,
        title,
        desc,
        user,
        date
      }
    );
  }

  deletePost() {

  }
}
