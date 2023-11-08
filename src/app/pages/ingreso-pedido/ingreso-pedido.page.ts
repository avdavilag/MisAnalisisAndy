import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController,  ModalController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { HelperService } from 'src/app/servicios/helpers/helper.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { PerfilesPage } from '../../modals/perfiles/perfiles.page';
import { PerfilesavaPage } from '../../modals/perfilesava/perfilesava.page';
import { CrearpacientePage } from '../../modals/crearpaciente/crearpaciente.page';
import { ListunidadPage } from '../../modals/listunidad/listunidad.page';

import { TranslateService } from '@ngx-translate/core';

import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';

import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/servicios/base/base.service';

import { AppConfigService } from 'src/app/utils/app-config-service';
import { PdfRenderService } from 'src/app/servicios/pdf/pdf-render.service';

import { IonDatetime } from '@ionic/angular';
import { id } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-ingreso-pedido',
  templateUrl: './ingreso-pedido.page.html',
  styleUrls: ['./ingreso-pedido.page.scss'],
})



export class IngresoPedidoPage implements OnInit {
  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;

  minDate: any;
  maxDate: any;

  active_lugar_pedido = this.appConfig.active_lugar_pedido;
  observaciones_pedido= this.appConfig.observaciones_pedido;
  refentrega_pedido=this.appConfig.refentrega_pedido;
  mobile: any;
  ListaAnalisis: any = [];
  ListaAnalisisTemp: any = [];

  ListLugar: any;
  ListEstado: any = [
    { descripcion: "RUTINA", codigo: 0 },
    { descripcion: "EMERGENCIA", codigo: 1 },
    { descripcion: "PRIORIDAD", codigo: 2 },

  ]

  lugar: any = {
    descripcion: null, codigo: null, enable: null
  };
  estado: any;

  inputAnalisis: any = '';
  inputCedula: any = '';
  inputDiagnostico: any = '';
  inputDiagnosticoextra: any = '';
  inputHabitacion: any = '';
  inputUnidad: any = '';

  inputObservacion: any = '';

  inputFechaExamen: any;

  show_listaDiagnostico: boolean = false;
  show_listaDiagnosticoextra: boolean = false;
  show_listaAnalisis: boolean = false;
  show_listaUnidad: boolean = false;

  ListDiagnostico: any = [];
  ListDiagnosticoextra: any = [];

  diagnostico: any = [];
  diagnosticoextra: any = [];

  unidad: any = [];
  listUnidad: any = [];

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
  dataOrden: any = {
    id_pedido: null,
    cod_pac: null,
    cod_med: null,
    txt_ord: null,
    fec_examen: null,
    fec_ord: null,
    cod_diagnostico: null,
    num_analisis: 0,
    cod_diagnostico2: null,
    cod_unidad: null,
    cod_lugar: null,
    estado_pedido: null,
    nro_habitacion: null,
    ca1_ord: null,
    cod_ref: null,
    hora_turno: null,
    tipo_user:null

  }

  analisis: any;

  disabled_cedula: boolean = false;

  pedido_duplicar: any;

  public des_usr: any = ""
  public tipo_usr: any = ""

  unidad_config: any;
  diagnostico_config: any;
  diagnostico_extra_config: any;

  nro_turnos_pedidos_fecha = 0;
  nro_max_turnos = this.appConfig.max_pedidos_turno;

  pac_fec_nac_config: any;
  pac_sex_input_config: any

  feraidosm_list: any;

  list_ref: any = [];
  ref_ca1_ord: any = null;

  list_fechas_disponibles: any = [];
  temp_max_turnos: any;

  enable_hora_turno: boolean = false
  hora_turno: any = null;

  check_ped_ord = {
    active: false,
    hora: 0
  };

  list_ordenesxpac=[];
  list_peticionesxorden=[]



