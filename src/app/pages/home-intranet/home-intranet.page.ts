import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { BnNgIdleService } from 'bn-ng-idle';
import { EntregaPage } from 'src/app/modals/entrega/entrega.page';
import { EnvioBloquePage } from 'src/app/pages/envio-bloque/envio-bloque.page';
import { PdfOrdenwebPage } from 'src/app/modals/pdf-ordenweb/pdf-ordenweb.page';
import { PopoverUsrPage } from 'src/app/popover/popover-usr/popover-usr.page';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { FuncionesComunes } from 'src/app/utils/funciones-comunes';
import { PresupuestoPage } from 'src/app/modals/presupuesto/presupuesto.page';

@Component({
  selector: 'app-home-intranet',
  templateUrl: './home-intranet.page.html',
  styleUrls: ['./home-intranet.page.scss'],
})
export class HomeIntranetPage implements OnInit {
  public mobile = false;
  private sesion_usuario = "";
  public sesion_usuario_des = "";
  envio_bloque:boolean=false;
  ingreso_orden_c:boolean=false;

  enable_envio_iess:boolean=false;
  presupuesto:boolean=false

  constructor(
    public popoverController: PopoverController,
    private varGlobal: VariablesGlobalesService,
    private router:Router,
    public modalCtrl: ModalController,
    private bnIdle: BnNgIdleService,
    public alertController: AlertController,
    private config: AppConfigService,
    public funcionesComunes: FuncionesComunes,
    public appconfigservice:AppConfigService
    
  ){ 
    
    this.ingreso_orden_c=this.appconfigservice.enable_orden_completa;
    this.enable_envio_iess=this.appconfigservice.enable_envio_iess;
    this.envio_bloque=this.appconfigservice.intra_envio_bloque;
    this.presupuesto=this.appconfigservice.enable_presupuesto;

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
    //this.lanzaIdle();console.log("SE LANSA EL IDLE");
    console.log(this.config.tiempoInactividad);
    setTimeout(() => {
   // this.funcionesComunes.iniciarIdle();
    }, 500);
    try{
      this.bnIdle.resetTimer()
    }catch(e){
      console.error(e)
      this.funcionesComunes.iniciarIdle()

    }
  }

  ionViewDidEnter() {
  
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

  cerrarSesion(){
    //this.popoverController.dismiss();
    this.funcionesComunes.cerrarSesion()
  }

  returnPDF(){
    this.bnIdle.stopTimer()
   //this.funcionesComunes.bnIdle.stopTimer()
   //lo inicio denuevo ya que lo para el ionwillleave
   //this.funcionesComunes.iniciarIdle()
    this.router.navigate(["/pdf-preview"], { replaceUrl: true }).then(()=>{
  
    })
  }

  
  
  ionViewDidLeave() {
    console.log("SALIO DEL COMPONENTE");
    //this.bnIdle.stopTimer();
  //  this.funcionesComunes.cierraIdles()
  }
  async openModalEntrega(){
      const modal = await this.modalCtrl.create({
      animated: true,
      component: EntregaPage,
      cssClass: 'modal-select-pdfs',
      componentProps: {
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
    
    const modal = await this.modalCtrl.create({
    component: PresupuestoPage,
    componentProps: { value: 123 },
    backdropDismiss:false
    });
  
    await modal.present();
  
  }
}