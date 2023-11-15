import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonAccordionGroup, IonItem, ModalController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CajaPage } from 'src/app/modals/orden/caja/caja.page';
import { ChequeoOrdenPage } from 'src/app/modals/orden/chequeo-orden/chequeo-orden.page';
import { FacturacionPage } from 'src/app/modals/orden/facturacion/facturacion.page';
import { GetAnalisisIndividualOrdenPage } from 'src/app/modals/orden/get-analisis-individual-orden/get-analisis-individual-orden.page';
import { IngresoFacturaPage } from 'src/app/modals/orden/ingreso-factura/ingreso-factura.page';
import { MuestrasPage } from 'src/app/modals/orden/muestras/muestras.page';
import { SearchMedicoPage } from 'src/app/modals/orden/search-medico/search-medico.page';

import { SearchPacientePage } from 'src/app/modals/orden/search-paciente/search-paciente.page';
import { MenuordenPage } from 'src/app/popover/menuorden/menuorden.page';
import { PopoverPagoPage } from 'src/app/popover/popover-pago/popover-pago.page';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { HelperService } from 'src/app/servicios/helpers/helper.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { FuncionesComunesIntra } from 'src/app/utils/funciones-comunes-intra';

@Component({
  selector: 'app-ingreso-orden-completa',
  templateUrl: './ingreso-orden-completa.page.html',
  styleUrls: ['./ingreso-orden-completa.page.scss'],
})
export class IngresoOrdenCompletaPage implements OnInit {
  //@ViewChild('Orden')  orden_slides: IonSlides;
  @ViewChild('itemPac', { static: false, read: ElementRef }) item: ElementRef;
  @ViewChild('toolbar_header', { static: false, read: ElementRef }) toolbar: ElementRef;
  @ViewChild('referencia', { static: false, read: ElementRef }) referencia: ElementRef;
  @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;


  optEntrega = [
    { tipo: "mail", input: true, icon: "mail-outline", checked: false, tag: "Mail", value: "", tinput: "text" },
    { tipo: "dictar", input: true, icon: "call-outline", checked: false, tag: "Dictar", value: "", tinput: "text" },
    { tipo: "fisico", input: true, icon: "newspaper-outline", checked: false, tag: "Entregar Físico", value: "", tinput: "text" },
    { tipo: "copia", input: true, icon: "copy-outline", checked: false, tag: "Entregar Copia", value: "", tinput: "number" },
    { tipo: "pedidomed", input: true, icon: "hand-right-outline", checked: false, tag: "Entregar Pédido Médico", value: "", hidden: "true" }
  ];

  dataOrden: any = {
    cod_ori: null,
    cod_pac: null,
    cod_med: null,
    ca1_ord: null,
    ca2_ord: null,
    pre_ord: 0.00,
    dcto_ord: 0.00,
    val_ord: 0.00,
    sts_ord: "PE",
    sts_adm: "S",
    txt_ord: null,
    cod_ref: null,
    dcto_val: 0.00,
    stat_ord: 0,
    id_plan: null,
    cod_suc: 1,//Revisar como sacar el codigo sucursal
    cod_emp: null,
    fec_ent: null,
    tip_ord: 0,
    cod_pac2: null,
    fac_ter: 0,
    cod_uni: null,
    pwd_ord: null,
    exp_ord: 0,
    pet_adi: 0,
    FEC_ENT2: null,
    nro_ext: null,
    mst_ext: 0,
    obs_ext: null,
    tip_ped: null,
    cod_ped: null,
    des_ped: null,
    iess_tseg: null,
    iess_dx: null,
    iess_tben: null,
    iess_tder: null,
    iess_nder: null,
    iess_tcon: null,
    iess_dx2: null,
    iess_id: null,
    nro_aux: 1,
    iess_dep: null,
    mail_ent: 0,
    mail_ent_det: null,
    dicta_ent: 0,
    dicta_ent_det: null,
    envio_ent: 0,
    envio_ent_det: null,
    cod_med2: null,
    copia_ent: null,
    pedido_ent: null,
    exclusive_ent: 0,
    //grupo_ord: null,
    fec_ord: null,
    num_analisis: 0,
    num_muestras: 0,
    user_type:null,
    user_code:null

   };

  pago: any = {
    cod_cli: '',
    cod_ori: null,
    cod_suc: '',
    cod_tdp: null,
    doc_pag: null,
    fac_seg: null,
    fec_upd: null,
    first_user: null,
    ins_pag: null,
    last_user: null,
    nro_ord: null,
    obs_pag: null,
    res_pag: null,
    val_pag: ''
  }
   aplicoAumento: boolean = false;
   planSelected: any;
  origen_lab:any=null;
 // dataOrden:any=[];
  hora_entrega="00:00";
  fecha_actual=new Date();
  paciente:any;
  segment_value:String="orden"
  segment_secondary_value:String="pet"
  medico:any;
  inputMedico="";
  inputPaciente="";
  input_paciente_terceros="";
  precioFinal: any = null;
  listAnalisis: any = [];
  listSeguro: any;
  listUnidad: any=[];
  listSearchAnalisis: any = [];
  analisisbuscar=""
  hiddenlistSearchAnalisis = true;
  total_ord = "";
  options_select = {
    cssClass: 'alert_select',
  }
  analisis: any;
  listReferencia:any=[]
  referencia_select:any
  unidad_select:any;
  listMuestras:any=[]
  preguntasAnalisis: any = [];
  public mobile = false;

  fechaEntrega: any = {
    fecha1: '',
    fecha2: ''
  }

  flag_show_pac_div=false;
  observaciones_usuario = '';
  codigo_orden_completa: any;
  variableUsuario: any;
  json_data: any;
  tabla_Pagos: any[] = [];
  orden_view: any;
  flag_referencia: boolean = false;
  cod_orden = '';
  vector_cod_name_ori: any = {
    name: '',
    value: ''
  };
  descuento:any;
text1: string = "";
text2: string = "";
paciente_completo:any;
paciente_completo_bolean:boolean=false;
paciente_completo_bolean_eliminar:boolean=false;

numero_antes:number;
bandera_limpia_vector_caja=0
////bloquea la facturacion a tercero
public bloquearIonItem: boolean = true;

  constructor(
    private varGlobal: VariablesGlobalesService,
    private queryservice:QueryService,
    private alertController:AlertController,
    private modalController:ModalController,
    private toastservice:ToastService,
    private helper:HelperService,
    private popoverController:PopoverController,
    private loadingservice: LoadingService,
    private funcionesComunes: FuncionesComunesIntra,
  ) { }

