import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DetalleOrdenPage } from '../../modals/detalle-orden/detalle-orden.page';
import { FuncionesComunes } from '../../utils/funciones-comunes';
import { WebRestService } from '../../servicios/intranet/web-rest.service';
import { MongoIntraService } from 'src/app/servicios/mongo/mongo-intra.service';
import { BaseService } from 'src/app/servicios/base/base.service';

@Component({
  selector: 'app-resultado-orden',
  templateUrl: './resultado-orden.page.html',
  styleUrls: ['./resultado-orden.page.scss'],
})
export class ResultadoOrdenPage implements OnInit {

  orden;
  redireccion_principal="/login";
  max_envio=3;
  cod_dcrp="CS"

  constructor(private route: ActivatedRoute,
    private servicios: BaseService,
    private modalCtrl: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public funcionesComunes: FuncionesComunes,
    public alertController: AlertController,
    private _translate: TranslateService,
    private router: Router) {
    this.presentLoading();
    this.orden = {
      fecha: "",
      paciente: {
        nombres: "",
        apellidos: "",
        identificacion: ""
      },
      empresa: {
        nombre: ""
      }
    }

  }

  ngOnInit() {
    sessionStorage.setItem("mx_cs",btoa(this.max_envio+"")+this.cod_dcrp);
    this.route.queryParams.subscribe(params => {
      let orden = params['id'];
      if(!orden){

        this.presentAlert("No permitido", "No existe orden");
        setTimeout(() => {
        this.loadingController.dismiss();
        }, 700);
      
      }

      console.log(orden); // Print the parameter to the console. 
      this.cargarDatos(orden);
    });
  }

  async presentModalOrden() {
    const modal = await this.modalCtrl.create({
      component: DetalleOrdenPage,
      cssClass: 'modal-detalle-orden',
      componentProps: {
        orden: this.orden
      }
    });
    return await modal.present();
  }

  cargarDatos(orden: String) {
    var formData: any = new FormData();
    formData.append("cod", orden);
    this.servicios.getResultado(formData).subscribe(resp => {
      console.log(resp);
      if (!resp||resp==null||!resp["orden"]) {
        this.presentAlert("No existe orden", "La orden solicitada no se encuentra registrada");
      
      }else{
        this.orden = resp["orden"];
      }
      setTimeout(() => {
        this.loadingController.dismiss();
      }, 600);
   

    }, error => {

      this.presentToast("Error interno " + error.message);
      this.router.navigate([this.redireccion_principal])
      this.loadingController.dismiss();
      console.log(error);

    })
  }

  back() {
    this.router.navigate([this.redireccion_principal]);
  }

  async presentAlert(titulo, mensaje) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      message: mensaje,
      backdropDismiss:false,
      buttons: [
        
           {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');
            this.router.navigate([this.redireccion_principal])
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: "top"
    });
    toast.present();
  }

  async presentLoading() {
    let mensaje = "";
    this._translate.get('complex.lista_cargando').subscribe((res: string) => {
      mensaje = res;
    });

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje + '...',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  validaEnvio(){
    let intent=sessionStorage.getItem("mx_cs");
  //  intent=atob(intent);

    console.log();
    
    this.funcionesComunes.enviarMail(this.orden,"web","");

  }
}
