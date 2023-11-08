import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { BnNgIdleService } from 'bn-ng-idle';
import { PopoverIntrausrPage } from 'src/app/popover/popover-intrausr/popover-intrausr.page';
import { PopoverUsrPage } from 'src/app/popover/popover-usr/popover-usr.page';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { AppConfigService } from 'src/app/utils/app-config-service';

import { FuncionesComunes } from 'src/app/utils/funciones-comunes';

@Component({
  selector: 'app-home-paciente',
  templateUrl: './home-paciente.page.html',
  styleUrls: ['./home-paciente.page.scss'],
})
export class HomePacientePage implements OnInit {
  public mobile = false;
  private sesion_usuario = "";
  public sesion_usuario_des = "";

  constructor(
    public popoverController: PopoverController,
    private varGlobal: VariablesGlobalesService,
    private router:Router,
    public modalCtrl: ModalController,
    public alertController: AlertController,
    private config: AppConfigService,
    private bnIdle: BnNgIdleService,
    private configApp: AppConfigService,
    public funcionesComunes: FuncionesComunes
  ){ 
     if (window.screen.width < 600 || window.innerWidth < 600) { // 768px portrait        
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    window.onresize = () => {
      console.log(window.screen.width);
      
      if (window.screen.width < 600 || window.innerWidth < 600) { // 768px portrait

        this.mobile = true;
      } else {
        this.mobile = false;
      }
    };
    }

  ngOnInit() {
    
    //Cargo el usuario y descripcion
    this.sesion_usuario = this.varGlobal.getVarUsuario();
    this.sesion_usuario_des = this.varGlobal.getVarUsuarioDes();
    this.lanzaIdle();console.log("SE LANSA EL IDLE");
    console.log(this.config.tiempoInactividad);
    this.funcionesComunes.iniciarIdle();
  }

  lanzaIdle(){
    
  }
  async presentPopover(ev: any) {
    console.log(ev);
    
    const popover = await this.popoverController.create({
      component: PopoverUsrPage,
      cssClass: 'popover-end-page',
      event: ev,
      translucent: true,
      componentProps: {
        usuario: {nombre:this.sesion_usuario_des}
      }
    });
    return await popover.present();
  }
  prueba(){
    console.log("asd");
    
  }

  cerrarSesion(){
    this.popoverController.dismiss();
    this.funcionesComunes.cerrarSesion();
    
  }


}
