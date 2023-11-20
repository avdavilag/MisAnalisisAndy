import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { HelperService } from 'src/app/servicios/helpers/helper.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { PerfilesavaPage } from '../../modals/perfilesava/perfilesava.page';
import { ChequeoOrdenPage } from '../../modals/orden/chequeo-orden/chequeo-orden.page';
import { WebRestService } from 'src/app/servicios/intranet/web-rest.service';
import { AppConfigService } from '../../utils/app-config-service';
import { Router } from '@angular/router';
import { FuncionesComunesIntra } from 'src/app/utils/funciones-comunes-intra';
import { CrearpacientePage } from '../../modals/crearpaciente/crearpaciente.page';
@Component({
  selector: 'app-ingreso-orden',
  templateUrl: './ingreso-orden.page.html',
  styleUrls: ['./ingreso-orden.page.scss'],
})
export class IngresoOrdenPage implements OnInit {

  options_select = {
    cssClass: 'alert_select',
  }

  inputCedula: any;
  inputMedico: any;
  disabled_cedula: boolean = false;
  origen_lab: any = null;
  listSeguro: any;
  listUnidad: any;
  plan: any;
  listAnalisis: any = [];
  analisis: any;
  paciente = {
    cod_pac: null,
    id_pac: null,
    nombre_completo: null,
    nom_pac: null,
    ape_pac: null,
    edad: null,
    fec_nac: null,
    mail_pac: null,
    sex_pac: null,
    hidden: true
  };

