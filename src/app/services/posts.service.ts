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

  fetchPost(postId: string) {
    return this.http.get(
      `${environment.firebaseConfig.databaseURL}/traffic-updates/${postId}.json`
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

  updatePost(postId: string, title: string, desc: string, date, user: string) {
    // tslint:disable-next-line: variable-name
    const last_update = moment().format();
    return this.http.put(
      `${environment.firebaseConfig.databaseURL}/traffic-updates/${postId}.json`,
      {
        id: null,
        title,
        desc,
        last_update,
        date,
        user
      }
    );
  }

  deletePost(postId: string) {
    return this.http.delete<{ name: string }>(
      `${environment.firebaseConfig.databaseURL}/traffic-updates/${postId}.json`,
    );
  }

  fetchPostComments(postId: string) {
    return this.http.get(
      `${environment.firebaseConfig.databaseURL}/comments/${postId}.json`
    );
  }

  addComment(postId: string, commenter: string, commenterEmail: string, comment: string) {
    const date = moment().format();
    return this.http.post<{ name: string }>(
      `${environment.firebaseConfig.databaseURL}/comments/${postId}.json`,
      {
        id: null,
        commenter,
        commenterEmail,
        comment,
        date
      }
    );
  }

  deletePostComments(postId: string) {
    return this.http.delete<{ name: string }>(
      `${environment.firebaseConfig.databaseURL}/comments/${postId}.json`,
    );
  }
}
