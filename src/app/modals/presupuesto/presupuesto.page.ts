import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { HelperService } from 'src/app/servicios/helpers/helper.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { AnalisisPage } from '../analisis/analisis.page';
import { PdfRenderService } from 'src/app/servicios/pdf/pdf-render.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { Utilidades } from 'src/app/utils/utilidades';

const formatter = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.page.html',
  styleUrls: ['./presupuesto.page.scss'],
})
export class PresupuestoPage implements OnInit {
  AnalisisListDemo:any=[];
  AnalisisList: any = [];
  analisis: any = {};


  planList: any;
  cod_ana_input: any = '';
  plan_selected: any=[];
  descuento_selected: any;
  porcentaje_descuento: number = 0;

  precio_total: any;

  fecha_demora: Date = new Date();
  //fecha_demora: any;
  fecha_label: any = "";

  hidden_total: boolean = true;

  precio_normal: number = 0;
  precio_seguro: number = 0;
  precio_ahora: number = 0;
  precio_descuento: number = 0;
  precio_totalplandscto: number = 0;


  flag_descuento: string = "dscto"
  
  constructor(
    private modalController: ModalController,
    private queryservice: QueryService,
    private helperservice: HelperService,
    private toastservice: ToastService,
    private router: Router,
    private serviciosPDF:PdfRenderService,
    private loadingService:LoadingService,
    public utilidades: Utilidades,

  ) { }


  ngOnInit() {
    this.fecha_label = (formatter.format(this.fecha_demora));

    // this.analisis.ss="ss";
    console.table('analisisp',this.analisis);
      this.getListSeguro();
   }

  async presentModalListAnalisis() {
    const modal = await this.modalController.create({
      component: AnalisisPage,
      backdropDismiss: false,
      componentProps: {
        listaTemporal: this.AnalisisList
      },
    });

    modal.onDidDismiss()
      .then((result) => {
        console.log('resiñ', result);
        if (result.data.analisisAgregados) {
          let data = result.data.analisisAgregados
          console.log('data modla', data);

          data.forEach(element => {
            console.log('elementmodal', element);

            this.cod_ana_input = element.cod_ana
            console.log('elementmodal', this.cod_ana_input);
            //this.getAnalisis();
            this.AnalisisList.push(element);
            this.updatePreciosbyPlan('todo', '');
            this.calcularDemora()
            this.cod_ana_input = ""
          });
        }

        /*
        if (result.data.cod_med) {
          this.cod_med = result.data.cod_med
          this.getMedico();
  
  
  
        };*/
      });

    await modal.present();


  }
    getListSeguro() {
    let data;
    this.queryservice.getListPlanes().then((result: any) => {
      console.log('ee', result);
      this.planList = result.data.ListSeguro;

      this.plan_selected = this.planList[0].Plan[0];
      console.log('plan', this.planList);


    },error=>{
      if(error.message){
        this.toastservice.presentToast({ message: 'Ocurrio un error <br>'+error.message, color: 'warning', position: 'bottom' })
         }
         else {
          this.toastservice.presentToast({ message: 'Ocurrio un error <br>'+error, color: 'warning', position: 'bottom' })
         } console.log('error', error);
    
    })

  }

