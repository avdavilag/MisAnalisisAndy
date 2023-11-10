import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { ToastService } from 'src/app/servicios/toast.service';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.page.html',
  styleUrls: ['./caja.page.scss'],
})
export class CajaPage implements OnInit {

dcto_ord:any=""
dcto_val:any=""
val_ord :any=""
pre_ord :any=""
vuelto_suma:any=""
cantidadPaga: number;
tip_tdp="";
dataOrden:any;
vuelto:string='';
vuelto_efectivo:string='';
listtdp=[];
tdp_select:any;
json_data:any;
codigo_orden_completa:any;
variableUsuario:any;
input_doc_pag:null;
input_ins_pag:null;
input_res_pag:null;
tabla_Pagos: any[] = [];
descuento:any;
aumento:any;
variable_pago_modal:any;
variable_saldo_modal:any;
bandera_pago_botton:boolean;
analisis:any;
contador_analisis:any;
vector_analisis=[];
contador_analisis2:any;
nombre:any;
public numeroAnalisisAntes: number;
pagos_arreglo:any=[];
bandera_limpia_vector_caja;
variable_nombre_pago_arreglo;
input_pagar_no_efectivo:any;


pago:any={
  cod_cli:null,
  cod_ori:null,
  cod_suc:null,
  cod_tdp:null,
  doc_pag:null,
  fac_seg:null,
  fec_upd:null,
  first_user:null,
  ins_pag:null,
  last_user:null,
  nro_ord:null,
  obs_pag:null,
  res_pag:null,
  val_pag:null,
  valor_pago_unico:null,
 variable_nombre_pago_arreglo_ap:null,
}
constructor(
    private modalController :ModalController,
    private queryservice:QueryService,
    private toastservice:ToastService,
  ) { }


  ngOnInit() {

    if (this.bandera_limpia_vector_caja === 1) {
      this.tabla_Pagos = [];
    }
    this.queryservice.getListTdpAvailable().then((r: any) => {
      this.listtdp = r.data.ListTipoPagoAvailable;
      this.tdp_select = this.listtdp[1];
    }, error => {
      console.log(error);

    });

    console.log('-----Anderson Iniciado Metodo:-------- ');

    this.val_ord = parseFloat(this.val_ord).toFixed(2);
    if (this.val_ord !== 0) {
      if (this.tabla_Pagos !== undefined && this.tabla_Pagos.length !== 0) {
        this.pre_ord = (this.pre_ord - this.tabla_Pagos[0].valor_pago).toFixed(2);
        this.variable_saldo_modal = this.val_ord;
        console.log('-----Prueba:-------- ');
        this.input_pagar_no_efectivo=this.variable_saldo_modal;
        console.log('-----Anderson input_pagar:-------- ',this.input_pagar_no_efectivo);
        
        if (Math.abs(this.pre_ord - 0.00) < 0.001) {
          this.pre_ord = this.tabla_Pagos[0].valor_pago;
        }
      } else {
        if (this.tabla_Pagos.length !== 0) {
          this.pre_ord = this.tabla_Pagos[0].valor_pago;
        } else {
          this.pre_ord = parseFloat(this.pre_ord).toFixed(2);
          this.val_ord = parseFloat(this.val_ord).toFixed(2);
        }
      }
    } else {
      this.bandera_pago_botton = false;
    }
    console.log('tabla Pagos revisar : ',this.tabla_Pagos);
    this.variable_saldo_modal = this.tabla_Pagos[this.tabla_Pagos.length - 1].valor_pago_unico;
    this.variable_pago_modal = 0;
    this.pre_ord = this.tabla_Pagos[this.tabla_Pagos.length - 1].val_pag;
    this.input_pagar_no_efectivo=this.pre_ord;
console.log('-----Anderson input_pagar en:-------- ',this.input_pagar_no_efectivo);

    if (this.variable_saldo_modal === 0) {
      this.bandera_pago_botton = false;
    }
    console.log('-----Anderson terminado metodo en:-------- ');

  }



    
  CancelarPago(){
    let pago_arreglo:any;
    this.pago.cod_tdp=this.tdp_select.cod_tdp;



    if(this.tdp_select.cod_tdp==='CASH'){
      
      console.log('CASH');
      this.pago.doc_pag=null;
      this.pago.ins_pag=null;
    this.pago.res_pag=null;
    this.variable_nombre_pago_arreglo='Efectivo';
    this.pago.variable_nombre_pago_arreglo_ap=this.variable_nombre_pago_arreglo;
    
  }else  if(this.tdp_select.cod_tdp==='ANC'){
      console.log('ANC');
      this.pago.doc_pag=this.input_doc_pag;
      this.pago.ins_pag=this.input_ins_pag;
      this.pago.res_pag=this.input_res_pag;
      this.variable_pago_modal=this.pre_ord;
      this.variable_nombre_pago_arreglo='Dr. Archundia';
      this.pago.variable_nombre_pago_arreglo_ap=this.variable_nombre_pago_arreglo;
   
    }
    else  if(this.tdp_select.cod_tdp==='CHECK'){
      console.log('CHECK');
      this.pago.doc_pag=this.input_doc_pag;
      this.pago.ins_pag=this.input_ins_pag;
      this.pago.res_pag=this.input_res_pag;
      this.variable_pago_modal=this.pre_ord;
      this.variable_nombre_pago_arreglo='Cheque';
      this.pago.variable_nombre_pago_arreglo_ap=this.variable_nombre_pago_arreglo;
    }
    else  if(this.tdp_select.cod_tdp==='TAR'){
      console.log('TAR');
      this.pago.doc_pag=this.input_doc_pag;
      this.pago.ins_pag=this.input_ins_pag;
      this.pago.res_pag=this.input_res_pag;
      this.variable_pago_modal=this.pre_ord;
      this.variable_nombre_pago_arreglo='Tarjeta de Credito';
      this.pago.variable_nombre_pago_arreglo_ap=this.variable_nombre_pago_arreglo;

    }
    else  if(this.tdp_select.cod_tdp==='TRA'){
      console.log('TRA');
      this.pago.doc_pag=this.input_doc_pag;
      this.pago.ins_pag=this.input_ins_pag;
      this.pago.res_pag=this.input_res_pag;
      this.variable_pago_modal=this.pre_ord;
      this.variable_nombre_pago_arreglo='Transferencia';
      this.pago.variable_nombre_pago_arreglo_ap=this.variable_nombre_pago_arreglo;

    }
    else  if(this.tdp_select.cod_tdp==='RET'){
      console.log('RET');
      this.pago.doc_pag=this.input_doc_pag;
      this.pago.ins_pag=this.input_ins_pag;
      this.pago.res_pag=this.input_res_pag;
      this.variable_pago_modal=this.pre_ord;
      this.variable_nombre_pago_arreglo='X Retención en la Fuente';
      this.pago.variable_nombre_pago_arreglo_ap=this.variable_nombre_pago_arreglo;
      
    }

    // //Fecha para Update
     var fecha_update = new Date();
     var fecha_update_bdd=this.FormatoParaBaseDeDatosFechaUpdate(fecha_update);
    this.pago.fec_upd=fecha_update_bdd;
   this.pago.val_pag=this.variable_pago_modal;
this.pago.valor_pago_unico=this.variable_saldo_modal;

this.tabla_Pagos.push(Object.assign({}, this.pago));
console.log('tabla en this pagos para vista verificar: ',this.tabla_Pagos);



if(this.variable_saldo_modal===undefined){
  this.variable_saldo_modal=0;
}else{
  this.pre_ord=this.variable_saldo_modal;

}


this.bandera_pago_botton=false;
this.cantidadPaga=null;
this.vuelto_efectivo='';
this.pagos_arreglo.push(Object.assign({}, this.pago));
console.log('<-----this.pago:----> ',this.pago);
console.log('pago_arreglo:-*------>: ',this.pagos_arreglo);


this.bandera_limpia_vector_caja=0;
  }

delete_Pago(pago:String){
  const indexToRemove = this.tabla_Pagos.findIndex(fila => fila.fec_upd === pago);
if (indexToRemove !== -1) {
  this.tabla_Pagos.splice(indexToRemove, 1);
}
  }

