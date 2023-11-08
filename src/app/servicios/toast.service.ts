import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastctrl: ToastController,
  ) { }

  /*
toastconf =
             {
               'message': message,
               'style': 'warning',
               'position':'top'
             };
 */

  async presentToast(toastconf) {

    const toast = await this.toastctrl.create({
      message: toastconf.message,
      duration: 1500,
      position: toastconf.position,
      //cssClass:style,
      color: toastconf.color
    });
    toast.present();
  }
  async presentToast2(toastconf) {

    const toast = await this.toastctrl.create({
      message: toastconf.message,
      duration: 1500,
      position: toastconf.position,
      //cssClass:style,
      cssClass: 'custom-toast',
      color: toastconf.color
    });
    toast.present();
  }

}
