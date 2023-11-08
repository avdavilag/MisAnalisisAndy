import { ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { WebRestService } from '../../servicios/intranet/web-rest.service';
import { saveAs } from 'file-saver';
import { AlertController, AnimationBuilder, createAnimation, IonFab, LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PopoverIntrausrPage } from '../../popover/popover-intrausr/popover-intrausr.page';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { BnNgIdleService } from 'bn-ng-idle';
import { SelectPdfPage } from '../../modals/select-pdf/select-pdf.page';

import { timeout } from 'rxjs/operators';
import * as uuid from 'uuid';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { PdfRenderService } from 'src/app/servicios/pdf/pdf-render.service';
import { MongoIntraService } from 'src/app/servicios/mongo/mongo-intra.service';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { Utilidades } from 'src/app/utils/utilidades';
import { FuncionesComunes } from 'src/app/utils/funciones-comunes';
import { EntregaPage } from 'src/app/modals/entrega/entrega.page';
import { AlertWzpSendPage } from 'src/app/modals/alert-wzp-send/alert-wzp-send.page';
import { FirmaService } from 'src/app/servicios/firma/firma.service';
import { ReimpresionPage } from 'src/app/modals/reimpresion/reimpresion.page';
import { QueryService } from 'src/app/servicios/gql/query.service';
//cambio el worker
//checkear q version de worker esta usando para descar ese mismo
//(window as any).pdfWorkerSrc = 'assets/libraries/pdfjs-3.0.279-dist/build/pdf.worker.js';
@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.page.html',
  styleUrls: ['./pdf-preview.page.scss'],
})
export class PdfPreviewPage implements OnInit {
  //pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
  public idOrden = "";
  public orden;
  public datosPaciente;
  public datosAdjuntos;
  public dir_qr = "";
  private dir_qr_full;
  private dir_qr_short;
  private resultadosSelect = [];
  private analisisSelect = [];
  private uuid_pdf = "";
  private uuid_orden = "";
  private version_pdf;
  public pdf64//: ArrayBuffer;
  private pdf64Send;
  public zoomPage = 1;
  public rotatePage = 0;
  public itemsCheked = 0;
  private sesion_usuario = "";
  public sesion_usuario_des = "";
  private sesion_permiso = 0;
  public formatos;
  public formato = "default";
  private firma_orden = "";
  public adjuntos_flag = true;
  public mobile = false;
  public filtro = false;
  public select_pdf;
  public lista_pdfs;
  public flag_descarga; //flag para saber si descargo para evitar que se vuelva a guardar
  public historial_busqueda = [];
  @ViewChild('inputId', { static: false }) inputOrden;
  private orden_original;
  private parametros = [];
  public permiso_impresion: any = true;
  public activa_versionamiento: any = true;
  private dir_qr_anexo: any;
  public lista = false;
  public mensaje_info = '';
  public activaMail = true;
  public activaWzp = true;
  public activaLib = true;
  public lista_pendientes = "";
  private fileName = "";
  private force_delivery = false;
  private force_sgc = false;
  private firma_archivo = null;
  private firma_codigo = null;
  private activa_firma = false;
  private activa_firma_list = false
  private firmaUsuarios;
  private activa_imagenes_analisis = true;
  private imagenesAnalisis;
  private callAdjuntos = true;//PERMITE O CANCELA ADJUNTOS
  private permisoPrintRef = true;//NO PERMITE SI TIENE REFERENCIA
  public permiteSoloAdjuntos = false;//Permite imprimir solo adjuntos
  private analisisServicio;

  constructor(
    private servicios: WebRestService,
    private serviciosPDF: PdfRenderService,
    private serviciosFirma: FirmaService,
    private serviciosMongo: MongoIntraService,
    private serviciosGeneral: GeneralService,
    private queryservice: QueryService,
    public toastController: ToastController,
    private route: ActivatedRoute,
    public alertController: AlertController,
    public sanitizer: DomSanitizer,
    private menu: MenuController,
    private zone: NgZone,
    private cd: ChangeDetectorRef,
    public utilidades: Utilidades,
    public popoverController: PopoverController,
    public _translate: TranslateService,
    public loadingController: LoadingController,
    private router: Router,
    private config: AppConfigService,
    private bnIdle: BnNgIdleService,
    public modalCtrl: ModalController,
    private varGlobal: VariablesGlobalesService,
    private funciones_comunes: FuncionesComunes,
    private generalServicio: GeneralService
  ) {
    this.defaultDatos();
    console.log(this._translate.getDefaultLang());
  }

