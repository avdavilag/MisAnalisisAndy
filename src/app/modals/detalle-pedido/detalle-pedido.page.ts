import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.page.html',
  styleUrls: ['./detalle-pedido.page.scss'],
})
export class DetallePedidoPage implements OnInit {

  @Input() pedido;
  colores_grid=[];
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    
  //  this.colores_grid=["#e2ffdc", "#daecff", "#ffe1f7", "#ffffcb"]
  this.colores_grid=["#D6FFFA", "#FFFFEF", "#EAD6FF"]
  
    console.log(this.pedido);
    
  }
  getColor(indice){
  // console.log("color",indice&this.colores_grid.length);
   
    return this.colores_grid[indice%this.colores_grid.length]
  }
  cerrar(){
    this.modalCtrl.dismiss();
  }
}
