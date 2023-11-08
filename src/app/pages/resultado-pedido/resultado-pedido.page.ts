import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PdfPreviewResultPage } from 'src/app/modals/pdf-preview-result/pdf-preview-result.page';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { WebRestService } from 'src/app/servicios/intranet/web-rest.service';
import { PdfRenderService } from 'src/app/servicios/pdf/pdf-render.service';
import { Utilidades } from 'src/app/utils/utilidades';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-resultado-pedido',
  templateUrl: './resultado-pedido.page.html',
  styleUrls: ['./resultado-pedido.page.scss'],
})
export class ResultadoPedidoPage implements OnInit {

 
  orden;
  redireccion_principal = "/login";
  max_envio = 3;
  pdf64;
  pdf_saved;
  pdf_last_version;
  orden_original: Object;
  mobile = false;
  fecha_actual=new Date().getTime()//PARA EL CACHE

  constructor(private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private servicios: WebRestService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public utilidades: Utilidades,
    public alertController: AlertController,
    private _translate: TranslateService,
    private serviciosPDF:PdfRenderService,
    private router: Router,
    private queryservice: QueryService) {
    this.orden = {
      Paciente: {},
      Medico: {}
    }

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let uuid = params['uid'];
      console.log("el uuid",uuid);
      
        if (uuid) {
          this.getData(uuid)
        } else {
        
          this.presentAlert("No permitido", "No existe pedido");
        }


  

      console.log(uuid); // Print the parameter to the console. 
      // this.cargarDatos(uuid);
    });

    
    if (window.screen.width < 600 || window.innerWidth < 600) { // 768px portrait        
      this.mobile = true;
    } else {
      this.mobile = false;
    }

    window.onresize = () => {
      if (window.screen.width < 600 || window.innerWidth < 600) { // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    };
  }

  
  getData(uid) {
    //this.dataOrden.cod_med = this.varGlobal.getVarUsuario()
    this.presentLoading();
    this.queryservice.getPedidosbyUuid(uid).then(async (result: any) => {
      console.log('resultpedido', result);
      if(result&&result.data){
        this.orden=result.data.PedidoUuid
        this.openPDF(this.orden);
      }else{
        if(result.errors&&result.errors.length>0){
          this.utilidades.mostrarToast(result.errors[0].message)
        }else{
          this.utilidades.mostrarToast("OCURRIO UN PROBLEMA AL CARGAR PEDIDOS")
        }
      }
      setTimeout(() => {
      this.loadingController.dismiss()
      }, 500);
        
    },err=>{
      console.log(err);
      
      setTimeout(() => {
        this.loadingController.dismiss()
        }, 500);
    })

  }

  async cargarDatos(uuid: String) {
    await this.presentLoading();
    let formData: any = new FormData();
    formData.append("uuid", uuid);
    console.log(formData);

    //seteo
    this.pdf64 = null;
    this.pdf_saved = {}
    //this.pdf64 = new ArrayBuffer(192);
    //console.log(this.pdf64);
    //AQUI DEBO LLAMAR A LOS DATOS


  }


  back() {
    this.router.navigate([this.redireccion_principal]);
  }

  async presentModalPDF( pdf64,orden) {
    const modal = await this.modalCtrl.create({
      component: PdfPreviewResultPage,
      cssClass: 'modal-detalle-orden',
      componentProps: {
        pdf64:pdf64,
        idOrden: orden
      }
    });
    return await modal.present();
  }
  
  imprimir() {
    if (this.pdf_saved && this.pdf_saved != null) {
      //SOLO PARA MOBILES INDICO EL MODAL
    if(this.mobile){
      this.presentModalPDF(this.base64ToArrayBuffer(this.pdf_saved), this.orden.id_pedidos)
      return;
    }
      // let pdfWindow = window.open("");
      // pdfWindow.document.write("<iframe title='Preview' width='100%' height='100%' src='data:application/pdf;base64,"+encodeURI(this.pdf_saved.archivo)+"'></iframe>");
      // pdfWindow.document.title = 'Preview';
     // console.log(this.utilidades.getNavegador());
      
      var byteCharacters = atob(this.pdf_saved);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], { type: 'application/pdf;base64' });
      
      if(this.utilidades.getNavegador()=="Safari"){
        this.guardarPDF(file);
   
      }else{
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    } else {
      this.presentAlert("Tuvimos un problema", "Intente nuevamente");
    }

  }
  openPDF(orden) {
    // orden.empresa.nombrePdf="femedic";
    // PREPARO LOS VALORES
    let valores_enviar = {
      "orden": orden
    }
    console.log(JSON.stringify(valores_enviar.orden));
    
    console.log(valores_enviar);
    //ENVIO AL SERVICIO
    let respuesta;
    this.serviciosPDF.getPDFPedido(valores_enviar).subscribe(resp => {
      console.log(resp);
      respuesta = resp;
      if (respuesta.estado == 0) {
        this.pdf_saved=respuesta.data
      } else {
        this.utilidades.mostrarToast(respuesta.description)
      }

    }, error => {
      console.error(error);
     this.utilidades.mostrarToast("Problema datos " + error.status);
   
    });
    //  window.open("https://resultados.gamma.com.ec:8443/gamma/webresources/eReport/pdf?orden=712418&paciente=227064&token=2048", "_blank")

  }

  //desscarga pdf
  async guardarPDF(archivo:Blob) {
  //si no existe orden saco
 // const blob = new Blob([new Uint8Array(this.pdf64)], { type: "application/pdf" });
  //const exportUrl = URL.createObjectURL(blob);
  saveAs(archivo, "orden_" + this.orden.id_orden + ".pdf");
  //tengo q volver a generar otro por el codigo qrx
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
          handler: () => {
            console.log('Confirm Okay');
            //   this.router.navigate([this.redireccion_principal])
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
      duration: 10000
    });
    return loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  validaEnvio() {
    let intent = sessionStorage.getItem("mx_cs");
    //  intent=atob(intent);

    console.log();

   // this.utilidades.enviarMail(this.orden, "web", "");

  }

async verInforme(uuid){
   await this.cargarDatos(uuid).then(()=>{

    this.imprimir();
   });
  
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

}