  ngOnInit() {

    if (window.screen.width < 600 || window.innerWidth < 600) { // 768px portrait
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    window.onresize = () => {
      console.log('this.mobile', this.mobile);

      if (window.screen.width < 600 || window.innerWidth < 600) { // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    };

    window.onscroll=()=>{
      console.log("entre scroll");

    }


    this.getOrigen();
    this.getSeguro();
    this.getReferencia();
    this.getUnidad()
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicePage');

   //


  }
  ChangeContentView(){
    console.log("entreeee");
    if(this.item){
   // console.log('this.item.nativeElement',this.item.nativeElement);
    //console.log('this.item.nativeElement',this.item.nativeElement.getBoundingClientRect());
    //console.log('this.toolbar_header.nativeElement',this.toolbar.nativeElement);
    //console.log('this.toolbar_header.nativeElement',this.toolbar.nativeElement.getBoundingClientRect());
    //console.log('this.referencia.nativeElement',this.referencia.nativeElement);
    console.log('this.referencia.nativeElement',this.referencia.nativeElement.getBoundingClientRect().y);
      let y_position_div=this.referencia.nativeElement.getBoundingClientRect().y
    if(y_position_div<=117){
      this.flag_show_pac_div=true
    }
    else{
      this.flag_show_pac_div=false
    }


  }
  }

  async presentModalNewPaciente() {
    const modal = await this.modalController.create({
      component: SearchPacientePage,
      componentProps: { value: 123 },
      backdropDismiss: false
    });


    await modal.present();
    modal.onDidDismiss().then(r => {

      if (r.data) {
        this.paciente = r.data.paciente
        this.inputPaciente=this.paciente.id_pac;
        console.log('this.paciente: -Modal: ',this.inputPaciente);
      }
    })
  }

  


  async presentModalNewMedico() {
    const modal = await this.modalController.create({
      component: SearchMedicoPage,
      componentProps: { value: 123 },
      backdropDismiss: false
    });

    await modal.present();
    modal.onDidDismiss().then(r => {

      if (r.data) {
        this.medico = r.data.medico
        this.inputMedico=this.medico.cod_med;
        console.log('this.medico: ', this.inputMedico);
      }
    })
  }


  testMedico(){
    let data ={"nom_med":"aa","id_med":"aa","mail_med":"aa","esp_med":"aa","col_med":"aa","cel_med":"aa","telf_med":"aa","dir_med":"aa","obs_med":"aaa"}
    this.queryservice.insertMedicoLite(JSON.stringify(data)).then((r)=>{
      console.log("r",r);

    })
  }

  getOrigen() {
  const origenNombre = localStorage.getItem('origen_nombre');
    console.log('origenNombre: ',origenNombre);
  if (origenNombre) {
    const origenLabInfo = JSON.parse(origenNombre);
console.log('origenLabInfo: ',origenLabInfo)
    this.origen_lab = origenLabInfo.name;
    this.cod_orden = origenLabInfo.value;

  } else {
  }
    // this.origen_lab = this.varGlobal.getOrigenOrden();
    // if(this.origen_lab==null){
    //   this.presentAlertOrigen();
    // }else{
    //   // this.origen_lab = this.varGlobal.getOrigenOrden();
    //   // console.log("this.origen_lab", this.origen_lab.des_ori);
    //   // this.dataOrden.cod_ori = this.origen_lab.cod_ori;
    //   // this.hora_entrega = this.origen_lab.hora_ori;

    //   const origenNombre = localStorage.getItem('origen_nombre');

    //   if (origenNombre) {
    //     this.vector_cod_name_ori = JSON.parse(origenNombre);
    //     console.log('Valor recuperado de localStorage:', this.vector_cod_name_ori);
    //     this.origen_lab = this.vector_cod_name_ori.name;
    //     console.log("this.origen_lab", this.origen_lab.des_ori);
    //     this.dataOrden.cod_ori = this.origen_lab.cod_ori;
    //     this.hora_entrega = this.origen_lab.hora_ori;
    //   }
      // this.origen_lab = this.varGlobal.getOrigenOrden()
      // console.log("this.origen_lab", this.origen_lab);
      // this.dataOrden.cod_ori = this.origen_lab.cod_ori
      // this.hora_entrega = this.origen_lab.hora_ori
      // const origenNombre = localStorage.getItem('origen_nombre');

      // if (origenNombre) {
      //   this.vector_cod_name_ori = JSON.parse(origenNombre);
      //   console.log('Valor recuperado de localStorage:', this.vector_cod_name_ori);
      // }
    }



  getSeguro() {


    this.queryservice.getListSeguro().then((r: any) => {
      console.log('planes', r);
      this.listSeguro = r.data.ListSeguro;
      this.planSelected = this.listSeguro[0].Plan[0];

    })
  }

  getReferencia(){
    this.queryservice.getListReferencia().then((r:any)=>{
      console.log("referencia",r);
      let data=r.data.ListReferencia
      this.listReferencia=data;
    })
  }

  getUnidad(){
    this.queryservice.getListUnidad().then((r:any)=>{
      console.log("unidad",r);
      this.listUnidad=r.data.ListUnidad

    })
  }
  checkPriority() {
    console.log("checck date", this.dataOrden.stat_ord);

    if (this.dataOrden.stat_ord == 1) {
      console.log("checck urgente");
//      this.fechaEntrega.fecha1 = this.helper.soloFecha(new Date());
//      console.log(this.fechaEntrega);

    }
  }
  async presentAlertOrigen() {
    const r = await this.queryservice.getListOrigen();
    let inputs = [];
    let cont=0;
    let storage_origen_env;
    if (r && r.data && r.data.ListOrigen && r.data.ListOrigen.length > 0) {
      r.data.ListOrigen.forEach((origen) => {

        inputs.push({
          name: origen.des_ori,
          type: 'radio',
          label: origen.des_ori,
          value: origen,
          // value: origen.cod_ori,
          cont: cont
        });
        cont++;
      });

      const alert = await this.alertController.create({
        header: 'Seleccione un Origen !',
        inputs: inputs,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel: blah');
            }
          },
          {
            text: 'Seleccionar',
            handler: async (contador) => {
                 this.getMostrarCodOrigenLab(inputs, contador);
            }
          }
        ]
      });
      await alert.present();
    } else {
      console.log('No se encontraron datos de Orígenes.');
    }
  }
  getMostrarCodOrigenLab(inputs, contador) {
    //console.log('Inputs........: ',inputs);
    // let variable_contador=inputs.cont;
     //console.log('Revisar los Inputssss aqui getMostrarCondOrigenLab: ',variable_contador);
console.log('nombre de origen: ',contador.des_ori);
console.log('id de origen: ',contador.cod_ori);


    this.cod_orden = contador.cod_ori;
    this.origen_lab = contador.des_ori;

    this.vector_cod_name_ori = {
      name: this.origen_lab,
      value: this.cod_orden
    }
    console.log('this.vectocodigoname: ',this.vector_cod_name_ori);
  localStorage.setItem('origen_nombre', JSON.stringify(this.vector_cod_name_ori));
  }

async presentModalSearchPaciente() {
  const modal = await this.modalController.create({
  component: SearchPacientePage,
  componentProps: { value: 123 },
  backdropDismiss:false
  });

  await modal.present();
  modal.onDidDismiss().then(r=>{
    console.log(r);
    if(r.data){
      this.paciente=r.data.paciente
    }
  })
}

getMedico() {
  console.log(" this.inputMedico", this.inputMedico);

  if (this.inputMedico === '') {
    let toastconf =
    {
      'message': 'Ingrese el codigo de Médico',
      'style': 'warning',
      'position': 'top'
    };
    this.toastservice.presentToast(toastconf);
    return
  }

  this.queryservice.getMedicosbyCod(this.inputMedico).then((r: any) => {
    console.log(r);
    if (r.data.getMedicobyCod != null) {
      this.medico = r.data.getMedicobyCod
    }
    else {
      this.toastservice.presentToast({ message: "No se encuentra medico", position: "top", color: "warning", duration: 1500 })
    }
  })
}

/////////get Paciente///////////////
////////////////////////////////////////
getPaciente() {
  console.log(" this.inputPaciente", this.inputPaciente);
  if (this.inputPaciente === '') {
    let toastconf =
    {
      'message': 'Ingrese la Cédula del Paciente',
      'style': 'warning',
      'position': 'top'
    };
    this.toastservice.presentToast(toastconf);
    return
  }
  this.queryservice.getPacientesbyId(this.inputPaciente).then((r: any) => {
    console.log(r);
    if (r.data.getPaciente.id_pac !== null) {
      this.paciente = r.data.getPaciente;
      console.log('this.paciente*----> Verificar: ',this.paciente);
    }
    else {
      this.toastservice.presentToast({ message: "No se encuentra Paciente", position: "top", color: "warning", duration: 1500 });
    }
  })
}

//////////////////get Paciente_a_terceros///////////////////////////////////
getPaciente_terceros() {
  console.log(" this.inputPaciente_terceros", this.input_paciente_terceros);
  
  if (this.input_paciente_terceros === '') {
    let toastconf =
    {
      'message': 'Ingrese la Cédula del Paciente',
      'style': 'warning',
      'position': 'top'
    };
    this.toastservice.presentToast(toastconf);
    return
  }

  const cedula_paciente_tercero=this.input_paciente_terceros.trim();

console.log('Const cedula_paciente_tercera: ',cedula_paciente_tercero);
  this.queryservice.getPacientesbyId(cedula_paciente_tercero)
  .then((r: any) => {
    console.log(r);
    if (r.data.getPaciente.id_pac !== null) {
      this.paciente_completo = r.data.getPaciente;
      console.log('this.paciente*----> Verificar: ', this.paciente_completo);
      this.bloquearIonItem=true;
      this.paciente_completo_bolean_eliminar=false;
      this.paciente_completo_bolean=false;
    } else {
      this.toastservice.presentToast({ message: "No se encuentra Paciente", position: "top", color: "warning", duration: 1500 });
    }
  })
  .catch(error => {
    console.error("Error al obtener pacientes: ", error);
  });
}





///////////////////////////////////////////
///////////////////////////////////////////
searchAnalisisList() {
  console.log('entr seare');
  console.log('this.analisisbuscar', this.analisisbuscar);

  if (this.analisisbuscar == '' || this.analisisbuscar == null) {
    console.log("entre no hay dato");

    return
  }

  let data = this.queryservice.SearchAnalisxMstrs2(this.analisisbuscar);
  data.then((result: any) => {
    this.hiddenlistSearchAnalisis = false;
    console.log(result);
    let data = result.data.searchAnalisisMstrs2
    this.listSearchAnalisis = data;
    console.log('list', this.listSearchAnalisis);
console.log('Aqui aumenta el analisis debe en primera');
    if (this.listSearchAnalisis.length >= 10) {
      this.listSearchAnalisis.push({ 'mayor': true, 'message': 'Buscar mas ' })
    }
  });
}

close_analisis() {
  setTimeout(() => {
    this.hiddenlistSearchAnalisis = true
  }, 500)

}

selectAnalisis(item) {
  this.hiddenlistSearchAnalisis = true;
  console.log('Anmañsas', item)
  if (item.cod_ana) {
    console.log("entre if buscar");
    this.analisisbuscar = item.cod_ana;
    this.searchAnalisis()
  }
  if (item.mayor) {
    //  this.flagAnalaisisSearch=true;
    //  this.presentModalAnalisis();
  }
 if(this.tabla_Pagos.length>0){
  this.pago=[];
  this.bandera_limpia_vector_caja=1;
  this.toastservice.presentToast({ message: "Aumento un analisis tus pagos se volveran a recargar", position: "buttom", duration: "1500", color: "warning" });
 
}
}

searchAnalisis() {
  if (this.planSelected == null || this.planSelected == undefined) {
    this.toastservice.presentToast({ message: "Debe seleccionar un tipo de plan", position: "top", duration: 1500, color: "warning" });
    return
  }

  let message;
  /*
  this.translate.get('message.missfield').subscribe((res: string) => {
    message = res;
  });
  */
  if (this.analisisbuscar == '' || this.analisisbuscar == null) {
    let toastconf =
    {
      message: "Analisis vacio",
      style: 'warning',
      position: 'top'
    };
    this.toastservice.presentToast(toastconf);
    return
  }
  let cod_ana = this.analisisbuscar;
  let repetido = false
  console.log("this.list", this.listAnalisis);

  this.listAnalisis.forEach(element => {

    if (element.cod_ana == cod_ana) {
      console.log('repetido');
      repetido = true
    }
  });
  if (repetido) {
    /*
    this.translate.get('message.repeatAnalisis').subscribe((res: string) => {
      message = res;
    });
    */
    let toastconf =
    {
      message: "Análisis repetido",
      style: 'warning',
      position: 'top'
    };
    this.toastservice.presentToast(toastconf);
    this.analisisbuscar = ''
    return
  }



  let data = this.queryservice.SearchAnalisxMstrs(this.analisisbuscar);
  data.then(
    async (result: any) => {
      let data = result.data.AnalisisMstrsbyCod
      if (data.length > 0) {
        this.analisis = data[0];
        /*
        if (!this.orden_view) {
          */
          this.queryservice.getQuexAna({ cod_ana: this.analisis.cod_ana }).then((r: any) => {
            console.log('questions', r);
            let data_q: any = r.data.GetQuexAna;
            if (data_q.length > 0) {
              for (let index = 0; index < data_q.length; index++) {

                const element = data_q[index];
                element.des_ana = this.analisis.des_ana
                console.log('element questions', element);

                this.presentAlertQuestionsAna(element);
              }
            }

          })
          /*
        }
        */
        console.log("this.analisis", this.analisis);


        //estructura analisis---------------------------------------------------------------------
        this.analisis.aumento = false;
        this.analisis.dcto_val = 0.00;
        this.analisis.dcto_pet = 0.00;
        this.analisis.sts_pet = "PE";
        this.analisis.des_sts = "Pendiente";
        this.analisis.cant_pet = 1;
        if (this.analisis.dias_proceso) {
          console.log('fechasss', this.fechaEntrega.fecha1);
          let fechaCal: any = this.helper.calcDemora(this.analisis.demora, this.analisis.dias_proceso);
          console.log('fechaCal', fechaCal);

          this.analisis.fechaFinal = fechaCal;
          if (this.fechaEntrega.fecha1 == '') {
            console.log("entre fecha1 vacia");
            this.fechaEntrega.fecha1 = this.helper.soloFecha(fechaCal);
            // this.fechaEntrega.fecha1 = fechaCal.toISOString();
            console.log("entre fecha1 vacia", this.fechaEntrega.fecha1);
          } else {
            if (fechaCal > this.fechaEntrega.fecha1) {
              this.fechaEntrega.fecha1 = this.helper.soloFecha(fechaCal);
            }
          }
          this.analisis.fec_ent = this.analisis.fechaFinal;

          //   const lang = this.translate.getDefaultLang();

          var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

          this.analisis.fechaFinal = this.analisis.fechaFinal.toLocaleString(undefined, options);

        } else {
          this.analisis.fechaFinal = "";
          this.analisis.fecha_ent = null;
        }
        this.listAnalisis.push(this.analisis);
        this.analisisbuscar = ""
       }
      else {
        let message;
        /*
        this.translate.get('message.notfoundg').subscribe((res: string) => {
          message = "Not found revisar";
        });
*/
        let toastconf =
        {
          'message': "Not found revisar",
          'style': 'warning',
          'position': 'top'
        };
        this.toastservice.presentToast((toastconf));
        return
      }
    }
    ,
    (error) => {
      let message;
      /*
      this.translate.get('message.servererror').subscribe((res: string) => {
        message = res;
      });
*/
      let toastconf =
      {
        //      'message': message + " " + error,
        'message': "error revisar " + error,
        'style': 'warning',
        'position': 'top'
      };
      this.toastservice.presentToast((toastconf));
      return

    }
  ).finally(() => {
    //this.calcTotal()
    this.updatePreciosbyPlan('uno', this.analisis)
    setTimeout(() => {
      this.calcTotal()
      this.getMuestrasbyAnalisis();


    }, 1000)

  });
}

updatePreciosbyPlan(tipo, data) {
  console.log('updateplan', this.planSelected);

  let plan = this.planSelected;

  console.log('precios plan todo');
  for (let index = 0; index < this.listAnalisis.length; index++) {
    const element = this.listAnalisis[index];
    console.log("element preciooos", element);

    let flag_no_precio = false;
    let data_p = this.queryservice.getPrecios(element.cod_ana, plan.cod_lpr);
    data_p.then((result: any) => {
      console.log("result asdadasdadas", result);
      if (result.data.PreciosbySeguro == null) {
        if (!element.flag_no_precio) {
          this.toastservice.presentToast({ message: element.des_ana + " no tiene asignado un precio", duration: 2000, color: "warning", position: "center" });
        }
        flag_no_precio = true;
        element.flag_no_precio = flag_no_precio
        element.paso = true
        element.subtotal = 0;
        element.totalPac = 0;
        element.total_vista = "0.00";
        element.pospago = 0;
        return
      }
      let data = result.data.PreciosbySeguro;
      console.log(data);
      if (data.pre_ana == null || data.pre_ana == '') {
        data.pre_ana = 0;
        flag_no_precio = true;
      }
      let porcentaje = 0.00;
      if (plan.por_seg == 0 && data.por_seg == '0.00') {
        porcentaje = 0;
      }
      else if (plan.por_seg > 0) {
        porcentaje = plan.por_seg
      } else {
        porcentaje = data.por_seg
      }
      let pre_analisis = data.pre_ana * plan.fac_plan
      let pospago: any = this.helper.toFixed((pre_analisis * porcentaje), 2)
      //let pospago: any = this.helper.toFixed((data.pre_ana * porcentaje), 2)

      /*
      element.subtotal = (data.pre_ana - pospago);
       element.totalPac = (data.pre_ana - pospago);
       */
      element.flag_no_precio = flag_no_precio
      element.subtotal = (pre_analisis - pospago);
      element.totalPac = (pre_analisis - pospago);
      element.total_vista = (pre_analisis - pospago).toFixed(2);
      element.pospago = pospago;
    }, error => {
      console.log("entre al error", error);

    });
    setTimeout(() => { this.calcTotal() }, 1000);
  }
  return
}

calcTotal() {
  let total: number = 0.00;
  let pospago: number = 0.00
  let subtotal: number = 0.00
  let flag_aumento: boolean = false;
  let flag_bandera_0:boolean=false;
  if (this.listAnalisis.length > 0) {
    for (let i = 0; i < this.listAnalisis.length; i++) {
      console.log('this.listAnalisis[i]', this.listAnalisis[i]);
      if (this.listAnalisis[i].aumento) {
        flag_aumento = true;
        // this.listAnalisis.dcto_val=this.dataOrden.dcto_val
        if (this.dataOrden.dcto_val == 0) {
          this.listAnalisis[i].dcto_val = this.dataOrden.dcto_val;
          this.listAnalisis[i].aumento = false;
        } else {
          this.listAnalisis[i].dcto_val = this.dataOrden.dcto_val;
        }
      }

    }

    if (!flag_aumento && this.dataOrden.dcto_val != 0) {
      console.log('this.dataOrden.dcto_val revisar si entra: ',this.dataOrden.dcto_val);
      this.listAnalisis[this.listAnalisis.length - 1].dcto_val = this.dataOrden.dcto_val;
      // let dcto_val_json=this.listAnalisis[this.listAnalisis.length - 1].dcto_val;
      // let subtotal_json=this.listAnalisis[this.listAnalisis.length - 1].subtotal;
      // let suma_total_dolares=subtotal_json+dcto_val_json;
      // console.log('---------------suma_total_dolares:--------------------',suma_total_dolares);
      this.listAnalisis[this.listAnalisis.length - 1].aumento = true;
    }

  }

  this.listAnalisis.forEach((element, index) => {
    element.dcto_pet = this.dataOrden.dcto_ord;
    // element.dcto_val=this.dataOrden.dcto_val;
    // console.log('element.dcto_val: ',element.dcto_val);
    console.log('Elementoosssss: ',element);
    subtotal = subtotal + parseFloat(element.subtotal);``
    console.log('this.listAnalisis[i]', this.listAnalisis);

    if(this.dataOrden.dcto_val === 0){
      console.log('Anderson verifica por favor el doct_val');
    }else{

      let totalTemp = (((element.subtotal * element.dcto_pet) / 100) + parseFloat(element.subtotal) + parseFloat(element.dcto_val));
      element.totalPac = totalTemp;
      // this.dataOrden.subtotal=element.totalPac;
      flag_bandera_0=true;
     console.log('this.dataOrden.subtotal: ',element.totalPac);

    }
    if (this.dataOrden.dcto_ord != 0) {
      let totalTemp = (((element.subtotal * element.dcto_pet) / 100) + parseFloat(element.subtotal) + parseFloat(element.dcto_val));
      element.totalPac = this.helper.toFixed(totalTemp, 2);
    }else{
      if(flag_bandera_0){
        flag_bandera_0=false;
      }else{
        console.log('element.subtota: ',element.subtotal);
      console.log(' element.dcto_pet: ', element.dcto_pet);
      element.totalPac=element.subtotal;
      console.log('verificar el 00000000000000000000000000000000000000000000'+element.totalPac);
      flag_bandera_0=false;
      }    
         }
    total = total + parseFloat(element.totalPac);
    pospago = pospago + parseFloat(element.pospago);
    console.log('Elemneto verifiacr: ',element);
  });
  //  total=total+this.dataOrden.dcto_val;
  this.precioFinal = { total: total, pospago: pospago, subtotal: subtotal }
  this.dataOrden.pre_ord = subtotal;
  this.dataOrden.val_ord = total;
  this.total_ord = total.toFixed(2);

}

removeAnalisis(item) {
  for (let i = 0; i < this.listAnalisis.length; i++) {
    if (item.cod_ana == this.listAnalisis[i].cod_ana) {
      if (this.listAnalisis[i].aumento) {
        this.aplicoAumento = false;
      }
      this.listAnalisis.splice(i, 1);
      console.log('muestras', this.listMuestras);
      let temp_analisis_preguntas = this.preguntasAnalisis.filter(pregunta => pregunta.cod_ana != item.cod_ana);
      this.preguntasAnalisis = temp_analisis_preguntas;
      //this.removeMuestras(item);
      this.getMuestrasbyAnalisis();
    }
  }
  this.calcTotal()
  console.log('length analisis', this.listAnalisis.length);

console.log('this.pago.length: ',this.pago.length);

this.limpiar_pagos();

}

async getAnalisisIndividual(item) {
console.log('El item que viene de get AnalisisIndividual: ',item);

const modal = await this.modalController.create({
  component: GetAnalisisIndividualOrdenPage,
  componentProps: {
    'item':item,
    modalId: 'get_analisis_individual',
  },
  id:'get_analisis_individual'
});
modal.onDidDismiss()
  .then((result: any) => {   
  });
await modal.present();


}





getMuestrasbyAnalisis() {
  let cadena = "";
  let temporal = [];
  temporal = this.listAnalisis.filter(analisis => !analisis.flag_no_precio);
  console.log("temporallll", temporal);
  if (temporal.length == 0) {
    return
  }
  for (let index = 0; index < temporal.length; index++) {
    const element = temporal[index];
    if (index != 0) {
      cadena += ", "
    }
    cadena += "'" + element.cod_ana + "'";
  }

  this.queryservice.getMuestrasxAna(JSON.stringify({ analisis: cadena })).then(async (result: any) => {
    console.log('result', result);
    this.listMuestras = [];
    let data = JSON.parse(result.data.GetMuestrasxAnalisis.data)
    for await (const element of data) {
      //console.log("element",element);
      let muestra_temp = {
        des_mst: element.xdes_mst,
        cod_mst: element.xcod_mst,
        // analisis: data.cod_ana,
        fec_upd: new Date(),
        fec_ini: new Date(),
        fec_ent: new Date(),
        lock_mst: 0,
        checked: true,
        id_mxo: null
      }
      /*
      if (this.orden_view) {
        console.log('this.muestras_temp');

        for (let index = 0; index < this.muestras_temp.length; index++) {
          const element_temp = this.muestras_temp[index];
          console.log('element_temp mst', element_temp);

          if (element_temp.cod_mst == element.xcod_mst) {
            muestra_temp.id_mxo = element_temp.id_mxo
          }
        }
      }
*/
      this.listMuestras.push(muestra_temp)
      console.log('this.listMuestras', this.listMuestras);

    }

  }, error => {
    console.error('error', error);
  })
}



async presentPopoverMenu(ev: any) {
  const popover = await this.popoverController.create({
    component: MenuordenPage,
    event: ev,
    translucent: true,
    mode:"ios",
    size:"auto",
    side:"bottom",
    alignment:"end"

  });

  await popover.present();
}

changePrioritybtn(){
  if(this.dataOrden.stat_ord==1){
    this.dataOrden.stat_ord=2
    return
  }else if(this.dataOrden.stat_ord==2){
    this.dataOrden.stat_ord=0
    return
  }
  else{
    this.dataOrden.stat_ord=1
    return
  }
}


async presentAlertQuestionsAna(data) {
  const alert = await this.alertController.create({
    header: 'Responda por favor',
    subHeader: data.des_ana,
    message: data.cod_que,
    inputs: [
      {
        type: 'text',
        name: 'que_res'
      }
    ],
    buttons: [{
      text: "Aceptar",
      handler: (data_alert) => {
        console.log("data res", data_alert);
        this.preguntasAnalisis.push({
          cod_ana: data.cod_ana,
          des_ana: data.des_ana,
          cod_que: data.cod_que,
          res_que: data_alert.que_res
        })
      }
    }]
  });

  await alert.present();
}

async presentModalMuestras() {
  const modal = await this.modalController.create({
  component: MuestrasPage,
  componentProps: { listMuestras: this.listMuestras }
  });

  await modal.present();

}

async presentModalObservations(tipo) {
  const modal = await this.modalController.create({
    component: ChequeoOrdenPage,
    componentProps: {
      optEntrega: this.optEntrega,
      fechaEntrega: this.fechaEntrega,
      observaciones_usuario: this.observaciones_usuario,
      exclusive_ent: this.dataOrden.exclusive_ent,
      preguntas_ana: this.preguntasAnalisis,
      dataOrden: this.dataOrden,
      tipo: tipo
    }
  });
  this.dataOrden.stat_ord
  modal.onDidDismiss()
    .then((result: any) => {

      console.log(result)

      if (result.data.observaciones_usuario) {
        this.observaciones_usuario = result.data.observaciones_usuario
      };

      if (result.data.stat_ord) {
        this.dataOrden.stat_ord = result.data.stat_ord
      };

      if (result.data.tipo == 'S') {

       this.saveComplete()
      }
    });

  await modal.present();
}

async presentPopoverPago(ev: any) {
  const popover = await this.popoverController.create({
    component: PopoverPagoPage,
    event: ev,
    translucent: false,
    componentProps: {
      'dcto_ord': this.dataOrden.dcto_ord,
      'dcto_val': this.dataOrden.dcto_val,
      'val_ord': this.dataOrden.val_ord,
      'pre_ord': this.dataOrden.pre_ord,
    //  'listAnalisis': this.listAnalisis,
   //   'list_pagos': this.list_pagos

    },
    mode:"ios",
    cssClass:"pop_over_pago"
  });
  popover.onDidDismiss().then(
    ((result: any) => {
      console.log(result);

      let data = result.data.dataModal;
      if (data) {
        this.dataOrden.dcto_ord = data.dcto_ord,
          this.dataOrden.dcto_val = data.dcto_val,
          this.dataOrden.val_ord = data.val_ord,
          this.dataOrden.pre_ord = data.pre_ord,
          this.listAnalisis = data.listAnalisis,
       //   this.list_pagos = data.list_pagos
        this.calcTotal()
      }



    })
  )
  popover.present();
}


// async presentModalPago() {
//   const modal = await this.modalController.create({
//     component: CajaPage,
//     componentProps: {
//       'dcto_ord': this.dataOrden.dcto_ord,
//       'dcto_val': this.dataOrden.dcto_val,
//       'val_ord': this.dataOrden.val_ord,
//       'pre_ord': this.dataOrden.pre_ord,
//     //  'listAnalisis': this.listAnalisis,
//    //   'list_pagos': this.list_pagos

//     },
//   });

//   modal.present()
// }

limpiar_pagos(){

  this.pago=[];
  this.bandera_limpia_vector_caja=1;
  this.toastservice.presentToast({ message: "Eliminaste un analisis tus pagos se volveran a recargar", position: "buttom", duration: "1500", color: "danger" })


  //this.tabla_Pagos=[];
}

async presentModalPago() {
    const numeroAnalisisAntes = this.listAnalisis.length;
  console.log(`Número de análisis antes de abrir el modal: ${numeroAnalisisAntes}`);
  const modal = await this.modalController.create({
    component: CajaPage,
    componentProps: {
      'dcto_ord': this.dataOrden.dcto_ord,
      'dcto_val': this.dataOrden.dcto_val,
      'val_ord': this.dataOrden.val_ord,
      'pre_ord': this.dataOrden.pre_ord,
      'codigo_orden_completa': this.codigo_orden_completa,
      'variableUsuario': this.variableUsuario,
      json_data: this.json_data,
      'tabla_Pagos': this.tabla_Pagos,
      'bandera_limpia_vector_caja':this.bandera_limpia_vector_caja,
      'analisis':this.listAnalisis,
      'numeroAnalisisAntes': numeroAnalisisAntes,

    },
  });
  modal.onDidDismiss()
    .then((result: any) => {
     this.pago=result.data.pagos_arreglo;
     this.bandera_limpia_vector_caja=result.data.bandera_limpia_vector_caja;
      if (result.data.tipo == 'P') {
        // this.saveComplete();
        console.log('this.pago arreglo: ', this.pago);    
           }        
         this.tabla_Pagos=this.pago;  
           console.log('pago: ',this.pago);
    });
  await modal.present();
}

saveComplete() {

  if (this.orden_view) {
    this.toastservice.presentToast({ message: "No puede guardar una orden en modo vista", position: "top", duration: "1500", color: "danger" })
    return
  }

  if (this.listAnalisis.length == 0) {
    this.toastservice.presentToast({ message: "No existen análisis para guardar orden", position: "top", duration: "1500", color: "warning" })
    return
  }


  if (this.paciente.cod_pac == null || this.paciente.cod_pac == '') {
    this.toastservice.presentToast({ message: "Falta información del paciente", position: "top", duration: "1500", color: "warning" })
    return
  } else { this.dataOrden.cod_pac = this.paciente.cod_pac; }

  if (this.medico.cod_med == null || this.medico.cod_med == 'null') {
    this.toastservice.presentToast({ message: "Falta información del médico", position: "top", duration: "1500", color: "warning" })
    return
  } else { this.dataOrden.cod_med = this.medico.cod_med; }

  if (this.fechaEntrega.fecha1 == '') {
    this.dataOrden.fec_ent = this.helper.fechaFormato(new Date, this.hora_entrega)
  } else {
    this.dataOrden.fec_ent = this.helper.fechaFormato(this.fechaEntrega.fecha1, this.hora_entrega)
  }
  if (this.fechaEntrega.fecha2 != '') {
    this.dataOrden.FEC_ENT2 = this.fechaEntrega.fecha2
  } else {
    this.dataOrden.FEC_ENT2 = null
  }

  for (let i = 0; i < this.optEntrega.length; i++) {
    if (this.optEntrega[i].tipo == 'mail') {
      if (this.optEntrega[i].checked) {
        this.dataOrden.mail_ent = 1;
        this.dataOrden.mail_ent_det = this.optEntrega[i].value
      }
      else {
        this.dataOrden.mail_ent = 0;
        this.dataOrden.mail_ent_det = null;
      }
    }
    if (this.optEntrega[i].tipo == 'dictar') {
      if (this.optEntrega[i].checked) {
        this.dataOrden.dicta_ent = 1;
        this.dataOrden.dicta_ent_det = this.optEntrega[i].value
      }
      else {
        this.dataOrden.dicta_ent = 0;
        this.dataOrden.dicta_ent_det = null;
      }
    }
    if (this.optEntrega[i].tipo == 'fisico') {
      if (this.optEntrega[i].checked) {
        this.dataOrden.envio_ent = 1;
        this.dataOrden.envio_ent_det = this.optEntrega[i].value
      }
      else {
        this.dataOrden.envio_ent = 0;
        this.dataOrden.envio_ent_det = null;
      }
    }
    if (this.optEntrega[i].tipo == 'copia') {
      if (this.optEntrega[i].checked) {
        this.dataOrden.copia_ent = 1;
        this.dataOrden.cod_med2 = this.optEntrega[i].value
      }
      else {
        this.dataOrden.copia_ent = 0;
        this.dataOrden.cod_med2 = null;
      }
    }
    if (this.optEntrega[i].tipo == 'pedidomed') {
      if (this.optEntrega[i].checked) {
        this.dataOrden.pedido_ent = 1;
      }
      else {
        this.dataOrden.pedido_ent = 0;
      }
    }
  }

  this.dataOrden.cod_ori = 2;
  let forden = new Date();
  this.dataOrden.fec_ord = this.helper.soloFecha(forden);
  this.dataOrden.dcto_ord = (this.dataOrden.dcto_ord / 100);
  this.dataOrden.id_plan = this.planSelected.id_plan;

  let observaciones = '';
  if (this.flag_referencia) {
    observaciones += "Orden ingresada por Referencia "
    this.dataOrden.user_type = 'ref',
      this.dataOrden.user_code = this.varGlobal.getVarUsuario()


  }
  this.preguntasAnalisis.forEach(element => {
    observaciones += element.cod_que + " " + element.res_que + "\n"
  });
  this.dataOrden.txt_ord = this.observaciones_usuario + "\n" + observaciones;
  this.dataOrden.num_analisis = this.listAnalisis.length;
  this.dataOrden.num_muestras = this.listMuestras.length;


  let Analisis_final = this.saveAnalisis();
  let Muestras_final = this.saveMuestras()


  if (Analisis_final.length == 0) {
    this.toastservice.presentToast({ message: "No existen análisis para guardar orden", position: "top", duration: "1500", color: "warning" })
    return
  }

  this.json_data = {
    orden: this.dataOrden,
    //  pago: this.list_pagos,
    muestras: Muestras_final,
    analisis: Analisis_final
  }
  console.log('Json Data: <------------------>: ', this.json_data);
  
  if(this.paciente_completo){
    this.dataOrden.cod_pac2=this.paciente_completo.cod_pac;   
  }else{    
    this.dataOrden.cod_pac2=null;
    const nativeEl = this.accordionGroup; 
    if (nativeEl.value === 'first') {
      nativeEl.value = undefined;
    } else {
      nativeEl.value = 'first';
    }
    this.bloquearIonItem=false;
  }
  this.facturarPaciente();
  this.loadingservice.present("Ingresando Orden");
//   this.queryservice.insertOrden({

//     jsonAnalisis: JSON.stringify(Analisis_final),
//     jsonMuestras: JSON.stringify(Muestras_final),
//     jsonOrden: JSON.stringify(this.dataOrden)

//   }).then 
//     ((result: any) => {
//       this.loadingservice.dismiss()
//       console.log("ingresooo", result);
//       if (result.data.insertOrdenCompleta.resultado == 'ok') {
//         let data = JSON.parse(result.data.insertOrdenCompleta.data);

//         this.codigo_orden_completa = data[0].nro_ord;
//         console.log('codigo_orden_completa dentro del metodo save: ', this.codigo_orden_completa);
//         let toastconf =
//         {
//           'message': "Orden ingresada con exito",
//           'color': 'success',
//           'position': 'top',
//           'duration': 1500,
//         };
//         this.varGlobal.getVarUsuarioDes();
//         let detalle = "Ingreso de Orden por referencia -Paciente=" + this.paciente.cod_pac + "; Nombre=" + this.paciente.nombre_completo + "; Medico=" + this.medico.cod_med + "; Plan=" + this.dataOrden.id_plan + "; Entrega=" + this.dataOrden.fec_ent + ";Valor=" + this.dataOrden.val_ord.toFixed(2) + "; Pagos=0; Saldo=" + this.dataOrden.val_ord.toFixed(2)
//         this.funcionesComunes.enviaAuditoria('Ref.' + this.varGlobal.getVarUsuarioDes(), data[0].nro_ord, 'DEMO', detalle)
//         let detalle_pet = "Ingreso de peticion "
//         for (let index = 0; index < Analisis_final.length; index++) {
//           const element = Analisis_final[index];
//           detalle_pet = element.cod_ana + "; "

//         }
//         this.funcionesComunes.enviaAuditoria('Ref.' + this.varGlobal.getVarUsuarioDes(), data[0].nro_ord, 'PETICION', detalle_pet)

//         this.variableUsuario = this.varGlobal.getVarUsuario();
//         console.log('Variable Usuario------------------------------------: ', this.variableUsuario);


//         let detalle_mst = "Ingreso de muestra "
//         for (let index = 0; index < Muestras_final.length; index++) {
//           const element = Muestras_final[index];
//           detalle_mst = element.cod_mst + "; "

//         }

//         this.funcionesComunes.enviaAuditoria('Ref.' + this.varGlobal.getVarUsuarioDes(), data[0].nro_ord, 'MUESTRA', detalle_mst)

//         let list_ord_print = [];
//         list_ord_print.push({ tipo: "ord", data: data[0].nro_ord });
//         let mst_temp = data[0].mst.split(' ');
//         for (let index = 0; index < mst_temp.length; index++) {
//           let element = mst_temp[index];
//           if (element != '') {
//             list_ord_print.push({ tipo: "mst", data: element, nro_ord: data[0].nro_ord });
//           }
//         }
//         this.toastservice.presentToast(toastconf);
// ////  INICIO DE CONTROL DE PAGOS/////////////////////////////////////////////////////////

// this.pago.cod_cli = this.json_data.orden.cod_pac;
// this.pago.cod_ori = this.json_data.orden.cod_ori;
// this.pago.cod_suc = this.json_data.orden.cod_suc;
// this.pago.first_user = this.variableUsuario;
// this.pago.last_user = this.variableUsuario;
// this.pago.nro_ord = this.codigo_orden_completa;



// // this.queryservice.insertPago(JSON.stringify(this.pago))
// this.queryservice.insertPago({json_data:JSON.stringify(this.pago)})
//   .then((result: any) => {
//     console.log('Resultado de haber ingresado el de la orden completa: ', result);
//   })
//   .catch(error => {
//     console.log('Error al ingresar el pago de la orden: ', error);
//   });


//       }
//      if (result.data.insertOrdenCompleta.resultado == 'error') {
//         let toastconf =
//         {
//           'message': "Error al ingresar la orden..intentelo otra vez o consulte a soporte",
//           'style': 'Warning',
//           'position': 'top'
//         };
//         this.toastservice.presentToast(toastconf);
//         //this.loading.dismiss();
//       }

     this.presentModalFactura();

//     }).catch(error => {
//       console.log('Error en la promesa: ', error);
//       // Manejo de errores generales aquí, si es necesario
//     });
}

facturarPaciente() {
  const nativeEl = this.accordionGroup; 
  if (nativeEl.value === 'first') {
    nativeEl.value = undefined;
  } else {
    nativeEl.value = 'first';
  }
  if(this.paciente_completo){
    let codigoPaciente = this.paciente_completo.cod_pac;
    if(this.paciente_completo.cod_pac===undefined){    
    }else{
    if (this.paciente_completo_bolean) {      
      this.paciente_completo.cod_pac=codigoPaciente;
    } else {
           this.paciente_completo.cod_pac=this.paciente.cod_pac; 
    }
  }
  }else{
    this.paciente_completo=this.paciente.cod_pac;
    console.log('El this.paciente_completo se encuentra vacion: ',this.paciente_completo);
  }
}



Eliminar_Paciente_Tercero(){
  this.advertecia_Eliminar_Paciente_Tercero();  
  const nativeEl = this.accordionGroup; 
  if (nativeEl.value === 'first') {
    nativeEl.value = undefined;
  } else {
    nativeEl.value = 'first';
  }
}


async advertecia_Eliminar_Paciente_Tercero() {
  const alert = await this.alertController.create({
    header: 'Estás seguro',
    message: '¿De eliminar el paciente de facturacion a tercero?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Operación cancelada.');
        }
      },
      {
        text: 'Aceptar',
        handler: () => {
          if(this.paciente_completo){

            if(this.paciente_completo.cod_pac===undefined){    
            }else{
            if (this.paciente_completo_bolean_eliminar) {      
              this.paciente_completo=this.paciente;
              this.bloquearIonItem=false;
            } 
          }
          }else{
            this.paciente_completo=this.paciente;
            this.bloquearIonItem=false;
          }
          this.input_paciente_terceros=' ';
          console.log('El Eliminar_Paciente_Tercero verificar: ',this.paciente_completo);
          this.paciente_completo=undefined;

        }
      }
    ]
  });

  await alert.present();
}

