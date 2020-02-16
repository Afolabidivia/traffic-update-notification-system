import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { PostsService } from 'src/app/services/posts.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {
  defaultHref;
  form: FormGroup;
  isLoading: boolean;
  postId: string;
  post;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private postService: PostsService,
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('postId')) {
        this.navCtrl.navigateBack('post');
        return;
      }
      this.postId = paramMap.get('postId');
      this.defaultHref = `posts/${this.postId}`;
      this.isLoading = true;
      this.postService.fetchPost(this.postId)
        .subscribe(res => {
          this.post = res;
          this.form = new FormGroup({
            title: new FormControl(this.post.title, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            description: new FormControl(this.post.desc, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)]
            })
          });
          this.isLoading = false;
        }, err => {
          this.isLoading = false;
        });
    });
  }

  onUpdatePost() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating traffic update...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.postService
          .updatePost(
            this.postId,
            this.form.value.title,
            this.form.value.description,
            this.post.date,
            this.post.user
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.utilityService.presentToast(
              'Traffic Update updated successful!',
              4000,
              true,
              'success'
            );
            this.router.navigate([`posts/${this.postId}`]);
          });
      });
  }

}
