import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonInfiniteScroll, LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { DetalleOrdenPage } from '../../modals/detalle-orden/detalle-orden.page';
import { PopoverFiltroPage } from '../../popover/popover-filtro/popover-filtro.page';
import { PopoverUsrPage } from '../../popover/popover-usr/popover-usr.page';
import { WebRestService } from '../../servicios/intranet/web-rest.service';
import { formatDate } from "@angular/common";
import { PopoverOrdenPage } from '../../popover/popover-orden/popover-orden.page';
import { AlertPeriodoFiltroPage } from '../../modals/alert-periodo-filtro/alert-periodo-filtro.page';
import { FuncionesComunes } from '../../utils/funciones-comunes';
import { AppConfigService } from '../../utils/app-config-service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { BaseService } from 'src/app/servicios/base/base.service';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { FuncionesComunesIntra } from 'src/app/utils/funciones-comunes-intra';
import { PdfPreviewResultPage } from 'src/app/modals/pdf-preview-result/pdf-preview-result.page';
import { FacturasPage } from 'src/app/modals/facturas/facturas.page';
import { Utilidades } from 'src/app/utils/utilidades';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-lista-orden',
  templateUrl: './lista-orden.page.html',
  styleUrls: ['./lista-orden.page.scss'],
})
export class ListaOrdenPage implements OnInit {
  @ViewChild('filterOrden') filterInput: ElementRef;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public formato_fecha = 'yyyy-MM-dd';
  public usuario;
  public var_usr;
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
  public flag_view_ord=false;

