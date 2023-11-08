import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { PdfPreviewResultPage } from 'src/app/modals/pdf-preview-result/pdf-preview-result.page';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { PdfRenderService } from 'src/app/servicios/pdf/pdf-render.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';

@Component({
  selector: 'app-lista-orden-web',
  templateUrl: './lista-orden-web.page.html',
  styleUrls: ['./lista-orden-web.page.scss'],
})
export class ListaOrdenWebPage implements OnInit {
  des_usr:any;
  tipo_user:any;
  var_usr:any;

  fecha_desde
  fecha_hasta
  list_ord:any;

  constructor(
  private varGlobal:VariablesGlobalesService,
  private queryservices: QueryService,
  private alertController:AlertController,
  private serviciosPDF:PdfRenderService,
  private modalController:ModalController
  ) { }

  ngOnInit() {
   
    
  }

  ionViewWillEnter(){   
    this.des_usr = this.varGlobal.getVarUsuarioDes();
    this.var_usr = this.varGlobal.getVarUsuario()//ESTE ES L CODIGO
    this.tipo_user = this.varGlobal.getVarUsuarioTipo();
    let fecha_hoy = new Date()
    
    this.fecha_hasta = fecha_hoy.toISOString().split("T")[0]
    let dias = 7
    this.fecha_desde = new Date(fecha_hoy.setDate(fecha_hoy.getDate() - dias)).toISOString().split("T")[0]
  
  }

  getDataOrder(){
    let data_send=
    {
      cod_user:this.var_usr,
      type_user:this.tipo_user, 
      fdesde:this.fecha_desde, 
      fhasta:this.fecha_hasta,
      dato:''
  }
  console.log('data_send',data_send);
  
    this.queryservices.getListOrdersWeb(data_send).then((r:any)=>{
console.log("r",r);
      let data=r.data.getOrdersWebbyFiltro
      this.list_ord=data
      this.list_ord.forEach(element => {
        let analisis_list=""
          this.queryservices.getAnalisisxOrden({nro_ord:element.nro_ord}).then((r_analisis:any)=>{
            console.log('r_analisis',r_analisis);
            let data_analisis=r_analisis.data.searchAnalisisxOrden;
            for (let index = 0; index < data_analisis.length; index++) {
              const elementd = data_analisis[index];
              analisis_list+=elementd.des_ana+"\t "
            }
            element.analisis_list=analisis_list
            element.analisis=data_analisis
            
          })
      });
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
      this.getDataOrder()
    }, espera);

  }

  async presentAlertAnalisis( data) {
    let mensaje="";
    data.forEach(element => {
      mensaje+='<small>'+element.des_ana+'</small><br>'
      
    });
    const alert = await this.alertController.create({
      



      header: 'Análisis de Orden',
      message: mensaje,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  mostrarPdf(){
console.log('data',);
//this.presentLoading();
// orden.empresa.nombrePdf="femedic";
// PREPARO LOS VALORES

let valores_enviar = {
  "orden": {
    fecha_desde:this.fecha_desde,
    fecha_hasta:this.fecha_hasta,
    tipo_user:this.tipo_user,
    des_user:this.des_usr,
    listado:this.list_ord
  }
}
console.log(JSON.stringify(valores_enviar.orden));

console.log(valores_enviar);

//ENVIO AL SERVICIO
let respuesta;
this.serviciosPDF.getPDFOrdenWeb(valores_enviar).subscribe(resp => {
  //CIERRO EL LOADING
  setTimeout(() => {
    //this.loadingController.dismiss();
  }, 500);
  console.log(resp);
  
  respuesta = resp;
  
  if (respuesta.estado == 0) {
    //CREO EL PDF
    let pdfWindow = window.open("");
    pdfWindow.document.write(
      "<iframe title='Orden web' width='100%' height='100%' src='data:application/pdf;base64, " +
      encodeURI(respuesta.data) + "'></iframe>"
    );
    pdfWindow.document.title = 'Orden web';
  } else {
 //   this.utilidades.mostrarToast(respuesta.description)
  }

}, error => {
  setTimeout(() => {
 //   this.loadingController.dismiss();
  }, 500);
  console.error(error);
// this.utilidades.mostrarToast("Problema datos " + error.status);

});
//  window.open("https://resultados.gamma.com.ec:8443/gamma/webresources/eReport/pdf?orden=712418&paciente=227064&token=2048", "_blank")


  }

}
