import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonInfiniteScroll, LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertPeriodoFiltroPage } from 'src/app/modals/alert-periodo-filtro/alert-periodo-filtro.page';
import { DetalleOrdenPage } from 'src/app/modals/detalle-orden/detalle-orden.page';
import { DetallePedidoPage } from 'src/app/modals/detalle-pedido/detalle-pedido.page';
import { VisorQrPage } from 'src/app/modals/visor-qr/visor-qr.page';
import { PopoverFiltroPage } from 'src/app/popover/popover-filtro/popover-filtro.page';
import { PopoverOrdenPage } from 'src/app/popover/popover-orden/popover-orden.page';
import { BaseService } from 'src/app/servicios/base/base.service';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { PdfRenderService } from 'src/app/servicios/pdf/pdf-render.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { Utilidades } from 'src/app/utils/utilidades';

@Component({
  selector: 'app-lista-pedidos',
  templateUrl: './lista-pedidos.page.html',
  styleUrls: ['./lista-pedidos.page.scss'],
})
export class ListaPedidosPage implements OnInit {

  public formato_fecha = 'yyyy-MM-dd';
  public usuario;
  public var_usr;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public lista_pedidos;
  public mobile = false;
  public digitosBusqueda:String = "";
  public lista_filtrar;
  public lista_temporal;
  public criterio_ordenamiento = "D";
  public tipo_ordenamiento = "fecha";
  public paginacion = 10;
  public cargando = true;
  public filtro = false;
  public tooltip_btn = "";
  public tipo_server = 0;

  public fecha_comparar=new Date();

  f_desde;
  f_hasta;
  public dato_find:String="";
  infoText="";

  des_usr:any=""

  qr_link="";

  constructor(
    private serviciosBase: BaseService,
    public modalCtrl: ModalController,
    private varGlobal: VariablesGlobalesService,
    private serviciosPDF:PdfRenderService,
    public popoverController: PopoverController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public toastController: ToastController,
    public utilidades: Utilidades,
    private configApp: AppConfigService,
    private router: Router,
    private _translate: TranslateService,
    private queryservice: QueryService,
    private toastservice:ToastService) {


    this.var_usr = {};
    this.lista_pedidos = [];
    this.lista_filtrar = [];
    this.lista_temporal = [];
    //PONGO EL DEFAULT DEL FORMATO DE FECHA
    this.formato_fecha = this.configApp.formatoFecha;

    this.des_usr = this.varGlobal.getVarUsuarioDes();
    

    



  }