  FormatoParaBaseDeDatosFechaUpdate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milliseconds}`;
  }

  
  dismiss(){
    console.log('vector en pago: ',this.tabla_Pagos);
    
    if (this.pagos_arreglo && this.pagos_arreglo.length === 0) {
        this.pagos_arreglo=this.tabla_Pagos;
        console.log('This.pagos_arreglo dentro del if rellenado: ',this.pagos_arreglo);

    } 


    this.modalController.dismiss({
      'dismissed': true,
      'tipo': 'P',
      'cod_tpg':this.tdp_select.cod_tdp,
      'documento_pago': this.input_doc_pag,
      'institucion_pago':this.input_ins_pag,
      'responsable_pago':this.input_res_pag,
      'fecha_update':this.pago.fec_upd,
      'valor_pago':this.pago.val_pag,
      'pagos_arreglo':this.pagos_arreglo,
      'bandera_limpia_vector_caja':this.bandera_limpia_vector_caja
      },"blank");

    // this.modalController.dismiss()
  }

calcularVueltoNoEfectivo(){
  console.log('Por favor revisa input_pagar_no_efectivo: ',this.input_pagar_no_efectivo);
}

calcularVuelto(){
  this.variable_pago_modal=0;
console.log('variable_saldo_modal:----->calcular vuelto: ',this.variable_saldo_modal)
if(this.variable_saldo_modal===0){
  this.bandera_pago_botton=false;
  this.toastservice.presentToast({ message: "Tu pago esta totalmento completo", position: "bottom", color: "warning", duration: 1500});
}else{ 
   if(this.cantidadPaga<this.pre_ord){
  this.vuelto = (this.cantidadPaga - this.pre_ord).toFixed(2);
    if(parseFloat(this.vuelto)<=0){
      console.log('Entra al vuelto de no completo el pago: ',this.vuelto);
      this.vuelto_efectivo='0.00';
    }

  let resultado_calcular_vuelto=this.pre_ord-this.cantidadPaga;
  this.variable_pago_modal=this.cantidadPaga;
  this.variable_saldo_modal=(resultado_calcular_vuelto).toFixed(2);
  }else{
this.vuelto = (this.cantidadPaga - this.pre_ord).toFixed(2);
this.vuelto_efectivo=(this.cantidadPaga - this.pre_ord).toFixed(2);


console.log('this.cantidadPaga:  primeramente calcularVuelto: ', this.cantidadPaga);
console.log('this.vuelto:  primeramente calcularVuelto: ', this.vuelto);

this.variable_pago_modal=this.cantidadPaga-parseFloat(this.vuelto);
console.log('this.variable_pago:  verificar: antes de hacer un clic: ',this.variable_pago_modal);


if (isNaN(this.variable_pago_modal)) {
  this.variable_pago_modal = 0;
}
    this.variable_saldo_modal=this.pre_ord-this.variable_pago_modal;
    console.log('this.variable_pago_modal: ',this.variable_pago_modal);
    console.log('this.pre_ord: dddd ',this.pre_ord);
    console.log('this.variable_pago_modal: ',this.variable_saldo_modal);

  }
  this.bandera_pago_botton=true;
  }
}

}
