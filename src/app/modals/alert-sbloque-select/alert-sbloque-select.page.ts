import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert-sbloque-select',
  templateUrl: './alert-sbloque-select.page.html',
  styleUrls: ['./alert-sbloque-select.page.scss'],
})
export class AlertSbloqueSelectPage implements OnInit {
  tipo_select="ref"
  email_otro=""

  list_tipo_select=[
    {des:"Referencia", value:"ref"},
    {des:"Médico", value:"med"},
    {des:"Plan", value:"plan"}
  ]
  constructor(
    private modalcontroller:ModalController
  ) { }

  ngOnInit() {
  }

dismiss(){
  this.modalcontroller.dismiss()
}

aceptar(){
  this.modalcontroller.dismiss(
    {
      tipo_select:this.tipo_select,
      email_otro:this.email_otro
    },'aceptar'
  )
}

select(item){
  this.modalcontroller.dismiss({
    filtro_select:item
  },'dismiss_data')
}

}
