import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chequeo-orden',
  templateUrl: './chequeo-orden.page.html',
  styleUrls: ['./chequeo-orden.page.scss'],
})
export class ChequeoOrdenPage implements OnInit {

  fechaEntrega: any = {
    fecha1: '',
    fecha2: ''
  }
  stat_ord='';
  optEntrega;
  tipo="O"
  observaciones_usuario='';
  preguntas_ana;
  dataOrden;
  constructor(
    private modalcontroller:ModalController
  ) { }

  ngOnInit() {
    console.log('optEntrega',this.optEntrega);
    console.log('observaciones',this.observaciones_usuario);
    console.log('preguntas_ana',this.preguntas_ana);
    
  }

  cerrar() {
    console.log(this.observaciones_usuario);
    
    this.modalcontroller.dismiss({
      'dismissed': true,
      // 'flag_origen': this.flag_origen
    
        observaciones_usuario:this.observaciones_usuario,
      //  stat_ord:this.dataOrden.stat_ord
      
    },"blank");
    //    this.orden = [];
  }

  cerrarSave(){
    this.modalcontroller.dismiss({
      'dismissed': true,
      'tipo': 'S',
      observaciones_usuario:this.observaciones_usuario,
    //   stat_ord:this.dataOrden.stat_ord
      
    },"blank");
    //    this.orden = [];
  };

  changeChecked(event){
    console.log(event);
    console.log("this.optEntrega",this.optEntrega);
    

    
  }



}
