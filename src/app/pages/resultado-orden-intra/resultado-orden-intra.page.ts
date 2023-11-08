import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, createAnimation, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SelectPdfPage } from '../../modals/select-pdf/select-pdf.page';
import { FuncionesComunes } from '../../utils/funciones-comunes';
import { WebRestService } from '../../servicios/intranet/web-rest.service';
import { saveAs } from 'file-saver';
import { PdfPreviewResultPage } from '../../modals/pdf-preview-result/pdf-preview-result.page';
import { MongoIntraService } from 'src/app/servicios/mongo/mongo-intra.service';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { PdfRenderService } from 'src/app/servicios/pdf/pdf-render.service';
import { FuncionesComunesIntra } from 'src/app/utils/funciones-comunes-intra';
import { Utilidades } from 'src/app/utils/utilidades';

@Component({
  selector: 'app-resultado-orden-intra',
  templateUrl: './resultado-orden-intra.page.html',
  styleUrls: ['./resultado-orden-intra.page.scss'],
})
export class ResultadoOrdenIntraPage implements OnInit {

  private orden;
  private datos_orden;
  private redireccion_principal = "/login";
  //private max_envio = 3;
  private pdf64;
  public pdf_saved;
  public pdf_last_version;
  //private orden_original: Object;
  public mobile = false;
  public fecha_actual = new Date().getTime()//PARA EL CACHE
  public activa_versionamiento: any = true;
  public datosPaciente
  public permiso_impresion = true
  public parametros = [];
  public listo = false;
  private flag_activa = false;//activa el versionamiento
  public orden_uuid;
  public mesajePendientes = "";
  private idOrden = "";

  constructor(private route: ActivatedRoute,
    private servicios: WebRestService,
    private serviciosMongo: MongoIntraService,
    private modalCtrl: ModalController,
    private serviciosPDF: PdfRenderService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public utilidades: Utilidades,
    public funcionesComunesIntra: FuncionesComunesIntra,
    public alertController: AlertController,
    private _translate: TranslateService,
    private config: AppConfigService,
    private router: Router) {
    this.orden = {
      paciente: {},
      medico: {}
    }
    this.datosPaciente = {}
  }

