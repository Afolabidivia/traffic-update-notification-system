import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PostsService } from 'src/app/services/posts.service';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

import * as moment from 'moment';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.page.html',
  styleUrls: ['./new-post.page.scss'],
})
export class NewPostPage implements OnInit {
  form: FormGroup;
  user: User;

  constructor(
    private postService: PostsService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    console.log(moment());
    this.authService.user.subscribe(userData => {
      this.user = userData;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onCreateTrafficUpdate() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Creating traffic update...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.postService.addPost(
          this.form.value.title,
          this.form.value.description,
          this.user.id
        ).subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/posts']);
          });
      });
  }
}