  constructor(
    private serviciosBase: BaseService,
    private router: Router,
    private modalcontroller: ModalController,
    private queryservice: QueryService,
    private toastservice: ToastService,
    private helperservice: HelperService,
    private loadingservice: LoadingService,
    private varGlobal: VariablesGlobalesService,
    private alertController: AlertController,
    private _translate: TranslateService,
    private appConfig: AppConfigService,
    private serviciosPDF: PdfRenderService,

  ) {

    this.helperservice.checkFecha(6);
    this.inputObservacion=(this.observaciones_pedido.default_msg && this.observaciones_pedido.default_msg!='')?this.observaciones_pedido.default_msg:""
    if (this.appConfig.check_ped_ord) {
      this.queryservice.getCsParms({ cs_name: "AVATPED" }).then((r: any) => {
        console.log('r cs', r);
        let hora = r.data.getCsParms.data_parm;
        if (hora != 0) {
          this.check_ped_ord.active = true
          this.check_ped_ord.hora = hora
        }
        console.log('this.check_ped_ord', this.check_ped_ord);

      })
    }


    this.enable_hora_turno = this.appConfig.enabe_hora_turno;
    if (this.enable_hora_turno) {
      this.hora_turno = "00:00";
      console.log('this.hora_turno', this.hora_turno);

    }
    this.getMaxTurnos();

    
    this.des_usr = this.varGlobal.getVarUsuarioDes();
    this.tipo_usr=this.varGlobal.getVarUsuarioTipo();
    console.log('this.des_usr', this.des_usr);
    console.log('this.tipo_usr', this.tipo_usr);

    this.unidad_config = this.appConfig.unidad_pedido;
    this.diagnostico_config = this.appConfig.diagnostico_pedido;
    this.diagnostico_extra_config = this.appConfig.diagnostico_extra_pedido;
    this.pac_fec_nac_config = this.appConfig.pac_fec_nac;
    this.pac_sex_input_config = this.appConfig.pac_sex;

    this.ListLugar = this.appConfig.listado_lugar_pedido;
    console.log('this.ListLugar', this.ListLugar);
    console.log('this.lugar', this.lugar);
    if (this.varGlobal.getLugarPedido() != '') {
      this.lugar = this.ListLugar.filter(r => r.codigo == this.varGlobal.getLugarPedido())
      this.lugar = this.lugar[0];
    }


    console.log('this.lugar2', this.lugar);
    if (!this.appConfig.lugar_default && this.appConfig.active_lugar_pedido) {
      this.presentAlertLugar();
    }
    console.log('this.lugar.codigo', this.lugar.codigo);

    if (this.lugar.codigo == 2) {
      this.estado = this.ListEstado[1]
    } else { this.estado = this.ListEstado[0] }

  }

  async presentAlertLugar() {
    let buttons = []
    this.ListLugar.forEach(element => {
      if (element.enable) {
        buttons.push(
          {
            text: element.descripcion,
            cssClass: "" + element.style,
            handler: () => {
              console.log('Confirm Cancel: blah', element.descripcion);
              this.lugar = element

              if (this.lugar.codigo == 2) {
                this.estado = this.ListEstado[1]
              } else { this.estado = this.ListEstado[0] }
          
            }
          })
      }

    });

    const alert = await this.alertController.create({
      header: 'Seleccione un lugar',
      buttons: buttons,
      backdropDismiss: false
    });

    await alert.present();
  }