  ngOnInit() {
    //variable para activar o no el versionamiento
    this.activa_versionamiento = this.config.activaVersionamiento

    this.route.queryParams.subscribe(params => {
      let uuid = params['uid'];//del versionamiento
      let flag_activa = params['flag']
      let orden_uuid = params['oUid'];//de la orden original
      if (orden_uuid) {
        this.orden_uuid = orden_uuid;
        if (this.activa_versionamiento) {
          if (uuid) {
            this.cargarDatos(uuid)
          } else {
            this.checkPDFGuardados(orden_uuid);
          }
        } else {
          //cuando no hay versionamiento
          this.cargarDatosAva(orden_uuid)
        }
        if (flag_activa) {
          //con versionamiento no se probo
          this.flag_activa = flag_activa
          this.presentLoading();
        }



      } else {
        this.presentAlert("No permitido", "No existe orden");
        setTimeout(() => {
          this.loadingController.dismiss();
        }, 700);
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

  async presentModalPDF(pdf64, orden) {
    const modal = await this.modalCtrl.create({
      component: PdfPreviewResultPage,
      cssClass: 'modal-detalle-orden',
      componentProps: {
        pdf64: pdf64,
        idOrden: orden
      }
    });
    return await modal.present();
  }

  async cargarDatos(uuid: String) {
    await this.presentLoading();
    let formData: any = new FormData();
    formData.append("uuid", uuid);
    console.log("este es el formdata",formData);
    //seteo
    this.pdf64 = null;
    this.pdf_saved = {}
    //this.pdf64 = new ArrayBuffer(192);
    //console.log(this.pdf64);
    await this.serviciosMongo.getSavedPDFUid(formData).toPromise().then(async (resp) => {
      console.log(resp);
      if (resp && resp != null) {
        this.pdf_saved = resp;
        // this.loadingController.dismiss();
        this.pdf_saved.fecha = this.pdf_saved.fecha.replace(" ", "T")
        if (new Date(this.pdf_saved.fecha).toLocaleDateString() == new Date().toLocaleDateString()) {
          //console.log("HOOOOOOOOY");
          this.pdf_saved.hoy = "Hoy "
        }
        this.cargarDatosPaciente(this.pdf_saved.orden)
        this.cargarUltimaVersion(this.pdf_saved.orden, this.pdf_saved.version);
        //CARGO EL PDF
        this.listo = true;
        this.pdf64 = this.pdf_saved.archivo
        if (this.flag_activa) {
          this.imprimir()
        }
setTimeout(() => {
  this.loadingController.dismiss();
}, 500);

      } else {
        this.loadingController.dismiss();
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>No se encuentra la orden</b></h2>" + uuid)

      }


    }, error => {
      console.log("ERROR DATOS ORDEN");
      console.error(error);
      this.loadingController.dismiss()

      let nombre_error = "get-pdf-saved"
      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")


    });
  }


  async cargarDatosAva(uuid: String) {
    await this.presentLoading();
    let formData: any = new FormData();
    formData.append("uuid", uuid);
    //seteo
    this.pdf64 = null;
    this.pdf_saved = {}
    this.listo = false;
    //this.pdf64 = new ArrayBuffer(192);
    console.log("uuid", uuid);
    let respuesta;
    await this.servicios.getOrderbyUid(formData).toPromise().then(async (resp) => {
      console.log(resp);
      respuesta = resp;
      this.idOrden=respuesta.response.order;
      if (respuesta.response && respuesta.response.order && respuesta.response.order != null) {
        // this.cargoOrdenOriginal(respuesta.response.order);
        this.cargarDatosPaciente(respuesta.response.order).then(() => {
          this.loadingController.dismiss();
          if (this.datosPaciente.progress > 0)
            this.funcionesComunesIntra.renderizaPDFOrden(respuesta.response.order, 0).then((pdf) => {
              console.log("EL PDF DE FUNCOMUN", pdf);
              this.listo = true;
              this.pdf64 = pdf
            }, error => {
              console.error("ERROR DEL METODO", error);
             //this.loadingController.dismiss();
              this.listo = true;
            });
        });
      } else {
        this.loadingController.dismiss();
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>No se encuentra la orden</b></h2>" + uuid)
      }


    }, error => {
      console.log("ERROR DATOS ORDEN");
      console.error(error);
      this.loadingController.dismiss()

      let nombre_error = "get-order-uid"
      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")


    });
  }

  async cargarDatosPaciente(orden) {
    var formData: any = new FormData();
    formData.append("orden", orden);
    //formData.append("orden", this.orden.id_orden);
    await this.servicios.getDatosPacienteIntra(formData).toPromise().then(async (resp) => {
      console.log("DATOS PACIENTE", resp);
      if (resp || resp[0]) {
        this.datosPaciente = resp[0];
        //this.datosPaciente.saldo=99
        if (this.datosPaciente.saldo && this.datosPaciente.saldo > 0) {
          this.permiso_impresion = false;
          //this.listo = true
          //  const confirmation = await this.presentAlertPermiso(this.datosPaciente.saldo)
          //   console.log("CONFIRMATION", confirmation);
          //  this.permiso_impresion = confirmation;
        }

        if (this.datosPaciente.incomplete > 0) {
          this.activaPendientes(this.datosPaciente.pendientes, this.datosPaciente.progress > 0)
          //this.permiso_impresion = confirmation2;
        }
      }
    }, error => {
      console.log("ERROR EN DATOS DE PACIENTE");
      console.error(error);
      if (error.status == 403) {
        sessionStorage.clear();
        this.router.navigate(["/login-intranet"], { replaceUrl: true });
      } else {
        let nombre_error = "datos-paciente"
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
      }
    });
  }

  activaPendientes(pendientes, activa) {
    if (activa) {
      this.mesajePendientes = pendientes;
    } else {
      this.mesajePendientes = "No existen exámenes validados aun en esta orden";
      //this.listo = false;
    }
  }

  onErrorPDF(error: any) {
    // do anything
    if (this.pdf64 == null) {
      console.log("PDF VACIO");

    } else {
      console.log("EL PDF ERROR", this.pdf64);
      this.loadingController.dismiss();
      console.log(error);
    }
    //this.loadingController.dismiss();

  }

  async cargarDatosOrden(id_orden) {
    //await this.loadingOrden();
    let formData: any = new FormData();
    formData.append("orden", id_orden);
    console.log(formData);
    //this.pdf64 = new ArrayBuffer(192);
    //console.log(this.pdf64);
    this.servicios.getOrdenIntra(formData).toPromise().then(async (resp) => {
      console.log(resp);
      if (resp && resp != null) {
        this.orden = resp;
        this.loadingController.dismiss();
        //cargo datos de paciente
        // this.cargarDatosPaciente();
      } else {
        this.loadingController.dismiss();
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>No se encuentra la orden</b></h2>" + id_orden)
      }
    }, error => {
      console.log("ERROR DATOS ORDEN");
      console.error(error);
      this.loadingController.dismiss()

      let nombre_error = "get-orden"
      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
    });
  }

  async cargarUltimaVersion(orden: String, version: Number) {
    let formData: any = new FormData();
    formData.append("orden", orden);
    formData.append("version", version);
    console.log(formData);

    this.serviciosMongo.getLastVersionPDF(formData).subscribe(async (resp) => {
      console.log(resp);
      if (resp && resp != null) {
        this.pdf_last_version = resp;

        this.pdf_last_version.fecha = this.pdf_last_version.fecha.replace(" ", "T")
        if (new Date(this.pdf_last_version.fecha).toLocaleDateString() == new Date().toLocaleDateString()) {
          //console.log("HOOOOOOOOY");
          this.pdf_last_version.hoy = "Hoy "
        }


      } else {
        console.log("ES LA ULTIMA VERSION");
        this.pdf_last_version = null

        //  this.loadingController.dismiss();
        // this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>No se encuentra la orden</b></h2>" + orden)

      }


    }, error => {
      console.error(error);

      let nombre_error = "get-last-version"
      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")


    });
  }

  back() {
    this.router.navigate([this.redireccion_principal]);
  }

  imprimir() {
    if (!this.activa_versionamiento) {
      this.imprimeRender()
      return
    }
    if (this.pdf_saved.archivo && this.pdf_saved.archivo != null) {
      //SOLO PARA MOBILES INDICO EL MODAL
      if (this.mobile) {
        console.log("IDORDEN", this.idOrden);
        
        this.presentModalPDF(this.base64ToArrayBuffer(this.pdf_saved.archivo), this.idOrden)
        return;
      }
      // let pdfWindow = window.open("");
      // pdfWindow.document.write("<iframe title='Preview' width='100%' height='100%' src='data:application/pdf;base64,"+encodeURI(this.pdf_saved.archivo)+"'></iframe>");
      // pdfWindow.document.title = 'Preview';
      // console.log(this.funcionesComunes.getNavegador());

      var byteCharacters = atob(this.pdf_saved.archivo);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], { type: 'application/pdf;base64' });

      if (this.utilidades.getNavegador() == "Safari") {
        this.guardarPDF(file);

      } else {
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      }
    } else {
      this.presentAlert("Tuvimos un problema", "Intente nuevamente");
    }

  }


  //desscarga pdf
  async guardarPDF(archivo: Blob) {
    //si no existe orden saco
    // const blob = new Blob([new Uint8Array(this.pdf64)], { type: "application/pdf" });
    //const exportUrl = URL.createObjectURL(blob);
    saveAs(archivo, "orden_" + this.orden_uuid + ".pdf");
    //tengo q volver a generar otro por el codigo qrx
  }
  imprimeRender() {
    if (this.pdf64) {
      let blob = new Blob([new Uint8Array(this.pdf64)], { type: "application/pdf" });
      const exportUrl = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      if (this.mobile) {
        this.presentModalPDF(this.pdf64, this.idOrden)
        return;
      }

      if (this.utilidades.getNavegador() == "Safari") {
        this.guardarPDF(blob);

      } else {
        var fileURL = URL.createObjectURL(blob);
        window.open(fileURL);
      }

    } else {
      this.presentAlert("Tuvimos un problema", "Intente nuevamente");
    }
  }


  async validarOrdenOriginal() {
    let ordenModificada = await JSON.parse(JSON.stringify(this.datos_orden));

    for (let i = 0; i < ordenModificada.length; i++) {
      ordenModificada[i] = { "ava_misanalisis_report": ordenModificada[i] };
    }
    console.log(ordenModificada);
    return ordenModificada;

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

    //this.funcionesComunes.enviarMail(this.orden, "web", "");

  }

  async checkPDFGuardados(orden_uuid) {
    var formData: any = new FormData();
    formData.append("orden_uuid", orden_uuid);
    console.log(formData);
    //formData.append("orden", this.orden.id_orden);
    let respuesta;
    await this.serviciosMongo.getSavedListUidPDF(formData).toPromise().then((resp) => {
      respuesta = resp;
      console.log(resp);

      if (respuesta && respuesta.length > 0) {
        respuesta.forEach(element => {
          if (new Date(element.fecha).toLocaleDateString() == new Date().toLocaleDateString()) {
            //console.log("HOOOOOOOOY");
            element.hoy = "Hoy "
          }

        });
        //agarro el primer registro q corresponde a la ultima version
        this.cargarDatos(respuesta[0].uuid);
        // this.lista_pdfs = respuesta;
      } else {
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>No existe</b></h2></br>No se encontro la orden solicitada<br>")

      }

    }, error => {
      console.error(error);

      let nombre_error = "getSavedPDFs"
      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

      //  this.loadingController.dismiss()

    });
  }

  async verInforme(uuid) {
    await this.cargarDatos(uuid).then(() => {

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
  /*
    async cargaModalHistorial(lista) {
      const modal = await this.modalCtrl.create({
        animated: true,
        component: SelectPdfPage,
        cssClass: 'modal-select-pdfs',
        componentProps: {
          lista_pdfs: lista
        },
        // leaveAnimation: animationBuilder,
      });
      modal.onDidDismiss()
        .then((data) => {
          console.log(data['data']);
          // this.filtrarPeriodo(data['data']);
          if (data['data']) {
            // this.getArchivoPDF(data['data']);
            //this.pdf_saved=data['data']
            //llamo denuevo para no estar llamando dos veces mas
            this.cargarDatos(data['data'].uuid);
          }
        });
      return await modal.present();
    }
  
  
  
    async getArchivoPDF(pdf) {
      //LLAMO AL PDF POR ID DEL MONGO
      var formData: any = new FormData();
      formData.append("id", pdf.id);
      let data;
      return this.servicios.getSavedPDF(formData).toPromise().then(resp => {
        console.log(resp);
        data = resp;
        // this.base64ToArrayBuffer(data.archivo);
        this.pdf_saved.archivo = data.archivo
  
        //this.pdf64Send =data.archivo;
        //GENERO EL MENU NUEVAMENTE CON LOS ANALISIS
        //this.generaMenuAnalisiSelect(pdf.analisis)
      }, error => {
        let nombre_error = "get-archivo"
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
      })
    }
  */

  /*//COMENTO TODO LO DE CARGA PDF INTRA SIN VERSION
    async cargoOrdenOriginal(orden) {
      let formData: any = new FormData();
      formData.append("orden", orden);
      await this.servicios.getOrdenOriginalIntra(formData).toPromise().then(async (resp) => {
        this.datos_orden = resp
        this.cargaTodosParametrosOrden(orden).then(() => {
          this.cargaParametrosOrden(orden).then(() => {
            this.funcionesComunes.cargarPDF(0,this.datos_orden,this.parametros).then((resp)=>{
              this.listo=true;
              console.log(resp);
              
              this.pdf64=resp
            });
          })
        })
      });
    }
  
  
    //PARAMETROS POR ORDEN
    async cargaParametrosOrden(orden) {
      var BreakException = {};
      try {
        for (const parametro of this.config.parametrosPDFOrden) {
          //compruebo que no exista
          console.log("PARAMETRO", parametro);
          if (!this.parametros.some(param => param.nombre === parametro)) {
            let formData: any = new FormData();
            formData.append("parametro", parametro);
            formData.append("orden", orden);
  
            let respuesta;
            await this.servicios.getResourceParametroOrden(formData).toPromise().then(resp => {
              console.log(resp);
              respuesta = resp;
              if (respuesta && respuesta.response) {
                if (respuesta.response.code == 1) {
                  if (respuesta.response.data && respuesta.response.data != "") {
                    this.parametros.push({ "nombre": parametro, "valor": respuesta.response.data })
                    console.log("INGRESO", respuesta.response);
                  }
                } else
                  this.funcionesComunes.mostrarToast("Error al cargar parametro (" + parametro + ") desc: " + respuesta.response.description)
              } else {
                this.funcionesComunes.mostrarToast("Error al cargar parametro (" + parametro + ") no existe response")
              }
            }, error => {
              if (error.status == 403) {
                sessionStorage.clear();
                this.router.navigate(["/login-intranet"], { replaceUrl: true });
              } else {
                let nombre_error = "get-formatos"
                this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
  
              }
  
              throw BreakException;
            })
          }
        }//Acaba for
      } catch (e) {
        if (e !== BreakException) throw e;
      }
      //this.parametros.push({"nombre":"HELLO","valor":"WORD"})
      //this.parametros.push({"nombre":"PAPI","valor":"Chulo"})
      console.log("PARAMETROS PDF", this.parametros);
    }
  
    //PARAMETROS POR ORDEN
    async cargaTodosParametrosOrden(orden) {
      //mensaje de info
      //this.mensaje_info = 'Cargando parametros...'
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
                await this.parametros.push({ "nombre": parametro.code, "valor": parametro.data })
              }
            }
          } else
            this.funcionesComunes.mostrarToast("Error al cargar parametros desc: " + respuesta.response.description)
        } else {
          this.funcionesComunes.mostrarToast("Error al cargar parametros no existe response")
        }
      }, error => {
        if (error.status == 403) {
          sessionStorage.clear();
          this.router.navigate(["/login-intranet"], { replaceUrl: true });
        } else {
          let nombre_error = "get-all-parametros-orden"
          this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
  
        }
  
      })
      console.log("PARAMETROS PDF", this.parametros);
  
    }
  
  
    async cargarPDF() {
      //orden = await this.validarOrden(orden);
      // let orden = await this.validarOrdenOriginal();
      let adjuntos64 = "";
      let versionamiento = 0;
  
      if (this.activa_versionamiento) {
        versionamiento = 1//1 activa el verionamiento
      }
  
      let orden = await this.validarOrdenOriginal();
  
      let valores_enviar = {
        "nombreLab": "",
        "firma": "",
        "formato": "",
        "qr": "",
        "qr2": "",
        "adjuntos": adjuntos64,
        "orden": orden,
        "parametros": this.parametros,
        "versionamiento": versionamiento
        // "orden": orden
      }
  
      console.log("envio al pdf", valores_enviar);
      //console.log(JSON.stringify(valores_enviar));
  
      //ENVIO AL SERVICIO QUE GENERA EL PDF
      // const loader = await this.loadingController.getTop();
      // if loader present then dismiss
      if (orden && orden != null) {
        await this.serviciosPDF.getPDFIntra(valores_enviar).toPromise().then(async (resp) => {
          setTimeout(() => {
            //  this.loadingController.dismiss();
          }, 300);
          console.log("EL PDF", resp);
          this.pdf64 = resp// this.base64ToArrayBuffer(respuesta.data);
          this.listo = true;
          if (this.flag_activa) {
            this.loadingController.dismiss();
            this.imprimir()
          }
          //para movil le hago back zoom
          //if (this.mobile)
          //this.zoomPage = 0.6;
        }, error => {
          this.loadingController.dismiss();
          //this.presentAlert('Error', 'Error de consulta ' + error.status);
          let nombre_error = "pdf-intra"
          this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
          console.log(error);
  
          this.pdf64 = null;
        });
  
  
      } else {
        //this.presentAlert('','')
        this.presentAlert('No se genero el pdf', 'No existe informacion de examenes para la orden solicitada');
        // let nombre_error=""
        //this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></h1></br>Favor contacte con soporte.\n<br><small>Codigo error: "+nombre_error+"<small>")
        this.pdf64 = null;
        this.loadingController.dismiss();
      }
    }
  
    */
}