  fecha_desde
  fecha_hasta
  dato_find = ""
  inicio_paginacion = 0
  order_by = ""
  infoText = ""
  constructor(
    public modalCtrl: ModalController,
    private varGlobal: VariablesGlobalesService,
    private servicios: BaseService,
    private serviciosIntra: WebRestService,
    public popoverController: PopoverController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public toastController: ToastController,
    public funcionesComunes: FuncionesComunes,
    public utilidades: Utilidades,
    public funcionesComunesIntra: FuncionesComunesIntra,
    private configApp: AppConfigService,
    private router: Router,
    private _translate: TranslateService,
    private queryservice: QueryService
  ) {
    this.usuario = {};
    this.var_usr = {};
    this.lista_ordenes = [];
    this.lista_filtrar = [];
    this.lista_temporal = [];

    //PONGO EL DEFAULT DEL FORMATO DE FECHA
    this.formato_fecha = this.configApp.formatoFecha;
    this.ativa_progress = this.configApp.progressPDF;//si esta activado buscara el prgress para dejarle imprimir
    if (this.configApp.formatoRefPDF) {
      this.formato_pdf_ref = this.configApp.formatoRefPDF//si tiene un valor voy a coger este valor y activar el boton
    }

  }
  ionViewWillEnter() {
    let fecha_hoy = new Date()
    this.fecha_hasta = fecha_hoy.toISOString().split("T")[0]
    let dias = 7

    this.des_usr = this.varGlobal.getVarUsuarioDes();
    this.var_usr = this.varGlobal.getVarUsuario()//ESTE ES L CODIGO
    this.tipo_user = this.varGlobal.getVarUsuarioTipo();
    
    if(this.tipo_user=='ref'){
      if(this.configApp.enable_orden_referencia)
      {this.flag_view_ord=true}
    }
    if(this.tipo_user=='int'){
      this.flag_view_ord=true
    }

    //this.fecha_desde=new Date(this.fecha_desde.setDate( this.fecha_hasta.getTime()-miliseg_dia))
    if (this.tipo_user=='pat') {
      this.fecha_desde = new Date("1990-01-01").toISOString().split("T")[0]
    } else {
      this.fecha_desde = new Date(fecha_hoy.setDate(fecha_hoy.getDate() - dias)).toISOString().split("T")[0]
    }

    this.presentLoading();
    this.usuario = this.varGlobal.getEntidad();

    //tipo de servidor
    this.tipo_server = this.configApp.apiBaseType;
    //DEFAULT PAGINACION
    this.paginacion = this.configApp.defaultPaginacion;
    console.log("usuario", this.usuario);
    console.log("var_usr", this.var_usr);
    setTimeout(() => {
      //this.getData();
      this.getDataListAva()
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

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverUsrPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps: {
        usuario: this.usuario
      }
    });
    return await popover.present();
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

  async presentPopoverOrden(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverOrdenPage,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true,
      componentProps: {
        criterio: this.criterio_ordenamiento
      }
    });
    popover.onDidDismiss()
      .then((data) => {
        // console.log(data['data']);
        if (data['data'] && data['data'].valor == 'ordena') {
          this.criterio_ordenamiento = data['data'].criterio;
          this.getDataListAva()
        } else
          this.ordenarLista(data['data']);
      });
    return await popover.present();
  }
  moda
  async presentPopoverFacturas(data) {

    var formData: any = new FormData();
    formData.append("orden", data.nro_ord);
    let facturas;
    this.servicios.getListFacturas(formData).toPromise().then(async (r) => {
      console.log('r', r);
      facturas = r
      if (facturas.length > 0) {
        const modal = await this.modalCtrl.create({
          component: FacturasPage,
          //   cssClass: 'my-custom-class',
          //    event: ev,
          componentProps: {
            facturas: facturas,
            orden: data.nro_ord
          }
        });
        modal.onDidDismiss()
          .then((data) => {
          });
        return await modal.present();

      } else {
        this.presentToast("No contiene Facturas")
      }
    }, error => {
      this.utilidades.alertErrorService("get-list-fact", error.status)
    })
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
    //ASC
    //   this.lista_filtrar.sort((a,b) => a.orden.paciente.nombres.localeCompare( b.orden.paciente.nombres));
    //DES
    // this.lista_filtrar.sort((a, b) => b.orden.paciente.nombres.localeCompare(a.orden.paciente.nombres));
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
      this.getDataListAva()



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
    // formData.append("tipo_usr", this.usuario.tipo);
    // formData.append("cod", this.usuario.codigo);
    this.paginacion = this.configApp.defaultPaginacion;
    /*
  
      this.queryservice.getOrdenResultados({ codigo: this.var_usr, tipo: this.tipo_user }).then((result: any) => {
        console.log('Resultado', result);
        this.lista_ordenes = result.data.OrdenResultadosbyparam;
        return
      })
    */
    this.getDataListAva()
    //return this.servicios.getListaResultados(formData).toPromise();   
  }

  getData() {
    var formData: any = new FormData();
    formData.append("tipo_usr", this.usuario);
    formData.append("cod", this.var_usr);
    console.log(this.var_usr);
    console.log(this.tipo_user);
    console.log(formData, 'formData');

    // formData.append("usuario", this.usuario.usuario);
    // formData.append("pwd", this.usuario.clave);

    this.queryservice.getOrdenResultados({ codigo: this.var_usr, tipo: this.tipo_user }).then((result: any) => {
      console.log(result);

      this.lista_ordenes = result.data.OrdenResultadosbyparam;
      this.lista_filtrar = result.data.OrdenResultadosbyparam;
      this.lista_filtrar = this.lista_filtrar.slice(0, this.paginacion)
      //quitar para la version 3.2
      /*
      this.lista_filtrar.forEach(e => {
        e.listo=1
      });
      this.lista_ordenes.forEach(e => {
        e.listo=1
      });
*/
      this.loadingController.dismiss();
    }, error => {
      console.log(error);

      this.loadingController.dismiss();
    })

    /*
    
        this.servicios.getListaResultados(formData).subscribe(resp => {
          this.loadingController.dismiss();
          console.log(resp);
          this.lista_ordenes = resp;
          this.lista_filtrar = resp;
          this.lista_filtrar = this.lista_filtrar.slice(0, this.paginacion)
        }, error => {
          console.error(error);
          //ACCESO DENEGADO TAL VES POR EL TOKEN
          if(error.status==403){
            sessionStorage.clear();
            this.router.navigate(["/login"]);
          }else{
            this.presentAlert("Error de datos", "Favor contactarse con soporte.\n<br><small>Cod: " + error.status + "<small>")
          }
    
          
          this.loadingController.dismiss();
          //sessionStorage.clear()
    
    
        })
        */
  }
  buscaxFiltro() {
    if (this.dato_find.length > 3 || this.dato_find == '') {
      this.getDataListAva()
    }
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
      this.getDataListAva()
    }, espera);

  }
  async getDataListAva() {
    //this.presentLoading()
    this.infoText = "Cargando..."
    var formData: any = new FormData();
    //tiene que tener 3 caracteres para buscar
    //requisito ing
    if (this.dato_find != "" && this.dato_find.length > 3) {
      formData.append("dato", this.dato_find);
    } else {
      formData.append("dato", "");
    }

    console.log(this.fecha_desde);
    formData.append("codigo", this.var_usr);
    formData.append("tipo", this.tipo_user);
    formData.append("desde", this.fecha_desde);
    formData.append("hasta", this.fecha_hasta);
    formData.append("inicio", this.inicio_paginacion);
    if (this.criterio_ordenamiento == 'D') {
      formData.append("orderby", "DESC");
    } else {
      formData.append("orderby", "ASC");
    }

    // formData.append("usuario", this.usuario.usuario);
    // formData.append("pwd", this.usuario.clave);

    this.servicios.getListOrders(formData).subscribe(async (result: any) => {
      console.log(result);

      this.lista_ordenes = result;
      this.lista_filtrar = result;
      this.lista_filtrar = this.lista_filtrar.slice(0, this.configApp.defaultPaginacion)
      //quitar para la version 3.2
      /*
      this.lista_filtrar.forEach(e => {
        e.listo=1
      });
      this.lista_ordenes.forEach(e => {
        e.listo=1
      });
*/
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

  enviaMail(idOrden) {
    //aqui devia validar si es mongo o el del intranet
    console.log("idOrden", idOrden);

    this.funcionesComunesIntra.enviarMailIntra(this.tipo_user + "-" + this.var_usr, idOrden, 0, "")
  }

  async cargarDatosPaciente(orden, formato = "") {
    if (this.tipo_user == 'int') {
      this.router.navigateByUrl("pdf-preview?param1=" + orden);
      return;
    }
    var formData: any = new FormData();
    formData.append("orden", orden);
    //formData.append("orden", this.orden.id_orden);
    let datosPaciente;
    await this.serviciosIntra.getDatosPacienteIntra(formData).toPromise().then(async (resp) => {
      console.log("DATOS PACIENTE", resp);
      if (resp || resp[0]) {
        datosPaciente = resp[0];
        //this.datosPaciente.saldo=99

        if (datosPaciente.incomplete > 0 && datosPaciente.progress > 0) {
          this.presentAlertIncompleto(datosPaciente.pendientes, orden,formato);//aqui vielvo a hacer la cargaPDF
        } else {
          this.cargaPDF(orden, formato);
        }
      }

    }, error => {
      console.log("ERROR EN DATOS DE PACIENTE");
      console.error(error);
      this.utilidades.alertErrorService("datos-paciente", error.status)
    })
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

      /*
      if (this.mobile||this.funcionesComunes.getNavegador() == "Safari") {
        this.presentModalPDF(pdf, idOrden)
        return;
      }

      let blob = new Blob([new Uint8Array(pdf)], { type: "application/pdf" }); 
      var win = window.open('', '_blank');
      const exportUrl = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      this.funcionesComunesIntra.enviaAuditoria("WEB",idOrden,"PRINT","REVISADO POR "+this.tipo_user+ "-" + this.var_usr)      
      if (this.funcionesComunes.getNavegador() == "Safari") {
        //alert(this.funcionesComunes.getNavegador())
        // this.guardarPDF(blob,idOrden);

      } else {
        var fileURL = URL.createObjectURL(blob);
      //window.open(fileURL,"_blank");
       win.location=fileURL
      }
      */

    },error=>{
      console.error("ERROR DEL METODO",error);
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

  //desscarga pdf
  async guardarPDF(archivo: Blob, orden) {
    //si no existe orden saco
    // const blob = new Blob([new Uint8Array(this.pdf64)], { type: "application/pdf" });
    //const exportUrl = URL.createObjectURL(blob);
    saveAs(archivo, "orden_" + orden + ".pdf");
    //tengo q volver a generar otro por el codigo qrx
  }

  doInfinite(event) {
    if (this.lista_filtrar.length != this.lista_ordenes.length && this.digitosBusqueda.length == 0) {
      this.cargando = false;
      let inicio_paginacion = this.paginacion;
      this.paginacion += this.configApp.defaultPaginacion
      setTimeout(() => {
        this.infiniteScroll.complete();
        this.lista_filtrar.push(...this.lista_ordenes.slice(inicio_paginacion, this.paginacion));

        //Al ordenar la lista se esta posicionando al final del scroll

        /*setTimeout(() => {
            this.ordenarLista({ criterio: this.criterio_ordenamiento, valor: this.tipo_ordenamiento });
        }, 1000);
     
        */
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
    //no hay como paginar a penas que use un temporal
    //vuelvo a paginar
    //this.lista_filtrar = this.lista_filtrar.slice(0, this.paginacion);

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

  async presentAlert(titulo, mensaje) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }


  async presentAlertIncompleto(pendientes, orden,formato="") {


    let mensaje = "";
    let botones = [{
      text: 'OK',
      role: "cancel",
      cssClass: 'cancel-button-alert',
      handler: () => {
        this.cargaPDF(orden,formato);
        
      }
    }]

    mensaje = "Análisis sin validar </br><div class='a_pend'><pre>" + pendientes + "</pre></div>"

    const confirm = await this.alertController.create({
      cssClass: 'mensajes-pendientes',
      header: "INFORME PARCIAL",
      message: mensaje,
      backdropDismiss: true,
      buttons: botones
    });

    //await alert.present();

    await confirm.present();


  }


  cssToolTip() {
    document.querySelector("ion-toolbar")
      .shadowRoot
      .querySelector(".toolbar-container").setAttribute("style", "contain:initial;overflow:initial")
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: "top",

    });
    toast.present();
  }
  openChartPac(orden){  
    this.router.navigate(['/charts-paciente'], { queryParams: { cod_pac: orden.cod_pac,nombre:orden.nombre_completo }, queryParamsHandling: 'merge' });
  }


    view_Orden(orden){
      
    this.varGlobal.setOrden_view(orden);
   
    if(this.tipo_user=='ref'){
      this.router.navigateByUrl("/home-medico/ingreso-orden",{replaceUrl:true})
    }
    
    if(this.tipo_user=='int'){
      this.router.navigateByUrl("/home-intranet/ingreso-orden",{replaceUrl:true})
    }
  }
}

