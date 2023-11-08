import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { FuncionesComunes } from 'src/app/utils/funciones-comunes';
import { WebRestService } from 'src/app/servicios/intranet/web-rest.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import {CambioclavePage} from 'src/app/modals/cambioclave/cambioclave.page'
import { AppConfigService } from 'src/app/utils/app-config-service';
import {PdfOrdenwebPage} from 'src/app/modals/pdf-ordenweb/pdf-ordenweb.page'

@Component({
  selector: 'app-popover-usr',
  templateUrl: './popover-usr.page.html',
  styleUrls: ['./popover-usr.page.scss'],
})
export class PopoverUsrPage implements OnInit {
  @Input()  usuario;
  var_usuario;
  tipo_usuario;
  flag_ingreso_orden_ref=false
  
  constructor(private configApp: AppConfigService,public router:Router,public popoverController: PopoverController,public servicios: VariablesGlobalesService,public funcionesComunes: FuncionesComunes,private modalController: ModalController) { 
    this.var_usuario={entidades:[]};
  }
  ionViewWillEnter() {
    this.var_usuario = this.servicios.getVarUsuario();
    this.tipo_usuario = this.servicios.getVarUsuarioTipo();
    this.flag_ingreso_orden_ref=this.servicios.getVarUsuarioTipo()=='ref'&&this.configApp.enable_orden_referencia
    console.log(this.var_usuario,this.var_usuario);
    
  }

  ngOnInit() {
   
  }

  cerrarSesion(){
    this.popoverController.dismiss();
    this.funcionesComunes.cerrarSesion()
  }
  cambiarUsuario(){
    this.popoverController.dismiss();
    this.funcionesComunes.cambiarUsuario();
  }



  async presentModalClave() {
    this.popoverController.dismiss();
    const modal = await this.modalController.create({
    component: CambioclavePage,
    cssClass:"modal-change-login",
    componentProps: { value: 123 }
    });
  
    await modal.present();
  
  }

async presentModalPdfOrdenWeb() {
  this.popoverController.dismiss();
  const modal = await this.modalController.create({
  component: PdfOrdenwebPage,
  componentProps: { value: 123 }
  });

  await modal.present();

}

}
