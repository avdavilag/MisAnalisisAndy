import { Injectable, SimpleChange } from "@angular/core";
import { EmailValidator } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController, LoadingController, ModalController, PopoverController, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { BnNgIdleService } from "bn-ng-idle";
import { resolve } from "dns";
import { Observable, Observer, Subscription } from "rxjs";
import { WebRestService } from "../servicios/intranet/web-rest.service";
import { PdfRenderService } from "../servicios/pdf/pdf-render.service";
import { VariablesGlobalesService } from "../servicios/variables/variables-globales.service";
import { AppConfigService } from "./app-config-service";
import { Utilidades } from "./utilidades";

@Injectable({
  providedIn: 'root'
})
export class FuncionesComunes {
  private imageBase = "";
  private flag_session_active: boolean = false;
  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    private configApp: AppConfigService,
    public router: Router,
    public loadingController: LoadingController,
    public serviciosPDF: PdfRenderService,
    private varGlobal: VariablesGlobalesService,
    private utilidades: Utilidades,//INTRA
    public _translate: TranslateService,
    public bnIdle: BnNgIdleService,
    private modalCtrl: ModalController,
    private popoverController: PopoverController) {
    //COMENTADO POR QUE NO SE USA LA IMAGEN
    /*
    //CARGO UNA VES LA IMAGEN EN BASE 64
    this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
     // console.log(base64data);
      this.imageBase = base64data
    });
*/
  }

  openPDF(orden) {
    this.utilidades.presentLoading();
    // orden.empresa.nombrePdf="femedic";
    // PREPARO LOS VALORES
    let valores_enviar = {
      "nombreLab": this.configApp.nombreLab,
      "imgLab": this.imageBase,
      "pdfEncabezado": this.configApp.pdfEncabezado,
      "pdfPie": this.configApp.pdfPie,
      "orden": orden

    }
    console.log(valores_enviar);
    //ENVIO AL SERVICIO
    let respuesta;
    this.serviciosPDF.getPDF(valores_enviar).subscribe(resp => {
      //CIERRO EL LOADING
      setTimeout(() => {
        this.loadingController.dismiss();
      }, 500);
      console.log(resp);
      respuesta = resp;
      if (respuesta.estado == 0) {
        //CREO EL PDF
        let pdfWindow = window.open("");
        pdfWindow.document.write(
          "<iframe title='Resultados PDF' width='100%' height='100%' src='data:application/pdf;base64, " +
          encodeURI(respuesta.data) + "'></iframe>"
        );
        pdfWindow.document.title = 'Resultados PDF';
      } else {
        this.utilidades.mostrarToast(respuesta.description)
      }

    }, error => {
      setTimeout(() => {
        this.loadingController.dismiss();
      }, 500);
      console.error(error);
      this.utilidades.mostrarToast("Problema datos " + error.status);
    });
    //  window.open("https://resultados.gamma.com.ec:8443/gamma/webresources/eReport/pdf?orden=712418&paciente=227064&token=2048", "_blank")

  }
  //tipo=intra//web
  //mail si existe
  async enviarMail(orden, tipo, mail) {
    let word_complex;
    let word_simple;
    let valores_enviar;
    let respuesta;
    //LO DE i18n
    this._translate.get('complex').subscribe((res: string) => {
      word_complex = res;
    });
    this._translate.get('simple').subscribe((res: string) => {
      word_simple = res;
    });

    //Creo la alerta
    const alert = await this.alertController.create({
      cssClass: 'alert-mail',
      header: word_complex.alert_enviar_titulo,
      inputs: [
        {
          type: "email",
          name: 'email',
          value: mail,
          placeholder: 'example@example.com'
        }

      ],
      buttons: [
        {
          text: word_simple.Cancelar,
          role: 'cancel',
          cssClass: 'cancel-button-alert',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: word_simple.Enviar,
          cssClass: 'principal-button-alert',
          handler: (data) => {
            if (this.utilidades.isEmail(data.email)) {
              this.utilidades.presentLoading();
              //CODIGO DE ENVIO
              valores_enviar = {
                "nombreLab": this.configApp.nombreLab,
                "imgLab": this.imageBase,
                "pdfEncabezado": this.configApp.pdfEncabezado,
                "pdfPie": this.configApp.pdfPie,
                "email": data.email,
                "orden": orden
              }
              let servicio;
              //if (tipo=="intra"){
              //  servicio=this.servicios.getPDFIntra(valores_enviar);
              //}else{
              // servicio=this.servicios.getPDF(valores_enviar);
              //}


              this.serviciosPDF.getPDF(valores_enviar).subscribe(resp => {
                console.log(resp);
                setTimeout(() => {
                  this.loadingController.dismiss();
                }, 500);

                respuesta = resp;
                // if (respuesta.estado == 0)
                //   this.mostrarToast("Correo enviado correctamente");
                // else
                //   this.mostrarToast("Correo no enviado");
                this.utilidades.mostrarToast(respuesta.description)

                setTimeout(() => {
                  this.loadingController.dismiss();
                }, 500);

              }, error => {

                setTimeout(() => {
                  this.loadingController.dismiss();
                }, 500);

                console.error(error);
                this.utilidades.mostrarToast("Problema de datos " + error.status)

              });
            } else {
              this.utilidades.mostrarToast("Ingrese un correo valido")
            }

          }
        }

      ]
    });

    await alert.present();
  }

  async cerrarSesion() {
    this.cierraIdles();
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
    this.varGlobal.setVarUsuario("");
    this.varGlobal.setVarEntidad("");
    this.varGlobal.setTokenServer("");
    sessionStorage.clear();
    this.router.navigate(["/login"], { replaceUrl: true });



    // this.idle.unsubscribe();
  }

  cambiarUsuario() {
    this.router.navigate(["/usuarios-disponibles"])

  }
  idlesCreados: Subscription[] = [];
  idleSubscription: Subscription;
  iniciarIdle() {
    console.log("LANZA IDLE", this.idleSubscription);
    console.log("TIEMPO", this.configApp.tiempoInactividad);

    if (this.idleSubscription && !this.idleSubscription.closed) {
      console.log("RESET TIMER");
      this.bnIdle.stopTimer();
      this.idleSubscription.unsubscribe()
    }

    //HAY UN RETRASO A LO QUE INICIA
    setTimeout(() => {
      this.idleSubscription = this.bnIdle.startWatching(this.configApp.tiempoInactividad).subscribe((isTimedOut: boolean) => {
        if (isTimedOut) {
          console.log("CIERRA SESION");
          this.cerrarSesion();
        }
      });
    }, 500);

    //  this.idlesCreados.push(idle)
  }

  cierraIdles() {

    this.bnIdle.stopTimer();
    this.idleSubscription.unsubscribe()
    console.log("IDLES CREADOS", this.idleSubscription);

  }

}