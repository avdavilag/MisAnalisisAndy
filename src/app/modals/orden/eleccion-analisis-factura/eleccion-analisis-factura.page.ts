import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { HelperService } from 'src/app/servicios/helpers/helper.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { FuncionesComunesIntra } from 'src/app/utils/funciones-comunes-intra';

@Component({
  selector: 'app-eleccion-analisis-factura',
  templateUrl: './eleccion-analisis-factura.page.html',
  styleUrls: ['./eleccion-analisis-factura.page.scss'],
})
export class EleccionAnalisisFacturaPage implements OnInit {
  dcto_ord:any;
  dcto_val:any;
  val_ord:any;
  codigo_orden_completa:any;
  variableUsuario:any;
  json_data:any;
  tabla_Pagos:any;
  array_analisis=[];
  select_analisis_array: any[] = [];/////Vector que hace los anilisis seleccionados y envia al Backend
  cont_analisis_select_factura:any;
  valor_total_json_factura:any;
  array_ptoxori_enviar_factura:any=[];
  facturar:any={
    cod_cli:' ',   
    cod_suc:'',   
    fec_ini:'',  
    lock_fxo:'', 
    fec_upd:'', 
    last_user:'', 
    res_fac:'', 
    first_user:'', 
    tip_doc:'', 
    sri_razon:'', 
    sri_estab:'', 
    sri_ptoemi:'', 
    sri_aut:'', 
    sri_ruc:'', 
    sri_comprador:'', 
    sri_doccompra:'', 
    sri_caduca:'', 
    sri_totalsin:'', 
    sri_ice:'', 
    sri_iva1:'', 
    sri_iva2:'', 
    sri_totalcon:'',  
    sri_dcto:'', 
    sri_doc:'', 
    exp_anu:'', 
    sri_id:null, 
    print_ok:'', 
    dir_fac:'', 
    tel_fac:'', 
    det_fac:'', 
    sri_tipo:'', 
    tdoc_ref:'', 
    tip_cli:'',  
    sri_ivam:'', 
    sri_retiva:'', 
    sri_retren:'', 
    sri_subtotal:'', 
    ord_ref:'', 
    tip_emi:'', 
    mail_fac:'', 
    sri_fecaut:null, 
    sri_acceso:null, 
    sri_autorizacion:null, 
    sri_tipoemision:null,
    intento:'',
    cod_ori:'',
    num_analisis:''
 }
 json_analisis:any={};
 unselectedAnalisis: any[] = [];//////////////Vector si necesitamos las no seleccionadasss
 longitud_analisis:any;

  constructor(  
    private varGlobal: VariablesGlobalesService,
    private queryservice:QueryService,
    private alertController:AlertController,
    private modalController:ModalController,
    private toastservice:ToastService,
    private helper:HelperService,
    private popoverController:PopoverController,
    private loadingservice: LoadingService,
    private funcionesComunes: FuncionesComunesIntra) { }

  ngOnInit() {
    console.log('-------------------------------------------Ingresa al modal de variables de ELECCION DE ANALISIS DE FACTURA ASI QUE PILAS -----------------------------------------------');  
    console.log('array_ptoxori_enviar_factura elecccion_analisis_factura: ',this.array_ptoxori_enviar_factura); 
    // console.log('Json Data: ',this.json_data);
    this.array_analisis=this.json_data.analisis;
    this.valor_total_json_factura=this.val_ord;
   // console.log('Verificar el codigo de Sucursal que viene aquiiiii: ',this.cod_suc);
    this.array_analisis.forEach(analisis => {
      analisis.selected = true;
      this.select_analisis_array.push(analisis);
    });

    console.log('codigo_orden_completa Nro de orden verificadad Inicio:: ',this.codigo_orden_completa);

  }
  updateSelectedOptions(event: any) {
    this.select_analisis_array = event.detail.value;
    this.cont_analisis_select_factura=this.select_analisis_array.length;    
  }

  
  toggleSelection(analisis: any) {
    if (this.select_analisis_array.includes(analisis)) {      
      this.select_analisis_array = this.select_analisis_array.filter(item => item !== analisis);
      this.unselectedAnalisis.push(analisis);
      this.valor_total_json_factura = (parseFloat(this.valor_total_json_factura) - parseFloat(analisis.pre_pac)).toFixed(2);
    } else {      
      this.select_analisis_array.push(analisis);
      this.unselectedAnalisis = this.unselectedAnalisis.filter(item => item !== analisis);
      this.valor_total_json_factura = (parseFloat(this.valor_total_json_factura) + parseFloat(analisis.pre_pac)).toFixed(2);
    }
  }

