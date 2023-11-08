import { Component, Input, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { Utilidades } from 'src/app/utils/utilidades';

@Component({
  selector: 'app-reimpresion',
  templateUrl: './reimpresion.page.html',
  styleUrls: ['./reimpresion.page.scss'],
})
export class ReimpresionPage implements OnInit {
  detalleSgc;
  itemDetalleSgc = { id: 0, form_sgc: "", tip_eve: "", tip_pro: "", det_eve: "" };
  @Input() nroOrden = "1";
  observacion: ''
  respuestaSave;
  sesion_usuario = "";
  sesion_usuario_des = "";
  constructor(public modalCtrl: ModalController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    // public funcionesComunesIntra: FuncionesComunesIntra,
    public utilidades: Utilidades,
    private varGlobal: VariablesGlobalesService,
    private queryservice: QueryService) { }

  ngOnInit() {

    this.sesion_usuario = this.varGlobal.getVarUsuarioIntra();
    this.sesion_usuario_des = this.varGlobal.getVarUsuarioIntraDes();
    this.getDetSgc()
  }
  cerrar() {
this.modalCtrl.dismiss()
  }
  guardaRegistro() {

  }


  getDetSgc() {
    //this.dataOrden.cod_med = this.varGlobal.getVarUsuario()
    //this.presentLoading();
    this.detalleSgc = [];
    if (this.nroOrden && this.nroOrden != null && this.nroOrden != '') {

      let data = { nro_orden: this.nroOrden }
      console.log("data", data);

      this.queryservice.getDetallesSGC().then(async (result: any) => {
        console.log('resultpedido', result);
        if (result && result.data && result.data.getDetalleSgc) {
          this.detalleSgc = result.data.getDetalleSgc;
          this.detalleSgc=this.detalleSgc.filter(e=>e.form_sgc=='P')

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
        this.utilidades.alertErrorService("gphql-getDetalleSgc", error.status)

        //this.loadingController.dismiss();
      })

    }
  }

  saveEventSgc() {
    if (this.itemDetalleSgc.id == 0)
      return

    if (this.nroOrden && this.nroOrden != null && this.nroOrden != '') {

      let data = { id_detsgc: this.itemDetalleSgc.id, cod_suc: 1, nro_ord: this.nroOrden, cod_usr: this.sesion_usuario, obs_sgc: this.observacion }
      console.log("data", data);

      this.queryservice.insertSgcEvent(data).then(async (result: any) => {
        console.log('resultpedido', result);
        if (result && result.data && result.data.insertSgcEvent) {
          this.respuestaSave = result.data.insertSgcEvent;
          if (this.respuestaSave.id_sgc && this.respuestaSave.id_sgc != null) {
            this.utilidades.mostrarToastSuccess("PROCESO REALIZADO CORRECTAMENTE")
            this.modalCtrl.dismiss()
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
        this.utilidades.alertErrorService("gphql-insertSgcEvent", error.status)

        //this.loadingController.dismiss();
      })

    }
  }
}
