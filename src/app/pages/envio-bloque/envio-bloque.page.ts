import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonAccordionGroup, IonInfiniteScroll, LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { DetalleOrdenPage } from '../../modals/detalle-orden/detalle-orden.page';
import { PopoverFiltroPage } from '../../popover/popover-filtro/popover-filtro.page';
import { PopoverUsrPage } from '../../popover/popover-usr/popover-usr.page';
import { WebRestService } from '../../servicios/intranet/web-rest.service';
import { formatDate } from "@angular/common";
import { PopoverOrdenPage } from '../../popover/popover-orden/popover-orden.page';
import { AlertPeriodoFiltroPage } from '../../modals/alert-periodo-filtro/alert-periodo-filtro.page';
import { FuncionesComunes } from '../../utils/funciones-comunes';
import { AppConfigService } from '../../utils/app-config-service';

import { TranslateService } from '@ngx-translate/core';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { BaseService } from 'src/app/servicios/base/base.service';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { FuncionesComunesIntra } from 'src/app/utils/funciones-comunes-intra';
import { PdfPreviewResultPage } from 'src/app/modals/pdf-preview-result/pdf-preview-result.page';
import { FacturasPage } from 'src/app/modals/facturas/facturas.page';
import { Utilidades } from 'src/app/utils/utilidades';
import { AlertSbloqueSelectPage } from '../../modals/alert-sbloque-select/alert-sbloque-select.page';
import { log } from 'console';
import { ToastService } from 'src/app/servicios/toast.service';
import { ListTipoPage } from 'src/app/popover/list-tipo/list-tipo.page';

@Component({
  selector: 'app-envio-bloque',
  templateUrl: './envio-bloque.page.html',
  styleUrls: ['./envio-bloque.page.scss'],
})
export class EnvioBloquePage implements OnInit {

  @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;
  @ViewChild('filterOrden') filterInput: ElementRef;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public formato_fecha = 'yyyy-MM-dd';
  public usuario;
  public var_usr;
  public sesion_usuario;
  public lista_ordenes;
  public mobile = false;
  public digitosBusqueda = "";
  public lista_filtrar;
  public lista_temporal;
  public criterio_ordenamiento = "D";
  public tipo_ordenamiento = "fecha";
  public paginacion = 10;
  public cargando = true;
  public filtro = false;
  public tooltip_btn = "";
  public tipo_server = 0;
  public des_usr: any = ""
  public tipo_user = "";
  public ativa_progress = false;

  public formato_pdf_ref = "";
  public flag_view_ord = false;

  fecha_desde
  fecha_hasta
  dato_find = ""
  inicio_paginacion = 0
  order_by = ""
  infoText = ""
  checked_all = false

  input_filtro: any = {};

  list_referencia: any;
  list_medicos: any;
  list_planes: any;
  local_ip:any='';

  filtro_correos=[
    {des:'Referencia',checked:true,cod:'ref'  },
    {des:'Medico',checked:true,cod:'med'  },
    {des:'Paciente',checked:true,cod:'pac'  },
    {des:'Otro',checked:false,cod:'otro'  },
  ]

  inputMailOtro:String="";

  filtro_ref:any={cod:null,des:"todos"};
  filtro_med:any={cod:null,des:"todos"};
  filtro_plan:any={cod:null,des:"todos"};
  filtro_uni:any={cod:null,des:"todos"};

  filtro_sts:any={cod:null,des:"todos"};
  
