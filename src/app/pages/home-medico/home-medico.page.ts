import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { BnNgIdleService } from 'bn-ng-idle';
import { CambioclavePage } from 'src/app/modals/cambioclave/cambioclave.page';
import { PopoverIntrausrPage } from 'src/app/popover/popover-intrausr/popover-intrausr.page';
import { PopoverUsrPage } from 'src/app/popover/popover-usr/popover-usr.page';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { FuncionesComunes } from 'src/app/utils/funciones-comunes';

@Component({
  selector: 'app-home-medico',
  templateUrl: './home-medico.page.html',
  styleUrls: ['./home-medico.page.scss'],
})
export class HomeMedicoPage implements OnInit {

  public mobile = false;
  private sesion_usuario = "";
  public sesion_usuario_des = "";
  public activeOrden: boolean = true;
  public activePedidos: boolean = false;
  public flag_pedido_ref: boolean = false;
  public flag_ingreso_orden_ref: boolean = false;

  
  constructor(
    public popoverController: PopoverController,
    private varGlobal: VariablesGlobalesService,
    private router: Router,
    public modalCtrl: ModalController,
    public alertController: AlertController,
    private config: AppConfigService,
    private bnIdle: BnNgIdleService,
    private configApp: AppConfigService,
    public funcionesComunes: FuncionesComunes,
   
  ) {
    console.log('this.varGlobal.getVarUsuarioTipo()',this.varGlobal.getVarUsuarioTipo());
    
    //para ver movil
    if (window.screen.width < 600 || window.innerWidth < 600) { // 768px portrait        
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    this.flag_pedido_ref=this.varGlobal.getVarUsuarioTipo()=='ref'&&this.configApp.enable_pedido_referencia&&this.configApp.enablePedidos

    this.flag_ingreso_orden_ref=this.varGlobal.getVarUsuarioTipo()=='ref'&&this.configApp.enable_orden_referencia

    this.activePedidos = this.varGlobal.getVarUsuarioTipo()=='med'&&this.configApp.enablePedidos;
    if(this.configApp.onlyPedidos)
      this.activeOrden = false;
      else
      this.activeOrden=true
  }

  ngOnInit() {
   if(this.varGlobal.getForceUpdate()===true){
     this.presentModalClave();
   }

    //Cargo el usuario y descripcion
    this.sesion_usuario = this.varGlobal.getVarUsuario();
    this.sesion_usuario_des = this.varGlobal.getVarUsuarioDes();
    //this.lanzaIdle(); console.log("SE LANSA EL IDLE");
    this.funcionesComunes.iniciarIdle();
    console.log(this.config.tiempoInactividad);
    //this.funcionesComunes.iniciarIdle();

        
  }
  ionViewWillEnter(){
    window.onresize = () => {
      if (window.screen.width < 600 || window.innerWidth < 600) { // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    };
  }
  lanzaIdle() {

    console.log("LANZA IDLE");
    this.bnIdle.startWatching(this.configApp.tiempoInactividad).subscribe(async (isTimedOut: boolean) => {
      if (isTimedOut) {
        const isModalOpened = await this.modalCtrl.getTop();
        const isPopoverOpened = await this.popoverController.getTop();
        const isAlertOpened = await this.alertController.getTop();
        if (isModalOpened) {
          console.log("CERRANDO MODAL");
          this.modalCtrl.dismiss();
        }
        if (isPopoverOpened) {
          console.log("CERRANDO POPOVER");
          this.popoverController.dismiss();
        }
        if (isAlertOpened) {
          console.log("CERRANDO ALERT");
          this.alertController.dismiss();
        }
        console.log("CIERRA SESION");
        this.cerrarSesion();
      }
    });
  
  }


  async presentPopover(ev: any) {
    console.log(ev);

    const popover = await this.popoverController.create({
      component: PopoverUsrPage,
      cssClass: 'popover-end-page',
      event: ev,
      translucent: true,
      componentProps: {
        usuario: { nombre: this.sesion_usuario_des }
      }
    });
    return await popover.present();
  }
  
  prueba() {
    console.log("asd");

  }

  async cerrarSesion() {
    const isPopoverOpen = await this.popoverController.getTop();
    if (isPopoverOpen) {
      this.popoverController.dismiss()
    }
    this.funcionesComunes.cerrarSesion()
  }
  

  async presentModalClave() {
    this.popoverController.dismiss();
    const modal = await this.modalCtrl.create({
    component: CambioclavePage,
    cssClass:"modal-change-login",
    componentProps: { value: 123 },
    backdropDismiss:false,
    showBackdrop:true
    });
  
    await modal.present();
  
  }
}
