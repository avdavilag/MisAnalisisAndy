import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { HelperService } from 'src/app/servicios/helpers/helper.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';


@Component({
  selector: 'app-crearperfil',
  templateUrl: './crearperfil.page.html',
  styleUrls: ['./crearperfil.page.scss'],
})
export class CrearperfilPage implements OnInit {

  @ViewChild('menudesplegable') menudesplegable: ElementRef;
  @ViewChild('menu') menu: ElementRef;


  @ViewChild('toggleButton') toggleButton: ElementRef;
  //  @ViewChild('menu') menu: ElementRef;
  flag_tipo: string = 'nuevo';
  id_perfil: any;

  inputAnalisis: any = "";
  ListaAnalisis: any = [];

  ListaAnalisisFinal: any = [];

  showListado: boolean = false

  Perfil: any;
  //icon_style={nombre:'search',color:'primary'}
  icon_search: string = 'buscar';

  nombreperfil: string = "";
  observacion: string = "";

  ListaAnalisisTemp: any = [];

  constructor(
    private queryservice: QueryService,
    private toastservice: ToastService,
    private renderer: Renderer2,
    private varGlobal: VariablesGlobalesService,
    private modalcontroller: ModalController,
    private loadingservice: LoadingService,
    private alertController: AlertController,
    private helperservice: HelperService
  ) {


  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit() {
    console.log('this.flag_tipo', this.flag_tipo);
    if (this.flag_tipo == 'actualizar') {
      this.queryservice.getPerfilesbyId(this.id_perfil).then((result: any) => {
        let data = result.data.PerfilesbyId;
        this.nombreperfil = data.nombre;
        this.observacion = data.observaciones;

        let arregloPerfil = data.detalle.split(' ');
        console.log('arregloPerfil', arregloPerfil);

        arregloPerfil.forEach(element => {
          if (element != '') {
          let data = this.queryservice.SearchAnalisxMstrs(element);
          data.then(
            (result: any) => {
              console.log("results",result);
              
              let data = result.data.AnalisisMstrsbyCod
              if (data.length > 0) {
        
                let analisis =JSON.parse(JSON.stringify(data[0])) ;
            
                console.log('analisis', analisis);
        
                let flag = false
                this.ListaAnalisisFinal.forEach(element => {
                  if (element.cod_ana ==analisis.cod_ana) { flag = true }
                });
        
        
                if (!flag) {
                 // this.getMuestrasbyAna(this.analisis.cod_muestras, this.analisis.cod_ana);
                  this.ListaAnalisisFinal.push(analisis);
                 // this.calcTotal()
                }
               
        
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
        
        
            }
            
            ,
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
        
        



          };

        });
      });
    }
  }
  buscarAnalisis() {
    if (this.inputAnalisis == '') {
     // this.toastservice.presentToast({ message: 'Ingrese descripción del Análisis', position: "top", color: "warning" })
      return
    }
    this.queryservice.SearchAnalisxMstrs2(this.inputAnalisis).then((result: any) => {
      console.log('result', result);
      console.log('ListaAnalisisFinal',this.ListaAnalisisFinal);
      
       let data = result.data.searchAnalisisMstrs2;
      this.ListaAnalisis = []

      this.showListado = true;
      if (this.ListaAnalisisFinal.length > 0) {


        data.forEach((element, index) => {
         
          let flag_repetido: boolean = false

          this.ListaAnalisisFinal.forEach(element_lista => {

            console.log('data',element);
            console.log('element_lista',element_lista);
            
            
            if (element.cod_ana == element_lista.cod_ana) {
              flag_repetido = true
              return
            }
          });
          if (!flag_repetido) {
            this.ListaAnalisis.push(element)
          } else {
            console.log('no deberia ingresar', element);
          }
        });
      } else {
        this.ListaAnalisis = data
      }
/*
      if (this.ListaAnalisis.length > 0) {
        this.ListaAnalisis = [];
      }
      let data_list=result.data.searchAnalisisMstrs2;

      array_temp=data_list.filter(data_element=>{

      })
      .forEach(element => {
        this.showListado = true;
        if (this.ListaAnalisisFinal.length > 0) {


          this.ListaAnalisisFinal.forEach((element_lista, index) => {
            if (element.cod_ana == element_lista.cod_ana) {
              flag_existe = true
            }
          });

        }
        if (!flag_existe) {
          this.ListaAnalisis.push(element);
        }


      });
      */
      //  this.probarclic()
      console.log('this.ListaAnalisis', this.ListaAnalisis);
    }, error => {
      if (error.message) {
        this.toastservice.presentToast({ message: 'Ocurrio un error <br>' + error.message, color: 'warning', position: 'bottom' })
      }
      else {
        this.toastservice.presentToast({ message: 'Ocurrio un error <br>' + error, color: 'warning', position: 'bottom' })
      } console.log('error', error);

    })
  }

  test(event) {
    if (event.target.className.includes("here") || event.target.parentElement.className.includes("here")) {
      this.showListado = true
    } else {
      this.showListado = false
      this.cerrarBusqueda();
    }

  }





  changeStylesearch() {
    console.log('entrechange');
    console.log('this.inputAnalisis', this.inputAnalisis);

    if (this.inputAnalisis == '') {
      this.icon_search = "buscar"

    }
    else {
      this.icon_search = "cerrar"
    }

  }
  cerrarBusqueda() {
    this.inputAnalisis = "";
    this.ListaAnalisis = [];
    // this.icon_search="buscar "
    this.showListado = false;
  }


  addAnalisis(data, index) {
    console.log('data', data);
    let flag_repetido: boolean = false;
    if (this.ListaAnalisisFinal.length > 0) {

      this.ListaAnalisisFinal.forEach(element => {
        if (element.cod_ana == data.cod_ana) {
          flag_repetido = true
        }

      });

    }
    if (!flag_repetido) {
      this.ListaAnalisisFinal.push(data);
      this.toastservice.presentToast({ message: "Analisis añadido al listado", position: "top", color: "success" })
      this.ListaAnalisis.splice(index, 1)
    }
    console.log('this.ListaAnalisisFinal', this.ListaAnalisisFinal);

  }




  quitarListadoTemp(data) {
    if (this.ListaAnalisis.length > 0) {
      this.ListaAnalisis.forEach((element, index) => {
        if (data.cod_ana == element.cod_ana) {
          this.ListaAnalisis.splice(index, 1);
        }
      });
    }
  }

  quitarListadoFinal(index) {
    this.ListaAnalisisFinal.splice(index, 1);
  }

  guardarPerfil() {
    this.loadingservice.present('Ingresando Perfil');
    let listadostring: string = "";
    this.ListaAnalisisFinal.forEach(element => {
      listadostring += element.cod_ana + ' ';

    });
    let data = {
      nombre: this.nombreperfil,
      observaciones: this.observacion,
      detalle: listadostring,
      cod_med: this.varGlobal.getVarUsuario()
    }
    console.log('json', JSON.stringify(data));
    this.queryservice.insertPerfil(JSON.stringify(data)).then((result: any) => {
      let data = result.data
      console.log('result mutation', result);
      this.toastservice.presentToast({ message: data.insertPerfil.mensaje, position: 'top', color: 'success' })
      this.loadingservice.dismiss();
      this.dismissData();
    }, error => {
      console.log(error);
      this.toastservice.presentToast({ message: error.mensaje, position: 'top', color: 'warning' })
      this.loadingservice.dismiss()
    })
  }

  actualizarPerfil() { 
    let fechaupd=new Date();
    this.loadingservice.present('Actualizando Perfil');
    let listadostring: string = "";
    this.ListaAnalisisFinal.forEach(element => {
      listadostring += element.cod_ana + ' ';

    });
    let data = {
      nombre: this.nombreperfil,
      observaciones: this.observacion,
      detalle: listadostring,
      cod_med: this.varGlobal.getVarUsuario(),
      id_perfil:this.id_perfil,
      fec_upd:this.helperservice.soloFecha(fechaupd)
    }
    console.log('json', JSON.stringify(data));
    

 this.queryservice.actualizarPerfil(JSON.stringify(data)).then((result: any) => {
      let data = result.data
      console.log('result mutation', result);
      this.toastservice.presentToast({ message: data.UpdatePerfiles.mensaje, position: 'top', color: 'success' })
      this.loadingservice.dismiss();
      this.dismissData();
    }, error => {
      console.log(error);
      this.toastservice.presentToast({ message:'Intentelo mas tarde '+ error.mensaje, position: 'top', color: 'warning' })
      this.loadingservice.dismiss()
    })

  }

  dismiss() {
    this.modalcontroller.dismiss({
      'dismissed': true,
      // 'flag_origen': this.flag_origen
    });
    //    this.orden = [];
  }

  dismissData() {
    this.modalcontroller.dismiss({
      'dismissed': true,
      'flag_ingreso': true
    });
  }


  checkCambio() {
    if (this.inputAnalisis != '' || this.observacion != '' || this.ListaAnalisisFinal.length > 0) {
      this.presentAlertConfirmarDatos();
      return
    } else {
      this.dismiss();

      return
    }
  }

  async presentAlertConfirmarDatos() {
    const alert = await this.alertController.create({
      header: 'Alerta!',
      message: 'Desea descartar los cambios realizados',
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
            this.dismiss();


          }
        }
      ]
    });

    await alert.present();
  }
}
