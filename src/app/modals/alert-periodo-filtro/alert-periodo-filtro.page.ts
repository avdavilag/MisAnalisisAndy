import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert-periodo-filtro',
  templateUrl: './alert-periodo-filtro.page.html',
  styleUrls: ['./alert-periodo-filtro.page.scss'],
})
export class AlertPeriodoFiltroPage implements OnInit {
max=new Date().toJSON().split('T')[0];
@Input() f_desde;
@Input() f_hasta;

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {

  }
  cerrar() {
    this.modalCtrl.dismiss()
  }
  filtrar() {
    console.log(this.f_desde);
    console.log(this.f_hasta);
    this.modalCtrl.dismiss({f_desde:this.f_desde, f_hasta:this.f_hasta})
    
  }
}
