import { Injectable, SimpleChange } from "@angular/core";
import { EmailValidator } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController, LoadingController, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { resolve } from "dns";
import { Observable, Observer } from "rxjs";
import { WebRestService } from "../servicios/intranet/web-rest.service";
import { PdfRenderService } from "../servicios/pdf/pdf-render.service";
import { VariablesGlobalesService } from "../servicios/variables/variables-globales.service";
import { AppConfigService } from "./app-config-service";

@Injectable({
  providedIn: 'root'
})
export class Utilidades {
  private imageBase = "";

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    private configApp: AppConfigService,
    public router: Router,
    public loadingController: LoadingController,
    public serviciosPDF: PdfRenderService,
    private varGlobal: VariablesGlobalesService,
    private servicios: WebRestService,//INTRA
    public _translate: TranslateService) {
    //DE AQUI SELECCIONO LA IMAGEN DEL LOGO
    let imageUrl = 'assets/img/logo.png';
    //COMENTADO POR QUE NO SE USA LA IMAGEN
    /*
    //CARGO UNA VES LA IMAGEN EN BASE 64
    this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
     // console.log(base64data);
      this.imageBase = base64data
    });
*/
  }

  async crearToast(mensaje, color) {
    let timeOpen=0
    const isToastOpened = await this.toastController.getTop();
    if(isToastOpened){
      //si esta abierto lo abro despues de 1 sec por lo menos
      timeOpen=1000
    }
    setTimeout(async() => {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 4000,
      color:color
    });
    toast.present();
    }, timeOpen);
  }

  async mostrarToast(mensaje) {
   this.crearToast(mensaje,'')
  }


  async mostrarToastError(mensaje) {
   this.crearToast(mensaje,'danger')
  }

  async mostrarToastSuccess(mensaje) {
   this.crearToast(mensaje,'success')
  }


 async alertErrorService(nombre_error,codigo_status){
  let mensaje="<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" +codigo_status + "<small>"

    const alert = await this.alertController.create({
      cssClass: 'mensajes-pdf',
      header: "",
      message: mensaje,
      backdropDismiss: false,
      buttons: [

        {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');
            //this.router.navigate([this.redireccion_principal])
          }
        }
      ]
    });

    await alert.present();
   
  }

  getBase64ImageFromURL(url: string) {
    return new Observable((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    // This will draw image    
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    var dataURL = canvas.toDataURL("image/png");
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  async presentLoading() {
    let mensaje = "";

    this._translate.get('simple.Cargando').subscribe((res: string) => {
      mensaje = res;
    });

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje + '...',
      duration: 15000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
  
  base64ToArrayBuffer(base64) {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  isPhone(telefono) {
    var serchfind: boolean;
    let regexp = new RegExp(/^[0-9]*$/);
    serchfind = regexp.test(telefono);
    console.log(serchfind)
    return serchfind
  }

  isEmail(search: string): boolean {
    var serchfind: boolean;

    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    serchfind = regexp.test(search);

    console.log(serchfind)
    return serchfind
  }

  getNavegador() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
      return 'Opera';
    } else if (navigator.userAgent.indexOf("Chrome") != -1) {
      return 'Chrome';
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
      return 'Safari';
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
      return 'Firefox';
    } else if ((navigator.userAgent.indexOf("MSIE") != -1)) {
      return 'IE';
    } else {
      return 'unknown';

    }


  }

  async alertOkMessage(mensaje_status){
    
    let mensaje="<ion-icon name='checkmark-circle' size='large'></ion-icon><h4><b>"+mensaje_status+"</b></h4>"
  
      const alert = await this.alertController.create({
        cssClass: 'mensajes-pdf-success',
        header: "",
        message: mensaje,
        backdropDismiss: false,
        buttons: [
  
          {
            text: 'Aceptar',
            handler: () => {
              console.log('Confirm Okay');
              //this.router.navigate([this.redireccion_principal])
            }
          }
        ]
      });
  
      await alert.present();
     
    }

}