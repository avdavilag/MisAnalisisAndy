import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { BnNgIdleService } from 'bn-ng-idle';
import { EntregaPage } from 'src/app/modals/entrega/entrega.page';
import { PresupuestoPage } from 'src/app/modals/presupuesto/presupuesto.page';
import { EnvioBloquePage } from 'src/app/pages/envio-bloque/envio-bloque.page';
import { WebRestService } from 'src/app/servicios/intranet/web-rest.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { FuncionesComunes } from 'src/app/utils/funciones-comunes';

@Component({
  selector: 'app-popover-intrausr',
  templateUrl: './popover-intrausr.page.html',
  styleUrls: ['./popover-intrausr.page.scss'],
})
export class PopoverIntrausrPage implements OnInit {
  @Input() usuario;
  @Input() orden="";
  envio_bloque:boolean=false
  enable_envio_iess:boolean=false
  ingreso_orden_c:boolean=false
  presupuesto:boolean=false
  constructor(public popoverController: PopoverController, public servicios: VariablesGlobalesService,
    private varGlobal: VariablesGlobalesService,
    private funciones_comunes: FuncionesComunes,
    public modalCtrl: ModalController,
    private appconfig:AppConfigService,
    public router: Router) { }

  ngOnInit() {
    console.log(this.usuario);
    console.log(this.orden);
    this.envio_bloque=this.appconfig.intra_envio_bloque;
    this.enable_envio_iess=this.appconfig.enable_envio_iess
    this.ingreso_orden_c=this.appconfig.enable_orden_completa;
    this.presupuesto=this.appconfig.enable_presupuesto;
    
  }
  cerrarSesion() {
    this.funciones_comunes.bnIdle.stopTimer()
    this.servicios.setVarUsuarioIntra("");
    this.servicios.setTokenServer("");
    sessionStorage.clear();
    this.router.navigate(["/login-intranet"], { replaceUrl: true });
    this.popoverController.dismiss();
  }

  openListOrden() {
    // this.funciones_comunes.bnIdle.stopTimer()
    //this.router.navigate(["/lista-orden"]);
    this.varGlobal.setTokenServer(this.varGlobal.getTokenServer());

    //añadido av msp
    this.varGlobal.setVarUsuarioTipo('int');

    //GUARDO USUARIO Y DESCRIPCION
    //Guardar usuario del intra
    this.varGlobal.setVarUsuario(this.varGlobal.getVarUsuarioIntra());
    this.varGlobal.setVarUsuarioDes(this.usuario);
    this.router.navigate(["/home-intranet/lista-ordenes"], { replaceUrl: true });
    this.popoverController.dismiss();

  }

  openEnvioIess () {
    this.varGlobal.setTokenServer(this.varGlobal.getTokenServer());
//añadido av msp
    this.varGlobal.setVarUsuarioTipo('int');
    //GUARDO USUARIO Y DESCRIPCION
    //Guardar usuario del intra
    this.varGlobal.setVarUsuario(this.varGlobal.getVarUsuarioIntra());
    this.varGlobal.setVarUsuarioDes(this.usuario);
    this.router.navigate(["/home-intranet/envio-iess"], { replaceUrl: true });
    this.popoverController.dismiss();

  }

  openEnvioBloque() {
    this.varGlobal.setTokenServer(this.varGlobal.getTokenServer());
//añadido av msp
    this.varGlobal.setVarUsuarioTipo('int');
    //GUARDO USUARIO Y DESCRIPCION
    //Guardar usuario del intra
    this.varGlobal.setVarUsuario(this.varGlobal.getVarUsuarioIntra());
    this.varGlobal.setVarUsuarioDes(this.usuario);
    this.router.navigate(["/home-intranet/envio-bloque"], { replaceUrl: true });
    this.popoverController.dismiss();

  }

  //////Listado de pacientes y proceso de ingreso....
  openBusquedaPacientes() {
    this.varGlobal.setTokenServer(this.varGlobal.getTokenServer());
//añadido av msp
    this.varGlobal.setVarUsuarioTipo('int');
    //GUARDO USUARIO Y DESCRIPCION
    //Guardar usuario del intra
    this.varGlobal.setVarUsuario(this.varGlobal.getVarUsuarioIntra());
    this.varGlobal.setVarUsuarioDes(this.usuario);
    this.router.navigate(["/home-intranet/busqueda-pacientes"], { replaceUrl: true });
    this.popoverController.dismiss();

  }

  openNewOrden() {
    this.varGlobal.setTokenServer(this.varGlobal.getTokenServer());

    //añadido av msp
    this.varGlobal.setVarUsuarioTipo('int');
    //GUARDO USUARIO Y DESCRIPCION
    //Guardar usuario del intra
    this.varGlobal.setVarUsuario(this.varGlobal.getVarUsuarioIntra());
    this.varGlobal.setVarUsuarioDes(this.usuario);
    this.router.navigate(["/home-intranet/ingreso-orden"], { replaceUrl: true });
    this.popoverController.dismiss();

  }

  openNewOrdenCompleta() {
    this.varGlobal.setTokenServer(this.varGlobal.getTokenServer());

    //añadido av msp
    this.varGlobal.setVarUsuarioTipo('int');
    //GUARDO USUARIO Y DESCRIPCION
    //Guardar usuario del intra
    this.varGlobal.setVarUsuario(this.varGlobal.getVarUsuarioIntra());
    this.varGlobal.setVarUsuarioDes(this.usuario);
    this.router.navigate(["/home-intranet/ingreso-orden-completa"], { replaceUrl: true });
    this.popoverController.dismiss();

  }

  async presentModalEntrega() {
    this.popoverController.dismiss();

    const modal = await this.modalCtrl.create({
      animated: true,
      component: EntregaPage,
      cssClass: 'modal-select-pdfs',
      componentProps: {
        nroOrden:this.orden
      },
      // leaveAnimation: animationBuilder,
    });


    modal.onDidDismiss()
      .then((data) => {
        console.log(data['data']);
        // this.filtrarPeriodo(data['data']);
        if (data['data']) {
          //this.recuperaPDF(data['data']);
        }
      });

    return await modal.present();
  }


  async openCalcPresupuesto() {
    this.popoverController.dismiss();

    const modal = await this.modalCtrl.create({
    component: PresupuestoPage,
    componentProps: { value: 123 },
    backdropDismiss:false
    });
  
    await modal.present();
  
  }

}
