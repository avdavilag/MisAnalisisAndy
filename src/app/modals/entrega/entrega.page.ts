import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { FuncionesComunesIntra } from 'src/app/utils/funciones-comunes-intra';
import { Utilidades } from 'src/app/utils/utilidades';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.page.html',
  styleUrls: ['./entrega.page.scss'],
})
export class EntregaPage implements OnInit {

  public dataPac;
  public nuevaOption = "";
  public nameEntrega = "Paciente";
  public analisis;
  private sesion_usuario;
  sesion_usuario_des;
  public listAdicional = [
    { logo: 'mail', color: 'warning', active: 0, txtActive: 'Mail enviado' },
    { logo: 'logo-whatsapp', color: 'success', active: 0, txtActive: 'Whatsapp ' },
    { logo: 'home', color: 'primary', active: 0, txtActive: 'Enviado fisico' },
    { logo: 'documents', color: 'tertiary', active: 0, txtActive: 'Copias entregadas' },
    { logo: 'create', color: 'secondary', active: 0, txtActive: 'Pedido entregado' }
  ]

  @Input() public nroOrden = "";
  @Input() public forceMode = false;

  constructor(public modalCtrl: ModalController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public funcionesComunesIntra: FuncionesComunesIntra,
    public utilidades: Utilidades,
    private varGlobal: VariablesGlobalesService,
    private queryservice: QueryService) { }

  ngOnInit() {
    // this.nroOrden=10
    this.getDataPaciente()
    //Cargo el usuario y descripcion
    this.sesion_usuario = this.varGlobal.getVarUsuarioIntra();
    this.sesion_usuario_des = this.varGlobal.getVarUsuarioIntraDes();
    console.log("FORCE MODE", this.forceMode);

  }


  getDataPaciente() {
    //this.dataOrden.cod_med = this.varGlobal.getVarUsuario()
    //this.presentLoading();
    this.dataPac = {};
    if (this.nroOrden && this.nroOrden != null && this.nroOrden != '') {
      this.alertEntregaMessage()
      this.getDataAnalisis()
      let data = { nro_orden: this.nroOrden }
      console.log("data", data);

      this.queryservice.getOrdenPacienteEntrega(data).then(async (result: any) => {
        console.log('resultpedido', result);
        if (result && result.data && result.data.getOrdPaciente) {
          this.dataPac = result.data.getOrdPaciente;
          if (this.dataPac.stat_ord == '1') {
            this.dataPac.class = 'urg'
          } else
            if (this.dataPac.stat_ord == '2') {
              this.dataPac.class = 'prio'
            } else {
              this.dataPac.class = 'rut'
            }

        } else {
          if (result.errors && result.errors.length > 0) {
            this.utilidades.mostrarToast(result.errors[0].message)
          } else {
            this.utilidades.mostrarToast("OCURRIO UN PROBLEMA AL CARGAR ANALISIS")
          }
        }

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

        //this.loadingController.dismiss();
      })

    }
  }

  checkedAnalisis = [];
  valideCheckFisica(analisis) {
    console.log("analisis", analisis);
    let activo = !analisis.activeFisica
    let checkedAna;
    setTimeout(() => {
      analisis.activeFisica = analisis.activeFisica ? false : true;
    }, 300);

    if (activo) {
      this.checkedAnalisis.push({
        "cod_ana": analisis.cod_ana,
        "how_ent": this.nameEntrega,
        "usr": "ADMIN",
        "fisica": 1,
        "task": analisis.activeTask
      })
    }
  }

  valideCheckTask(analisis) {

  }

  getDataAnalisis() {
    //this.dataOrden.cod_med = this.varGlobal.getVarUsuario()
    //this.presentLoading();
    this.analisis = []
    this.dataPac = {};
    let data = { nro_ord: this.nroOrden }
    console.log("data", data);
    let listAna;
    this.queryservice.getAnalisisxOrden(data).then(async (result: any) => {
      console.log('analisis', result);
      if (result && result.data) {
        listAna = result.data.searchAnalisisxOrden;
        listAna.forEach(ana => {
          if (ana.entrega == 1) {
            ana.activeFisica = true
            this.analisis.push(ana)
          }
        });
        if (this.analisis && this.analisis.length == 0) {
          this.utilidades.mostrarToast("LA ORDEN NO TIENE ANALISIS PARA ENTREGA");
          if (this.forceMode) {//force mode llega despues de la impresion
            setTimeout(() => {
              this.cerrar()
            }, 500);
          }
        }
      } else {
        if (result.errors && result.errors.length > 0) {
          this.utilidades.mostrarToastError(result.errors[0].message)
        } else {
          this.utilidades.mostrarToastError("OCURRIO UN PROBLEMA AL CARGAR ANALISIS")
        }
      }

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
      this.utilidades.alertErrorService("gpql-anaxorden", error.status)

      //this.loadingController.dismiss();
    })
  }

