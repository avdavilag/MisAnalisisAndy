import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert-wzp-qr',
  templateUrl: './alert-wzp-qr.page.html',
  styleUrls: ['./alert-wzp-qr.page.scss'],
})
export class AlertWzpQrPage implements OnInit {
  @Input() imagenBase64;
  
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  cerrar() {
    this.modalCtrl.dismiss()
  }
}