  ngOnInit() {
   

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

  ionViewWillEnter() {
 
    this.lista_pedidos = [];
    this.lista_filtrar = [];
    this.lista_temporal = [];

    let fecha_hoy=new Date;
    let dias=5;
    this.f_hasta=fecha_hoy.toISOString().split("T")[0];
    this.f_desde= new Date(fecha_hoy.setDate(fecha_hoy.getDate() - dias)).toISOString().split("T")[0]
    this.presentLoading();
    this.usuario = this.varGlobal.getEntidad();
    this.var_usr = this.varGlobal.getVarUsuario();

    this.qr_link=this.configApp.redirectWeb;
    //tipo de servidor
    this.tipo_server = this.configApp.apiBaseType;
    //DEFAULT PAGINACION
    this.paginacion = this.configApp.defaultPaginacion;
  //  console.log("usuario", this.usuario);
  
    setTimeout(() => {
    
      this.getData();
    }, 100);

  }


  

  getData() {
    //this.dataOrden.cod_med = this.varGlobal.getVarUsuario()
    //this.presentLoading();
    this.lista_pedidos = [];
    this.lista_filtrar = [];
    this.lista_temporal = [];
    this.infoText = "Cargando...";

    
    let data={codigo:this.varGlobal.getVarUsuario(), desde:this.f_desde,hasta:this.f_hasta+ " 24:00" ,texto:this.dato_find,tipo:this.varGlobal.getVarUsuarioTipo()}
    
   console.log('data',data);
   
    this.queryservice.getPedidosbyTipo({json_data:JSON.stringify({filter:data})}).then(async (result: any) => {
      console.log('resultpedido', result);
      
      if(result&&result.data){
        this.lista_pedidos = result.data.ListPedidosbyTipo
        ;
        console.log('resultdata',this.lista_pedidos);
       
     //   console.log(this.lista_pedidos);
        //para filtrar
        this.lista_filtrar=result.data.ListPedidosbyTipo
        this.lista_filtrar = this.lista_filtrar.slice(0, this.paginacion)
      }else{
        if(result.errors&&result.errors.length>0){
          this.utilidades.mostrarToast(result.errors[0].message)
        }else{
          this.utilidades.mostrarToast("OCURRIO UN PROBLEMA AL CARGAR PEDIDOS")
        }
      }
      this.infoText = ""
      setTimeout(async () => {
        
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

  buscaxFiltro() {
    
    if (this.dato_find.length > 3 || this.dato_find == '') {
      this.getData()
    }
    
  }


  validaFecha() {
    let fecha_hoy = new Date()
    let dias = 7
    let espera = 100
    
    if (this.f_desde == '') {
      espera = 150;
      setTimeout(() => {
        this.f_desde = new Date(fecha_hoy.setDate(fecha_hoy.getDate() - dias)).toISOString().split("T")[0]
      }, 100);
    }
    if (this.f_hasta == '') {
      espera = 150;
      setTimeout(() => {
        this.f_hasta = fecha_hoy.toISOString().split("T")[0]
      }, 100);
    }
    setTimeout(() => {
      
      this.getData()
    }, espera);

  }

  //temporalFiltro
  filterOrdenes() {
    console.log(this.digitosBusqueda);
    console.log(this.digitosBusqueda.toLowerCase());
    this.infiniteScroll.disabled
    this.lista_filtrar = this.lista_pedidos.filter((item) => {
      return item.fec_ord.toLowerCase().indexOf(this.digitosBusqueda.toLowerCase()) > -1 ||
      item.Paciente.nom_pac.toLowerCase().indexOf(this.digitosBusqueda.toLowerCase()) > -1 ||
      item.Paciente.ape_pac.toLowerCase().indexOf(this.digitosBusqueda.toLowerCase()) > -1 ||
      item.Paciente.nombre_completo.toLowerCase().indexOf(this.digitosBusqueda.toLowerCase()) > -1 ||
      item.Paciente.id_pac.toLowerCase().indexOf(this.digitosBusqueda.toLowerCase()) > -1 ||
        item.id_pedidos.toString().toLowerCase().indexOf(this.digitosBusqueda.toLowerCase()) > -1
        ;
    });
    //no hay como paginar a penas que use un temporal
    //vuelvo a paginar
    //this.lista_filtrar = this.lista_filtrar.slice(0, this.paginacion);

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
         console.log(data['data']);
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
        criterio: this.criterio_ordenamiento,
        tipo:'pedido'
      }
    });
    popover.onDidDismiss()
      .then((data) => {
        // console.log(data['data']);
        this.ordenarLista(data['data']);
      });
    return await popover.present();
  }
  ordenarLista(data) {
    // console.log(data);
    if (data) {
      this.criterio_ordenamiento = data.criterio;
      this.tipo_ordenamiento = data.valor;
      if (data.valor == "fecha") {
        const format = 'yyyy-MM-dd';
        const myDate = new Date();
        const locale = 'en-US';

        this.lista_filtrar.sort((a, b) => formatDate(a.fec_ord, format, locale).localeCompare(formatDate(b.fec_ord, format, locale)));
      } else if (data.valor == "paciente") {
        this.lista_filtrar.sort((a, b) => a.Paciente.nombre_completo.localeCompare(b.Paciente.nombre_completo));
      } else if (data.valor == "orden") {
        this.lista_filtrar.sort((a, b) => a.id_pedidos - b.id_pedidos);
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
      //ESTO SIRVE PARA CUANDO SE DESEA CARGAR NUEVAMENTE DATOS NUEVOS  
      this.presentLoading()
      this.lista_pedidos = await this.getDataSynchronous();
      this.loadingController.dismiss()
      this.lista_pedidos=this.lista_pedidos.data.ListPedidosbyMed
      
      console.log(this.lista_pedidos);
      //filtro
      this.lista_filtrar = await this.lista_pedidos.filter((item) => {
        return formatDate(item.fec_ord, format, locale) >= (DiaPeriodo)
        //return fecha==DiaActual
      });
      console.log(this.lista_pedidos);

      //igualo 
      //ESTO SIRVE PARA CUANDO SE DESEA CARGAR NUEVAMENTE DATOS NUEVOS  
      this.lista_pedidos = this.lista_filtrar;
      //DESPUES ORDENO
      this.ordenarLista({ criterio: this.criterio_ordenamiento, valor: this.tipo_ordenamiento });
      console.log(periodo);

    }

    //TODOS
    if (periodo && periodo == -1) {
      //  console.log("ESTA AQUI");      
      this.lista_pedidos = await this.getDataSynchronous();
      this.lista_pedidos=this.lista_pedidos.data.ListPedidosbyMed
      this.infiniteScroll.disabled = false;
      this.lista_filtrar = this.lista_pedidos.slice(0, this.paginacion);
    }
    //PERSONALIZADO UTILIZO EL FLAG 99
    //TODOS
    if (periodo && periodo == 99) {
      this.openModalPeriodo();
    }
  }

  async openModalPeriodo() {
    const modal = await this.modalCtrl.create({
      component: AlertPeriodoFiltroPage,
      cssClass: 'modal-alert',

    });

    modal.onDidDismiss()
      .then((data) => {

        console.log(data['data']);
        // this.filtrarPeriodo(data['data']);
        this.filtroPersonalizado(data['data']);
      });

    return await modal.present();
  }

  async openModalQR(uuid) {
    //TOCA MODIFICAR EN CASO DE EXISTIR UN DOMINIO
    let url=this.configApp.redirectWeb+"#/resultado-pedido?uid="+uuid
    const modal = await this.modalCtrl.create({
      component: VisorQrPage,
      componentProps: {
        url: url
      }

    });

    modal.onDidDismiss()
      .then((data) => {
        console.log(data['data']);
        // this.filtrarPeriodo(data['data']);
        // this.filtroPersonalizado(data['data']);
      });

    return await modal.present();
  }

  async filtroPersonalizado(data) {
    if (data && data.f_desde && data.f_hasta) {
      this.validaFecha();
      //this.infiniteScroll.disabled = true;
      this.ordenarLista({ criterio: this.criterio_ordenamiento, valor: this.tipo_ordenamiento });


    }
  }

  getDataSynchronous() {
    let formData: any = new FormData();
    formData.append("tipo_usr", this.usuario.tipo);
    formData.append("cod", this.usuario.codigo);
    this.paginacion = this.configApp.defaultPaginacion;
   return this.queryservice.getPedidosbyMed(this.varGlobal.getVarUsuario())
  }


  cancelFiltroBusqueda(event) {
    // console.log(event);
    console.log("cancelo");
    this.digitosBusqueda = "";
     this.filterOrdenes();
    this.filtro = false;


  }

  doInfinite(event) {
    if (this.lista_filtrar.length != this.lista_pedidos.length && this.digitosBusqueda.length == 0) {
      this.cargando = false;
      let inicio_paginacion = this.paginacion;
      this.paginacion += this.paginacion
      setTimeout(() => {
        this.infiniteScroll.complete();
        this.lista_filtrar.push(...this.lista_pedidos.slice(inicio_paginacion, this.paginacion));

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

  abrirFiltro() {
    console.log("ABRIR FILTRO");
    this.filtro = true;
  }


  async presentModal(pedido) {
    const modal = await this.modalCtrl.create({
      component: DetallePedidoPage,
      cssClass: 'modal-detalle-orden',
      componentProps: {
        pedido: pedido
      }
    });
    return await modal.present();
  }

  openPDF(orden) {
    this.presentLoading();
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

  go_ingresar_duplicado(data){
    //console.log(data);
    this.varGlobal.setPedido_d(data);
    //sessionStorage.setItem('orden_duplicar',JSON.stringify(data));
    this.router.navigateByUrl("/home-medico/ingreso-pedido",{replaceUrl:true})
  }

  Anular_Pedido(data){
    console.log('data',data);
    
    
    
    this.serviciosBase.getAnularTurno({orden:{id_pedido:data.uuid_pedido}}).toPromise().then((result:any)=>{
      console.log('result',result);
      let respuesta=result.response;
      if(respuesta.code==1){
        this.queryservice.anularPedido(JSON.stringify({id_pedidos:data.id_pedidos})).then((r:any)=>{
          console.log('result',r);
          
          if(r.data.PedidoAnular.resultado=='ok'){
            data.anular_pedido=1;
            this.toastservice.presentToast({message:"Pedido anulado correctamente",position:"top",color:"success"})
          }
        })
      return
      }
      if(respuesta.code==-1){
        this.toastservice.presentToast({message:"A ocurrido un error: "+respuesta.error,position:"top",color:"warning"})
        return
      }
      if(respuesta.code==-2){
        this.toastservice.presentToast({message:"No se puede anular ya que se ha ocupado y asignado una orden real"+respuesta.error,position:"top",color:"warning"})
        return
      }
    })
    

    
  }

  checkAnular(orden){
    let fecha_base=new Date();
    
    let fecha_orden= new Date(orden.fec_ord);
    
    
    fecha_orden.setHours((fecha_orden.getHours()+12));

    if(fecha_orden>=fecha_base){
      return true
    }
    else{ return false}
  }

  async presentAlertAnular(data) {
    console.log('data_anular',data);
    console.log(JSON.stringify({uuid_anular:data.uuid_pedido}))
    
    const alert = await this.alertController.create({
      header: '¿Desea anular este pedido?',
      message: '',
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
           
            this.Anular_Pedido(data);
          }
        }
      ]
    });
  
    await alert.present();
  }
}
