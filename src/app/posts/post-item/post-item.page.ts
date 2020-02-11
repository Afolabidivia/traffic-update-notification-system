import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { PostsService } from 'src/app/services/posts.service';
import { UtilityService } from 'src/app/services/utility.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.page.html',
  styleUrls: ['./post-item.page.scss'],
})
export class PostItemPage implements OnInit {
  isLoading: boolean;
  postId: string;
  post;
  isLogin: boolean;

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
    });
  }

  navigateToEditpage() {
    this.router.navigateByUrl(`posts/edit-post/${this.postId}`);
  }

  async confirmPostDelete() {
    const alert = await this.alertController.create({
      header: 'Delete Traffic Update',
      message: 'Are you sure you want to delete this post?',
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

}