  constructor(
    public modalCtrl: ModalController,
    private varGlobal: VariablesGlobalesService,
    private servicios: BaseService,
    public popoverController: PopoverController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public toastService: ToastService,
    public funcionesComunes: FuncionesComunes,
    public utilidades: Utilidades,
    public funcionesComunesIntra: FuncionesComunesIntra,
    private configApp: AppConfigService,
    private _translate: TranslateService,
    private queryservice: QueryService,
    private popovercontroller: PopoverController,
    private webrestService:WebRestService
    
  ) {
    this.usuario = {};
    this.var_usr = {};
    this.lista_ordenes = [];
    this.lista_filtrar = [];
    this.lista_temporal = [];
    

    this.getIp();
    //PONGO EL DEFAULT DEL FORMATO DE FECHA
    this.formato_fecha = this.configApp.formatoFecha;
    this.ativa_progress = this.configApp.progressPDF;//si esta activado buscara el prgress para dejarle imprimir
    if (this.configApp.formatoRefPDF) {
      this.formato_pdf_ref = this.configApp.formatoRefPDF//si tiene un valor voy a coger este valor y activar el boton
    }

  }

  getIp(){
    this.webrestService.getIpbyCSservice().subscribe((r:any)=>{
      console.log('ip',r);
      this.local_ip=r.ip
console.log('local_ip',this.local_ip);

    },error=>{
      console.log("No ip local");
      
    })
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

    if (this.tipo_user == 'ref') {
      if (this.configApp.enable_orden_referencia) { this.flag_view_ord = true }
    }
    if (this.tipo_user == 'int') {
      this.flag_view_ord = true
    }

    //this.fecha_desde=new Date(this.fecha_desde.setDate( this.fecha_hasta.getTime()-miliseg_dia))
    if (this.tipo_user == 'pat') {
      this.fecha_desde = new Date("1990-01-01").toISOString().split("T")[0]
    } else {
      this.fecha_desde = new Date(fecha_hoy.setDate(fecha_hoy.getDate() - dias)).toISOString().split("T")[0]
    }

    // this.presentLoading();
    this.usuario = this.varGlobal.getEntidad();

    //tipo de servidor
    this.tipo_server = this.configApp.apiBaseType;
    //DEFAULT PAGINACION
    this.paginacion = this.configApp.defaultPaginacion;
    console.log("usuario", this.usuario);
    console.log("var_usr", this.var_usr);
    setTimeout(() => {
      //this.getData();
      // this.getDataListAva()
    }, 100);
    //MODIFICO EL CSS DE LA SOMBRA CREADA POR IONIC
    this.cssToolTip();

  }

  async mouseEnter(ev, mensaje: string) {
    this.tooltip_btn = mensaje;


  }

  async mouseleave() {
    console.log("sale");
    //  await this.popoverController.dismiss();
  }