  ionViewWillEnter() {
    this.getRefList();
    this.minDate = new Date();
    this.minDate = this.helperservice.soloFecha(this.minDate)
    this.pedido_duplicar = this.varGlobal.getPedido_d();
    if (this.pedido_duplicar) {
      console.log("entre duplicar");

      let data = this.pedido_duplicar;
      this.inputCedula = data.Paciente.id_pac;
      this.inputObservacion = data.observaciones;
      this.inputHabitacion = data.nro_habitacion;
      this.estado = this.ListEstado.filter(r => r.codigo == data.estado_pedido)[0];
      this.getPaciente();
      if (data.codigo_diagnostico != '' || data.codigo_diagnostico2 != null) {
        this.queryservice.getDiagnosticoById(data.codigo_diagnostico).then((result: any) => {
          console.log('resultd', result);
          this.diagnostico = result.data.DiagnosticoId
        })
      }
      if (data.codigo_diagnostico2 != '' || data.codigo_diagnostico2 != null) {
        this.queryservice.getDiagnosticoById(data.codigo_diagnostico2).then((result: any) => {
          console.log('resultd', result);
          this.diagnosticoextra = result.data.DiagnosticoId
        })
      }
      this.queryservice.getUnidadByCod(data.cod_unidad).then((result: any) => {
        console.log('unidad', result);
        this.unidad = result.data.getUnidadbyCod
      })
      data.Analisis.forEach(element => {
        this.inputAnalisis = element.cod_ana
        this.searchAnalisis();
      });
      setTimeout(() => {
        this.varGlobal.setPedido_d(undefined);
      }, 2000)
    }
    this.checkTurno();
  }
  ngOnInit() {
    let forden = new Date();
    let formatted_date = forden.getFullYear() + "-" + (forden.getMonth() + 1) + "-" + forden.getDate()
    this.dataOrden.fec_ord = this.helperservice.soloFecha(forden);
    this.dataOrden.fec_examen = this.helperservice.soloFecha(forden);
    this.inputFechaExamen = this.helperservice.soloFecha(forden);
    this.minDate = formatted_date;
    this.queryservice.getListUnidad().then((result: any) => {
      console.log('result', result);
      this.listUnidad = result.data.ListUnidad;
    })

    if (this.varGlobal.getVarUsuarioTipo() == 'ref') {
      this.dataOrden.cod_med = 0
      this.dataOrden.cod_ref = this.varGlobal.getVarUsuario()
    } else {
      this.dataOrden.cod_med = this.varGlobal.getVarUsuario()
    }

    console.log('this.dataOrden.cod_med', this.dataOrden.cod_med);

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
  async presentModalPerfiles() {
    const modal = await this.modalcontroller.create({
      component: PerfilesPage,
      //componentProps: { value: 123 }
      backdropDismiss: false
    });

    modal.onDidDismiss().then((result: any) => {
      let data = result.data
      let arregloPerfil: any = [];
      if (data.perfil) {
        let detalle = data.perfil.detalle;
        arregloPerfil = detalle.split(' ');
        arregloPerfil.forEach(element => {
          if (element != '') {
            this.inputAnalisis = element;
            this.searchAnalisis();
          }
        });
      }
    })
    return await modal.present();
  }

  async presentModalUnidad() {
    const modal = await this.modalcontroller.create({
      component: ListunidadPage,
      cssClass: "modal_Unidad",
      backdropDismiss: false
    });
    modal.onDidDismiss().then((result: any) => {
      let data = result.data.unidad
      if (data) {
        this.unidad = data;
      }
    })
    return await modal.present();
  }

  async presentModalPerfilesAva() {
    const modal = await this.modalcontroller.create({
      cssClass: 'modal_analisisA',
      component: PerfilesavaPage,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((result: any) => {
      let data = result.data
      if (data.analisis) {

        for (let index = 0; index < data.analisis.length; index++) {
          const element = data.analisis[index];
          if (element != '') {
            this.inputAnalisis = element.cod_ana;
            this.searchAnalisis();
          }
        }
     
      }
    })
    return await modal.present();
  }


  buscarAnalisis() {
    if (this.inputAnalisis == '') {
      this.toastservice.presentToast({ message: 'Ingrese el código de Análisis', position: "top", color: "warning" })
      return
    }
    this.queryservice.SearchAnalisxMstrs(this.inputAnalisis).then((result: any) => {
      console.log(result);
      if (result.data.AnalisisMstrsbyCod.length > 0) {
        this.ListaAnalisis.push(result.data.AnalisisMstrsbyCod[0])
        this.inputAnalisis = '';
      } else {
        this.toastservice.presentToast({ message: 'No se encontro el análisis con el codigo ingresado', color: 'warning', position: 'bottom' })
      }
    }, error => {
      if (error.message) {
        this.toastservice.presentToast({ message: 'Ocurrio un error <br>' + error.message, color: 'warning', position: 'bottom' })
      }
      else {
        this.toastservice.presentToast({ message: 'Ocurrio un error <br>' + error, color: 'warning', position: 'bottom' })
      } console.log('error', error);

    })
  }

  eliminarAnalisis(index) {
    this.ListaAnalisis.splice(index, 1)
  }

  async presentAlertPacienteCheck() {

    if (!this.paciente.cod_pac) {
      return
    }

    const alert = await this.alertController.create({
      header: 'Cuidado',
      message: 'El paciente ya cuenta con una orden ingresada.\n Desea continuar ingresando el pedido',
      buttons: [{
        text: "Continuar",
        handler: () => {
          console.log("Continuoooooo");

        }
      },
      {
        text: "Cancelar",
        handler: () => {
          this.LimpiarTodo()

        }
      }
      ],
      backdropDismiss:false
    });

    await alert.present();
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

          if (this.check_ped_ord.active) {
            console.log("CHECKEO ORDEn");
            let fechas_check = this.helperservice.checkFecha(this.check_ped_ord.hora)
            console.log('fechas_check', fechas_check);
            this.queryservice.checkordbyfecha({
              fecha_i: fechas_check.fecha_i,
              fecha_h: fechas_check.fecha_h,
              cod_pac: this.paciente.cod_pac
            }).then((r:any)=>{
              console.log("resss",r);
              if(r.data.checkordbyfecha.length>0){
                let data=r.data.checkordbyfecha;
                this.presentAlertPacienteCheck()
                console.log(' this.list_ordenesxpac', this.list_ordenesxpac);
                let ordenes_list=""
                for (let index = 0; index < data.length; index++) {
                  const element = data[index];
                  ordenes_list+=element.nro_ord;
                  if(index<(data.length-1))
                  ordenes_list+=",";
                }

                this.queryservice.getPetxOrdenes({nro_ord_list:ordenes_list}).then((r:any)=>{
                  this.list_peticionesxorden=[];
                  console.log("r",r);
                  let data_analisis=r.data.getPetxOrd

                  data_analisis.forEach(element => {
                    this.list_peticionesxorden.push(element.cod_ana)
                  });
                })

                console.log('ordenes_list',ordenes_list);
              }
             
              
            })
            //  

          }


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

  resetpaciente() {
    this.paciente.cod_pac = null
    this.paciente.id_pac = null,
      this.paciente.nombre_completo = null,
      this.paciente.nom_pac = null,
      this.paciente.ape_pac = null,
      this.paciente.edad = null,
      this.paciente.fec_nac = null,
      this.paciente.mail_pac = null,
      this.paciente.sex_pac = null,
      this.paciente.hidden = true
  }

  searchAnalisis() {

    if (this.inputAnalisis == '' || this.inputAnalisis == null) {
      let toastconf =
      {
        'message': 'Ingrese el código de Análisis',
        'style': 'warning',
        'position': 'top'
      };
      this.toastservice.presentToast(toastconf);
      return
    }
    let cod_ana = this.inputAnalisis;
    let repetido = false

    this.ListaAnalisis.forEach(element => {

      if (element.cod_ana == cod_ana) {
        repetido = true
      }
    });
    if (repetido) {
      let toastconf =
      {
        'message': 'Analisis Repetido',
        'style': 'warning',
        'position': 'top'
      };
      this.toastservice.presentToast(toastconf);
      return
    }

    let data = this.queryservice.SearchAnalisxMstrs(this.inputAnalisis);
    data.then(
      (result: any) => {
        let data = result.data.AnalisisMstrsbyCod
        if (data.length > 0) {

          this.analisis = JSON.parse(JSON.stringify(data[0]));
          this.addAnalisis(this.analisis)
/*

          let flag = false
          this.ListaAnalisis.forEach(element => {
            if (element.cod_ana == this.analisis.cod_ana) { flag = true }
          });
          if (!flag) {
            this.ListaAnalisis.push(this.analisis);
          }
          this.inputAnalisis = ""
          */
        }
        else {
          let toastconf =
          {
            'message': 'No se encontro la peticion',
            'style': 'warning',
            'position': 'top'
          };
          this.toastservice.presentToast((toastconf));
          return
        }
      },
      (error) => {
        let toastconf =
        {
          'message': error,
          'style': 'warning',
          'position': 'top'
        };
        this.toastservice.presentToast((toastconf));
        return

      }
    );
  }

  saveComplete() {
    this.dataOrden.ca1_ord = this.ref_ca1_ord
    let fecha = new Date();
    this.dataOrden.cod_diagnostico = (this.diagnostico.codigo) ? this.diagnostico.codigo : null;
    this.dataOrden.fec_ord = this.helperservice.soloFecha(fecha);
    this.dataOrden.fec_examen = this.inputFechaExamen;
    this.dataOrden.cod_pac = this.paciente.cod_pac;
    this.dataOrden.txt_ord = this.inputObservacion;
    this.dataOrden.id_pedido = uuidv4();
    this.dataOrden.cod_diagnostico2 = (this.diagnosticoextra.codigo) ? this.diagnosticoextra.codigo : null;
    this.dataOrden.cod_unidad = (this.unidad.cod_uni) ? this.unidad.cod_uni : null;
    this.dataOrden.cod_lugar = (!this.active_lugar_pedido) ? '' : this.lugar.codigo
    this.dataOrden.estado_pedido = this.estado.codigo
    this.dataOrden.nro_habitacion = this.inputHabitacion;
    let Analisis_final = this.saveAnalisis();
    this.dataOrden.num_analisis = Analisis_final.length;
    this.dataOrden.hora_turno = this.hora_turno
    this.dataOrden.tipo_user=this.tipo_usr
    let json_data = {
      orden: this.dataOrden,
      analisis: Analisis_final
    }
    console.log("json_data", json_data);

    this.saveTurno(json_data);

  }

  savePedido(orden, analisis) {
    console.log(JSON.stringify(orden));
    console.log(JSON.stringify(analisis));


    this.queryservice.insertPedido(JSON.stringify(orden), JSON.stringify(analisis)).then((result: any) => {
      let data = result.data.insertPedido
      console.log('result mutation', result);
      if (data.resultado == 'error') {
        this.toastservice.presentToast({ message: data.mensaje, position: 'top', color: 'warning' })
        this.loadingservice.dismiss();
        return
      }
      let nro_pedido_temp = data.data;
      this.queryservice.getPedidosbyId(nro_pedido_temp).then((result: any) => {
        console.log("result temp", result);
        let data_temp = result.data.PedidobyId;
        this.openPDF(data_temp);
      })
      this.toastservice.presentToast({ message: data.mensaje, position: 'top', color: 'success' })
      this.LimpiarTodo();
      this.loadingservice.dismiss();
    }, error => {
      console.log(error);
      this.toastservice.presentToast({ message: error.mensaje, position: 'top', color: 'warning' })
      this.loadingservice.dismiss()
    })
  }
  saveTurno(datos) {
    let nombre_error = "setTurno";
    let respuesta;
    this.serviciosBase.setTurnoPedido(datos).toPromise().then(resp => {
      respuesta = resp;
      if (respuesta && respuesta.response) {
        if (respuesta.response.code > 0) {
          this.savePedido(datos.orden, datos.analisis);
        } else {
          this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor intente nuevamente o contacte con soporte.\n<br><small>Codigo error web service: SendPDF/" + respuesta.response.code + "<small>")
        }
      } else {
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema en ENVIO</b></h2></br>Favor intente nuevamente o contacte con soporte.\n<br><small>" + nombre_error + "/" + "NO RESPONSE" + "<small>")
      }
    }, error => {
      if (error.status == 403) {
        sessionStorage.clear();
        this.router.navigate(["/login"], { replaceUrl: true });
      } else {
        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
      }
    });

  }

  alert_fecha_present: boolean = false;
  async presentAlertFecha() {
    this.alertController.dismiss();

    this.alert_fecha_present = true;
    const alert = await this.alertController.create({
      cssClass: "mensajes-pdf ",
      message: "<ion-icon name='alert-circle' class='warning' size='large'></ion-icon><h2><b>Límite de turnos excedido</b></h2>" +
        //   "<br><strong><small>Fecha: "+this.inputFechaExamen+"</small></strong>"+
        "<br><strong><small>La fecha se cambiara al día siguiente</small></strong>" +
        "<br><strong><small>Solo se permite el ingreso por Hospitalización o Emergencia</small></strong>",
      backdropDismiss: false,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.alert_fecha_present = false;
            this.inputFechaExament = this.inputFechaExamen
            this.list_fechas_disponibles = [];
            this.checkTurnod()
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
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }
  /////////////////////////////////////////////////////////////////
  saveAnalisis() {
    let peticionCompleta = [];
    if (this.ListaAnalisis.length == 0) {
      return null
    } else {
      this.ListaAnalisis.forEach(element => {

        let peticion = {
          "cod_ana": element.cod_ana,
          "tip_ser": element.tip_ser,
        }
        peticionCompleta.push(peticion);
      }
      );
      return peticionCompleta
    }
  }

  searchDiagnostico() {
    if (this.inputDiagnostico == '') {
      return
    }
    this.queryservice.searchDiagnostico(this.inputDiagnostico).then((result: any) => {
      console.log('result', result);
      let data = result.data.searchDiagnostico;
      this.show_listaDiagnostico = true
      this.ListDiagnostico = data;
    })
  }

  selectDiagnostico(data) {
    this.diagnostico = data
    this.inputDiagnostico = ''
    setTimeout(() => {
      this.show_listaDiagnostico = false;
    }, 500);
  }

  searchDiagnosticoextra() {
    if (this.inputDiagnosticoextra == '') {
      return
    }
    this.queryservice.searchDiagnostico(this.inputDiagnosticoextra).then((result: any) => {
      this.show_listaDiagnosticoextra = true
      let data = result.data.searchDiagnostico;
      this.ListDiagnosticoextra = data;
    })
  }

  selectDiagnosticoextra(data) {
    this.diagnosticoextra = data
    this.inputDiagnosticoextra = ''
    setTimeout(() => {
      this.show_listaDiagnosticoextra = false;
    }, 500);
  }

  searchUnidad() {
    if (this.inputUnidad == '') {
      return
    }
    this.queryservice.searchUnidad(this.inputUnidad).then((result: any) => {
      let data = result.data.searchUnidad;
      this.listUnidad = data;
      this.show_listaUnidad = true
    })
  }

  selectUnidad(data) {
    this.unidad = data
    this.inputUnidad = ''
    setTimeout(() => {
      this.show_listaUnidad = false;
    }, 500);
  }




  checkListaDesplegable(event) {
    if (event.target.className.includes("here") || event.target.parentElement.className.includes("here")) {
      this.show_listaDiagnostico = true
    } else {
      this.show_listaDiagnostico = false
    }

    if (event.target.className.includes("analisislist") || event.target.parentElement.className.includes("analisislist")) {
      this.show_listaAnalisis = true
    } else {
      this.show_listaAnalisis = false
    }

    if (event.target.className.includes("diagnostico") || event.target.parentElement.className.includes("diagnostico")) {
      this.show_listaDiagnosticoextra = true
    } else {
      this.show_listaDiagnosticoextra = false
    }

    if (event.target.className.includes("unidadlist") || event.target.parentElement.className.includes("unidadlist")) {
      this.show_listaUnidad = true
    } else {
      this.show_listaUnidad = false
    }
  }

  buscarAnalisis2() {
    if (this.inputAnalisis == '') {
      return
    }
    this.queryservice.SearchAnalisxMstrs2(this.inputAnalisis).then((result: any) => {
      let data = result.data.searchAnalisisMstrs2;
      this.show_listaAnalisis = true;
      this.ListaAnalisisTemp = []
      if (this.ListaAnalisis.length > 0) {
        data.forEach((element, index) => {
          let flag_repetido: boolean = false
          this.ListaAnalisis.forEach(element_lista => {
            if (element.cod_ana == element_lista.cod_ana) {
              flag_repetido = true
              return
            }
          });
          if (!flag_repetido) {
            this.ListaAnalisisTemp.push(element)
          } else {
            console.log('no deberia ingresar', element);
          }
        });
      } else {
        this.ListaAnalisisTemp = data
      }
    }, error => {
      if (error.message) {
        this.toastservice.presentToast({ message: 'Ocurrio un error <br>' + error.message, color: 'warning', position: 'bottom' })
      }
      else {
        this.toastservice.presentToast({ message: 'Ocurrio un error <br>' + error, color: 'warning', position: 'bottom' })
      } console.log('error', error);

    })
  }

 
  flag_pass_repeat_analisis:boolean=false;

  addAnalisis(data) {
    console.log("analisis",data);
    let data_temp=[]
    console.log(this.list_peticionesxorden);
    
    if(this.list_peticionesxorden.length>0){
      data_temp=this.list_peticionesxorden.filter(peticion=>peticion==data.cod_ana)

      if(data_temp.length>0 && !this.flag_pass_repeat_analisis){
        console.log("es un analisis repetido");
        let temp=this.presentAlertAnaRepeat(data);
        console.log("tempppp",temp);
        
        return
      }else{
        this.ListaAnalisis.push(data);
        this.toastservice.presentToast({ message: "Analisis añadido al listado", position: "top", color: "success" })
        this.flag_pass_repeat_analisis=false;
      }
    }
    else{
      this.ListaAnalisis.push(data);
    this.toastservice.presentToast({ message: "Analisis añadido al listado", position: "top", color: "success" })
    
    }
    this.inputAnalisis = ""
    setTimeout(() => {
      this.show_listaAnalisis = false;
    }, 500);
  }

  async presentAlertAnaRepeat(data) {
    const alert = await this.alertController.create({
      header: 'Cuidado',
      subHeader:data.des_ana,
      message: 'Ya existe esta petición ingresada para este paciente,\n Ingresar de todos modos.',
      backdropDismiss:false,
      buttons: [
        {
          text:"Continuar",
          handler:()=>{
           this.flag_pass_repeat_analisis=true;
           this.addAnalisis(data)
      }
    },{
      text:"Cancelar",
      handler:()=>{
      }
    }]
    });
  
    await alert.present();
  }

  async presentAlertGuardar() {
    if (this.paciente.id_pac == null) {
      this.toastservice.presentToast({ message: 'Ingresar un paciente', position: "top", color: "warning" })
      return
    }
    if (this.pac_fec_nac_config.required && this.pac_fec_nac_config.enable) {
      if (this.paciente.fec_nac == null || this.paciente.fec_nac == '') {
        this.toastservice.presentToast({ message: 'Ingresar fecha de nacimiento del paciente', position: "top", color: "warning" })
        return
      }
    }
    if (this.pac_sex_input_config.required && this.pac_sex_input_config.enable) {
      if (this.paciente.sex_pac == null || this.paciente.sex_pac == '') {
        this.toastservice.presentToast({ message: 'Seleccionar genero del paciente', position: "top", color: "warning" })
        return
      }
    }
    if (this.unidad_config.enable && this.unidad_config.required) {
      if (this.unidad.length == 0 && this.active_lugar_pedido) {
        this.toastservice.presentToast({ message: 'Escoger una Unidad', position: "top", color: "warning" })
        return
      }
    }
    if (this.diagnostico_config.enable && this.diagnostico_config.required) {
      if (this.diagnostico.length == 0) {
        this.toastservice.presentToast({ message: 'Ingresar un diagnóstico', position: "top", color: "warning" })
        return
      }
    }
    if (this.diagnostico_extra_config.enable && this.diagnostico_extra_config.required) {
      if (this.diagnosticoextra.length == 0) {
        this.toastservice.presentToast({ message: 'Ingresar un diagnóstico extra', position: "top", color: "warning" })
        return
      }
    }
    if (this.ListaAnalisis.length == 0) {
      this.toastservice.presentToast({ message: 'Ingresar al menos un análisis', position: "top", color: "warning" })
      return
    }

    if (this.observaciones_pedido.required && this.observaciones_pedido.enable) {
      if (this.inputObservacion == null || this.inputObservacion == '') {
        this.toastservice.presentToast({ message: 'Debe llenar el campo de observación', position: "top", color: "warning" })
        return
      }
    }

    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: 'Esta seguro de ingresar este Pedido',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.saveComplete();
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

  eliminarDiagnostico() {
    this.diagnostico = [];
  }

  eliminarUnidad() {
    this.unidad = [];
  }

  eliminarDiagnosticoextra() {
    this.diagnosticoextra = [];
  }

  changeEstado(event) {
    this.ListEstado.forEach(element => {
      if (element.codigo == event.detail.value) {
        this.estado = element
        return
      }
    });
  }

  changeUnidad(event) {
    this.listUnidad.forEach(element => {
      if (element.cod_uni == event.detail.value) {
        this.unidad = element
        return
      }
    });
  }

  changelugar(event) {
    this.ListLugar.forEach(element => {
      if (element.codigo == event.detail.value) {
        this.lugar = element
        this.checkTurno()
        return
      }
    });

  }

  LimpiarTodo() {
    let forden = new Date();
    this.resetpaciente();
    this.ListaAnalisis = [];
    this.ListaAnalisisTemp = [];
    this.diagnostico = [];
    this.inputObservacion = "";
    this.inputFechaExamen = '';
    this.inputCedula = '';
    this.diagnosticoextra = [];
    this.unidad = [];
    this.inputHabitacion = '';
    this.inputFechaExamen = this.helperservice.soloFecha(forden);
    this.disabled_cedula = false;
    this.checkTurno()


    if (!this.appConfig.lugar_default && this.appConfig.active_lugar_pedido) {
      this.presentAlertLugar();
    }

  }



  openPDF(orden) {
    this.loadingservice.present("Generando Pdf")
    // PREPARO LOS VALORES
    let valores_enviar = {
      "orden": orden
    }
    //ENVIO AL SERVICIO
    let respuesta;
    this.serviciosPDF.getPDFPedido(valores_enviar).subscribe(resp => {
      //CIERRO EL LOADING
      setTimeout(() => {
        this.loadingservice.dismiss();
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
        this.toastservice.presentToast({ position: "top", color: "dark", message: respuesta.description })
      }

    }, error => {
      setTimeout(() => {
        this.loadingservice.dismiss();
      }, 500);
      console.error(error);
      this.toastservice.presentToast({ position: "top", color: "dark", message: "Problema datos " + error.status })
    });
    //  window.open("https://resultados.gamma.com.ec:8443/gamma/webresources/eReport/pdf?orden=712418&paciente=227064&token=2048", "_blank")
  }

  inputFechaExament: any;
  checkTurno() {
    this.getMaxTurnos()
    if (this.lugar.codigo == "2" || this.lugar.codigo == '1') {
      return
    }
    this.nro_turnos_pedidos_fecha = 0;
    if (!this.appConfig.active_turno) {
      return
    }
    //cuento los pedidos realizados en la fecha 
    this.queryservice.countPedidosbyFecha({ fecha: this.inputFechaExamen, }).then((result: any) => {
      console.log("check", result);
      let data = result.data.CountPedidobyFecha;
      if (data.data_total == 0 || data.data_total == null) {
        console.log("entre");

        return
      }
      this.nro_turnos_pedidos_fecha = data.data_total
    }).finally(() => {
      //cuento los turnos permitidos en esa fecha si es feriado
      this.queryservice.getFeriadobyFecha({ fecha: this.inputFechaExamen }).then
        ((result_fer: any) => {
          console.log("result_fer", result_fer);
          let data_fer = result_fer.data.getFeriadobyFecha;
          if (data_fer.fec_fer != null) {
            this.nro_max_turnos = data_fer.max_turnos
            console.log();

          }
        }).finally(() => {
          this.checkFecha_avaliable()
        })
    })
  }

  checkFecha_avaliable() {
    let d = new Date(this.inputFechaExamen)

    let f2 = this.helperservice.soloFechaaddDay(d)
    let d2 = new Date(f2)

    //se le añade un dia porq la fecha con el input me devuelve la anterior

    if (d2.getDay() == 6) {
      this.inputFechaExamen = this.helperservice.soloFechaaddDay(d);
      this.checkTurno()
      return
    } else
      if (d2.getDay() == 0) {
        this.inputFechaExamen = this.helperservice.soloFechaaddDay(d);
        this.checkTurno()
        return
      }
    if (this.nro_turnos_pedidos_fecha >= this.nro_max_turnos) {
      this.presentAlertFecha();
      this.inputFechaExamen = this.helperservice.soloFechaaddDay(d);
      this.checkTurno()
    }

  }

  formatDate(data) {
    this.inputFechaExamen = data;
    this.checkTurno()
  }

  updatePaciente() {
    this.queryservice.insertPacientelite(JSON.stringify(this.paciente)).then((result: any) => {
    })
  }

  updateRef(ev) {
    this.ref_ca1_ord = ev.detail.value
  }

  getRefList() {
    this.list_ref.push({ value: null, des: "Ninguno" })
/*
    this.queryservice.getCsParms({ cs_name: "AVAREL" }).then((r: any) => {
      let data = r.data.getCsParms;
      console.log("r avarel",r);
      if(data==null){
        return
      }
      if (data.cod_parm && data.cod_parm != null) {
        let list = data.data_parm.split("/");
        list.forEach(element => {
          if (element.length > 0) {
            this.list_ref.push({ value: element, des: element })
          }
        });
      }
    }, error => {
        console.error("este es el error", error)
    })
    */
  }

  getMaxTurnos() {
    this.queryservice.getCsParms({ cs_name: "AVATXD" }).then((r: any) => {
      let data = r.data.getCsParms;
      if(data==null){
        return
      }
      if (data.cod_parm && data.cod_parm != null) {
        this.nro_max_turnos = data.data_parm;
      } else {
        this.nro_max_turnos = this.appConfig.max_pedidos_turno;
      }
    }, error => {
      console.error(error)
    })
  }

  getMaxTurnost() {
    this.queryservice.getCsParms({ cs_name: "AVATXD" }).then((r: any) => {
      let data = r.data.getCsParms;
      if(data==null){
        return
      }
      if (data.cod_parm && data.cod_parm != null) {
        this.temp_max_turnos = data.data_parm;
      } else {
        this.temp_max_turnos = this.appConfig.max_pedidos_turno;
      }
    }, error => {
      console.error(error)
    })
  }

  nro_turnos_pedidos_fechat: any = 0

  checkTurnod() {
    if (this.list_fechas_disponibles.length >= 5) {
      return
    }
    this.getMaxTurnost()
    this.nro_turnos_pedidos_fechat = 0;
    //cuento los pedidos realizados en la fecha 
    this.queryservice.countPedidosbyFecha({ fecha: this.inputFechaExament, }).then((result: any) => {
      console.log("check", result);
      let data = result.data.CountPedidobyFecha;
      if (data.data_total == 0 || data.data_total == null) {
        return
      }
      this.nro_turnos_pedidos_fechat = data.data_total
    }).finally(() => {
      //cuento los turnos permitidos en esa fecha si es feriado
      this.queryservice.getFeriadobyFecha({ fecha: this.inputFechaExament }).then
        ((result_fer: any) => {
          let data_fer = result_fer.data.getFeriadobyFecha;
          if (data_fer.fec_fer != null) {
            this.temp_max_turnos = data_fer.max_turnos
          }
        }).finally(() => {
          this.checkFecha_avaliabled()
        })
    })
  }

  checkFecha_avaliabled() {
    let d = new Date(this.inputFechaExament);
    let f1 = this.inputFechaExament;
    this.inputFechaExament = this.helperservice.soloFechaaddDay(d);
    let d2 = new Date(this.inputFechaExament);
    let f2 = this.helperservice.soloFechaaddDay(d2);
    //se le añade un dia porq la fecha con el input me devuelve la anterior
    this.inputFechaExament = this.helperservice.soloFechaaddDay(d);

    if (d2.getDay() == 6) {
      this.checkTurnod()
      return
    }
    if (d2.getDay() == 0) {
      //   this.toastservice.presentToast({message:"La fecha seleccionada es de fin de semana",position:"top",time:"1500",color:"warning"})
      this.checkTurnod()
      return
    }

    if (this.nro_turnos_pedidos_fechat < this.temp_max_turnos) {
      if (this.list_fechas_disponibles.length >= 5) {
        return
      }
      this.list_fechas_disponibles.push({ fecha: d2, inputFechaExamen: f1, selected: false })
    }

    this.checkTurnod()
  }

  changeFechaManual(data) {
    this.inputFechaExamen = data.inputFechaExamen;
    data.selected = true;
    for (let index = 0; index < this.list_fechas_disponibles.length; index++) {
      if (this.list_fechas_disponibles[index].inputFechaExamen == data.inputFechaExamen) {
        this.list_fechas_disponibles[index].selected = true
      }
      else {
        this.list_fechas_disponibles[index].selected = false
      }
    }
    this.checkTurno()
  }

  setTurnoHora() {
    console.log("hora", this.hora_turno);

  }


}