  async alertEditSelect() {
    const alert = await this.alertController.create({
      cssClass: 'alert-mail',
      header: "A QUIEN SE ENTREGA",
      inputs: [
        {
          type: "text",
          name: 'name',
          value: this.nuevaOption,
          placeholder: 'Ingrese el nombre'
        }

      ],
      buttons: [
        {
          text: "Cancelar",
          role: 'cancel',
          cssClass: 'cancel-button-alert',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: "Ok",
          cssClass: 'principal-button-alert',
          handler: async (data) => {
            if (data.name != "") {
              this.nuevaOption = data.name;
              this.nameEntrega = data.name;

            }
            else {
              this.nuevaOption = ""
            }
            //   if (this.utilidades.isEmail(data.email)) {


            // } else {
            //  this.utilidades.mostrarToast("Ingrese un correo valido")
            //}

          }
        }

      ]
    });

    await alert.present();
    //this.utilidades.enviarMail(this.orden, "intra", this.datosPaciente.mail_pac);
    //this.validaFabList=true;
  }
  guardaAnalisis() {
    //this.modalCtrl.dismiss();
    let codesAnalisis = [];
    this.analisis.forEach(ana => {
      if (ana.activeFisica) {
        codesAnalisis.push(ana.cod_ana)
      }
    });
    console.log("strAna", codesAnalisis);
    if (codesAnalisis.length > 0) {
      this.actualizaEstado(codesAnalisis)
    }


  }

  actualizaEstado(codesAnalisis) {
    let data = { detalle: "ENTREGA", estado: "EN", cod_ana: codesAnalisis, nro_ord: this.nroOrden, how_ent: this.nameEntrega, tipo: "Entrega", user: this.sesion_usuario };
    console.log('data', data);

    this.queryservice.updateStatusPet(JSON.stringify(data)).subscribe((result: any) => {
      console.log('result', result);
      let data = result.data.updateStsPeticion;
      if (data && data != null) {
        if (data.code == 1) {
          //GENERO LOS LOGS
          this.funcionesComunesIntra.enviaAuditoria(this.sesion_usuario, this.nroOrden, "Entrega", "Entrega de resultados " + JSON.stringify(codesAnalisis) + " a " + this.nameEntrega);//this.funcionesComunesIntra.enviaAuditoria(this.sesion_usuario, this.nroOrden, "Entrega", "Entrega de resultados ["+strAnalisis+"];" +" a " + this.nameEntrega);
          this.utilidades.mostrarToastSuccess("PROCESO REALIZADO CORRECTAMENTE")
          this.modalCtrl.dismiss()
          //this.funcionesComunesIntra.enviaAuditoria(this.sesion_usuario, this.nroOrden, "Entrega", strTareas+" ["+strAnalisis+"];" +" a " + this.nameEntrega);


          //    this.toastservice.presentToast({message:data.mensaje,color:"success",position:"top"});
          //  this.dismissData(JSON.parse(data.data));

        } else {
          this.utilidades.mostrarToastError(data.description)
        }
      } else {

        if (result.errors && result.errors.length > 0) {
          this.utilidades.mostrarToastError(result.errors[0].message)
        } else {
          this.utilidades.mostrarToastError("OCURRIO UN PROBLEMA AL CARGAR ANALISIS")
        }
      }
      //  this.loadingservice.dismiss()
    }, error => {
      console.error('error', error);
      // this.loadingservice.dismiss()
      this.utilidades.alertErrorService("qpql-updtStatusPet", error.status)

    })

  }
  async alertEntregaMessage() {

    try {
      // this.list_ref.push({ value: null, des: "Ninguno" })
      const dataParam: any = await this.queryservice.getNotasOrden({ nro_ord: this.nroOrden, tipo: 'EN' });
      console.log("DATA PARAM ENTREGA MESSAGE", dataParam);

      const data = dataParam.data.getNotasOrden ? dataParam.data.getNotasOrden.data : null
      if (data) {
        const alert = await this.alertController.create({
          cssClass: 'mensajes-pdf',
          header: "ALERTA",
          message: data,
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

      // return data;
    } catch (error) {
      console.error("ERROR AL OBTENER NOTAS", error);
      //return null;
    }

  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
  activaAdicional(item) {

    item.active = item.active == 1 ? 0 : 1;
  }
}