  ngOnInit() {
    console.log(window.innerWidth);
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
  abrirFiltro() {
    console.log("ABRIR FILTRO");
    this.filtro = this.filtro ? false : true;
  }

  cancelFiltroBusqueda(event) {
    // console.log(event);
    console.log("cancelo");
    this.digitosBusqueda = "";
    this.filterOrdenes();
    this.filtro = false;


  }


  async presentPopoverFiltro(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverFiltroPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    popover.onDidDismiss()
      .then((data) => {
        // console.log(data['data']);
        this.filtrarPeriodo(data['data']);

      });

    return await popover.present();
  }

  ordenarLista(data) {
    // console.log(data);
    if (data) {
      console.log(this.lista_filtrar);
      this.criterio_ordenamiento = data.criterio;

      this.tipo_ordenamiento = data.valor;
      if (data.valor == "fecha") {
        const format = 'yyyy-MM-dd';
        const myDate = new Date();
        const locale = 'en-US';
        this.lista_filtrar.sort((a, b) => formatDate(a.fec_upd, format, locale).localeCompare(formatDate(b.fec_upd, format, locale)));
      } else if (data.valor == "paciente") {
        this.lista_filtrar.sort((a, b) => a.nombre_completo.localeCompare(b.nombre_completo));
      } else if (data.valor == "doctor") {
        this.lista_filtrar.sort((a, b) => a.nombre_medico.localeCompare(b.nombre_medico));
      } else if (data.valor == "orden") {
        this.lista_filtrar.sort((a, b) => a.nro_ord - b.nro_ord);
      } else {
        //NO HACE ND o Refresca
      }
      if (data.criterio == "D") {
        this.lista_filtrar.reverse()
      }
      //vuelvo a paginar
      this.lista_filtrar = this.lista_filtrar.slice(0, this.paginacion);
    }
  }

  async filtrarPeriodo(periodo) {
    //console.log(periodo);
    if (periodo && periodo >= 0 && periodo != 99) {
      // this.infiniteScroll.disabled = true;
      const format = 'yyyy-MM-dd';
      const myDate = new Date();
      const locale = 'es-EC';
      myDate.setDate(myDate.getDate() - periodo)
      const DiaPeriodo = formatDate(myDate, format, locale);
      console.log(DiaPeriodo);
      //llamo los datos para refrescar la lista ordenes     
      await this.getDataSynchronous();
      console.log(this.lista_ordenes);
      //filtro
      this.lista_filtrar = await this.lista_ordenes.filter((item) => {
        return formatDate(item.fec_upd, format, locale) >= (DiaPeriodo)
        //return fecha==DiaActual
      });
      console.log(this.lista_ordenes);

      //igualo
      this.lista_ordenes = this.lista_filtrar;
      //DESPUES ORDENO
      this.ordenarLista({ criterio: this.criterio_ordenamiento, valor: this.tipo_ordenamiento });
      console.log(periodo);

    }

    //TODOS
    if (periodo && periodo == -1) {
      //  console.log("ESTA AQUI");      
      // this.lista_ordenes= await this.getDataSynchronous();
      await this.getDataSynchronous();
      this.infiniteScroll.disabled = false;
      this.lista_filtrar = this.lista_ordenes.slice(0, this.paginacion);
    }
    //PERSONALIZADO UTILIZO EL FLAG 99
    //TODOS
    if (periodo && periodo == 99) {
      this.openModalPeriodo();
    }
  }

  async presentModal(orden) {
    const modal = await this.modalCtrl.create({
      component: DetalleOrdenPage,
      cssClass: 'modal-detalle-orden',
      componentProps: {
        orden: orden
      }
    });
    return await modal.present();
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

  async filtroPersonalizado(data) {
    if (data && data.f_desde && data.f_hasta) {
      //this.infiniteScroll.disabled = true;
      const format = 'yyyy-MM-dd';
      const locale = 'es-EC';
      const f_desde = new Date(data.f_desde + " 00:01");
      const f_hasta = new Date(data.f_hasta + " 23:00");
      const f_desde_format = formatDate(f_desde, format, locale);
      const f_hasta_format = formatDate(f_hasta, format, locale);
      console.log(f_desde_format);
      console.log(f_hasta_format);


      //llamo los datos para refrescar la lista ordenes     
      await this.getDataSynchronous();
      console.log(this.lista_ordenes);

      this.lista_filtrar = this.lista_ordenes.filter((item) => {
        return formatDate(item.orden.fecha, format, locale) >= (f_desde_format) && formatDate(item.orden.fecha, format, locale) <= (f_hasta_format)
        //return fecha==DiaActual
      });
      this.lista_ordenes = this.lista_filtrar;
      //DESPUES ORDENO
      this.ordenarLista({ criterio: this.criterio_ordenamiento, valor: this.tipo_ordenamiento });


    }
  }

  getDataSynchronous() {
    let formData: any = new FormData();
    this.paginacion = this.configApp.defaultPaginacion;
    //  this.getDataListAva()
  }


  buscaxFiltro() {
    const nativeEl = this.accordionGroup;
    if (nativeEl.value === 'second') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'second';
    }
    this.getDataListAva()

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
    data.listo_imprime=1
    
    if (this.criterio_ordenamiento == 'D') {
      data.orderby= "DESC";
    } else {
      data.orderby= "ASC";
    }

    if(this.filtro_ref.cod!=null){
      data.id_ref=this.filtro_ref.cod
    }else{
      data.id_ref=""
    }
    if(this.filtro_med.cod!=null){
      data.cod_med=this.filtro_med.cod
    }else{
      data.cod_med=""
    }
    if(this.filtro_plan.cod!=null){
      data.id_plan=this.filtro_plan.cod
    }else{
      data.id_plan=""
    }

    if(this.filtro_sts.cod!=null){
      data.stsList=this.filtro_sts.cod
    }else{
      data.stsList=""
    }
    
      console.log(data);

      this.queryservice.getOrdenResultadosSB(data).then((r:any)=>{
        console.log(r);
        let result=r.data.getOrdentoResultadosDynamic

        for (let index = 0; index < result.length; index++) {
          let element = result[index];
          element.correos=[];


          if(element.mail_ref && element.mail_ref!=null && this.filtro_correos[0].checked){
            let correostemp=element.mail_ref.split(',');
            for (let index = 0; index < correostemp.length; index++) {
              const element_temp = correostemp[index];
              element.correos.push(element_temp)
            }
          }

          if(element.mail_med&& element.mail_med!=null && this.filtro_correos[1].checked){
            console.log('element.mail_med',element.mail_med);
          
            let correostemp=element.mail_med.split(',');
            for (let index = 0; index < correostemp.length; index++) {
              const element_temp = correostemp[index];
              element.correos.push(element_temp)
            }
          }


          if(element.mail_pac && element.mail_pac!=null && this.filtro_correos[2].checked){
            let correostemp=element.mail_pac.split(',');
            
            for (let index = 0; index < correostemp.length; index++) {
              const element_temp = correostemp[index];
              element.correos.push(element_temp)
            }
          }

          if(this.filtro_correos[3].checked && this.inputMailOtro!=''){
            element.correos.push(this.inputMailOtro)
          }
         // if(element.mail_pac) element.correos.push(element.mail_pac)
         // if(element.mail_med) element.correos.push(element.mail_med)
          element.text_correo=""
        }
  
        
  
        this.lista_ordenes = result;
        console.log('this.lista_ordenes',this.lista_ordenes);
        this.lista_filtrar=result;
        // this.lista_filtrar = result;
        /*
        if(this.filtro_med.cod==null &&this.filtro_ref.cod==null && this.filtro_plan.cod==null){
          this.lista_filtrar = result;
        }
  */
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

  modificaFecha(fecha) {
    return fecha.replace(" ", "T")
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

  //temporalFiltro
  filterOrdenes() {
    console.log(this.digitosBusqueda.toLowerCase());
    this.infiniteScroll.disabled
    this.lista_filtrar = this.lista_ordenes.filter((item) => {
      return item.fec_upd.toLowerCase().indexOf(this.digitosBusqueda.toLowerCase()) > -1 ||
        item.nombre.toLowerCase().indexOf(this.digitosBusqueda.toLowerCase()) > -1 ||
        item.apellido.toLowerCase().indexOf(this.digitosBusqueda.toLowerCase()) > -1 ||
        item.id_pac.toString().toLowerCase().indexOf(this.digitosBusqueda.toLowerCase()) > -1 ||
        item.nro_ord.toString().toLowerCase().indexOf(this.digitosBusqueda.toLowerCase()) > -1
        ;
    });

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


  cssToolTip() {
    document.querySelector("ion-toolbar")
      .shadowRoot
      .querySelector(".toolbar-container").setAttribute("style", "contain:initial;overflow:initial")
  }



  updateListPrint(ev, data) {
    if (data != null) {
      data.checked = !ev.detail.checked
    }
    else {
      console.log(this.checked_all, ev);
      this.checked_all = !ev.detail.checked
      this.lista_ordenes.forEach(element => {
        element.checked = this.checked_all
      });
    }
  }

/*
  async presentAlertSelect(tipo) {
    const modal = await this.modalCtrl.create({
      component: AlertSbloqueSelectPage,
      cssClass: 'alert_sbloque_select',
      componentProps: { value: 123 },
      backdropDismiss: false
    });

    modal.onDidDismiss()
      .then((data: any) => {
        let filtro_select
        console.log(data['data']);
        if (data['data']) {
          this.filtro_select = data['data'].filtro_select
          this.input_filtro = {}
          this.lista_filtrar = []
          this.lista_ordenes = []
        }

      });

    await modal.present();

  }
*/
  async presentAlertSendResults() {
    let message="Se enviaran solo ordenes que cuente con un correo."
    /*
    if(this.local_ip==""||this.local_ip==null){
      message+="<br><small>"+this.message_no_csService+"</small>"
    }
*/

    const alert = await this.alertController.create({
      header: 'Enviar Resultados',
      message: message,
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
          handler: () => {

            console.log('lista', this.lista_ordenes);
            console.log('this.lista_ordenes', JSON.stringify(this.lista_ordenes));
            let listado_enviar = []

            for (let index = 0; index < this.lista_ordenes.length; index++) {
              const element = this.lista_ordenes[index];
if(element.correos.length>0){
  //let flag_ip=(this.local_ip=='')?false:true;

  let detalle="(Envio en bloque) Enviado a: "+ element.correos.toString() ;
  let que = "MAIL"
  let donde = "Navegador: " + this.utilidades.getNavegador() + "; IP: " + this.varGlobal.getIPBrowser();
  let modify = "'" + this.sesion_usuario + "' as who_log, '" + que + "' as what_log, '" + donde + "' as where_log,'" + detalle + "' as why_log";
  console.log("MODIFY", modify);

              listado_enviar.push({
                nro_ord: element.nro_ord,
                correo: element.mail_ref,
                ip_send:this.local_ip,
                correos:element.correos,
                flag_ip:false,
                modify_audit:modify,
                user:this.sesion_usuario
              })
            }
          }
            console.log('listado_enviar',listado_enviar);
            
            if(listado_enviar.length==0){
              this.toastService.presentToast({message:"No existe ordenes con correos para enviar",position:"top",duration:1500,color:"warning"})
              return
            }

            this.webrestService.sendMassiveMails(listado_enviar).subscribe((r:any)=>{
              console.log('r',r);
              let data=r;
              if(data.status=='ok'){
                this.utilidades.alertOkMessage("Ha iniciado el servicio de envio de resultados de manera correcta");
                this.toastService.presentToast({message:data.message,color:'success',duration:1500,position:'top'})
              }

              if(data.status=='error'){
                this.toastService.presentToast({message:data.message,color:'warning',duration:1500,position:'top'})
              }
            },error=>{
              this.utilidades.alertErrorService("Send Result", error.status)
            })
            
          }
        }
      ]
    });

    await alert.present();
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
      
          if(data['data'].tipo=='med'){
            this.filtro_med= data['data'].data_select
          }
      
          if(data['data'].tipo=='plan'){
            this.filtro_plan= data['data'].data_select
          }

          if(data['data'].tipo=='uni'){
            this.filtro_uni= data['data'].data_select
          }

          if(data['data'].tipo=='sts'){
            this.filtro_sts= data['data'].data_select
          }
      

         // this.tipo_filtro:tipo
        //  this.input_filtro = data['data'].data_select
        //  this.lista_filtrar = []
        //  this.lista_ordenes = []
        }

      });
    await popover.present();
  }

  add_mail(data){
    console.log(data);
    if(data.text_correo==''){
      this.toastService.presentToast({message:"Escriba un correo en el campo",position:"top",color:"warning",duration:"1500"})
      return
    }
else{
  if(this.utilidades.isEmail(data.text_correo)){

      data.correos.push(data.text_correo);
      this.toastService.presentToast({message:"Correo añadido",position:"top",color:"success",duration:"1500"})
      data.text_correo=''
    return
  }else{
    this.toastService.presentToast({message:"Escriba un correo valido",position:"top",color:"warning",duration:"1500"})
      return
  }
}

  }

  delete_mail(item,index){
console.log(item,index);
item.splice(index,1)

  }

message_no_csService="No cuenta con el agente de notificaciones. Contacte con su administrador"
  
async presentAlertDownloadResults() {
//return;
    let fecha_d =new Date();
    let name_directory="avalab_results_"+fecha_d.getFullYear()+(fecha_d.getMonth()+1)+fecha_d.getDate()+fecha_d.getHours()+fecha_d.getMinutes()+fecha_d.getMilliseconds()

    let message="";
    let buttons=[]
    if(this.local_ip=='' || this.local_ip==''){
      message=this.message_no_csService;
      buttons=[{
        text: 'Entendido',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel: blah');
        }
      }]
    }
else{
  message="Esta seguro de descargar los resultados en su computador <br><small>Se descargaran en la carpeta de documentos en "+name_directory+ "</small>"
  buttons=[ {
    text: 'Cancel',
    role: 'cancel',
    cssClass: 'secondary',
    handler: () => {
      console.log('Confirm Cancel: blah');
    }
  }, {
    text: 'Aceptar',
    handler: () => {

      console.log('lista', this.lista_ordenes);
      console.log('this.lista_ordenes', JSON.stringify(this.lista_ordenes));
      let listado_enviar = []
     
      
      
  let detalle="(descarga en bloque) Resultados descargados";
  let que = "PRINT"
  let donde = "Navegador: " + this.utilidades.getNavegador() + "; IP: " + this.varGlobal.getIPBrowser();
  let modify = "'" + this.sesion_usuario + "' as who_log, '" + que + "' as what_log, '" + donde + "' as where_log,'" + detalle + "' as why_log";
  console.log("MODIFY", modify);
  

      for (let index = 0; index < this.lista_ordenes.length; index++) {
        const element = this.lista_ordenes[index];
        let d =new Date();
        //let nombre_pdf="result_"+element.nro_ord+d.getFullYear()+d.getMonth()+d.getDate()+d.getHours()+d.getMinutes()+d.getMilliseconds();
        let nombre_pdf=element.nro_ord+"_"+element.nombre_completo.trim()
        console.log('nombre_pdf',nombre_pdf);
        listado_enviar.push({
          nro_ord: element.nro_ord,
          name_pdf:nombre_pdf,
          name_directory:name_directory,
          modify_audit:modify,
          user:this.sesion_usuario
        })
    }
      console.log('listado_enviar',listado_enviar);
     ;
      this.webrestService.DownloadMassiveMails(listado_enviar).subscribe((r:any)=>{
        console.log('r',r);
        let data=r;
        if(data.status=='ok'){
          this.utilidades.alertOkMessage(data.message);
          //this.toastService.presentToast({message:data.message,color:'success',duration:1500,position:'top'})
        }

        if(data.status=='error'){
          this.toastService.presentToast({message:data.message,color:'warning',duration:1500,position:'top'})
        }
      },error=>{
        this.utilidades.alertErrorService("Send Result", error.status)
      })


    }
  }]
}

    const alert = await this.alertController.create({
      header: 'Descargar Resultados',
      message: message,
      buttons: buttons
    });

    await alert.present();
  }

  async presentAlertAftersendResults() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });
  
    await alert.present();
  }

/*
  //AUDITORIA
  async enviaAuditoria(accion, detalle) {
    let que = "";
    //let add_analisis = this.analisisSelect.toString();
    if (accion == "Impreso") {
      que = "PRINT"
    } else if (accion == "Descarga") {
      que = "PRINT"
    } else if (accion == "Email") {
      que = "MAIL"
    }

    //detalle = detalle 

    let donde = "Navegador: " + this.utilidades.getNavegador() + "; IP: " + this.varGlobal.getIPBrowser();
    let modify = "'" + this.sesion_usuario + "' as who_log, '" + que + "' as what_log, '" + donde + "' as where_log,'" + detalle + "' as why_log";
    console.log("MODIFY", modify);
    var formData: any = new FormData();
    formData.append("orden", this.orden.id_orden);
    formData.append("modify", modify);
    console.log(formData);
    let respuesta;
    this.webrestService.setAuditoria(formData).subscribe((resp) => {
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
  */

  changeMailFilter(item){
    console.log('item',item);
    if(item.code=='otro'|| !item.checked){
      this.inputMailOtro=""
    }
    item.checked = !item.checked;

    
  }
}


