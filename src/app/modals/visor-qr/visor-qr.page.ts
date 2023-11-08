import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-visor-qr',
  templateUrl: './visor-qr.page.html',
  styleUrls: ['./visor-qr.page.scss'],
})
export class VisorQrPage implements OnInit {
  @Input() url="";
  constructor(public modalCtrl: ModalController, ) { }

  ngOnInit() {
    console.log("DIRECCIONARA",this.url);
    
  }

  cerrar(){
    this.modalCtrl.dismiss();
  }

}