async presentModalFactura() {
  console.log('Entra ala modal de factura json_data verifica modal PresentFacura: ',this.json_data);
  const modal = await this.modalController.create({
    component: IngresoFacturaPage,
    componentProps: {
      'dcto_ord': this.dataOrden.dcto_ord,
      'dcto_val': this.dataOrden.dcto_val,
      'val_ord': this.dataOrden.val_ord,
      'pre_ord': this.dataOrden.pre_ord,
      'codigo_orden_completa': this.codigo_orden_completa,
      'variableUsuario': this.variableUsuario,
      json_data: this.json_data,
      'tabla_Pagos': this.tabla_Pagos,
    },
  });
  modal.onDidDismiss()
    .then((result: any) => {
    });
  await modal.present();
}

saveAnalisis() {
  //let fecha;
  let peticionCompleta = [];
  if (this.listAnalisis.length == 0) {
    return null
  } else {
    this.listAnalisis.forEach(element => {
      console.log('fecha', element.fec_ent);
      console.log('formato', this.helper.fechaFormato(element.fec_ent, this.hora_entrega));
      console.log('solo formato', this.helper.soloFecha(element.fec_ent));
      if (!element.flag_no_precio) {
        let peticion = {
          "cod_ana": element.cod_ana,
          "id_plan": this.dataOrden.id_plan,
          "cod_ref": this.dataOrden.cod_ref,
          "pre_pac": element.subtotal,
          "pre_seg": element.pospago,
          "dcto_val": element.dcto_val,
          "dcto_pet": (element.dcto_pet / 100),
          "cod_suc": this.dataOrden.cod_suc,
          "tip_ser": element.tip_ser,
          "sts_pet": 'PE',
          //   "fec_ent": this.helper.toUnicode(this.helper.fechaFormato(element.fec_ent)),
          "fec_ent": this.helper.fechaFormato(element.fec_ent, this.hora_entrega),
          "valor_pet": element.totalPac,
          "pet_adi": 0,
          "sts_adm": 'PE',
          "cant_pet": element.cant_pet
        }
        peticionCompleta.push(peticion);
      }
    }
    );

    return peticionCompleta
  }
}


saveMuestras() {

  let muestraCompleta = [];

  if (this.listMuestras.length == 0) {
    return null
  } else {
    this.listMuestras.forEach(element => {

      let muestras = {
        //'nro_ord':nro_ord,
        'cod_suc': this.dataOrden.cod_suc,
        'cod_mst': element.cod_mst,
        'lock_mst': element.lock_mst,
        'fec_upd': this.helper.fechaFormato(element.fec_upd, null),
        'fec_ent': this.helper.fechaFormato(element.fec_ini, null),//nom cambia
        'fec_ini': this.helper.fechaFormato(element.fec_ini, null),//no cambia


        'last_user': null,
        'first_user': null,
        'per_toma': null,
        'fec_toma': null
      }

      muestraCompleta.push(muestras);


      console.log('muestras', element);

    });

    return muestraCompleta
  }

}

}
