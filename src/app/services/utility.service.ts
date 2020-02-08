import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  appVerCode = new BehaviorSubject<string>(null);

  constructor(
    public toastController: ToastController,
    private alertCtrl: AlertController
  ) {
   }


  async presentToast(message: string, duration: number, showCloseButton: boolean, color: string, position?) {
    const toast = await this.toastController.create({
      message,
      duration,
      showCloseButton,
      closeButtonText: 'x',
      color,
      position
    });
    toast.present();
  }

  showAlert(header: string, message: string) {
    this.alertCtrl
      .create({
        header,
        message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }

}
