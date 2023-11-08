import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading=false;

  constructor(
    private loadingController: LoadingController
  ) { }


  async present(message) {
    this.isLoading = true;
    return await this.loadingController.create(
      {
        message:message,
        duration:800
      }
    ).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async dismiss() {
    if (this.isLoading) {
      this.isLoading = false;
      return await this.loadingController.dismiss();
    }
    return null;
  }
}
