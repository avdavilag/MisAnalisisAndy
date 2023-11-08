import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertWzpQrPage } from '../alert-wzp-qr/alert-wzp-qr.page';

@Component({
  selector: 'app-alert-wzp-send',
  templateUrl: './alert-wzp-send.page.html',
  styleUrls: ['./alert-wzp-send.page.scss'],
})
export class AlertWzpSendPage implements OnInit {

  @Input() wzpStatus = '';
  @Input() wzpStatusDetail = '';
  @Input() number = '';
  listaAnalisisOrigen = []
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  aceptar() {
    this.modalCtrl.dismiss({ cancel: false, number: this.number })
  }
  cerrar() {
    //regreso a lo que estaba
    this.modalCtrl.dismiss({ cancel: true })


  }
  actualizaEstado(){
    if(this.wzpStatus!=''){
      this.modalCtrl.dismiss({ estado: true })
    }
  }
  async openImage() {
    //suponiendo que detail viene la imagen
    const modal = await this.modalCtrl.create({
      animated: true,
      component: AlertWzpQrPage,
      cssClass: 'modal-alert',
      componentProps: {
        imagenBase64: this.wzpStatusDetail
      }
      // leaveAnimation: animationBuilder,
    });
    
    return await modal.present();
  }
}