  getAnalisis() {
    console.log('this.plan_selected',this.plan_selected);
    
    let flag_repetido = false;
    if (this.plan_selected.length > 0) {
      this.toastservice.presentToast({ message: "Seleccione un Plan de precios", position: "top", color: "warning" });
      return
    }

    if (this.cod_ana_input === '') {
      this.toastservice.presentToast({ message: "Ingrese un código de análisis", position: "top", color: "warning" });
      return
    }

    this.AnalisisList.forEach(element => {
      if (element.cod_ana === this.cod_ana_input) {
        flag_repetido = true;

      }
    });
    if (flag_repetido) {
      this.toastservice.presentToast({ message: "Analisis ya ingresado", position: "top", color: "warning" });
      return
    }



    this.queryservice.getAnalisisbyCod(this.cod_ana_input).then((result: any) => {
      if (result.data.AnalisisMstrsbyCod.length > 0) {
        this.analisis = {};
        this.analisis = JSON.parse(JSON.stringify(result.data.AnalisisMstrsbyCod[0]));

        this.cod_ana_input = '';


        setTimeout(() => {
          console.log('antes del plan', this.analisis);
          this.AnalisisList.push(this.analisis);
          this.updatePreciosbyPlan('todo', '');
          this.calcularDemora()


        }, 100);



      } else {
        this.toastservice.presentToast({ message: 'No se encontro resultados', position: "top", color: "warning" })
        return
      }

    },error=>{
      if(error.message){
        this.toastservice.presentToast({ message: 'Ocurrio un error <br>'+error.message, color: 'warning', position: 'bottom' })
         }
         else {
          this.toastservice.presentToast({ message: 'Ocurrio un error <br>'+error, color: 'warning', position: 'bottom' })
         } console.log('error', error);
    
    })
  }
  calcularDemora() {
    if (this.AnalisisList.length > 0) {
      this.hidden_total = false;
      this.AnalisisList.forEach(element => {
        let fecha_demora_temp = this.helperservice.calcDemora(element.demora, element.dias_proceso);
        console.log("fecha_demora_temp",fecha_demora_temp);
        console.log("fecha_demora",this.fecha_demora);
        
        if (fecha_demora_temp > this.fecha_demora) {
          console.log("entre if");
          
          this.fecha_demora = fecha_demora_temp;
        }

        formatter.format(this.fecha_demora)
        this.fecha_label = formatter.format(this.fecha_demora)
      });
    }
    else {
      this.hidden_total = true
    }

  }
  updatePreciosbyPlan(tipo, data) {

    //   console.log('updateplan', this.planSelected);
    let plan = this.plan_selected;
    //let plan = "1";
    if (Number.isNaN(this.porcentaje_descuento)) {
      this.porcentaje_descuento = 0
    }
    console.log('this.porcentaje_descuento', this.porcentaje_descuento);

    if (tipo == 'todo') {
      console.log('precios plan todo');

      this.AnalisisList.forEach((element, index) => {
        console.log('index', index);

        let data_p = this.queryservice.getPrecios(element.cod_ana, plan.cod_lpr);
        data_p.then((result: any) => {
console.log("result",result.data.PreciosbySeguro);

          if ( result.data.PreciosbySeguro==null ||result.data.PreciosbySeguro.pre_ana == null ) {
            console.log("entre if no precio");
            
            this.toastservice.presentToast({ message: "El analisis no cuenta con precio", position: "top", color: "warning" });
            this.eliminar_analisis(index)
            return
          }


          let data = result.data.PreciosbySeguro;
          let porcentaje = 0.00;
          if (plan.por_seg == 0 && data.por_seg == '0.00') {
            porcentaje = 0;
          }
          else if (plan.por_seg > 0) {
            porcentaje = plan.por_seg
          } else {
            porcentaje = data.por_seg
          }

          let pospago: any = this.helperservice.toFixed((data.pre_ana * porcentaje), 2)
          element.subtotal = (data.pre_ana - pospago);
          element.totalPac = this.helperservice.toFixed((data.pre_ana - pospago), 2);
          element.pospago = pospago;
          console.log('descuento', this.helperservice.toFixed(element.subtotal + (element.subtotal * (this.porcentaje_descuento / 100)), 2));
          element.precio_dcto = this.helperservice.toFixed(element.subtotal + (element.subtotal * (this.porcentaje_descuento / 100)), 2)
          element.precio_ahora = element.precio_dcto

          if (this.descuento_selected) {
            let data_p = this.queryservice.getPrecios(element.cod_ana, this.descuento_selected.cod_lpr);
            data_p.then((result: any) => {
              console.log('result precios descplan', result);
              if ( result.data.PreciosbySeguro==null ||result.data.PreciosbySeguro.pre_ana == null) {
                this.toastservice.presentToast({ message: "El analisis no cuenta con precio de descuento", position: "top", color: "warning" });
                this.eliminar_analisis(index)
                return
              }
              let data = result.data.PreciosbySeguro;
              let porcentaje = 0.00;
              if (this.descuento_selected.por_seg == 0 && data.por_seg == '0.00') {
                porcentaje = 0;
              }
              else if (this.descuento_selected.por_seg > 0) {
                porcentaje = this.descuento_selected.por_seg
              } else {
                porcentaje = data.por_seg
              }

              let pospago: any = this.helperservice.toFixed((data.pre_ana * porcentaje), 2)

              element.totalplandscto = this.helperservice.toFixed((data.pre_ana - pospago), 2);
            });
          }


          console.log('this.AnalisisList', this.AnalisisList);

        },error=>{
          if(error.message){
            this.toastservice.presentToast({ message: 'Ocurrio un error <br>'+error.message, color: 'warning', position: 'bottom' })
             }
             else {
              this.toastservice.presentToast({ message: 'Ocurrio un error <br>'+error, color: 'warning', position: 'bottom' })
             } console.log('error', error);
        
        });
      });
    }





    setTimeout(() => {
      this.calcTotal();
    }, 1000);

  }

