import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert-login',
  templateUrl: './alert-login.page.html',
  styleUrls: ['./alert-login.page.scss'],
})
export class AlertLoginPage implements OnInit {
  @Input() mensaje="";
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  cerrar(){
    this.modalCtrl.dismiss();
  }

}
