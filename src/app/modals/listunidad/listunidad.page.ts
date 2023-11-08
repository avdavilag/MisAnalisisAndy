import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';

@Component({
  selector: 'app-listunidad',
  templateUrl: './listunidad.page.html',
  styleUrls: ['./listunidad.page.scss'],
})
export class ListunidadPage implements OnInit {

  ListUnidad:any=[];
  textofiltro=''

  constructor(
    private queryservice:QueryService,
    private modalcontroller: ModalController
  ) { }

  ngOnInit() {
    this.queryservice.getListUnidad().then((result:any)=>{
      console.log(result);
      let data=result.data.ListUnidad;
      this.ListUnidad=data
    })
  }

  filtro(event){
    console.log('event',event.detail.value);
    this.textofiltro=event.detail.value;
  }


  seleccionUnidad(data){
    this.modalcontroller.dismiss({
      'dismissed': true,
     'unidad': data
    });
  }
  dismiss() {
    this.modalcontroller.dismiss({
      'dismissed': true,
      // 'flag_origen': this.flag_origen
    });
    //    this.orden = [];
  }

}
