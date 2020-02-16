import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { PostsService } from 'src/app/services/posts.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.page.html',
  styleUrls: ['./post-item.page.scss'],
})
export class PostItemPage implements OnInit {
  isLoading: boolean;
  isLoadingComment: boolean;
  postId: string;
  post;
  postComments;
  isLogin: boolean;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private postService: PostsService,
    private router: Router,
    private alertController: AlertController,
    private utilityService: UtilityService,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.loginState.subscribe(
      val => {
        this.isLogin = val;
      }
    );
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('postId')) {
        this.navCtrl.navigateBack('posts');
        return;
      }
      this.postId = paramMap.get('postId');
      this.isLoading = true;
      this.postService.fetchPost(this.postId)
        .subscribe(res => {
          this.isLoading = false;
          if (!res) {
            this.navCtrl.navigateBack('posts');
          }
          this.post = res;
        }, err => {
          this.navCtrl.navigateBack('posts');
          this.isLoading = false;
        });
      this.fetchPostComments();

      this.form = new FormGroup({
        name: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        email: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        comment: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        })
      });
    });
  }

  navigateToEditpage() {
    this.router.navigateByUrl(`posts/edit-post/${this.postId}`);
  }

  fetchPostComments() {
    this.postComments = [];
    this.isLoadingComment = true;
    this.postService.fetchPostComments(this.postId).subscribe(
      comments => {
        this.isLoadingComment = false;
        if (comments) {
          Object.keys(comments).map(elem => {
            // comments[elem].fd = moment(posts[elem].date, ['YYYY-M-D']).format('dddd, MMMM Do YYYY');
            this.postComments.push(comments[elem]);
          });
        }
      }
    );
  }

  async confirmPostDelete() {
    const alert = await this.alertController.create({
      header: 'Delete Traffic Update',
      // tslint:disable-next-line: max-line-length
      message: 'Are you sure you want to delete this post? By clicking yes, all the comments associated with this post will also be deleted.',
      buttons: [
        {
          text: 'YES',
          handler: () => {
            this.onDeletePost();
          }
        },
        {
          text: 'CANCEL',
        }
      ]
    });
    await alert.present();
  }

  onDeletePost() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Deleting post...' })
      .then(loadingEl => {
        loadingEl.present();
        this.postService.deletePost(this.postId)
          .subscribe(res => {
            loadingEl.dismiss();
            this.postService.deletePostComments(this.postId).subscribe();
            this.utilityService.presentToast(
              'Traffic Update deleted successful!',
              4000,
              true,
              'success'
            );
            this.navCtrl.navigateBack('posts');
          }, err => loadingEl.dismiss());
      });
  }

  onSubmitComment() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({ message: 'Submitting comment...'}).then(
      loadingEl => {
        loadingEl.present();
        this.postService.addComment(
          this.postId,
          this.form.value.name,
          this.form.value.email,
          this.form.value.comment
        ).subscribe(
          () => {
            loadingEl.dismiss();
            this.form.reset();
            this.fetchPostComments();
            this.utilityService.presentToast(
              'Comment submitted successful!',
              4000,
              true,
              'success'
            );
          },
          err => {
            this.utilityService.presentToast(
              'Server error. Unable to submit your comment. Please try again!',
              4000,
              true,
              'danger'
            );
          }
        );
      }
    );
  }

}
