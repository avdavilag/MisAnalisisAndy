import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { WebRestService } from 'src/app/servicios/intranet/web-rest.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-pdf-preview-result',
  templateUrl: './pdf-preview-result.page.html',
  styleUrls: ['./pdf-preview-result.page.scss'],
})
export class PdfPreviewResultPage implements OnInit {

  @Input() pdf64//: ArrayBuffer;
  @Input() idOrden;
  public zoomPage = 0.5;
  public rotatePage = 0;
  mobile;
  fileName = "";
  constructor(public modalCtrl: ModalController,
    public alertController: AlertController, private servicios: WebRestService) { }

  ngOnInit() {
    if (window.screen.width < 769 || window.innerWidth < 769) { // 768px portrait        
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    window.onresize = () => {
      if (window.screen.width < 769 || window.innerWidth < 769) { // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    };
 
    //CARGO EL NOMBRE
    this.cargaParametroOrden(this.idOrden);
  }

  onError(error: any) {
    // do anything
    if (this.pdf64 == null) {
      console.log("PDF VACIO");

    } else {
      console.log("EL PDF ERROR", this.pdf64);
      // this.loadingController.dismiss();
      console.log(error);
    }
    //this.loadingController.dismiss();

  }
  //desscarga pdf
  async guardarPDF() {
    //si no existe orden saco
    let fileName = "";
    if (this.fileName && this.fileName != "") {
      fileName = this.fileName;
    } else {
      fileName = "orden_" + this.idOrden
    }
    // new Blob([new Uint8Array(buffer, byteOffset, length)]);
    const blob = new Blob([new Uint8Array(this.pdf64)], { type: "application/pdf" });
    //const exportUrl = URL.createObjectURL(blob);
    saveAs(blob, fileName + ".pdf");
    //tengo q volver a generar otro por el codigo qrx
  }

  //PARAMETROS POR ORDEN UNO POR UNO
  async cargaParametroOrden(orden) {
    let formData: any = new FormData();
    formData.append("orden", orden);
    let respuesta;
    await this.servicios.getAllResourceParametroOrden(formData).toPromise().then(async (resp) => {
      console.log(resp);
      respuesta = resp;
      if (respuesta && respuesta.response) {
        if (respuesta.response.code == 1) {
          if (respuesta.response.parameters && respuesta.response.parameters.length != 0) {
            for (const parametro of respuesta.response.parameters) {
              if (parametro.code == "file_name" && parametro.data && parametro.data != "")//nombre del archivo
                this.fileName = parametro.data;

            }
          }
        } else
        console.log("ERROR AL CARGAR LOS DATOS");
        
      } else {console.log("NO HAY RESPONSE");
      
      }
    }, error => {
      console.error(error);
      
      if (error.status == 403) {
        sessionStorage.clear();
     //   this.router.navigate(["/login-intranet"], { replaceUrl: true });
      } else {
        let nombre_error = "get-all-parametros-orden"
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

      }

    })
   // console.log("PARAMETROS PDF", this.parametros);


  }

  async presentAlert(titulo, mensaje) {
    const alert = await this.alertController.create({
      cssClass: 'mensajes-pdf',
      header: titulo,
      message: mensaje,
      backdropDismiss: false,
      buttons: [

        {
          text: 'OK',
          cssClass: 'principal-button-alert',
          handler: () => {
            console.log('Confirm Okay');
            //   this.router.navigate([this.redireccion_principal])
          }
        }
      ]
    });

    await alert.present();
  }
  //HERRAMIENTAS DEL PDF
  addRemoveZoom(flag) {
    //a=add r=remove
    if (flag == 'a') {
      this.zoomPage = this.zoomPage + 0.1;
    } else {
      if (this.zoomPage > 0.1) {
        this.zoomPage = this.zoomPage - 0.1;
      }
    }
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}
