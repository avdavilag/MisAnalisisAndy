import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertPeriodoFiltroPage } from 'src/app/modals/alert-periodo-filtro/alert-periodo-filtro.page';
import { PdfPreviewResultPage } from 'src/app/modals/pdf-preview-result/pdf-preview-result.page';
import { ListTipoPage } from 'src/app/popover/list-tipo/list-tipo.page';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { WebRestService } from 'src/app/servicios/intranet/web-rest.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { FuncionesComunes } from 'src/app/utils/funciones-comunes';
import { FuncionesComunesIntra } from 'src/app/utils/funciones-comunes-intra';
import { Utilidades } from 'src/app/utils/utilidades';

@Component({
  selector: 'app-envio-iess',
  templateUrl: './envio-iess.page.html',
  styleUrls: ['./envio-iess.page.scss'],
})
export class EnvioIessPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;


  infoText = ""
  dato_find = ""
  fecha_desde
  fecha_hasta

  public digitosBusqueda = "";
  public cargando = true;
  public mobile = false;
  public des_usr: any = ""
  public tipo_user = "";
  public var_usr;
  public usuario;
  inicio_paginacion = 0
  public criterio_ordenamiento = "A";
  public sesion_usuario;
  filtro_ref:any={cod:null,des:"todos"};
  filtro_plan:any={cod:null,des:"todos"};
  filtro_uni:any={cod:null,des:"todos"};

  public lista_ordenes=[];
  public lista_filtrar=[];
  public lista_temporal=[];

  public paginacion = 10;

  public input_orden="";

  flag_firmapdf:boolean=false;
  sucursalSelect:any=null;

  public lista_sucursal=[]
  
  
  constructor(
    private varGlobal: VariablesGlobalesService,
    private popoverController:PopoverController,
    private queryservice:QueryService,
    private configApp: AppConfigService,
    public loadingController: LoadingController,
    public utilidades: Utilidades,
    private modalCtrl:ModalController,
    private _translate: TranslateService,
    public funcionesComunes: FuncionesComunes,
    public funcionesComunesIntra: FuncionesComunesIntra,
    private webrestservice: WebRestService,
    private alertController:AlertController,
    private toastService:ToastService,
    private loadingService:LoadingService
    
  ) { }

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
  }

  ionViewWillEnter() {
    this.usuario = {};
    this.var_usr = {};
    this.lista_ordenes = [];
    this.lista_filtrar = [];
    this.lista_temporal = [];
    let fecha_hoy = new Date()
    this.fecha_hasta = fecha_hoy.toISOString().split("T")[0]
    let dias = 3
    this.sesion_usuario = this.varGlobal.getVarUsuarioIntra();
    
    this.des_usr = this.varGlobal.getVarUsuarioDes();
    this.var_usr = this.varGlobal.getVarUsuario()//ESTE ES L CODIGO
    this.tipo_user = this.varGlobal.getVarUsuarioTipo();
    console.log('this.des_usr', this.varGlobal.getVarUsuarioDes());
    console.log('this.var_usr', this.var_usr);
    console.log('this.tipo_user', this.tipo_user);
    

    if (this.tipo_user == 'pat') {
      this.fecha_desde = new Date("1990-01-01").toISOString().split("T")[0]
    } else {
      this.fecha_desde = new Date(fecha_hoy.setDate(fecha_hoy.getDate() - dias)).toISOString().split("T")[0]
    }

    // this.presentLoading();
    this.usuario = this.varGlobal.getEntidad();

    //DEFAULT PAGINACION
    this.paginacion = this.configApp.defaultPaginacion;
    console.log("usuario", this.usuario);
    console.log("var_usr", this.var_usr);

    this.queryservice.getListSucursal().then((r:any)=>{
      console.log(r);

      this.lista_sucursal=r.data.ListSucursal;
      console.log('this.lista_sucursal',this.lista_sucursal);

    })
    
  }
 
  validaFecha() {
    let fecha_hoy = new Date()
    let dias = 7
    let espera = 100
    if (this.fecha_desde == '') {
      espera = 150;
      setTimeout(() => {
        this.fecha_desde = new Date(fecha_hoy.setDate(fecha_hoy.getDate() - dias)).toISOString().split("T")[0]
      }, 100);
    }
    if (this.fecha_hasta == '') {
      espera = 150;
      setTimeout(() => {
        this.fecha_hasta = fecha_hoy.toISOString().split("T")[0]
      }, 100);
    }
    setTimeout(() => {
      //    this.getDataListAva()
    }, espera);

  }

  async presentPopoverList(ev: any,tipo:any) {
    console.log(ev);
    
    const popover = await this.popoverController.create({
      component: ListTipoPage,
      event: ev,
      cssClass: 'ion-popover-custom',
      translucent: false,
      componentProps: {
        tipo:tipo
      }
    });

    popover.onDidDismiss()
      .then((data: any) => {

        console.log(data['data']);
        if (data['data']) {


          if(data['data'].tipo=='ref'){
         this.filtro_ref= data['data'].data_select
          }
          if(data['data'].tipo=='plan'){
            this.filtro_plan= data['data'].data_select
          }

          if(data['data'].tipo=='uni'){
            this.filtro_uni= data['data'].data_select
          }
      

         // this.tipo_filtro:tipo
        //  this.input_filtro = data['data'].data_select
        //  this.lista_filtrar = []
        //  this.lista_ordenes = []
        }

      });
    await popover.present();
  }

  buscaxFiltro() {
   
    this.getDataListAva()

  }

  async getDataListAva() {
    //this.presentLoading()
    this.infoText = "Cargando..."
    

    console.log(this.fecha_desde);


   
    let data:any={};

    if (this.dato_find != "" && this.dato_find.length > 3) {
      data.dato= this.dato_find;
    } else {
      data.dato, "";
    }

    data.codigo= this.var_usr
    data.tipo= this.tipo_user
    data.desde= this.fecha_desde
    data.hasta= this.fecha_hasta
    data.inicio= this.inicio_paginacion
    //data.complete="complete"
    data.nro_orden=this.input_orden
    data.listo_imprime=1
    if (this.criterio_ordenamiento == 'D') {
      data.orderby= "desc";
    } else {
      data.orderby= "asc";
    }

    if(this.filtro_ref.cod!=null){
      data.id_ref=this.filtro_ref.cod
    }else{
      data.id_ref=""
    }
    if(this.filtro_plan.cod!=null){
      data.id_plan=this.filtro_plan.cod
    }else{
      data.id_plan=""
    }

    if(this.filtro_uni.cod!=null){
      data.cod_uni=this.filtro_uni.cod
    }else{
      data.cod_uni=""
    }
    
      console.log(data);

      this.queryservice.getOrdenResultadosSB(data).then((r:any)=>{
        console.log(r);
        this.input_orden=""
        let result=r.data.getOrdentoResultadosDynamic

        for (let index = 0; index < result.length; index++) {
          let element = result[index];
          element.correos=[];
          if(element.mail_ref) element.correos.push(element.mail_ref)
          if(element.mail_pac) element.correos.push(element.mail_pac)
          if(element.mail_med) element.correos.push(element.mail_med)
          element.text_correo=""
        }
  
        
  
        this.lista_ordenes = result;
        console.log('this.lista_ordenes',this.lista_ordenes);
        this.lista_filtrar=result;

        this.lista_filtrar = this.lista_filtrar.slice(0, this.configApp.defaultPaginacion)
  
        //this.loadingController.dismiss();
        setTimeout(async () => {
          this.infoText = ""
          const isLoadingOpen = await this.loadingController.getTop();
          if (isLoadingOpen) {
            this.loadingController.dismiss()
          }
  
        }, 300);


      }, error => {
      console.log(error);
      const isLoadingOpen = this.loadingController.getTop();
      if (isLoadingOpen) {
        this.loadingController.dismiss()
      }
      this.utilidades.alertErrorService("get-list-orders", error.status)
      this.infoText = "Error"
      //this.loadingController.dismiss();
    })
   
  }


  async openModalPeriodo() {
    const modal = await this.modalCtrl.create({
      component: AlertPeriodoFiltroPage,
      cssClass: 'modal-alert',
      componentProps: {
        f_desde: this.fecha_desde,
        f_hasta: this.fecha_hasta
      }
    });

    modal.onDidDismiss()
      .then((data) => {

        console.log(data['data']);
        // this.filtrarPeriodo(data['data']);
        //deshabilito por cambios 3.4
        //this.filtroPersonalizado(data['data']);
        this.filtroFechaMovil(data['data'])
      });

    return await modal.present();
  }

  filtroFechaMovil(data) {
    if (data && data.f_desde && data.f_hasta) {
      //this.infiniteScroll.disabled = true;
      this.fecha_desde = data.f_desde;
      this.fecha_hasta = data.f_hasta;
      // this.getDataListAva()



    }
  }


  doInfinite(event) {
    if (this.lista_filtrar.length != this.lista_ordenes.length && this.digitosBusqueda.length == 0) {
      this.cargando = false;
      let inicio_paginacion = this.paginacion;
      this.paginacion += this.configApp.defaultPaginacion
      setTimeout(() => {
        this.infiniteScroll.complete();
        this.lista_filtrar.push(...this.lista_ordenes.slice(inicio_paginacion, this.paginacion));
        this.cargando = true;
        console.log(this.lista_filtrar);

      }, 1000);

    } else {
      event.target.disabled = true;
      this.toggleInfiniteScroll();
    }
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  cargaPDF(idOrden, formato = "") {
    
    this.presentLoading()
    this.funcionesComunesIntra.renderizaPDFOrden(idOrden, 0, formato).then(pdf => {
      this.loadingController.dismiss()
      this.presentModalPDF(pdf, idOrden);

      let descripcion_tipo = "";

      if (this.tipo_user == "ref")
        descripcion_tipo = "Referencia"
      else if (this.tipo_user == "pat")
        descripcion_tipo = "Paciente"
      else if (this.tipo_user == "med")
        descripcion_tipo = "Medico"

      this.funcionesComunesIntra.enviaAuditoria(this.tipo_user + "-" + this.var_usr, idOrden, "WEB", "REVISADO POR " + descripcion_tipo + " " + this.des_usr);
    }, error => {
      console.error("ERROR DEL METODO", error);
      this.loadingController.dismiss()

    })

  }

  async presentLoading() {
    let mensaje = "";
    this._translate.get('complex.lista_cargando').subscribe((res: string) => {
      mensaje = res;
    });
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje,
      duration: 15000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
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


  descargarIess(){
    this.loadingService.present("Cargando..")
    let detalle="(descarga en bloque Iess) Resultados descargados";
    let que = "PRINT"
    let donde = "Navegador: " + this.utilidades.getNavegador() + "; IP: " + this.varGlobal.getIPBrowser();
    let modify = "'" + this.sesion_usuario + "' as who_log, '" + que + "' as what_log, '" + donde + "' as where_log,'" + detalle + "' as why_log";
    console.log("MODIFY", modify);
    let lista_enviar:any=[];
    for (let index = 0; index < this.lista_ordenes.length; index++) {
      const element = this.lista_ordenes[index];
      lista_enviar.push({
        nombre:element.nombre_completo.trim(),
        nro_ord:element.nro_ord,
        modify_audit:modify,
        user:this.sesion_usuario

      })
    }
let extra_parm:any=[]
//extra_parm=null;
    if(this.flag_firmapdf && this.sucursalSelect !=null){
      extra_parm.push({
        cert:this.sucursalSelect.cert,
        pass:this.sucursalSelect.pwd_cert
      })
    }
    console.log('this.lista_enviar',lista_enviar);
    
    this.webrestservice.downloadIess(lista_enviar,extra_parm).subscribe((r:any)=>{
      this.loadingService.dismiss()
      console.log(r);
      if(r.status=='ok'){
        this.toastService.presentToast({
          color:"success",
          duration:1500,
          message:r.message,
          posotion:"top"
        })
        return
      }

      if(r.status=='error'){
        this.toastService.presentToast({
          color:"warning",
          duration:1500,
          message:r.message,
          posotion:"top"
        })
        return
      }
    },error=>{
      console.log(error);
      
      let nombre_error = "cs_agent.exe error"
      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "</br>"+error.message+"<small>")

/*
      console.log(error);
      this.loadingService.dismiss()
      this.toastService.presentToast({
        color:"warning",
        duration:1500,
        message:error.message,
        posotion:"top"
      })
*/

    })
  }

  async presentAlertConfirmDescargar() {
    if(this.lista_ordenes.length==0){
      this.toastService.presentToast({
        message:"No existe un listado que descargar",
        position:"middle",
        duration:1500,
        color:"warning"
      })
      return
    }
    const alert = await this.alertController.create({
      header: 'Se enviara a descargar',
     // message: 'Message <strong>text</strong>!!!',
     inputs:[
      {type:'checkbox',
      label:'Firmar los Pdf.',
      value:'flag',
      }
     ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: (r) => {
            if(r=='flag'){
              this.flag_firmapdf=true
            }else{this.flag_firmapdf=false}
           
            console.log('this.flag_firmapdf' ,this.flag_firmapdf);
            console.log("r",r);

            if(this.flag_firmapdf){
              console.log("emtrreete");
              
              this.presentAlertSucursal()
            }
            else{
              this.descargarIess()
            }
            
         
          }
        }
      ]
    });
  
    await alert.present();
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

async presentAlertSucursal() {
  if(this.lista_sucursal.length==0){
    this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>No existe listado de sucursal para continuar</b></h2>")
    return;
  }

  let list_input=[]
  for (let index = 0; index < this.lista_sucursal.length; index++) {
    const element = this.lista_sucursal[index];
    list_input.push({
      type: 'radio',
      label: element.des_suc,
      value: element,
      checked: false
    })
    
  }
  const alert = await this.alertController.create({
    
    header: 'Seleccione una sucursal',
    inputs:list_input,

    buttons: [ {
      text: 'Aceptar',
      cssClass: 'principal-button-alert',
      handler: (r) => {
        this.sucursalSelect=r;
        console.log('Confirm Okay',r);
        //this.router.navigate([this.redireccion_principal])
        this.descargarIess();
      }
    }]
  });

  await alert.present();
}

}