  flag_paciente: boolean = false;

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
    

   }

  medico: any = null;
  analisisbuscar: any = '';
  fechaEntrega: any = {
    fecha1: '',
    fecha2: ''
  }
  planSelected: any;
  listMuestras: any = [];
  edit: boolean = false;
  precioFinal: any = null;
  listSearchAnalisis: any = [];
  hiddenlistSearchAnalisis = true;
  aplicoAumento: boolean = false;
  preguntasAnalisis: any = [];
  observaciones_usuario = '';
  muestras_temp: any = [];
  hora_entrega: String = "00:00"
  printer_name = "";
  optEntrega = [
    { tipo: "mail", input: true, icon: "mail-outline", checked: false, tag: "Mail", value: "", tinput: "text" },
    { tipo: "dictar", input: true, icon: "call-outline", checked: false, tag: "Dictar", value: "", tinput: "text" },
    { tipo: "fisico", input: true, icon: "newspaper-outline", checked: false, tag: "Entregar Físico", value: "", tinput: "text" },
    { tipo: "copia", input: true, icon: "copy-outline", checked: false, tag: "Entregar Copia", value: "", tinput: "number" },
    { tipo: "pedidomed", input: true, icon: "hand-right-outline", checked: false, tag: "Entregar Pédido Médico", value: "", hidden: "true" }
  ];
  orden_view: any;
  flag_referencia: boolean = false;
  public mobile = false;
  constructor(
    private toastservice: ToastService,
    private queryservice: QueryService,
    private loadingservice: LoadingService,
    private varGlobal: VariablesGlobalesService,
    private alertController: AlertController,
    private helper: HelperService,
    private modalcontroller: ModalController,
    private webrestservice: WebRestService,
    private appconfigservice: AppConfigService,
    private router: Router,
    private funcionesComunes: FuncionesComunesIntra


  ) {
  }

  ngOnInit() {

    //  let printer_name=null

    if (sessionStorage.getItem("printer_name")) {
      this.printer_name = sessionStorage.getItem("printer_name")
    } else {
      this.printer_name = this.appconfigservice.printer_name;
    }


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
    this.getUnidad();
    this.InitValues(true)

  }

  InitValues(show_alert) {
    if (this.varGlobal.getVarUsuarioTipo() == 'ref') {

      this.flag_referencia = true;
      this.inputMedico = this.appconfigservice.cod_med_default;
      this.getMedico()
      console.log('this.varGlobal.getVarUsuario()', this.varGlobal.getVarUsuario());

      this.dataOrden.cod_ref = this.varGlobal.getVarUsuario()
      this.queryservice.getReferenciabyCod({ cod_ref: this.varGlobal.getVarUsuario() }).then((r: any) => {

        console.log("eferer", r);
        let data = r.data.ReferenciaByCod


        if (data.id_plan && data.cod_ori) {
          this.getOrigen()
          /*
               this.listSeguro.forEach(element => {
                 for (let index = 0; index < element.Plan.length; index++) {
                   const element1 =  element.Plan[index];
                   if(element1.id_plan==data.id_plan){
                     this.planSelected = element1;
                   }
                 }
           
         
             
           });
           */
          this.queryservice.getPlanxIdplan({ id_plan: data.id_plan }).then((r: any) => {
            console.log("plan referencia", r);
            this.planSelected = r.data.PlanxIdplan;
            console.log('this.planSelected', this.planSelected);

          }, error => {
            console.log(error);

          })
        }
        else {
          if (!show_alert) {
            return
          }
          this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor intente nuevamente o contacte con soporte.\n<br><small>Hace falta la configuracion de varios parametros</small>").finally(() => {
            console.log("entre al finally");

            this.router.navigateByUrl('/home-medico/lista-ordenes', { replaceUrl: true })
          })
        }


      })

    } else {
      this.getOrigen
      this.getSeguro()
    }
  }
  ionViewWillLeave() {
    console.log('treeeeeee');

    this.resetOrden()
  }

  ionViewWillEnter() {
    if (this.varGlobal.getVarUsuarioTipo() == 'ref') {

      this.getMedico()
    }

    this.orden_view = this.varGlobal.getOrden_view();
    this.varGlobal.setOrden_view(null);
    console.log('this.orden_view', this.orden_view);

    if (this.orden_view) {
      this.queryservice.getMstxOrden(this.orden_view.nro_ord).then((r: any) => {
        console.log('resultado msrt', r);
        this.muestras_temp = r.data.MuestraxOrden
        console.log('muestras_temp msrt', this.muestras_temp);
      })
      this.queryservice.getOrdenByOrd(this.orden_view.nro_ord).then((r: any) => {
        console.log("resutado orden", r);
        let orden_temp = r.data.OrdenByOrd

        for (let i = 0; i < this.optEntrega.length; i++) {
          if (this.optEntrega[i].tipo == 'mail') {
            if (orden_temp.mail_ent == 1) {
              this.optEntrega[i].checked = true
              this.optEntrega[i].value = orden_temp.mail_ent_det
            }
          }
          if (this.optEntrega[i].tipo == 'dictar') {
            if (orden_temp.dicta_ent == 1) {
              this.optEntrega[i].checked = true
              this.optEntrega[i].value = orden_temp.dicta_ent_det
            }
          }
          if (this.optEntrega[i].tipo == 'fisico') {

            if (orden_temp.envio_ent == 1) {
              this.optEntrega[i].checked = true
              this.optEntrega[i].value = orden_temp.envio_ent_det
            }
          }
          if (this.optEntrega[i].tipo == 'copia') {

            if (orden_temp.copia_ent == 1) {
              this.optEntrega[i].checked = true
              this.optEntrega[i].value = orden_temp.cod_med2
            }


          }
          if (this.optEntrega[i].tipo == 'pedidomed') {

            if (orden_temp.pedido_ent == 1) {
              this.optEntrega[i].checked = true
            }

          }
        }

        this.inputCedula = this.orden_view.id_pac
        this.inputMedico = this.orden_view.cod_med
        this.getMedico()
        this.getPaciente()
        this.observaciones_usuario = orden_temp.txt_ord
        this.dataOrden.stat_ord = orden_temp.stat_ord
        this.dataOrden.nro_ext=orden_temp.nro_ext
        this.dataOrden.obs_ext=orden_temp.obs_ext
        this.fechaEntrega.fecha1 = this.helper.soloFecha(orden_temp.fec_ent)
        if (orden_temp.FEC_ENT2) {
          this.fechaEntrega.fecha2 = this.helper.soloFecha(orden_temp.FEC_ENT2)
        }
        if (this.listUnidad.length > 0 && orden_temp.cod_uni != null) {
          this.dataOrden.cod_uni = orden_temp.cod_uni
        }


        this.queryservice.getPlanxIdplan({ id_plan: orden_temp.id_plan }).then((r: any) => {
          console.log("plan referencia", r);
          this.planSelected = r.data.PlanxIdplan;
          console.log('this.planSelected', this.planSelected);

        }, error => {
          console.log(error);

        })


        this.queryservice.getAnalisisxOrden({ nro_ord: this.orden_view.nro_ord }).then((r_ana: any) => {
          console.log("analiss orden view", r_ana);
          let temp_analisis = r_ana.data.searchAnalisisxOrden;

          for (let index = 0; index < temp_analisis.length; index++) {
            const element = temp_analisis[index];

            element.fechaFinal = this.helper.soloFecha(element.fec_ent);
            //   element.des_sts = "Pendiente";
            // element.sts_pet = "PE";


            //  this.selectAnalisis(element)
            this.helper.soloFecha(orden_temp.fec_ent)

            this.listAnalisis.push(element)
          }

          ;

          this.updatePreciosbyPlan('uno', this.analisis)
          setTimeout(() => {
            this.calcTotal()
            this.getMuestrasbyAnalisis();


          }, 1000)

        })




      })
    }
  }

  getSeguro() {


    this.queryservice.getListSeguro().then((r: any) => {
      console.log('planes', r);
      this.listSeguro = r.data.ListSeguro;
      this.planSelected = this.listSeguro[0].Plan[0];

    })
  }

  getPaciente() {

    if (this.inputCedula === '') {
      this.resetpaciente();
      let toastconf =
      {
        'message': 'Ingrese la cédula del paciente',
        'style': 'warning',
        'position': 'top'
      };
      this.toastservice.presentToast((toastconf));
      return
    }
    this.loadingservice.present('Cargar Paciente');
    let data = this.queryservice.getPacientesbyId(this.inputCedula);
    data.then(result => {
      let data;
      data = result.data;
      console.log(data);
      if (data.getPaciente != null) {

        if (data.getPaciente.id_pac != null) {
          this.paciente = data.getPaciente;
          this.flag_paciente = true;
          this.loadingservice.dismiss();
        }
        else {
          let toastconf =
          {
            'message': 'No se encontro el paciente',
            'style': 'warning',
            'position': 'top'
          };
          this.toastservice.presentToast((toastconf));
          this.loadingservice.dismiss();
          return
        }
      } else {
        this.paciente.hidden = true
        let toastconf =
        {
          'message': 'No se encontro una persona con ese número de cédula',
          'style': 'warning',
          'position': 'top'
        };
        this.toastservice.presentToast((toastconf));
        this.loadingservice.dismiss();
        return
      }
    },
      (error) => {
        let toastconf =
        {
          'message': "Ocurrio un error: " + error,
          'style': 'warning',
          'position': 'top'
        };
        this.loadingservice.dismiss();
        this.toastservice.presentToast((toastconf));
        return
      })

  }

  getMedico() {
    let cod_medt = ""

    if (this.varGlobal.getVarUsuarioTipo() == 'ref') {

      this.inputMedico = this.appconfigservice.cod_med_default;
    }
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

  resetpaciente() {
    this.paciente.cod_pac = null
    this.paciente.id_pac = null
    this.paciente.nombre_completo = null
    this.paciente.nom_pac = null
    this.paciente.ape_pac = null
    this.paciente.edad = null
    this.paciente.fec_nac = null
    this.paciente.mail_pac = null
    this.paciente.sex_pac = null
    this.paciente.hidden = true
    this.flag_paciente = false
    this.inputCedula = ''
  }

  getOrigen() {

    if (this.varGlobal.getVarUsuarioTipo() == 'ref') {

      this.queryservice.getReferenciabyCod({ cod_ref: this.varGlobal.getVarUsuario() }).then((r: any) => {

        console.log("efererOrigennn", r);
        let data = r.data.ReferenciaByCod
        this.queryservice.getOrigenbyCod({ cod_ori: data.cod_ori }).then(r => {
          console.log('r origen ref', r);

          this.varGlobal.setOrigenOrden(r.data.OrigenByCod);
          this.origen_lab = this.varGlobal.getOrigenOrden()
          console.log("this.origen_lab", this.origen_lab);
          this.dataOrden.cod_ori = this.origen_lab.cod_ori
          this.hora_entrega = this.origen_lab.hora_ori
        })
      })



    }

    else {
      this.origen_lab = this.varGlobal.getOrigenOrden()
      if (this.varGlobal.getOrigenOrden() != null) {
        console.log("entre if");
        this.dataOrden.cod_ori = this.origen_lab.cod_ori
        this.origen_lab = this.varGlobal.getOrigenOrden()
        console.log("this.origen_lab", this.origen_lab);
        this.hora_entrega = this.origen_lab.hora_ori
        console.log("this.origen_lab", this.origen_lab);
      }

      else {

        console.log("entre al else origen");

        this.presentAlertOrigen()
      }
    }
  }

  async presentAlertOrigen() {
    let list_ori
    this.queryservice.getListOrigen().then((r: any) => {
      console.log(r);
      list_ori = r.data.ListOrigen
    }).finally(async () => {
      let buttons = []
      list_ori.forEach(element => {


        buttons.push(
          {
            text: element.des_ori,
            //cssClass:""+element.style,
            handler: () => {
              console.log('Confirm Cancel: blah', element.des_ori);
              this.varGlobal.setOrigenOrden(element);
              this.getOrigen()
            }
          })

      });


      const alert = await this.alertController.create({
        subHeader: 'Seleccione el Origen',
        buttons: buttons
      });

      await alert.present();


    })

  }
  getUnidad() {
    this.queryservice.getListUnidad().then((r: any) => {
      this.listUnidad = r.data.ListUnidad;
      console.log(this.listUnidad);
    })
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
          if (!this.orden_view) {
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
          }
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

        this.listMuestras.push(muestra_temp)
        console.log('this.listMuestras', this.listMuestras);

      }

    }, error => {
      console.error('error', error);
    })
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
        this.listAnalisis[this.listAnalisis.length - 1].dcto_val = this.dataOrden.dcto_val;
        this.listAnalisis[this.listAnalisis.length - 1].aumento = true;
      }

    }
    this.listAnalisis.forEach((element, index) => {
      element.dcto_pet = this.dataOrden.dcto_ord;
      subtotal = subtotal + parseFloat(element.subtotal);




      if (this.dataOrden.dcto_ord != 0) {

        let totalTemp = (((element.subtotal * element.dcto_pet) / 100) + parseFloat(element.subtotal) + element.dcto_val);
        element.totalPac = this.helper.toFixed(totalTemp, 2);

      }
      total = total + parseFloat(element.totalPac);
      pospago = pospago + parseFloat(element.pospago);

    });
    //  total=total+this.dataOrden.dcto_val;
    this.precioFinal = { total: total, pospago: pospago, subtotal: subtotal }

    this.dataOrden.pre_ord = subtotal;
    this.dataOrden.val_ord = total;
    this.total_ord = total.toFixed(2);

  }

  total_ord = "";
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

      if (this.listSearchAnalisis.length >= 10) {
        this.listSearchAnalisis.push({ 'mayor': true, 'message': 'Buscar mas ' })
      }
    });
  }

  focusAnalisis(opt) {
    console.log(opt);

    console.log('perdio el blur');
    if (opt) {
      //this.hiddenlistSearchAnalisis=opt;
      return
    }
    if (!opt) {
      this.searchAnalisisList();
      return
    }


  }

  selectAnalisis(item) {
    this.hiddenlistSearchAnalisis = true;
    console.log('Anmañsas', item)
    if (item.cod_ana) {
      this.analisisbuscar = item.cod_ana;
      this.searchAnalisis()
    }
    if (item.mayor) {
      //  this.flagAnalaisisSearch=true;
      //  this.presentModalAnalisis();

    }
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


  }

  async presentModalPerfilesAva() {
    const modal = await this.modalcontroller.create({
      cssClass: 'modal_analisisA',
      component: PerfilesavaPage,
      backdropDismiss: false
    });
    modal.onDidDismiss().then(async (result: any) => {
      let data = result.data
      if (this.orden_view) {
        return
      }
      if (data.analisis) {

        for (let index = 0; index < data.analisis.length; index++) {
          if (data.analisis[index] != '') {
            this.analisisbuscar = await data.analisis[index].cod_ana;
            console.log('this.analisisbuscar', this.analisisbuscar);

            this.searchAnalisis();
          }
        }

      }
    })
    return await modal.present();
  }

  close_analisis() {
    setTimeout(() => {
      this.hiddenlistSearchAnalisis = true
    }, 500)

  }

  async presentAlertChangePacient() {
    const alert = await this.alertController.create({
      header: 'Cambiar paciente',
      message: 'Esta seguro de Cambiar de Paciente',
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
            this.resetpaciente();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }



  async presentModalObservations(tipo) {
    const modal = await this.modalcontroller.create({
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

    console.log('plann:', this.fechaEntrega);
    let forden = new Date();
    this.dataOrden.fec_ord = this.helper.soloFecha(forden);
    this.dataOrden.dcto_ord = (this.dataOrden.dcto_ord / 100);
    this.dataOrden.id_plan = this.planSelected.id_plan;

    let observaciones = '';
    if (this.flag_referencia) {
      observaciones += "Orden ingresada por Referencia "
      this.dataOrden.user_type='ref',
      this.dataOrden.user_code=this.varGlobal.getVarUsuario()


    }
    this.preguntasAnalisis.forEach(element => {
      observaciones += element.cod_que + " " + element.res_que + "\n"
    });
    this.dataOrden.txt_ord = this.observaciones_usuario + "\n" + observaciones;

    console.log('orden', this.dataOrden);
    console.log('orden', JSON.stringify(this.dataOrden));
    console.log('MUESTRAS', JSON.stringify(this.listMuestras));
    //console.log('pagos',JSON.stringify(this.list_pagos));
    console.log('analisis', JSON.stringify(this.listAnalisis));


    this.dataOrden.num_analisis = this.listAnalisis.length;
    this.dataOrden.num_muestras = this.listMuestras.length;


    let Analisis_final = this.saveAnalisis();
    let Muestras_final = this.saveMuestras()


    if (Analisis_final.length == 0) {
      this.toastservice.presentToast({ message: "No existen análisis para guardar orden", position: "top", duration: "1500", color: "warning" })
      return
    }

    let json_data = {
      orden: this.dataOrden,
      //  pago: this.list_pagos,
      muestras: Muestras_final,
      analisis: Analisis_final
    }
    console.log('json', JSON.stringify(json_data));

    this.loadingservice.present("Ingresando Orden")
    this.queryservice.insertOrden({

      jsonAnalisis: JSON.stringify(Analisis_final),
      jsonMuestras: JSON.stringify(Muestras_final),
      jsonOrden: JSON.stringify(this.dataOrden)


    }).then
      ((result: any) => {
        this.loadingservice.dismiss()
        console.log("ingresooo", result);

        if (result.data.insertOrdenCompleta.resultado == 'ok') {
          let data = JSON.parse(result.data.insertOrdenCompleta.data);
          console.log('data_result', data);

          let toastconf =
          {
            'message': "Orden ingresada con exito",
            'color': 'success',
            'position': 'top',
            'duration': 1500,
          };

          this.varGlobal.getVarUsuarioDes();
          let detalle = "Ingreso de Orden por referencia -Paciente=" + this.paciente.cod_pac + "; Nombre=" + this.paciente.nombre_completo + "; Medico=" + this.medico.cod_med + "; Plan=" + this.dataOrden.id_plan + "; Entrega=" + this.dataOrden.fec_ent + ";Valor=" + this.dataOrden.val_ord.toFixed(2) + "; Pagos=0; Saldo=" + this.dataOrden.val_ord.toFixed(2)
          this.funcionesComunes.enviaAuditoria('Ref.' + this.varGlobal.getVarUsuarioDes(), data[0].nro_ord, 'DEMO', detalle)
          let detalle_pet = "Ingreso de peticion "
          for (let index = 0; index < Analisis_final.length; index++) {
            const element = Analisis_final[index];
            detalle_pet = element.cod_ana + "; "

          }
          this.funcionesComunes.enviaAuditoria('Ref.' + this.varGlobal.getVarUsuarioDes(), data[0].nro_ord, 'PETICION', detalle_pet)


          let detalle_mst = "Ingreso de muestra "
          for (let index = 0; index < Muestras_final.length; index++) {
            const element = Muestras_final[index];
            detalle_mst = element.cod_mst + "; "

          }

          this.funcionesComunes.enviaAuditoria('Ref.' + this.varGlobal.getVarUsuarioDes(), data[0].nro_ord, 'MUESTRA', detalle_mst)

          let list_ord_print = [];
          list_ord_print.push({ tipo: "ord", data: data[0].nro_ord });
          let mst_temp = data[0].mst.split(' ');
          for (let index = 0; index < mst_temp.length; index++) {
            let element = mst_temp[index];
            if(element!=''){
            list_ord_print.push({ tipo: "mst", data: element,nro_ord:data[0].nro_ord  });
          }
          }
          this.toastservice.presentToast(toastconf);
          this.PrintTicket(list_ord_print);
          //  this.loading.dismiss();
          //  this.router.navigate(['/inicio_ordenes']);
          this.resetOrden()
        }

        if (result.data.insertOrdenCompleta.resultado == 'error') {
          let toastconf =
          {
            'message': "Error al ingresar la orden..intentelo otra vez o consulte a soporte",
            'style': 'Warning',
            'position': 'top'
          };


          this.toastservice.presentToast(toastconf);
          //this.loading.dismiss();
        }

      })

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


  resetOrden() {

    this.resetpaciente();
    if (this.varGlobal.getVarUsuarioTipo() != 'ref') {
      this.resetmedico();
      this.getSeguro();

    }

    this.getUnidad();
    this.listAnalisis = [];
    this.listMuestras = [];
    this.precioFinal = null;
    this.fechaEntrega.fecha1 = '';
    this.fechaEntrega.fecha2 = '';
    this.flag_referencia = false;
    this.precioFinal=0
    this.observaciones_usuario = '';
    this.preguntasAnalisis = [];
    this.optEntrega.forEach(element => {
      element.value = "",
        element.checked = false
    });
    this.InitValues(false)
    this.orden_view = null;
    console.log('this.dataOrden',this.dataOrden);
    
    this.dataOrden.FEC_ENT2=null
    this.dataOrden.ca1_ord= null
    this.dataOrden.ca2_ord= null
    this.dataOrden.cod_emp= null
    this.dataOrden.cod_med= null
    this.dataOrden.cod_med2= null
    this.dataOrden.cod_pac= null
    this.dataOrden.cod_pac2= null
    this.dataOrden.cod_ped= null
    this.dataOrden.cod_uni= null
    this.dataOrden.copia_ent= null
    this.dataOrden.dcto_ord= 0
    this.dataOrden.dcto_val= 0
    this.dataOrden.des_ped= null
    this.dataOrden.dicta_ent= 0
    this.dataOrden.dicta_ent_det= null
    this.dataOrden.envio_ent= 0
    this.dataOrden.envio_ent_det= null
    this.dataOrden.exclusive_ent= 0
    this.dataOrden.exp_ord= 0
    this.dataOrden.fac_ter= 0
    this.dataOrden.fec_ent= null
    this.dataOrden.fec_ord= null
    this.dataOrden.id_plan= null
    this.dataOrden.iess_dep= null
    this.dataOrden.iess_dx= null
    this.dataOrden.iess_dx2= null
    this.dataOrden.iess_id= null
    this.dataOrden.iess_nder= null
    this.dataOrden.iess_tben= null
    this.dataOrden.iess_tcon= null
    this.dataOrden.iess_tder= null
    this.dataOrden.iess_tseg= null
    this.dataOrden.mail_ent= 0
    this.dataOrden.mail_ent_det= null
    this.dataOrden.mst_ext= 0
    this.dataOrden.nro_aux= 1
    this.dataOrden.nro_ext= ""
    this.dataOrden.num_analisis= 0
    this.dataOrden.num_muestras= 0
    this.dataOrden.obs_ext= ""
    this.dataOrden.pedido_ent= null
    this.dataOrden.pet_adi= 0
    this.dataOrden.pre_ord= 0
    this.dataOrden.pwd_ord= null
    this.dataOrden.stat_ord= 0
    this.dataOrden.sts_adm= "S"
    this.dataOrden.sts_ord= "PE"
    this.dataOrden.tip_ord= 0
    this.dataOrden.tip_ped= null
    this.dataOrden.total_ord= 0
    this.dataOrden.txt_ord= ""
    this.dataOrden.val_ord= 0
    this.total_ord="0.00"
  }


  resetmedico() {
    this.medico.cod_med = "";
    this.medico.nom_med = "";
    this.medico.hidden = true;
    this.inputMedico = ""
  }
  socket_url: any;
  ws: any = null;

  async presentAlertListPrinters(list_printers) {
    let btn_list = [];
    console.log('list_printers',list_printers);
  
    
    list_printers = list_printers.sort()
    
    list_printers =   list_printers.sort((x, y) => {
      if (x.impresora.toUpperCase() < y.impresora.toUpperCase()) {
          return -1;
      }
   
      if (x.impresora.toUpperCase() > y.impresora.toUpperCase()) {
          return 1;
      }
   
      return 0;
  });
    console.log('list_printers',list_printers);
    
    
    
    list_printers.forEach(element => {
      btn_list.push({
        text:  element.impresora,
        handler: () => {
          console.log(element.impresora);
          console.log('Confirm Okay', element);
          sessionStorage.setItem("printer_name", element.impresora)
          this.printer_name = element.impresora;
          this.flag_do_printer = true;
        }
      })
    });
    const alert = await this.alertController.create({
      header: 'Seleccione una impresora de etiquetas encontrada',
      message: 'La impresora que esta confiugarada en el sistema no se encuentra en el computador.',
      cssClass:'alert_printer',
      buttons: btn_list,
     
    });

    await alert.present();
  }
  flag_do_printer: boolean = true;


  async PrintTicket(data_print) {

    let list_to_print = [];
    this.loadingservice.present("Imprimiendo etiquetas")
    console.log("data", data_print);

   
    if (this.printer_name == '' || this.printer_name == null) {
      this.toastservice.presentToast({ message: "No existe una impresora asignada ", position: "top", duration: "2000", color: "warning" })
      this.loadingservice.dismiss()
      return
    }
    
    data_print.forEach(element => {
      console.log('iterator',element);
         
      this.queryservice.getLabetTicketbyMxo(element).then((r: any) => {
        console.log("r",r);
        
        if (r.data.getTicketLabel) {
          list_to_print.push(r.data.getTicketLabel.ticket_label)
        }

      })       
    });
   
    setTimeout(()=>{
      console.log('list_to_print', list_to_print);
      this.webrestservice.printTicket({ "printer_name": this.printer_name, "data": list_to_print, "tipo": 'ticket' }).subscribe((r_print: any) => {
        console.log('r_print',r_print);
        if(r_print.result=='error'){
          this.toastservice.presentToast({message:r_print.message,position:"top",duration:"2000",color:"warning"})
          this.presentAlertListPrinters(JSON.parse(r_print.data))
        }

        if(r_print.result=='ok'){

          for (let index = 0; index < data_print.length; index++) {
            const element = data_print[index];
            if(element.tipo=='mst')
            {
              this.UpdateMst(element.data,"imp_mst",1)
              this.funcionesComunes.enviaAuditoria('Ref.'+this.varGlobal.getVarUsuarioDes(),element.nro_ord,'PRINT',"Impresion de etiqueta")
  
            }
  
            if(element.tipo=='ord')
            {
              this.funcionesComunes.enviaAuditoria('Ref.'+this.varGlobal.getVarUsuarioDes(),element.data,'PRINT',"Impresion de etiqueta")
  
            }    
          }
        }


       },error=>{
        this.toastservice.presentToast({message:'Error con el servicio de impresión: '+error.message,position:"top",duration:"2000",color:"warning"})
       })
  
    },2000)
  
  

  
    /*
        this.queryservice.getLabetTicketbyMxo({tipo:tipo, data:data}).then((r:any)=>{
          console.log("print]",r);
         
          this.webrestservice.printTicket({"printer_name":this.printer_name,"data": r.data.getTicketLabel.ticket_label,"tipo":'ticket'   }).subscribe((r_print:any)=>{
            console.log("respuesta_print",r_print);
            if(r_print.result=='error'){
              this.toastservice.presentToast({message:r_print.message,position:"top",duration:"2000",color:"warning"})
              this.presentAlertListPrinters(JSON.parse(r_print.data))
              this.flag_do_printer=false;
            }
    
    
          
    
    
            }
           
            this.loadingservice.dismiss()
          },error=>{
            console.log(error);
            this.toastservice.presentToast({message:"Error al mandar a imprimir, verifique si el servicio esta corriendo \n"+ error.message,position:"top",duration:"2000",color:"warning"})
            this.loadingservice.dismiss()
          })
          */
    //  })
    //   
  }

  print_ticket_custom(data,tipo_data) {
    console.log('this.listMuestras', this.listMuestras);
    let list_ord_print = [];
    if (data == 'todo') {
      list_ord_print.push({ tipo: "ord", data: this.orden_view.nro_ord,nro_ord: this.orden_view.nro_ord });
      for (let index = 0; index < this.listMuestras.length; index++) {
        const element = this.listMuestras[index];
        list_ord_print.push({ tipo: "mst", data: element.id_mxo,nro_ord: this.orden_view.nro_ord });
      }
      console.log('list_ord_print',list_ord_print);
      
      this.PrintTicket(list_ord_print)
      return
    }
    if (data == 'mst') {
      list_ord_print.push({ tipo: "mst", data: tipo_data.id_mxo,nro_ord: this.orden_view.nro_ord })
      this.PrintTicket(list_ord_print)
      return
    }
    if (data == 'ord') {
      list_ord_print.push({ tipo: "ord", data: tipo_data.nro_ord ,nro_ord: this.orden_view.nro_ord})
      this.PrintTicket(list_ord_print)
      return
    }
  }

  checkPriority() {
    console.log("checck date", this.dataOrden.stat_ord);

    if (this.dataOrden.stat_ord == 1) {
      console.log("checck urgente");
      this.fechaEntrega.fecha1 = this.helper.soloFecha(new Date());
      console.log(this.fechaEntrega);

    }
  }

  UpdateMst(idmxo, campo, value) {
    this.queryservice.UpdateMuestra({
      json_data: JSON.stringify({
        campo: campo,
        value: value,
        id_mxo: idmxo
      })
    }).then(r => {
      console.log('r muestras', r);
      if (campo == "imp_mst") {

        this.queryservice.UpdateMuestra({
          json_data: JSON.stringify({
            campo: "lock_mst",
            value: 1,
            id_mxo: idmxo
          })
        }).then(r => {
          console.log('r muestras', r);
        })


      }
    })
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
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertConfirmPrinter() {
    const alert = await this.alertController.create({
      header: 'Impresora asignada',
      //  message: this.printer_name,
      inputs: [
        {
          type: "text",
          name: 'printer_name',
          value: this.printer_name
        }
      ],
      buttons: [
        , {
          text: 'Confirmar',
          handler: (r) => {
            console.log('Confirm Okay', r);
            sessionStorage.setItem("printer_name", r.printer_name)
            this.printer_name = r.printer_name
          }
        }
      ]
    });

    await alert.present();
  }



  async presentModalNuevoPaciente() {
    const modal = await this.modalcontroller.create({
      component: CrearpacientePage,
    });
    await modal.present();
    modal.onDidDismiss().then((result: any) => {
      console.log('result', result);
      if (result.role == 'data') {
        switch (result.data.tipo) {
          case "insert":
            let dat_pac = result.data.data_pac[0];
            if (dat_pac) {
              this.queryservice.getPacientesbyCod(dat_pac.cod_pac).then((result: any) => {
                console.log('result pac', result);
                let data = result.data.getPacientebyCod;
                if (data) {
                  this.paciente = data;
                  this.inputCedula = this.paciente.id_pac;
                  this.disabled_cedula = true;
                }
              })
            }
            break;

          case "check":

            this.queryservice.getPacientesbyId(result.data.data_pac.id_pac).then((result: any) => {
              console.log("result pac modal", result);
              let data = result.data.getPaciente;
              if (data) {
                this.paciente = data;
                this.inputCedula = this.paciente.id_pac;
                this.disabled_cedula = true;
              }
            })
            break;

          default: return;

        }



      }



    });
  }
}