  ngOnInit() {
    console.log(this.varGlobal.loadIp());
    //this.lanzaIdle();
    //this.funciones_comunes.iniciarIdle();
    this.funciones_comunes.iniciarIdle();
    this.cargaFormatos();
    this.cargaParametros();
    // this.callAdjuntos=this.getDataParam("AVAVIAs")?true:false

    this.getDataParam("AVAVIA").then(resp => {
      this.callAdjuntos = resp
      console.log("Call adjuntos ", this.callAdjuntos);
    })

    //CHECK MOBILE
    if (window.screen.width < 600 || window.innerWidth < 700) { // 768px portrait        
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    window.onresize = () => {
      if (window.screen.width < 600 || window.innerWidth < 700) { // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    };

    //Cargo el usuario y descripcion
    this.sesion_usuario = this.varGlobal.getVarUsuarioIntra();
    this.sesion_usuario_des = this.varGlobal.getVarUsuarioIntraDes();

    //no entrar al router si ya esta logeado
    this.route.queryParams.subscribe(params => {
      let token = params['tkn'];
      let usuario = params['usr'];
      let usuario_desc = params['usr_des'];
      let flag = params['flag'];
      let orden = params['param1'];

      console.log("token ", token);
      if (token) {
        //seteo
        //this.servicio.setTokenServer(token);
        //this.servicio.setVarUsuario(usuario);
        //this.validaUsuario(this.loginForm2,flag+'?param1='+parametro1);
        this.sesion_usuario = usuario;
        this.sesion_usuario_des = usuario_desc;
        this.validaTkn(usuario, usuario_desc, token, "");
      } else {
        console.log("NO EXISTE ROUTER");

      }
      // let orden = params['param1'];
      console.log(orden);
      if (!orden) {
        console.log("no existe orden");
        //this.presentAlert("No permitido", "No existe orden");
        setTimeout(() => {
          //this.loadingController.dismiss();
        }, 700);
        this.idOrden = ""
      } else {
        this.idOrden = orden;
        //eliminar esto de cargar
        this.cargarDatos(this.idOrden);
      }
    });

    this.cargaPermisoUsuario();

    //crgo historial si existe para el usuario
    if (localStorage.getItem("hist_" + this.sesion_usuario)) {
      this.historial_busqueda = JSON.parse(localStorage.getItem("hist_" + this.sesion_usuario))
    } else {
      this.historial_busqueda = []
    }
    //variable para activar o no el versionamiento
    this.activa_versionamiento = this.config.activaVersionamiento
    //activa func
    this.activaMail = this.config.activaMail

    this.activaWzp = this.config.activaWhatsApp

    this.activaLib = this.config.activaLiberacion
    //activa la firma
    this.activa_firma = this.config.activaFirma
    //activa las firmas del graph para el reporte
    this.activa_firma_list = this.config.activaFirmaList
    //activa las imagenes de los analisis
    this.activa_imagenes_analisis = this.config.activaImagenesAnalisis
    //SOLO ADJUNTOS PARA EVITAR EL ERROR
    this.permiteSoloAdjuntos = this.config.permiteSoloAdjuntos

    //VERIFICO SI PERMITE REFERENCIAS
    this.validateUserPrintReferencia();

  }

  async checkDbParms(param) {
    try {
      // this.list_ref.push({ value: null, des: "Ninguno" })
      const dataParam: any = await this.queryservice.getDbParms({ cod_par: param });
      console.log("DTA PARAM " + param, dataParam);

      const data = dataParam.data.getCsDbParms ? dataParam.data.getCsDbParms.val_par : null

      return data;
    } catch (error) {
      console.error("ERRO AL OBTENER LOS PARAMETROS", error);
      this.utilidades.mostrarToastError("ERROR AL OBTENER PARAMETRO " + param)
      return null;
    }
  }
  
  async checkPeticionServicio(orden) {
    try {
      // this.list_ref.push({ value: null, des: "Ninguno" })
      const peticionesExternas: any = await this.queryservice.getPeticionesExternas({ nro_ord: parseInt(orden) });
      console.log("DTA ORDEN " + orden, peticionesExternas);

      const data = peticionesExternas.data.getPeticionesExternas ? peticionesExternas.data.getPeticionesExternas : []

      return data;
    } catch (error) {
      console.error("ERRO AL OBTENER PETICION EXTERNA", error);
      this.utilidades.mostrarToastError("ERROR AL PETICION EXTERNA" + orden)
      return null;
    }
  }
  
  async checkPermisionUser(user, permiso) {
    try {
      // this.list_ref.push({ value: null, des: "Ninguno" })
      const dataParam: any = await this.queryservice.getPermisoUsuario({ usuario: user, cod_per: permiso });
      console.log("Permiso" + permiso, dataParam);

      const data = dataParam.data.getPermisoXUsuario ? dataParam.data.getPermisoXUsuario.cod_per : null

      return data;
    } catch (error) {
      console.error("ERRO AL OBTENER LOS PARAMETROS", error);
      this.utilidades.mostrarToastError("ERROR AL OBTENER PARAMETRO " + permiso)
      return null;
    }
  }

  async getDataParam(param) {
    try {
      // this.list_ref.push({ value: null, des: "Ninguno" })
      const dataParam: any = await this.queryservice.getCsParms({ cs_name: param });
      console.log("DTA PARAM " + param, dataParam);

      const data = dataParam.data.getCsParms ? dataParam.data.getCsParms.cod_parm : null

      return data;
    } catch (error) {
      console.error("ERRO AL OBTENER LOS PARAMETROS", error);
      this.utilidades.mostrarToastError("ERROR AL OBTENER PARAMETRO " + param)
      return null;
    }

  }

  //Si existe el codigo AVALRF y esta en 1 o en S, bloquear la impresion de todas las ordenes que tengan una referencia ingresada en la orden, 
  //a menos que tengan el permiso especial en cs_perxgru el permiso PRINTRF
  async validateUserPrintReferencia() {
    const paramValidate = await this.checkDbParms("AVALRF")
    if (paramValidate && (paramValidate == '1' || paramValidate == 'S')) {//SI SI SE BLOQUEA
      const permisoEspecial = await this.checkPermisionUser(this.sesion_usuario, "PRINTRF")
      if (permisoEspecial) {//SI TIENE PERMISO PUEDE IMPRIMIR
        this.permisoPrintRef = true;
      } else {
        this.permisoPrintRef = false;
      }
    }
  }


  async validaTkn(usr, desc, token, router) {
    // let loading = await this.loadingPDF();
    var formData: any = new FormData();
    await this.generalServicio.validaToken(formData, token).toPromise().then(async (resp) => {
      console.log(resp);

      this.varGlobal.setTokenServer(token);

      //GUARDO USUARIO Y DESCRIPCION
      this.varGlobal.setVarUsuarioIntraDes(desc);
      this.varGlobal.setVarUsuarioIntra(usr);
      //NUEVAMENTE
      this.cargaPermisoUsuario();

    }, error => {
      //SI HAY ERROR IGUAL DESPARESCO EL LOADING
      console.log(error);
      setTimeout(() => {
        this.loadingController.dismiss();
      }, 400);
      if (error.status == 403) {
        this.utilidades.mostrarToast("No permitido");
        sessionStorage.clear();
        //this.router.navigate(["/login-"]);
      } else {
        this.utilidades.mostrarToast("Problema con el servidor: " + error.message);
      }

    })
  }
  ionViewWillEnter() {
    console.log("ENTROOO ION VIEW WILL ENTER");

  }



  lanzaIdle() {
    console.log("SE LANSA EL IDLE");
    this.bnIdle.startWatching(this.config.tiempoInactividad).subscribe(async (isTimedOut: boolean) => {
      if (isTimedOut) {
        sessionStorage.clear();
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

        this.bnIdle.stopTimer();
        this.router.navigate(["/login-intranet"], { replaceUrl: true })
      }
    });
  }

  defaultDatos() {
    this.orden = {
      id_orden: "",
      fecha: "",
      tipo_analisis: [
        {
          analisis: [
            {
              parametros: [

              ]
            }
          ]
        }
      ]

    }

    this.datosPaciente = {
      telf_pac: "",
      mail_pac: ""
    }
  }

  cargaPermisoUsuario() {
    let formData: any = new FormData();
    console.log("USUARIO", this.sesion_usuario);
    formData.append("usuario", this.sesion_usuario);
    formData.append("permiso", "PSALDO");//PERMISO DE IMPRESION CON SALDO
    let respuesta;
    this.servicios.getPermiso(formData).subscribe(resp => {
      console.log("PERMISO DEL USUARIO", resp);
      respuesta = resp;
      if (respuesta.response) {
        if (respuesta.response.code == 1) {
          this.sesion_permiso = 1
        } else {
          this.sesion_permiso = 0
        }
      }

    }, error => {
      //VALIDO YA QUE NO LLEGA MUY RAPIDO EL USUARIO
      if (error.status == 403) {
        return;
      }
      let nombre_error = "get-permiso"
      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

    })
  }

  cargaFormatos() {
    this.serviciosGeneral.getFormatosServer().subscribe(resp => {
      console.log(resp);
      this.formatos = resp;
      if (this.formatos && this.formatos.length == 0) {
        this.presentAlert("Tuvimos un problema con Formatos", "No existe formatos");
        this.formato = "";
      } else {
        if (!this.config.formatoDefIntra) {

          if (this.formatos.includes("default")) {
            this.formato = "default"
          } else {
            this.formato = this.formatos[0];
          }
        } else {
          this.formato = this.config.formatoDefIntra
        }

      }
    }, error => {
      let nombre_error = "get-formatos"
      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

    })
  }

  //PARAMETROS GLOBALES
  cargaParametros() {
    var BreakException = {};
    try {
      if (this.config.parametrosPDF.length > 0) {

        this.config.parametrosPDF.forEach(parametro => {
          let formData: any = new FormData();
          formData.append("parametro", parametro);
          console.log(formData);
          let respuesta;
          this.servicios.getResourceParametro(formData).subscribe(resp => {
            console.log(resp);
            respuesta = resp;
            if (respuesta && respuesta.response) {
              if (respuesta.response.code == 1) {
                if (respuesta.response.data && respuesta.response.data != "")
                  this.parametros.push({ "nombre": parametro, "valor": respuesta.response.data })
              } else
                this.utilidades.mostrarToast("Error al cargar parametro (" + parametro + ") desc: " + respuesta.response.description)
            } else {
              this.utilidades.mostrarToast("Error al cargar parametro (" + parametro + ") no existe response")
            }
          }, error => {
            if (error.status == 403) {
              sessionStorage.clear();
              this.router.navigate(["/login-intranet"], { replaceUrl: true });
            } else {
              let nombre_error = "get-resourceParametro"
              this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

            }

            throw BreakException;
          })
        });
      }
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    //this.parametros.push({"nombre":"HELLO","valor":"WORD"})
    //this.parametros.push({"nombre":"PAPI","valor":"Chulo"})
    console.log("PARAMETROS PDF", this.parametros);

  }

  //PARAMETROS POR ORDEN UNO POR UNO
  async cargaParametrosOrden(orden) {
    //mensaje de info
    this.mensaje_info = 'Cargando parametros...'
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
                this.utilidades.mostrarToast("Error al cargar parametro (" + parametro + ") desc: " + respuesta.response.description)
            } else {
              this.utilidades.mostrarToast("Error al cargar parametro (" + parametro + ") no existe response")
            }
          }, error => {

            console.error(error);

            if (error.status == 403) {
              sessionStorage.clear();
              this.router.navigate(["/login-intranet"], { replaceUrl: true });
            } else {
              let nombre_error = "get-parametro-ord"
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
  //PARAMETROS POR ORDEN TODOS A LA VEZ
  async cargaTodosParametrosOrden(orden) {
    //mensaje de info
    this.mensaje_info = 'Cargando parametros...'
    let formData: any = new FormData();
    formData.append("orden", orden);
    let respuesta;
    //seteo
    this.force_delivery = false;
    this.force_sgc = false;
    this.fileName = "";

    await this.servicios.getAllResourceParametroOrden(formData).pipe(timeout(10000)).toPromise().then(async (resp) => {
      console.log(resp);
      respuesta = resp;
      if (respuesta && respuesta.response) {
        if (respuesta.response.code == 1) {
          if (respuesta.response.parameters && respuesta.response.parameters.length != 0) {
            for (const parametro of respuesta.response.parameters) {
              if (parametro && parametro != null && parametro.code) {
                await this.parametros.push({ "nombre": parametro.code, "valor": parametro.data })
                if (parametro.code == "file_name" && parametro.data && parametro.data != "")//nombre del archivo
                  this.fileName = parametro.data;
                else if (parametro.code == "advice" && parametro.data && parametro.data != "") {//ALERTA INTRANET
                  this.presentAlert("ALERTA", parametro.data)
                }
                else if (parametro.code == "force_delivery" && parametro.data && (parametro.data == 1 || parametro.data == '1')) {//ABRE MODAL ENTREGA
                  this.force_delivery = true
                }
                else if (parametro.code == "force_sgc" && parametro.data && (parametro.data == 1 || parametro.data == '1')) {//ABRE MODAL SGC
                  this.force_sgc = true
                  this.presentAlert("Reimpresion de resultados", "La orden requerida presenta impresiones anteriores")
                }
              } else {
                console.error("LLEGO PARAMETRO NULL", resp);
                this.utilidades.mostrarToastError("PARAMETRO NULL")
              }

            }
          }
        } else
          this.utilidades.mostrarToast("Error al cargar parametros desc: " + respuesta.response.description)
      } else {
        this.utilidades.mostrarToast("Error al cargar parametros no existe response")
      }
    }, error => {

      console.error(error);

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

  ionViewDidEnter() {
    console.log("ENTRA AL COMPONENTE");
    setTimeout(() => {
      // this.funciones_comunes.iniciarIdle();
    }, 300);
  }
  ionViewDidLeave() {
    console.log("SALIO DEL COMPONENTE");
    // this.funciones_comunes.cierraIdles();
    //this.bnIdle.stopTimer();
  }

  guardaHistorialBusqueda(orden) {
    let repetido = this.historial_busqueda.find(el => el == orden)
    if (!repetido) {
      this.historial_busqueda.unshift(orden);//inserta al inicio
      if (this.historial_busqueda.length > 4) {
        //elimino el ultimo
        this.historial_busqueda.pop();
      }
      localStorage.setItem("hist_" + this.sesion_usuario, JSON.stringify(this.historial_busqueda))
    }
  }

  eliminaHistorialItem(orden) {
    this.historial_busqueda = this.historial_busqueda.filter(el => el !== orden)
    localStorage.setItem("hist_" + this.sesion_usuario, JSON.stringify(this.historial_busqueda))
  }
  buscaHistorialItem(orden) {
    this.cargarDatos(orden);
    this.idOrden = orden
  }

  async cargarPDF() {
    //si descarga y modifica vuelvo a dejar que guarde y seria un nuevo doc
    this.flag_descarga = false;
    console.log("UNO");
    if (!this.lista) {
      await this.loadingPDF();
    }
    //siempre verifico los analisis
    await this.verificarAnalisis();
    //orden = await this.validarOrden(orden);
    let orden = await this.validarOrdenOriginal();
    let adjuntos64;
    let qr;
    let versionamiento = 0;

    //valido si hay adjuntos
    if (this.datosAdjuntos && this.datosAdjuntos.response.code > 0 && this.datosAdjuntos.response.files != null && this.adjuntos_flag) {
      adjuntos64 = this.datosAdjuntos.response.files;
    } else {
      adjuntos64 = "";
    }

    //el full se da cuando se va a guardar
    if (this.dir_qr_short) {
      qr = this.dir_qr_short
    } else {
      qr = ""
    }

    if (this.activa_versionamiento) {
      versionamiento = 1//1 activa el verionamiento
    }
    
    this.pdf64=null;

    if(!orden||(orden.length==0&&adjuntos64=="")){     
      setTimeout(() => {
      this.loadingController.dismiss();
    }, 300);
    
      return;
    }


    let valores_enviar = {
      "nombreLab": "",
      "firma": this.firma_orden,
      "formato": this.formato,
      "qr": qr,//qr_validacion le crea en el generador el base64
      "qr2": this.dir_qr_anexo,//qr_validacion2 le crea en el generador el base64
      "adjuntos": adjuntos64,
      "orden": orden,
      "parametros": this.parametros,
      "versionamiento": versionamiento
      // "orden": orden
    }

    console.log("envio al pdf", valores_enviar);
    //console.log(JSON.stringify(valores_enviar));

    //ENVIO AL SERVICIO QUE GENERA EL PDF
    let respuesta;
    // const loader = await this.loadingController.getTop();
    // if loader present then dismiss
    if (orden && orden != null) {
      await this.serviciosPDF.getPDFIntra(valores_enviar).toPromise().then(async (archivo) => {
        console.log("EL PDF", archivo);
        respuesta = await archivo;
        this.pdf64Send = await this.utilidades.arrayBufferToBase64(respuesta);//cambio la forma de generar el pdf
        //console.log(JSON.stringify(respuesta.data));
        // if (this.lista) {
        this.mensaje_info = '';
        // } else {
        setTimeout(() => {
          this.loadingController.dismiss();
        }, 300);
        //}
        //para movil le hago back zoom
        if (this.mobile)
          this.zoomPage = 0.6;

        //VERIFICO FIRMA ELECTRONICA
        if (this.activa_firma) {
          this.loadingFirma(); //NUEVO LOADING
          if (!this.firma_archivo || this.firma_archivo == null) {
            this.pdf64 = archivo
            this.presentAlert("SIN FIRMA", "NO SE LOGRO FIRMAR EL DOCUMENTO")
            setTimeout(() => {
              this.loadingController.dismiss();
            }, 400);
            return;
          }
          let archivoFirma = {
            bytePDF: this.pdf64Send,
            byteFirma: this.firma_archivo,
            codigo: this.firma_codigo,
            formato: this.formato
          }
          await this.serviciosFirma.getPDFsign(archivoFirma).toPromise().then(async (firmado) => {
            console.log("firmado", firmado);
            this.pdf64 = firmado// this.base64ToArrayBuffer(respuesta.data);
            this.pdf64Send = await this.utilidades.arrayBufferToBase64(firmado);//vuelvo a generar el base64 por que este se envia

            setTimeout(() => {
              this.loadingController.dismiss();
            }, 400);

          }, error => {
            console.error(error);
            this.utilidades.alertErrorService("sign-intra", error.status);
            setTimeout(() => {
              this.loadingController.dismiss();
            }, 300);

          });

        } else {//SI NO ESTA ACTIVADO DEVUELVO EL PDF
          this.pdf64 = archivo
        }

        //GENERO UNA AUDITORIA SI CARGO EL PEDF
        this.enviaAuditoria("Preview","MisAnalisis")

      }, error => {

        this.loadingController.dismiss();
        //this.presentAlert('Error', 'Error de consulta ' + error.status);
        let nombre_error = "pdf-intra";
        this.utilidades.alertErrorService(nombre_error, error.status);

        console.error(error);

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

  async cargarDatos(orden: string) {
    await this.loadingOrden();
    let formData: any = new FormData();
    formData.append("orden", orden);
    console.log(formData);

    //seteo
    this.itemsCheked = 0;
    this.pdf64 = null;
    this.select_pdf = undefined;
    this.limpiarPantalla(null);
    this.idOrden = orden;
    this.defaultDatos();
    //cargo primero los datos del paciente
    this.cargarDatosPaciente(orden).then(() => {
      console.log("DATOS ORD", this.datosPaciente);
      //SI TIENE REFRENCIA TOCA VALIDAR SI PERMITE IMPRIMIR
      if (this.datosPaciente.cod_ref && this.datosPaciente.cod_ref != '') {
        if (!this.permisoPrintRef) {
          this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>No tiene permiso para imprimir referencias</b></h2>" + orden)
          this.loadingController.dismiss()
          return;
        }
      }

      if (this.datosPaciente && this.datosPaciente != null && this.datosPaciente.nro_ord) {
        //cargo la orden original
        if (this.permiso_impresion) {
          this.servicios.getOrdenOriginalIntra(formData).toPromise().then(async (resp) => {
            //carglo el loading
            this.mensaje_info = 'Cargando Datos'
            console.log("orden_original", resp);
            this.orden_original = resp;

            const analisisServicio = await this.checkPeticionServicio(orden);
            this.analisisServicio=analisisServicio;
            console.log("ANALISIS DE SERVICIO",this.analisisServicio)
            this.cargarOrdenParseada(orden);
            if (resp && resp != null && this.orden_original.length != 0) {
              // this.cargarOrdenOriginal(orden).then(() => {
              console.log("permiso", this.permiso_impresion);
              //si esta activo el versionamiento compruebo lo del mongo
              if (this.activa_versionamiento)
                this.checkPDFGuardados(orden).then(() => { });
              //por atras cargo la firma y luego cargo el pdf

              //cargo los parametros de la orden
              //tambien lo podria poner al ultimo para q renderice mas rapido
              //si la orden tiene parametros de orden se debe tener cuidado de que no se repitan los datos del qr ejemplo si esta versionado 
              this.cargaTodosParametrosOrden(orden).then(() => {
                if (this.parametros.filter(e => e.nombre === "url_validacion").length < 1) {
                  this.utilidades.mostrarToastError("PROBLEMA AL GENERAR EL QR")
                }
                this.cargaParametrosOrden(orden).then(() => { //este lo dejo por si a caso 
                  //           this.lista = true;
                  //si no hay parametros no es necesario cargar denuevo

                  //this.cargarDatosFirmaDepre().then(() => {//ESTA SIN FUNCIONAR
                  this.getFirmasGraphsUser().then(() => {//CAMBIO POR EL OTRO
                    this.cargarDatosAdjuntos(orden).then(() => {
                      this.cargarDatosQR(orden).then(() => {
                        this.cargaUrlRight(orden);
                        //CARGO LOS DATOS DE LA FIRMA
                        this.getImagesAnalisis(orden).then(() => {

                          if (this.activa_firma) {
                            this.getFirmaElecUser().then(() => {
                              this.cargarPDF();
                            }, error => {
                              console.error('firma ' + error);

                            })
                          } else {
                            this.cargarPDF();
                          }
                          this.loadingController.dismiss();

                        }, error => {
                          console.error(error);
                          //  console.log(error.message);
                          this.utilidades.alertErrorService("datos-images-analisis", "REVISE CONSOLA: " + error.message)
                        })
                      }, error => {
                        console.error(error);
                        //  console.log(error.message);
                        this.utilidades.alertErrorService("datos-qr", "REVISE CONSOLA: " + error.message)
                      })
                    }, error => {
                      console.error(error);
                      //  console.log(error.message);
                      this.utilidades.alertErrorService("datos-adjuntos", "REVISE CONSOLA: " + error.message)
                    })
                  }, error => {
                    console.error(error);
                    //  console.log(error.message);
                    this.utilidades.alertErrorService("datos-firma", "REVISE CONSOLA: " + error.message)
                  })
                }, error => {
                  console.error(error);
                  //  console.log(error.message);
                  this.utilidades.alertErrorService("parametros-orden", "REVISE CONSOLA: " + error.message)
                })
              }, error => {
                console.error(error);
                //  console.log(error.message);
                this.utilidades.alertErrorService("get-all-parametros-orden", "REVISE CONSOLA: " + error.message)
              })
            } else {
              this.loadingController.dismiss();
            }
          }).catch((error) => {
            this.loadingController.dismiss();
            // console.log("Promise rejected with " + JSON.stringify(error));

            console.error(error);
            //reject(error)
            if (error.status == 403) {
              sessionStorage.clear();
              this.router.navigate(["/"], { replaceUrl: true });
            } else {
              let nombre_error = "get-orden-original"
              this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
            }

          })
        } else {
          this.loadingController.dismiss();
          this.limpiarPantalla(null)
        }

      } else {
        //ERROR
        this.loadingController.dismiss();
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>No se encuentra la orden</b></h2>" + orden)
        this.limpiarPantalla(null)
        this.mensaje_info = ""
      }
    }, error => {
      console.error("ERROR AL CARGAR DATOS PACIENTE", error);

    });//fin carga samorden

  }

  cargarOrdenParseada(orden) {
    let formData: any = new FormData();
    formData.append("orden", orden);
    //despues cargo la orden parseada
    this.servicios.getOrdenIntra(formData).subscribe((resp) => {
      console.log("ord_prs", resp);
      // this.checkPDFGuardados(orden).then(() => { });
      if (resp && resp != null) {
        this.orden = resp;
        /*
         //cargo datos de paciente
        this.cargarDatosPaciente().then(() => {
          //  this.cargarOrdenOriginal(orden);
          //CHEQUEO SI EXISTE PDFS GUARDADOS
          console.log("permiso", this.permiso_impresion);
  
          this.checkPDFGuardados().then(() => { });
          //por atras cargo la firma y luego cargo el pdf
          if (this.permiso_impresion) {
            this.cargarDatosFirma().then(() => {
              this.cargarDatosAdjuntos().then(() => {
                this.cargarDatosQR().then(() => {
                  //cargo la original nuevo 
                  this.cargarOrdenOriginal(orden).then(() => {
                    this.cargarPDF();
                  })
                })
              })
            });
          }
        });
        */
        //por defecto les pongo checked
        for (const tipo of this.orden.tipo_analisis) {
          tipo.isChecked = false;
          if (tipo.analisis.length && tipo.analisis.length > 0) {
            //sumo los que estan chequeados
            this.itemsCheked += tipo.analisis.length
          }
          for (const analisis of tipo.analisis) {
            analisis.isChecked = false;
          }

        }
        this.verificarAnalisis()
      } else {
        //  this.loadingController.dismiss();
       
        if(this.permiteSoloAdjuntos){
          this.orden = {};
          this.cargarDatosAdjuntos(orden).then(() => {
            this.orden.paciente=this.datosPaciente.name_pac;
            this.orden.id_orden=orden;
            this.orden.tipo_analisis=[];
           // this.itemsCheked=1
            this.cargarPDF();
          })
        }else{ 
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>No se encuentra datos del resultado</b><br>(miaReport)</h2>" + orden)
        this.mensaje_info = ""

        }

      }

      console.log("checked", this.itemsCheked);

    }, error => {
      console.log("ERROR DATOS ORDEN");
      console.error(error);
      //this.loadingController.dismiss()
      if (error.status == 403) {
        sessionStorage.clear();
        this.router.navigate(["/login-intranet"], { replaceUrl: true });
      } else {
        let nombre_error = "get-orden"
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
      }

    });
  }

  //CARGA LA ORDEN ORIGINAL
  async cargarOrdenOriginal(orden) {
    // return new Promise<void>(async(resolve, reject) => {
    //await this.loadingOrden();
    let formData: any = new FormData();
    formData.append("orden", orden);
    console.log(formData);
    //this.pdf64 = new ArrayBuffer(192);
    //console.log(this.pdf64);
    return await this.servicios.getOrdenOriginalIntra(formData).toPromise().then((resp) => {
      console.log("orden_original", resp);
      if (resp && resp != null) {
        this.orden_original = resp;
        // resolve()
      }
    })
    // });
  }

  //NO ESTA DEVOLVIENDO NADA ESTE WEB SERVICE
  cargaUrlRight(orden) {
    let formData: any = new FormData();
    formData.append("orden", orden);
    let respuesta;
    this.servicios.getUrlOrden(formData).subscribe(resp => {
      console.log("URL DERECHA", resp);
      respuesta = resp;
      if (respuesta.url) {
        this.dir_qr_anexo = respuesta.url
      }

    }, error => {
      let nombre_error = "get-url-right"
      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

    })
  }

  async cargarDatosPaciente(orden) {
    var formData: any = new FormData();
    formData.append("orden", orden);
    //formData.append("orden", this.orden.id_orden);
    await this.servicios.getDatosPacienteIntra(formData).toPromise().then(async (resp) => {
      console.log("DATOS PACIENTE", resp);
      if (resp && resp[0]) {
        this.datosPaciente = resp[0];
        //this.datosPaciente.saldo=99
        if (this.datosPaciente.saldo && this.datosPaciente.saldo > 0) {
          this.permiso_impresion = false;
          const confirmation = await this.presentAlertPermiso(this.datosPaciente.saldo)
          console.log("CONFIRMATION", confirmation);
          this.permiso_impresion = confirmation;
        }
        if (this.datosPaciente.incomplete > 0) {//1 incompleto
          this.permiso_impresion = false;
          const confirmation2 = await this.presentAlertIncompleto(this.datosPaciente.pendientes, this.datosPaciente.progress > 0)
          this.permiso_impresion = confirmation2;
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
      //  this.loadingController.dismiss()

    });

  }

  //YA NO SE UTILIZA ESTE METODO PARA OBTENER LA FIRMA
  async cargarDatosFirmaDepre() {
    var formData: any = new FormData();
    //let ultimo_tipo = this.orden.tipo_analisis[this.orden.tipo_analisis.length - 1];
    //let ultimo_analisis = ultimo_tipo.analisis[ultimo_tipo.analisis.length - 1]
    let usuario_peticion = this.orden_original[this.orden_original.length - 1].usuario_validacion_peticion
    formData.append("usuario", usuario_peticion);
    console.log("FIRMA DEL USUARIO ", usuario_peticion);
    console.log(formData);
    //formData.append("orden", this.orden.id_orden);
    let respuesta;
    await this.servicios.getDatosUsuarioPeticionIntra(formData).toPromise().then(async (resp) => {
      console.log("FIRMA", resp);
      respuesta = resp;
      if (respuesta.result && respuesta.result.sign)
        this.firma_orden = respuesta.result.sign;
    }, error => {
      console.log("ERROR EN DATOS DE USUARIO");
      console.error(error);
      if (error.status == 403) {
        sessionStorage.clear();
        this.router.navigate(["/login-intranet"], { replaceUrl: true });
      } else {
        let nombre_error = "datos-usuario"
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

      }
      //  this.loadingController.dismiss()
    });
  }
  //nueva forma FIRMA
  async getFirmaElecUser() {
    //this.dataOrden.cod_med = this.varGlobal.getVarUsuario()
    //this.presentLoading();
    this.firma_archivo = null;
    this.firma_codigo = null;
    if (this.orden_original) {
      //cojo el ultimo usuario
      let usuario_peticion = this.orden_original[this.orden_original.length - 1].usuario_validacion_peticion

      let data = { usuario: usuario_peticion }
      console.log("data FIRMA", data);

      return this.queryservice.getArchivoFirma(data).then(async (result: any) => {
        console.log('DATA FIRMA', result);
        if (result && result.data && result.data.getArchivoFirma && result.data.getArchivoFirma != null) {
          this.firma_codigo = result.data.getArchivoFirma.codigo;
          //ESTA CODIFICADO
          this.firma_archivo = result.data.getArchivoFirma.encode_file;
          if (this.firma_archivo == null)
            this.presentAlert("SIN FIRMA", "EL USUARIO QUE FIRMA ESTA ORDEN '" + usuario_peticion + "' NO CONTIENE FIRMA ELECTRONICA")

        } else {
          if (result.errors && result.errors.length > 0) {
            this.utilidades.mostrarToast(result.errors[0].message)
          } else {
            this.utilidades.mostrarToast("OCURRIO UN PROBLEMA AL CARGAR FIRMA")
          }
        }

        setTimeout(async () => {
          const isLoadingOpen = await this.loadingController.getTop();
          if (isLoadingOpen) {
            this.loadingController.dismiss()
          }

        }, 300);


      }, error => {
        console.error(error);
        const isLoadingOpen = this.loadingController.getTop();
        if (isLoadingOpen) {
          this.loadingController.dismiss()
        }
        this.utilidades.alertErrorService("gphql-getArchivoFirma", error.status)

        //this.loadingController.dismiss();
      })

    }

  }
  //firmas de los validadores
  async getFirmasGraphsUser() {
    //saco los usuarios q validan la orden
    // this.loadingFirma()
    return new Promise(async (resolve) => {
      if (this.activa_firma_list) {//ESTO ACTIVA SOLO PARA INTRANET
        let usuarios = [...new Set(this.orden_original.map(item => item.usuario_validacion_peticion))];
        console.log("USUARIOS VALIDADORES", usuarios);
        let data = { users: usuarios.toString() }
        this.queryservice.getGraphUsers(data).then(async (result: any) => {
          console.log("las firmas de los usuarios", result);//encode_file
          if (result && result.data && result.data.getGraphUsers && result.data.getGraphUsers != null) {
            this.firmaUsuarios = result.data.getGraphUsers;

          }
          resolve(true)
        }, error => {

          console.error(error);
          const isLoadingOpen = this.loadingController.getTop();
          if (isLoadingOpen) {
            this.loadingController.dismiss()
          }
          this.utilidades.alertErrorService("gphql-getGraphUsers", error.status)

          //this.loadingController.dismiss();
        })

      } else {
        resolve(true)
      }

    })


  }

  //IMAGENES ANALISIS
  async getImagesAnalisis(orden) {
    console.log("ENTRO A PROBAR IMAGNES");

    //saco los usuarios q validan la orden
    // this.loadingFirma()
    return new Promise(async (resolve) => {
      if (this.activa_imagenes_analisis) {//ESTO ACTIVA SOLO PARA INTRANET
        // let analisis = [...new Set(this.orden_original.map(item => item.codigo_analisis))];

        let data = { nro_ord: orden }
        this.queryservice.getImagesAdjunto(data).then(async (result: any) => {
          console.log("las imagenes de la orden", result);//encode_file
          if (result && result.data && result.data.getImagesAdjunto && result.data.getImagesAdjunto != null) {
            this.imagenesAnalisis = result.data.getImagesAdjunto;

          }
          resolve(true)
        }, error => {

          console.error(error);
          const isLoadingOpen = this.loadingController.getTop();
          if (isLoadingOpen) {
            this.loadingController.dismiss()
          }
          this.utilidades.alertErrorService("gphql-getImagesAdjunto", error.status)

          //this.loadingController.dismiss();
        })

      } else {
        resolve(true)
      }

    })

  }

  showButtonAdjunto = false
  async cargarDatosAdjuntos(orden) {
    if (!this.callAdjuntos) {//SI ES FALCE NO LLAMO A LOS ADJUNTOS
      return null;
    }

    var formData: any = new FormData();
    formData.append("orden", orden);
    //formData.append("orden", this.orden.id_orden);
    await this.servicios.getAttachmentPDF(formData).toPromise().then(async (resp) => {
      console.log(resp);
      this.datosAdjuntos = resp;
      if (this.datosAdjuntos.response.code > 0) {
        this.zone.run(() => {
          this.showButtonAdjunto = true
        });

        this.adjuntos_flag = true;
      } else {

        this.showButtonAdjunto = false

        this.adjuntos_flag = false;
        console.log("NO CARGO ADJUNTOS " + this.datosAdjuntos.response.code);
        this.utilidades.mostrarToast(this.datosAdjuntos.response.description)
      }
      this.cd.detectChanges()
    }, error => {
      console.log("ERROR EN DATOS DE ADJUNTOS");
      console.error(error);
      if (error.status == 403) {
        sessionStorage.clear();
        this.router.navigate(["/login-intranet"], { replaceUrl: true });
      } else {
        let nombre_error = "datos-adjuntos"
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
      }
      //  this.loadingController.dismiss()
    });

  }


  async cargarDatosQR(orden) {
    //no llamo a los datos QR si no tiene versionamiento
    if (!this.activa_versionamiento) {
      return;
    }
    var formData: any = new FormData();
    formData.append("orden", orden);
    let respuesta;
    //formData.append("orden", this.orden.id_orden);
    await this.servicios.getQrPDF(formData).toPromise().then(async (resp) => {
      console.log("LOS DATOS DEL QR", resp);
      respuesta = resp;
      if (respuesta.response) {
        if (respuesta.url) {
          this.dir_qr = respuesta.url
        } else {
          this.dir_qr = respuesta.response.url
        }
        //SI tiene el back slash lo elimino
        if (this.dir_qr[this.dir_qr.length - 1] == "/") {
          this.dir_qr.slice(0, this.dir_qr.length - 1)
        }
        //asigno el uuid de la orden
        this.dir_qr += "?oUid=" + respuesta.response.uid
        console.log(this.dir_qr);
        this.uuid_orden = respuesta.response.uid;

        //GENERO LA UUID
        const myId = uuid.v4();
        //asigno la variable para guardar
        this.uuid_pdf = myId;
        console.log("UUID", myId);
        //creo la direccion url
        if (this.dir_qr) {
          this.dir_qr_full = this.dir_qr + "&uid=" + myId
        }
        await this.cargoShortUrl().then(async () => {
          //genero el pdf
          console.log("CARGO SHRT URL");
          //si no existe cargo la grande
          if (!this.dir_qr_short || this.dir_qr_short == "") {
            this.dir_qr_short = this.dir_qr_full
          }

        })
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
      //  this.loadingController.dismiss()

    });

  }


  async cargoShortUrl() {
    var formData: any = new FormData();
    formData.append("orden", this.orden.id_orden);
    // formData.append("cod_pac", this.datosPaciente.cod_pac);
    formData.append("cod_pac", this.orden.paciente.nombre_paciente);
    formData.append("url", this.dir_qr_full);
    let respuesta;
    //formData.append("orden", this.orden.id_orden);
    await this.servicios.getShortUrl(formData).toPromise().then(async (resp) => {
      console.log("URL ACORTADA", resp);
      respuesta = resp;
      if (respuesta.shortUrl) {
        this.dir_qr_short = respuesta.shortUrl
      }
    }, error => {
      console.log("ERROR EN DATOS DE PACIENTE");
      console.error(error);
      if (error.status == 403) {
        sessionStorage.clear();
        this.router.navigate(["/login-intranet"], { replaceUrl: true });
      } else {
        this.utilidades.alertErrorService("short-url", error.status)

      }
      //  this.loadingController.dismiss()

    });

  }


  //SI ES DE TIPO EXAMEN VOY A ENVIAR EL PADRE TAMBIEN 
  //PARA CHEKEARLO
  //SI ES TRUE EL CHEKED SE ELIMINA 
 async variarResultado(parent, data, tipo) {
    //para movil cierro el menu
    if (this.mobile)
      this.menu.close();

    if (tipo == 't') {
      data.analisis.forEach(analisis => {
        if (data.isChecked == true) {
          analisis.isChecked = false;
        } else {
          analisis.isChecked = true;
        }
      });
    }

    if (tipo == 'e') {
      if (data.isChecked == true) {
        parent.isChecked = false;
      }
    }
    //si es true toca eliminarlo
   await setTimeout(() => {
      data.isChecked = data.isChecked ? false : true;
    }, 100);

    console.log("CHECKED?",data.isChecked);

    this.cargarPDF()

    //console.log(data);
  }

  selectTodosNinguno(checked) {
    this.orden.tipo_analisis.forEach(tipo => {
      tipo.isChecked = checked;
      tipo.analisis.forEach(analisis => {
        analisis.isChecked = checked;
      });
    });

    this.cargarPDF()
  }


  async validarOrden(orden) {
    //clonacion profunda 
    // no es recomendable por que puede que no parsee bien las fechas
    const ordenModificada = await JSON.parse(JSON.stringify(orden));
    //console.log(orden);
    if (!ordenModificada.tipo_analisis) {
      console.log('No existe tipo_analisis');
      return null
    }
    //reseteo para volver a sumar 
    this.itemsCheked = 0;
    //los que tienen true se los elimina
    //retorno todos los que no estan chequeados
    ordenModificada.tipo_analisis = await ordenModificada.tipo_analisis.filter((tipo) => { return !tipo.isChecked });
    for (const tipo of ordenModificada.tipo_analisis) {
      tipo.analisis = await tipo.analisis.filter((anls) => { return !anls.isChecked });
      //miro cuantos estan checkeados
      if (tipo.analisis.length && tipo.analisis.length > 0) {
        this.itemsCheked += tipo.analisis.length
      }
    }
    console.log(ordenModificada);
    console.log(this.itemsCheked);
    return ordenModificada;
  }


  async validarOrdenOriginal() {
    //let ordenModificada = this.orden_original;
    let ordenModificada = await JSON.parse(JSON.stringify(this.orden_original));
    //si existe la orden por que si no existe esta vacio los analisis aun asta que carge
    if (this.orden.id_orden && this.orden.id_orden != "") {
      console.log(this.analisisSelect);
      console.log(ordenModificada);

      ordenModificada = await ordenModificada.filter((elemento) => {
        return this.analisisSelect.includes(elemento.codigo_analisis)
      })
      //miro los chekeados /no recuerdo por que si puedo validar con los analisis seleccionados
      this.itemsCheked = 0;
      for (const tipo of this.orden.tipo_analisis) {
        for (const analis of tipo.analisis) {
          if (!analis.isChecked) {
            this.itemsCheked++;
          }
        }
      }
    }
    //añado este nodo por que se elimino
    console.log("LAS FIRMAS", this.firmaUsuarios);//ESTE LLEGA VACIO SI NO ESTA ACTIVADO
    console.log("LAS IMAGENES", this.imagenesAnalisis);//ESTE LLEGA VACIO SI NO ESTA ACTIVADO
    let imagenesAnalisis;//EL FILTRO POR UN ANALISIS 
    for (let i = 0; i < ordenModificada.length; i++) {

      //voy a buscar las firmas de cada usuario cuando cambie pero tengo q ponerle al ultimo 
      //selecciono el primero
      ordenModificada[i].FIRMAUSUARIO = ""
      if (this.firmaUsuarios && this.firmaUsuarios.length > 0) {
        if (i != ordenModificada.length - 1 && ordenModificada[i].codigo_tipo_analisis != ordenModificada[i + 1].codigo_tipo_analisis) {
          ordenModificada[i].FIRMAUSUARIO = this.firmaUsuarios.filter(e => e.usuario == ordenModificada[i].usuario_validacion_peticion)[0].encode_file
        }

        if (i == ordenModificada.length - 1) {
          ordenModificada[i].FIRMAUSUARIO = this.firmaUsuarios.filter(e => e.usuario == ordenModificada[i].usuario_validacion_peticion)[0].encode_file
        }

      }
      ordenModificada[i].IMAGEANALISIS = null
      if (this.imagenesAnalisis && this.imagenesAnalisis.length > 0) {
        //   ordenModificada[i].IMAGEANALISIS = ""
        imagenesAnalisis = this.imagenesAnalisis.filter(e => e.cod_ana == ordenModificada[i].codigo_analisis);
        console.log("IMAGENES", JSON.stringify(imagenesAnalisis));

        if (i != ordenModificada.length - 1 && ordenModificada[i].codigo_analisis != ordenModificada[i + 1].codigo_analisis) {
          ordenModificada[i].IMAGEANALISIS = JSON.stringify(imagenesAnalisis);

        }
        if (i == ordenModificada.length - 1) {
          ordenModificada[i].IMAGEANALISIS = JSON.stringify(imagenesAnalisis);
        }
      }


      ordenModificada[i] = { "ava_misanalisis_report": ordenModificada[i] };
    }

    console.log("LA ORDEN MODIFICADA", ordenModificada);
    return ordenModificada;

  }

  cancelFiltroBusqueda(event) {
    //console.log(event);
    console.log("CLICK");

    console.log(this.idOrden);
    setTimeout(() => {

      if (this.idOrden.length < 1 && this.orden.id_orden) {
        this.limpiarPantalla(null);
        //this.cargarDatos("")                                           
      }
    }, 300);
  }


  limpiarPantalla(evento) {
    if (evento)
      evento.stopPropagation();
    //PARA VOLVER ABRIR YA QUE LA ULTIMA VERSION NO FUNCIONA STOPPROPAGATION
    setTimeout(() => {
    //  this.fab.activated = true;
    }, 200);

    if (this.idOrden) {
      //guardo historial de busqueda
      this.guardaHistorialBusqueda(this.idOrden)
    }
    this.idOrden = "";
    this.itemsCheked = 0;
    this.pdf64 = null;
    this.pdf64Send = null;
    this.select_pdf = undefined;
    this.orden = {};
    this.flag_descarga = false;
    this.adjuntos_flag = false
    this.showButtonAdjunto = false
    this.permiso_impresion = true;
    this.datosAdjuntos = null
    this.datosPaciente = {}
    this.dir_qr_full = "";
    this.dir_qr_short = "";
    this.dir_qr = "";
    this.lista_pendientes = ""
    //inicializo los parametros
    this.parametros = [];
    this.lista = false;
    this.mensaje_info = "";
    this.force_delivery = false;
    this.imagenesAnalisis = [];
    this.cargaParametros()
    setTimeout(() => {
      if (this.filtro || !this.mobile) {
        console.log("elemnos", this.inputOrden.setFocus());
        document.getElementsByClassName('contenedor').item(0).scroll(0, 0)
      }
    }, 400);
  }

  abrirFiltro() {
    console.log("ABRIR FILTRO");
    this.filtro = true;
  }

  buscarOrden() {
    console.log(this.idOrden);
    if (this.orden.id_orden) {
      this.guardaHistorialBusqueda(this.orden.id_orden)
    }
    setTimeout(() => {
      // if(this.mobile){
      this.filtro = false;
      //}
      this.cargarDatos(this.idOrden);
    }, 500);
  }

  async verificarAnalisis() {
    this.resultadosSelect = [];
    this.analisisSelect = [];
    for (const tipo of this.orden.tipo_analisis) {
      for (const analisis of tipo.analisis) {
        if (!analisis.isChecked && !tipo.isChecked) {
          //console.log("ENTRA A GUARDAR ANALISIS SELECT",analisis.codigo_analisis);
          await this.analisisSelect.push(analisis.codigo_analisis)
        }
        for (const parametro of analisis.parametros) {

          //para coger los checkeados solo poner en negativo
          //||!tipo.isChecked
          if (!analisis.isChecked && !tipo.isChecked) {
            await this.resultadosSelect.push(parametro.resultado.id_resultado)

          }
        }

      }
    }
    console.log("COD SELECT ", this.resultadosSelect);

    console.log("ANA SELECT ", this.analisisSelect);

  }
  actualizaFormato() {
    console.log(this.formato);

    this.cargarPDF();
  }
  //ACTUALIZA REGISTROS SELECCIONADOS
  async enviarSeleccionados(accion, estado, detalle) {

    if (this.force_sgc)
      await this.presentModalReimpresion().then(resp => {
        console.log("PASO");

      })

    if (!this.select_pdf) {
      //para ver si descargo
      if (!this.flag_descarga) {
        //guarda pdf va a incluir la actualizacion y auditoria
        console.log("ENTRA GUARDAR");
        //antes de guardar genero nuevamente el PDF final con el QR


        if (this.activa_versionamiento) {
          //Al guardar genero auditoria y actualiza registros
          this.guardaPDFServer(accion, estado, detalle);
          //genero el uuid
        } else {
          //solo hago auditoria y no guardo si no hay versionamiento
          if(this.permiteSoloAdjuntos&&this.analisisServicio&&this.analisisServicio.length>0){
            const stringCodAnaSeparadoPorComas = this.analisisServicio.map(objeto => objeto.cod_ana).join(", ");
            //AQUI NO ACTUALIZO REGISTROS 
            if(this.orden.tipo_analisis.length>0){//supongo que hay pdf generado
              this.actualizaRegistros(accion, estado, detalle)
            }
              //no hay datos de pdf solo serian adjuntos, no hay registros que actualizar
            this.enviaAuditoria(accion, detalle +"; Adjunto Avasus analisis: "+stringCodAnaSeparadoPorComas+"; version: " + "1.0.0")            
          }else{
            this.enviaAuditoria(accion, detalle + "; version: " + "1.0.0")
            this.actualizaRegistros(accion, estado, detalle)
          }
        }

      }

    }
    else {
      
      //solo auditoria
      this.enviaAuditoria(accion, detalle + "; version: " + this.version_pdf)
      if (!this.version_pdf) {
        this.presentAlert("Tuvimos un problema", "Problema al cargar version para AUDITORIA");
      }
      return true;
    }


  }

  //SERA ASYNC
  actualizaRegistros(accion, estado, detalle) {
    let valida = false;
    console.log(accion);
    let datos_envio;
    datos_envio = {
      "id_res": this.resultadosSelect,
      "nro_ord": this.orden.id_orden,
      "tipo": accion,
      "estado": estado,
      "detalle": detalle,
      "user": this.sesion_usuario
    }
    console.log(datos_envio);

    let respuesta;
    this.servicios.setValidaAccion(datos_envio).subscribe((resp) => {
      console.log(resp);
      respuesta = resp;
      if (respuesta && respuesta.response) {
        if (respuesta.response.code != 1) {
          this.presentAlert("Tuvimos un problema actualizacion", "Problema al cargar datos: " + respuesta.response.description + ", intente nuevamente");
        }
      }
      else {
        this.presentAlert("Tuvimos un problema actualizacion", "Problema al cargar datos (sin response)");
      }
    }, error => {
      let nombre_error = "valida-accion"
      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

    })

    return valida
  }

  //AUDITORIA
  async enviaAuditoria(accion, detalle) {
    let que = "";
    let add_analisis = this.analisisSelect.toString();
    if (accion == "Impreso") {
      que = "PRINT"
    } else if (accion == "Descarga") {
      que = "PRINT"
    } else if (accion == "Preview") {
      que = "PREVIEW"
    } else if (accion == "Email") {
      que = "MAIL"
    } else if (accion == "WhatsApp") {
      que = "WHATSAPP"
      //creo una variable para controlar si se usa el pdf directo mando los analisis seleccionados
      if (this.config.tipoWhatsapp && this.config.tipoWhatsapp == 'directo') {
        //SI ES DIRECTO PONGO TODOS
        add_analisis = "";//el whatsapp le llega completo cuando usa el servicio del pdf directo
        for (const tipo of this.orden.tipo_analisis) {
          for (const analisis of tipo.analisis) {
            add_analisis += add_analisis + ", "
          }
        }
      }
    }
    detalle = detalle + " analisis seleccionados: " + add_analisis;

    let donde = "Navegador: " + this.utilidades.getNavegador() + "; IP: " + this.varGlobal.getIPBrowser();
    let modify = "'" + this.sesion_usuario + "' as who_log, '" + que + "' as what_log, '" + donde + "' as where_log,'" + detalle + "' as why_log";
    console.log("MODIFY", modify);
    var formData: any = new FormData();
    formData.append("orden", this.orden.id_orden);
    formData.append("modify", modify);
    console.log(formData);
    let respuesta;
    this.servicios.setAuditoria(formData).subscribe((resp) => {
      console.log(resp);
      respuesta = resp;
      if (respuesta && respuesta.response) {
        if (respuesta.response.code != 1) {
          this.presentAlert("Tuvimos un problema auditoria", "Problema al cargar datos: " + respuesta.response.description + ", intente nuevamente");
        } else {
          console.log("AUDITORIA OK")
        }
      }
      else {
        this.presentAlert("Tuvimos un problema auditoria", "Problema al cargar datos (sin response)");
      }
    }, error => {
      let nombre_error = "envia-auditoria"
      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

    })

  }

  //GUARDA DATOS EN MONGO
  async guardaPDFServer(accion, estado, detalle) {
    //si guardo en el server vuelvo a generar un nuevo pdf
    let valida = false;
    console.log(accion);
    let datos_envio;
    datos_envio = {
      "usuario": this.sesion_usuario,
      "fecha": "",
      "orden": this.orden.id_orden,
      "accion": accion,
      "detalle": detalle,
      "analisis": this.analisisSelect,
      "formato": this.formato,
      "archivo": this.pdf64Send,
      "uuid": this.uuid_pdf,
      "orden_uuid": this.uuid_orden,
      "url": this.dir_qr_full,
      "shorturl": this.dir_qr_short
    }
    console.log("Envio guarda", datos_envio);
    let respuesta;
    await this.serviciosMongo.savePDFIntra(datos_envio).toPromise().then(async (resp) => {
      console.log("respuesta guardado", resp);
      respuesta = resp;
      if (respuesta) {
        if (respuesta.code == 0) {
          //this.cargarPDF(this.orden);
          valida = await true;
          this.enviaAuditoria(accion, detalle + "; version: " + respuesta.version)
          this.actualizaRegistros(accion, estado, detalle)
          this.version_pdf = respuesta.version;
        } else {
          if (respuesta.descripcion) {
            this.presentAlert("Tuvimos un problema", "Problema al guardar PDF: <b>" + respuesta.descripcion + "</b>,</br> favor contacte con soporte");
          } else {
            this.presentAlert("Tuvimos un problema", "Problema al guardar PDF (sin descripcion), favor contacte con soporte");
          }
        }
      }
    }, error => {
      let nombre_error = "save-pdf"
      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

    })
    return valida;
  }

  //EN CADA EVENTO CLICK MANDO A ACTUALIZAR EL TOKEN
  @HostListener("click")
  clicked() {
    console.log("click");
    this.renovarToken();

  }

  renovarToken() {
    var formData: any = new FormData();
    formData.append("usuario", this.sesion_usuario);
    console.log(formData);
    //formData.append("orden", this.orden.id_orden);
    let respuesta;
    this.serviciosGeneral.refreshTokenIntra(formData).subscribe((resp) => {
      console.log("renuevo token");
      console.log(resp);
      respuesta = resp;
      this.varGlobal.setTokenServer(respuesta.refreshToken)
    },
      error => {
        console.log("ERROR REFRESH TOKEN");
        console.error(error);
        if (error.status == 403) {
          sessionStorage.clear();
          this.router.navigate(["/login-intranet"], { replaceUrl: true });
        } else {
          this.router.navigate(["/login-intranet"], { replaceUrl: true });
          let nombre_error = "refresh-token"
          this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

        }
        //  this.loadingController.dismiss()

      });
  }
  //LAS FUNCIONES DE LA PAGINA
  //para que no se quede abierto el filtro
  validaFocus() {
    this.filtro = false;
  }

  async imprimirPDF(evento) {

    evento.stopPropagation()
    //PARA VOLVER ABRIR YA QUE LA ULTIMA VERSION NO FUNCIONA STOPPROPAGATION
    setTimeout(() => {
      this.fab.activated = true;
    }, 200);

    if (this.mensaje_info != '') {
      this.mostrarToastMensajeInfo(this.mensaje_info);
      return;
    }

    this.loadingAccion()
    //si no existe orden saco
    if (!this.orden.id_orden || this.orden.id_orden == "" ||  (this.itemsCheked < 1&&this.permiteSoloAdjuntos&&this.pdf64==null)||(this.itemsCheked < 1&&!this.permiteSoloAdjuntos)) {
      return;
    }
    console.log("ENTRA");
    await this.enviarSeleccionados("Impreso", "IM", "Impreso ").then(async () => {

      let blob = new Blob([new Uint8Array(this.pdf64)], { type: "application/pdf" });
      const exportUrl = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');

      //const iframe = await window.frames[0];
      /*
      iframe.onload = () => {
        iframe.contentWindow.addEventListener('afterprint', (evt) => {
          document.body.removeChild(iframe)
          console.log('1before print!')
        });
      }
      */

      //display none en mozilla no imprime
      iframe.style.position = "absolute"
      iframe.style.top = "-100000px";
      //iframe.style.display = 'none';
      iframe.src = exportUrl;

      document.body.appendChild(iframe);

      var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      console.log(iframe);

      if (iframeDoc.readyState == 'complete') {
        iframe.contentWindow.onload = () => {
          //en mozilla se demora
          setTimeout(async () => {
            this.loadingController.dismiss()
            iframe.focus();
            await iframe.contentWindow.print();
            setTimeout(() => {
              if (this.force_delivery)
                this.presentModalEntrega()
              this.limpiarPantalla(null);
              this.mostrarToastAcciones("Proceso realizado correctamente");
            }, 1000);
          }, 300);
        }


      } else {

        this.loadingController.dismiss()
        let pdfWindow = window.open(exportUrl);
        setTimeout(() => {
          pdfWindow.print();
          if (this.force_delivery)
            this.presentModalEntrega()
          this.mostrarToastAcciones("Proceso realizado correctamente");
          setTimeout(() => {
            this.limpiarPantalla(null);
          }, 300);
        }, 1500);

      }

      //pdfWindow.document.close(); // necessary for IE >= 10
      // pdfWindow.focus(); // necessary for IE >= 10*/

      URL.revokeObjectURL(exportUrl);
    })
    /*  if (!valida) {
        console.log("SALEEE");
        return;
      }
      console.log("SIGEEE");
  */

  }

  liberaPDF(evento) {
    evento.stopPropagation()
    //PARA VOLVER ABRIR YA QUE LA ULTIMA VERSION NO FUNCIONA STOPPROPAGATION
    setTimeout(() => {
      this.fab.activated = true;
    }, 200);

    let accion = "Liberacion"
    let detalle = ""
    let estado = "LI"
    this.enviaAuditoria(accion, detalle + "; version: " + "1.0.0")
    this.actualizaRegistros(accion, estado, detalle)
    this.utilidades.mostrarToast("LIBERADO")
    this.limpiarPantalla(null);
  }

  //desscarga pdf
  async guardarPDF(evento) {
    evento.stopPropagation()
    //PARA VOLVER ABRIR YA QUE LA ULTIMA VERSION NO FUNCIONA STOPPROPAGATION
    setTimeout(() => {
      this.fab.activated = true;
    }, 200);

    if (this.mensaje_info != '') {
      // this.mostrarToastMensajeInfo(this.mensaje_info);
      return;
    }
    //  console.log(this.orden.id_orden);
    if (!this.orden.id_orden || this.orden.id_orden == "" ||  (this.itemsCheked < 1&&this.permiteSoloAdjuntos&&this.pdf64==null)||(this.itemsCheked < 1&&!this.permiteSoloAdjuntos)) {
      return;
    }

    //ACTUALIZO SELECCIONADOS
    console.log("ENTRO METODO");
    await this.enviarSeleccionados("Descarga", "DE", "Descarga").then(async () => {

      console.log("SALIO METODO");

      let fileName = "";
      if (this.fileName != "")
        fileName = this.fileName
      else
        fileName = this.orden.id_orden
      //si no existe orden saco
      const blob = new Blob([new Uint8Array(this.pdf64)], { type: "application/pdf" });
      //const exportUrl = URL.createObjectURL(blob);
      saveAs(blob, fileName + ".pdf");
      this.flag_descarga = true;
      this.mostrarToastAcciones("Proceso realizado correctamente");
      //tengo q volver a generar otro por el codigo qr
      if (!this.select_pdf) {
        //this.cargarPDF(this.orden);
      }

    });

  }
  alertImagenWzp() {
    console.log('ENTRO');

  }

  @ViewChild(IonFab) fab;

  async enviarWsp(evento) {
    console.log(evento);
    //PARA VOLVER ABRIR YA QUE LA ULTIMA VERSION NO FUNCIONA STOPPROPAGATION
    setTimeout(() => {
      this.fab.activated = true;
    }, 200);

    if (evento != null)
      evento.stopPropagation();

    this.loadingAccion();
    if (this.mensaje_info != '') {
      //this.mostrarToastMensajeInfo(this.mensaje_info);
      return;
    }
    //si no existe orden saco
    console.log(this.itemsCheked);

    if (!this.orden.id_orden || this.orden.id_orden == "" ||  (this.itemsCheked < 1&&this.permiteSoloAdjuntos&&this.pdf64==null)||(this.itemsCheked < 1&&!this.permiteSoloAdjuntos)) {
      return;
    }
    //window.open("https://wa.me/593981438167?text=Revise su bandeja")

    //this.utilidades.enviarWzp(this.orden, this.datosPaciente.telf_pac);
    let orden = this.orden;
    let telefono = "";

    if (this.datosPaciente.cel_pac && this.datosPaciente.cel_pac != "" && this.datosPaciente.cel_pac != null) {
      telefono = this.datosPaciente.cel_pac
    } else {
      telefono = this.datosPaciente.telf_pac
    }

    //si tiene referencia pongo el telefono de la referencia
    if (this.datosPaciente.telf_ref && this.datosPaciente.telf_ref != null && this.datosPaciente.telf_ref != "") {
      telefono = this.datosPaciente.telf_ref
    }

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
    let estado_wzp;
    let descripcion_estado;
    let flag_css = "";
    let url_qr = "";
    let detailEstado = ""
    await this.servicios.getStatusWzp().toPromise().then(resp => {
      console.log("RESPUESTA DEL ESTADO", resp);
      if (resp)
        estado_wzp = resp
      if (estado_wzp.response && estado_wzp.response.status == 'authenticated') {
        descripcion_estado = ''
        flag_css = "listo"
        url_qr = ""
      } else {
        descripcion_estado = estado_wzp.response.status
        flag_css = "alert";
        if (estado_wzp.response.detail && estado_wzp.response.detail != '') {
          //  url_qr = `<a href="${estado_wzp.response.detail}" target="_blank"><ion-icon name='qr-code-outline'></ion-icon></a>`
          detailEstado = estado_wzp.response.detail
        }
        else
          url_qr = ""
      }

      //url_qr = `<button onclick="alertImagenWzp()" (click)="alertImagenWzp()" >s<ion-icon name='qr-code-outline'></ion-icon></button>`
      this.loadingController.dismiss();
    }, error => {
      this.loadingController.dismiss();
      descripcion_estado = 'errror'
      console.error(error);
      this.utilidades.alertErrorService("status-wzp", error.status)
    })
    //Creo la alerta
    const modal = await this.modalCtrl.create({
      animated: true,
      component: AlertWzpSendPage,
      cssClass: 'modal-alert-wzp',
      componentProps: {
        wzpStatus: descripcion_estado,
        wzpStatusDetail: detailEstado,
        number: telefono
      },
      // leaveAnimation: animationBuilder,
    });


    modal.onDidDismiss()
      .then(async (data) => {
        console.log(data['data']);
        // this.filtrarPeriodo(data['data']);
        if (data['data']) {
          if (data && data['data'] && data['data'].cancel) {
            console.log("SE CANCELO");

          } else if (data['data'].number && data['data'].number != '') {

            if (this.utilidades.isPhone(data['data'].number)) {
              this.loadingAccion();
              await this.enviarSeleccionados("WhatsApp", "WA", "Enviado para " + data['data'].number).then(async () => {
                //CODIGO DE ENVIO
                valores_enviar = {
                  "orden": this.orden.id_orden.toString(),
                  "email": data['data'].number,
                  "file": this.pdf64Send,
                  "server": 1
                }
                console.log(valores_enviar);

                await this.servicios.sendPDFIntra(valores_enviar).subscribe(resp => {
                  console.log("RESPONDE ENVIO", resp);

                  respuesta = resp;
                  if (respuesta.response) {
                    console.log(respuesta.response.code);

                    if (respuesta.response.code != 1) {
                      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor intente nuevamente o contacte con soporte.\n<br><small>Codigo error web service: SendPDFW/" + respuesta.response.code + "<small>")
                    }

                    if (respuesta.response.description) {
                      this.utilidades.mostrarToast(respuesta.response.description)
                      setTimeout(() => {
                        if (this.force_delivery)
                          this.presentModalEntrega()
                        this.limpiarPantalla(null);
                        this.mostrarToastAcciones("Proceso realizado correctamente");
                      }, 600);
                    }
                    setTimeout(() => {
                      this.loadingController.dismiss();
                    }, 600);

                  } else {
                    this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema en ENVIO</b></h2></br>Favor intente nuevamente o contacte con soporte.\n<br><small>SendPDFW/NO RESPONSE<small>")

                  }


                }, error => {

                  setTimeout(() => {
                    this.loadingController.dismiss();
                  }, 500);

                  console.error(error);
                  let nombre_error = "sendPDFW"
                  this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
                });
              });

            } else {
              this.utilidades.mostrarToast("Ingrese un numero valido")
            }
          } else if (data['data'].estado) {
            this.enviarWsp(null);
          }
        }
      });

    return await modal.present();

    //
    const alert = await this.alertController.create({
      cssClass: 'alert-mail',
      message: "<b>Ingrese el número</b>" +
        `<ion-badge class="ion-text-wrap alert-info-wzp ${flag_css}" color="success">
      ${descripcion_estado}
       </ion-badge>`+ url_qr,
      inputs: [
        {
          type: "tel",
          name: 'numero',
          value: telefono,
          placeholder: '098XXXXXXX'
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
          handler: async (data) => {

            if (this.utilidades.isPhone(data.numero)) {
              this.loadingAccion();

              //ESTO SE HACE PARA TRANSFORMAR A BASE64URL QUE USA WHATSAAP
              //Caracteres diferentes + por - ;y / por _ 
              //YA LO HAGO EN EL SERVER
              //var pdf = this.pdf64Send.replaceAll("+", "-").replaceAll("/", "_");
              //ACTUALIZO SELECCIONADOS
              await this.enviarSeleccionados("WhatsApp", "WA", "Enviado para " + data.numero).then(async () => {

                //CODIGO DE ENVIO
                valores_enviar = {
                  "orden": this.orden.id_orden.toString(),
                  "email": data.numero,
                  "file": this.pdf64Send,
                  "server": 1
                }
                console.log(valores_enviar);

                await this.servicios.sendPDFIntra(valores_enviar).subscribe(resp => {
                  console.log("RESPONDE ENVIO", resp);

                  respuesta = resp;
                  if (respuesta.response) {
                    console.log(respuesta.response.code);

                    if (respuesta.response.code != 1) {
                      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor intente nuevamente o contacte con soporte.\n<br><small>Codigo error web service: SendPDFW/" + respuesta.response.code + "<small>")
                    }

                    if (respuesta.response.description) {
                      this.utilidades.mostrarToast(respuesta.response.description)
                      setTimeout(() => {
                        if (this.force_delivery)
                          this.presentModalEntrega()
                        this.limpiarPantalla(null);
                        this.mostrarToastAcciones("Proceso realizado correctamente");
                      }, 600);
                    }
                    setTimeout(() => {
                      this.loadingController.dismiss();
                    }, 600);

                  } else {
                    this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema en ENVIO</b></h2></br>Favor intente nuevamente o contacte con soporte.\n<br><small>SendPDFW/NO RESPONSE<small>")

                  }


                }, error => {

                  setTimeout(() => {
                    this.loadingController.dismiss();
                  }, 500);

                  console.error(error);
                  let nombre_error = "sendPDFW"
                  this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
                });
              });

            } else {
              this.utilidades.mostrarToast("Ingrese un numero valido")
            }

          }
        }

      ]
    });

    await alert.present();


  }

  async enviarEmail(evento) {
    evento.stopPropagation();
    //PARA VOLVER ABRIR YA QUE LA ULTIMA VERSION NO FUNCIONA STOPPROPAGATION
    setTimeout(() => {
      this.fab.activated = true;
    }, 200);

    if (this.mensaje_info != '') {
      // this.mostrarToastMensajeInfo(this.mensaje_info);
      return;
    }
    //si no existe orden saco
    if (!this.orden.id_orden || this.orden.id_orden == "" || (this.itemsCheked < 1&&this.permiteSoloAdjuntos&&this.pdf64==null)||(this.itemsCheked < 1&&!this.permiteSoloAdjuntos)) {
      return;
    }

    let mail = this.datosPaciente.mail_pac;
    //SI EXISTE REFERENCIA COGE LA DEL MAIL
    if (this.datosPaciente.mail_ref && this.datosPaciente.mail_ref != null && this.datosPaciente.mail_ref != "") {
      mail = this.datosPaciente.mail_ref
    }
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
          placeholder: 'ejemplo@ejemplo.com'
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
          handler: async (data) => {
            if (data.email != "") {
              let correos = data.email.split(",")
              console.log("correos", correos);

              let correos_invalidos = "";
              //SOLO PARA MENSAJE
              correos.forEach(correo => {
                if (!this.utilidades.isEmail(correo)) {
                  correos_invalidos = correos_invalidos + correo + ", "
                }
              });
              //ENVIO CORREOS
              if (correos_invalidos == "") {
                this.loadingAccion();

                //ACTUALIZO SELECCIONADOS
                await this.enviarSeleccionados("Email", "MA", "Enviado para " + data.email).then(async () => {
                  //CODIGO DE ENVIO
                  valores_enviar = {
                    "orden": this.orden.id_orden.toString(),
                    "email": data.email,
                    "file": this.pdf64Send,
                    "server": 1
                  }
                  console.log(valores_enviar);

                  this.servicios.sendPDFIntra(valores_enviar).subscribe(async (resp) => {
                    console.log(resp);

                    //si no existe orden saco
                    //const blob = new Blob([resp], { type: "application/pdf" });
                    //const exportUrl = URL.createObjectURL(blob);
                    //saveAs(blob, "orden_" + this.orden.id_orden + ".pdf");

                    respuesta = resp;
                    if (respuesta.response) {
                      console.log(respuesta.response.code);
                      if (respuesta.response.code != 1) {
                        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor intente nuevamente o contacte con soporte.\n<br><small>Codigo error web service: SendPDF/" + respuesta.response.code + "<small>")
                      }
                      if (respuesta.response.description) {
                        this.utilidades.mostrarToast(respuesta.response.description)
                        setTimeout(() => {
                          if (this.force_delivery)
                            this.presentModalEntrega()
                          this.limpiarPantalla(null)
                          this.mostrarToastAcciones("Proceso realizado correctamente");
                        }, 600);
                      }
                      setTimeout(() => {
                        this.loadingController.dismiss();
                      }, 600);

                    }
                    else {
                      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema en ENVIO</b></h2></br>Favor intente nuevamente o contacte con soporte.\n<br><small>NO RESPONSE<small>")
                    }


                  }, error => {

                    setTimeout(() => {
                      this.loadingController.dismiss();
                    }, 500);

                    console.error(error);
                    let nombre_error = "sendPDF"
                    this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

                  });
                });
              } else {
                this.utilidades.mostrarToast("Ingrese un correo valido para (" + correos_invalidos + ") e intente nuevamente ")
              }
            }
            else {
              this.utilidades.mostrarToast("Ingrese un correo")
            }
            //   if (this.utilidades.isEmail(data.email)) {


            // } else {
            //  this.utilidades.mostrarToast("Ingrese un correo valido")
            //}

          }
        }

      ]
    });

    await alert.present();
    //this.utilidades.enviarMail(this.orden, "intra", this.datosPaciente.mail_pac);
    //this.validaFabList=true;
  }

  adjuntosAddRemove(evento) {
    
    evento.stopPropagation();
    //PARA VOLVER ABRIR YA QUE LA ULTIMA VERSION NO FUNCIONA STOPPROPAGATION
    setTimeout(() => {
      this.fab.activated = true;
    }, 200);

    console.log("Adjuntos", this.datosAdjuntos);
    if (this.datosAdjuntos.response.code > 0 && this.datosAdjuntos.response.files != null) {
      this.adjuntos_flag = this.adjuntos_flag ? false : true;
      this.cargarPDF();
    } else {
      if (this.select_pdf)
        this.utilidades.mostrarToast("Solo visualización");
      else
        this.utilidades.mostrarToast("No tiene adjuntos");
    }




  }
  //FIN DE LAS FUNCIONES


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

  rotarPage(flag) {
    if (flag == 'der' && this.rotatePage < 360) {
      this.rotatePage += 90;
    } else
      if (flag == 'izq' && this.rotatePage > 0) {
        this.rotatePage -= 90;
      } else
        if (flag == 'izq' && this.rotatePage == 0) {
          this.rotatePage = 270;
        }
    if (this.rotatePage == 360) {
      this.rotatePage = 0
    }


    console.log(this.rotatePage);
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
            //this.router.navigate([this.redireccion_principal])
          }
        }
      ]
    });

    await alert.present();
  }


  async presentAlertIncompleto(pendientes, activa) {
    return new Promise(async (resolve) => {
      let mensaje = "";
      let botones = [{
        text: 'CANCELAR',
        role: "cancel",
        cssClass: 'cancel-button-alert',
        handler: () => {
          this.permiso_impresion = false;
          this.limpiarPantalla(null);
          return resolve(false);
        }
      }]


      if (activa) {
        mensaje = "Análisis sin validar </br><div class='a_pend'><pre>" + pendientes + "</pre></div>"

        botones.push({
          text: 'PROCEDER',
          role: "",
          cssClass: 'principal-button-alert',
          handler: () => {
            this.permiso_impresion = true;
            this.lista_pendientes = pendientes
            return resolve(true);
          }

        })
      } else {
        mensaje = "No existen exámenes validados en esta orden"
      }

      const confirm = await this.alertController.create({
        cssClass: 'mensajes-pendientes',
        header: "INFORME PARCIAL",
        message: mensaje,
        backdropDismiss: true,
        buttons: botones
      });

      //await alert.present();

      await confirm.present();
    });

  }

  async presentAlertPermiso(saldo) {
    //REDONDEO
    saldo = Math.round((saldo + Number.EPSILON) * 100) / 100;
    return new Promise(async (resolve) => {
      let mensaje = "";
      let botones = [{
        text: 'CANCELAR',
        role: "cancel",
        cssClass: 'cancel-button-alert',
        handler: () => {
          this.permiso_impresion = false;
          this.limpiarPantalla(null);
          return resolve(false);
        }
      }]
      if (this.sesion_permiso == 1) {
        mensaje = "Desea proceder a la impresión del reporte de la orden " + this.orden.id_orden + "<br><small>Saldo: </small><b>$" + saldo + "</b>"
        botones.push({
          text: 'PROCEDER',
          role: "",
          cssClass: 'principal-button-alert',
          handler: () => {
            this.permiso_impresion = true;
            return resolve(true);
          }

        })
      } else {
        mensaje = "La orden " + this.orden.id_orden + " tiene un saldo de <b>$" + saldo + "</b> y no se puede enviar a imprimir"

      }
      const confirm = await this.alertController.create({
        cssClass: 'mensajes-pdf',
        header: "ORDEN CON SALDO",
        message: mensaje,
        backdropDismiss: true,
        buttons: botones
      });

      //await alert.present();

      await confirm.present();
    });

  }
  openMenu() {
    //this.menu.enable(true, 'custom');
    this.menu.open();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverIntrausrPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps: {
        usuario: this.sesion_usuario_des,
        orden: this.idOrden
      }
    });
    return await popover.present();
  }

  async checkPDFGuardados(orden) {
    var formData: any = new FormData();
    formData.append("orden", orden);
    console.log(formData);
    //formData.append("orden", this.orden.id_orden);
    let respuesta;
    await this.serviciosMongo.getSavedListPDF(formData).toPromise().then((resp) => {
      respuesta = resp;
      console.log(resp);

      if (respuesta && respuesta.length > 0) {
        respuesta.forEach(element => {
          element.fecha = element.fecha.replace(" ", "T")
          if (new Date(element.fecha).toLocaleDateString() == new Date().toLocaleDateString()) {
            //console.log("HOOOOOOOOY");
            element.hoy = "Hoy "
          }

        });

        this.presentModalPdfs(respuesta);
        this.lista_pdfs = respuesta;
      }

    }, error => {
      console.error(error);
      if (error.status == 403) {
        sessionStorage.clear();
        this.router.navigate(["/login-intranet"], { replaceUrl: true });
      } else {

        //  this.router.navigate(["/login-intranet"], { replaceUrl: true });
        let nombre_error = "getSavedPDFs"
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

      }
      //  this.loadingController.dismiss()

    });
  }

  async presentModalPdfs(lista) {
    const enterAnimation = (baseEl) => {
      console.log("baseEl", baseEl);
      const backdropAnimation = createAnimation()
        .addElement(baseEl.querySelector(".modal-wrapper .close-contenido"))
        .fromTo("opacity", "0.01", "0.0")
        .to("opacity", "");

      const wrapperAnimation = createAnimation()
        .addElement(baseEl.querySelector(".modal-wrapper.item-select"))
        .to("transform", "translatex(120%) translatey(-55%)")
        // .fromTo("transform", "translatey(0px)", "translatey(-70%)")
        .fromTo("opacity", "1", "0")
        .to("height", "40%")
      //.fromTo("color", "red", "green");

      return createAnimation()
        .addElement(baseEl)
        .easing("ease-in-out")
        .duration(600)
        .addAnimation([wrapperAnimation, backdropAnimation]);
    };
    const modal = await this.modalCtrl.create({
      animated: true,
      component: SelectPdfPage,
      cssClass: 'modal-select-pdfs',
      componentProps: {
        lista_pdfs: lista
      },
      // leaveAnimation: animationBuilder,
      leaveAnimation: enterAnimation,
    });


    modal.onDidDismiss()
      .then((data) => {
        console.log(data['data']);
        // this.filtrarPeriodo(data['data']);
        if (data['data']) {
          this.recuperaPDF(data['data']);
        }
      });

    return await modal.present();
  }

  async recuperaPDF(datos_pdf) {
    //SI LLEGO AL HISTORIAL HABILITO LA IMPRESION AUNQ NO DEBERIA PASAR HISTORIAL
    this.permiso_impresion = true;

    await this.loadingPDF();
    this.select_pdf = datos_pdf;
    this.getArchivoPDF(datos_pdf).then(() => {
      this.pdf64Send = datos_pdf.archivo;
      this.pdf64 = this.utilidades.base64ToArrayBuffer(datos_pdf.archivo);
      this.generaMenuAnalisiSelect(datos_pdf.analisis);
      this.formato = datos_pdf.formato;
      //guardo la version
      this.version_pdf = datos_pdf.version;
      this.loadingController.dismiss();
      console.log("FIN");
    }, error => {
      console.log("ERROR", error);
      this.loadingController.dismiss()

    }
    );

  }

  async getArchivoPDF(pdf) {
    //LLAMO AL PDF POR ID DEL MONGO
    var formData: any = new FormData();
    formData.append("id", pdf.id);
    let data;
    return this.serviciosMongo.getSavedPDF(formData).toPromise().then(resp => {
      console.log(resp);
      data = resp;
      // this.base64ToArrayBuffer(data.archivo);
      this.select_pdf.archivo = data.archivo
      //this.pdf64Send =data.archivo;
      //GENERO EL MENU NUEVAMENTE CON LOS ANALISIS
      //this.generaMenuAnalisiSelect(pdf.analisis)
    }, error => {
      let nombre_error = "get-archivo"
      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
    })
  }

  async generaMenuAnalisiSelect(lista_analisis: any[]) {
    console.log(lista_analisis);
    for (const tipo of this.orden.tipo_analisis) {
      tipo.isChecked = true;//TRUE DESACTIVADO
      for (const analisis of tipo.analisis) {
        //    console.log(analisis);
        analisis.isChecked = true;
        for (const select_analisis of lista_analisis) {
          if (select_analisis == analisis.codigo_analisis) {
            //console.log("ENCONTRO " + analisis.codigo_analisis);
            analisis.isChecked = false;
            tipo.isChecked = false;
          }
        }
      }
    }
  }

  async loadingOrden() {
    // let mensaje = "";

    //this._translate.get('complex.lista_cargando').subscribe((res: string) => {
    this._translate.get("complex.lista_cargando").subscribe((res: string) => {
      this.mensaje_info = res;
    });

    const loading = await this.loadingController.create({
      id: '1',
      cssClass: 'my-custom-class',
      message: this.mensaje_info + '...',
      backdropDismiss: true,
      duration: 10000
    });

    return loading.present();
  }


  async loadingAccion() {
    let mensaje = "Cargando";


    this._translate.get('simple.Cargando').subscribe((res: string) => {
      mensaje = res;
    });
    const loading = await this.loadingController.create({
      id: '1',
      cssClass: 'my-custom-class',
      message: mensaje + '...',
      backdropDismiss: true,
      duration: 20000
    });

    return loading.present();
  }

  async loadingPDF() {
    let mensaje = "";

    this._translate.get('complex.lista_cargando').subscribe((res: string) => {
      mensaje = res;
    });
    mensaje = "Generando Informe";
    const loading = await this.loadingController.create({
      id: '2',
      cssClass: 'my-custom-class',
      message: mensaje + '...',
      duration: 15000
    });
    return await loading.present();
  }

  async loadingFirma() {
    let mensaje = "";

    mensaje = "Firmando el documento";
    const loading = await this.loadingController.create({
      id: '3',
      cssClass: 'my-custom-class',
      message: mensaje + '...',
      duration: 15000
    });
    return await loading.present();
  }

  seleccion(item) {
    this.select_pdf = item;
    this.recuperaPDF(item);
  }


  async mostrarToastAcciones(mensaje) {
    const toast = await this.toastController.create({
      cssClass: 'toast-verde',
      color: 'success',
      message: mensaje,
      duration: 3000,
      //position:'middle'
    });
    return toast.present();
  }

  async mostrarToastMensajeInfo(mensaje) {
    const toast = await this.toastController.create({
      cssClass: 'toast',
      //color: 'success',
      message: mensaje,
      duration: 1000,
      //position:'middle'
    });
    return toast.present();
  }

  async presentModalEntrega() {
    this.popoverController.dismiss();

    const modal = await this.modalCtrl.create({
      animated: true,
      component: EntregaPage,
      cssClass: 'modal-select-pdfs',
      componentProps: {
        nroOrden: this.orden.id_orden,
        forceMode: this.force_delivery
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

  async presentModalReimpresion() {
    //this.popoverController.dismiss();
    return new Promise(async (resolve) => {


      const modal = await this.modalCtrl.create({
        //animated: true,
        component: ReimpresionPage,
        cssClass: 'modal-select-pdfs',
        backdropDismiss: false,
        componentProps: {
          nroOrden: this.orden.id_orden,
          forceMode: this.force_sgc
        },
        // leaveAnimation: animationBuilder,
      });


      modal.onDidDismiss()
        .then((data) => {
          console.log(data);
          resolve(true)
          console.log(data['data']);
          // this.filtrarPeriodo(data['data']);
          if (data['data']) {
            //this.recuperaPDF(data['data']);
          }
        });

      return await modal.present();
    })

  }

}