  calcTotal() {

    let precio_normal_temp: number = 0;
    let precio_seguro_temp: number = 0;
    let precio_ahora_temp: number = 0;
    let precio_descuento_temp: number = 0;
    let precio_totalplandscto_temp: number = 0;

    console.log(this.AnalisisList);
    console.log('precion', this.precio_normal);

    if (this.AnalisisList.length > 0) {

      this.AnalisisList.forEach((element: any) => {
        let data = element;
        console.log('element', element);

        console.log('precito', data.subtotal);

        precio_normal_temp += parseFloat(element.totalPac);
        precio_seguro_temp += parseFloat(element.pospago);
        precio_ahora_temp += parseFloat(element.precio_ahora);
        precio_descuento_temp += parseFloat(element.precio_dcto);



        if (element.totalplandscto) {

          precio_totalplandscto_temp += parseFloat(element.totalplandscto)
        }
        console.log('preciono', this.precio_normal);
      });

      this.precio_normal = precio_normal_temp
      this.precio_seguro = precio_seguro_temp;
      this.precio_ahora = precio_ahora_temp;
      this.precio_descuento = precio_descuento_temp;
      this.precio_totalplandscto = precio_totalplandscto_temp

    }
    else {
      this.precio_normal = 0
      this.precio_seguro = 0;
      this.precio_ahora = 0;
      this.precio_descuento = 0;
      this.precio_totalplandscto = 0
    }

  }


  tesplan() {
    console.log('plan', this.plan_selected);

  }

  eliminar_analisis(index) {
    this.AnalisisList.splice(index, 1);
    this.calcTotal();
    this.calcularDemora()
  }

  reset() {
    this.hidden_total = true
    this.AnalisisList = []
    this.analisis = {}
    this.fecha_label = '';
    this.descuento_selected=null
    this.porcentaje_descuento=0
    this.calcTotal()
   
  }

  selecPlanDescuento(tipo) {
    this.flag_descuento = tipo
    this.updatePreciosbyPlan('todo', '');

  }

  goInicio() {
    this.router.navigateByUrl('/iniciotm', { replaceUrl: true })
  }



  cerrar() {
    this.modalController.dismiss({
      'dismissed': true,
      // 'flag_origen': this.flag_origen
    });
    //    this.orden = [];
  }

  print(){
    console.log("entre");
    let data_pdf={
      precio_normal_total:this.precio_normal.toFixed(2),
      precio_ahora_total:this.precio_ahora.toFixed(2),
      precio_descuento_total:this.precio_descuento.toFixed(2),
      tipo_descuento:(this.flag_descuento=='dscto' && this.porcentaje_descuento!=0 )?'pctj':(this.flag_descuento=='dscto_plan')?"plan":"",
      precio_totalplandscto_total:(this.flag_descuento=='dscto')?this.precio_descuento.toFixed(2):(this.flag_descuento=='dscto_plan')?this.precio_totalplandscto.toFixed(2):"0.00",
      precio_seguro_total:this.precio_seguro.toFixed(2),
      analisisList:this.AnalisisList,
      porcentaje_dscto:this.porcentaje_descuento,
      des_plan:this.plan_selected.des_plan,
      id_plan:this.plan_selected.id_plan,
      des_plan_dscto:(this.descuento_selected)?this.descuento_selected.des_plan:'',
      id_plan_dscto:(this.descuento_selected)?this.descuento_selected.id_plan:0,
      fecha_entrega:this.fecha_label


    }

    console.log("data_pdf",data_pdf);
    console.log("data_pdf",JSON.stringify(data_pdf));
    this.openPDF(data_pdf)
  }


  openPDF(presupuesto) {
    
    this.loadingService.present("Generando Pdf");
    // orden.empresa.nombrePdf="femedic";
    // PREPARO LOS VALORES
    let valores_enviar = {
      "presupuesto": presupuesto
    }
    console.log(JSON.stringify(valores_enviar.presupuesto));
    
    console.log(valores_enviar);
    //ENVIO AL SERVICIO
    let respuesta;
    this.serviciosPDF.getPDFPresupuesto(valores_enviar).subscribe(resp => {
      //CIERRO EL LOADING
      setTimeout(() => {
        this.loadingService.dismiss();
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
        this.loadingService.dismiss();
      }, 500);
      console.error(error);
     this.utilidades.mostrarToast("Problema datos " + error.status);
   
    });
    //  window.open("https://resultados.gamma.com.ec:8443/gamma/webresources/eReport/pdf?orden=712418&paciente=227064&token=2048", "_blank")

  }

}