  envio_factura_backend(){
    this.json_analisis=this.select_analisis_array;/////Esto enviar al graphQl//////
    this.longitud_analisis=this.json_analisis.length;/////Send of longitud at array facturar;
////It's part of field fec_ini:
var fecha_update = new Date();
var fecha_update_bdd=this.FormatoParaBaseDeDatosFechaUpdate(fecha_update);
////////////////It's part the get ADMIN or logged in user variable
this.variableUsuario = this.varGlobal.getVarUsuario();
    console.log('Variable Usuario------------------------------------: ', this.variableUsuario);

/////////////////////////////////////////////////////////////AQUI CAMBIAR LOGICA CUANDO YA TENGAS EL CONSUMIDOR FINAL///////////////
//////////////It's part of part consumer the Graph-Ql of getPacientes with identification card.////
this.queryservice. getPacientesbyCod(this.json_data.orden.cod_pac).then((result: any) => {
  if(result.data.getPacientebyCod.id_pac===null){
    let cedula_prueba='1002969333';
  this.facturar.sri_doccompra=cedula_prueba;
  console.log('Dentro del If Verificar: ',this.facturar.sri_doccompra);  
}else{ 
this.facturar.sri_doccompra=result.data.getPacientebyCod.id_pac;
console.log('Aqui tienes el result en Else: ',this.facturar.sri_doccompra);
 }
///////Messague for field det_fac for table Ava_lisfac////////////////
const fecha = new Date(fecha_update);
const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const nombreDiaSemana = diasSemana[fecha.getDay()];
const dia = fecha.getDate();
const mes = fecha.toLocaleString('default', { month: 'long' });
const año = fecha.getFullYear();
const fechaFormateada = `${nombreDiaSemana}, ${dia} de ${mes} de ${año}`;
let message_field_det_fac="Orden de análisis clínicos Nº "+this.codigo_orden_completa+".Efectuados el "+fechaFormateada;
console.log('Verificar el mensaje dentro del message_field_det_fac: ', message_field_det_fac);
////////////////////////////////////////////////////////////////////////////////

////////////////There billing array of facturar here//////////////////////
this.facturar.cod_cli=this.json_data.orden.cod_pac;
this.facturar.cod_suc=this.array_ptoxori_enviar_factura.cod_suc;
this.facturar.fec_ini=fecha_update_bdd;
this.facturar.lock_fxo=2,
this.facturar.fec_upd=fecha_update_bdd,
this.facturar.last_user=this.variableUsuario;
this.facturar.res_fac=this.variableUsuario;
this.facturar.first_user=this.variableUsuario;
this.facturar.tip_doc='FV';
this.facturar.sri_razon=this.array_ptoxori_enviar_factura.sucursal.sri_razon;
this.facturar.sri_estab=this.array_ptoxori_enviar_factura.sri_estab;
this.facturar.sri_ptoemi=this.array_ptoxori_enviar_factura.pto_emi;
this.facturar.sri_aut=0,
this.facturar.sri_ruc=this.array_ptoxori_enviar_factura.sucursal.sri_ruc;
this.facturar.sri_comprador=result.data.getPacientebyCod.nombre_completo;
this.facturar.sri_caduca=null;
this.facturar.sri_totalsin = this.ajustarDecimales(parseFloat(this.valor_total_json_factura), 2);
this.facturar.sri_ice=0.00;
this.facturar.sri_iva1=this.ajustarDecimales(parseFloat(this.valor_total_json_factura), 2);
this.facturar.sri_iva2=0.00;
this.facturar.sri_totalcon=this.ajustarDecimales(parseFloat(this.valor_total_json_factura), 2);
this.facturar.sri_dcto= 0.00;
this.facturar.sri_doc=18;
this.facturar.exp_anu=0;
this.facturar.sri_id=null;
this.facturar.print_ok=0;
this.facturar.dir_fac=result.data.getPacientebyCod.dir_pac;
this.facturar.tel_fac=result.data.getPacientebyCod.cel_pac;
this.facturar.det_fac=message_field_det_fac;
this.facturar.sri_tipo='05';
this.facturar.tdoc_ref='OR';
this.facturar.tip_cli='P';
this.facturar.sri_ivam =0.00;
this.facturar.sri_retiva=0.00;
this.facturar.sri_retren=0.00;
this.facturar.sri_subtotal=this.ajustarDecimales(parseFloat(this.valor_total_json_factura), 2);
this.facturar.ord_ref=this.codigo_orden_completa;
this.facturar.tip_emi=result.data.getPacientebyCod.mail_pac;
this.facturar.sri_fecaut= null;
this.facturar.sri_acceso=null;
this.facturar.sri_autorizacion=null;
this.facturar.sri_tipoemision=null;
this.facturar.intento=0;
this.facturar.cod_ori=this.json_data.orden.cod_ori;
this.facturar.num_analisis=this.longitud_analisis;

this.queryservice.inserFactura({
  json_factura:JSON.stringify(this.facturar),
  json_analisis:JSON.stringify(this.json_analisis),
}).then 
((result: any) => {
  console.log('Resultado enviado a backend: ',result);

});

console.log('<----Verificar el json a Facturar de Facturar:---->',this.facturar);
});



    


/////////////////////////////////////////////////////////////////////


//console.log('json_data: ',this.json_data);
console.log('')
console.log('this.facturar.fec_ini----este es importante: ',this.facturar);
  //  console.log('Unselected Analisis:', this.unselectedAnalisis);

    

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

  ajustarDecimales(numero, decimales) {
    const factor = 10 ** decimales;
    return Math.round(numero * factor) / factor;
  }
}
