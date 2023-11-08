import { Component, OnInit,Input } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { FuncionesComunes } from 'src/app/utils/funciones-comunes';


@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.page.html',
  styleUrls: ['./detalle-orden.page.scss'],
})
export class DetalleOrdenPage implements OnInit {
  @Input() orden;
  configDetalle;
  constructor(public modalCtrl: ModalController, public alertController: AlertController, public toastController: ToastController,
    private configApp: AppConfigService,
    public funcionesComunes: FuncionesComunes) { }

  ngOnInit() {
 
    //CARGO DEFAULT COLORES
    this.configDetalle=this.configApp.configDetalle;
    console.log(this.configDetalle);
    
    
  }

  cerrar(){
    this.modalCtrl.dismiss();
  }

  async mostrarToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  

}
