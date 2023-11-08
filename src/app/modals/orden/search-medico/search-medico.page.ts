import { QueryService } from 'src/app/servicios/gql/query.service';
import { CrearpacientePage } from '../../crearpaciente/crearpaciente.page';
// import { IngresoNuevoMedicoPage } from './../ingreso-nuevo-medico/ingreso-nuevo-medico.page';
import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/servicios/toast.service';
import { AlertController, ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/servicios/loading.service';
import { IngresoNuevoMedicoPage } from '../ingreso-nuevo-medico/ingreso-nuevo-medico.page';

@Component({
  selector: 'app-search-medico',
  templateUrl: './search-medico.page.html',
  styleUrls: ['./search-medico.page.scss'],
})
export class SearchMedicoPage implements OnInit {

  cedula:any="";
  codigo:any="";
  nombre:any="";
  apellido:any="";
  celular:any="";
  colegio:any="";
  orden:any;
  list_result=[]
  constructor(
    private queryservice:QueryService,
    private toastservice:ToastService,
    private alertController:AlertController,
    private modalController:ModalController,
    private loadingController:LoadingService
  ) { }

  ngOnInit() {
  }

  buscarMedico(){
    if(this.cedula==='' && this.codigo==='' && this.nombre==='' && this.celular==='' && this.colegio===''){
      this.toastservice.presentToast({message:"Ingrese al menos un campo de busqueda",position:"top",color:"warning", duration:1500})
      return
    }
    this.list_result=[]
;
    this.loadingController.present("Buscando Doctor");
    this.queryservice.SearchMedicoDynamic(

      {id_med:this.cedula,nom_med:this.nombre,cel_med:this.celular,cod_med:this.codigo,col_med:this.colegio}
    ).then((r:any)=>{    
      console.log('R: ',r);
      let data=r.data.searchMedicoDynamic;
    
      if(data.length>0){
        this.loadingController.dismiss;
        this.list_result=data;
      }else{
        this.toastservice.presentToast({message:"No se encuentran resultados",position:"middle",color:"warning", duration:1500})
      }
      
    })
  }



  async createModalNewPaciente() {
    let bandera_editar=true;
    const modal = await this.modalController.create({
    component: IngresoNuevoMedicoPage,
    componentProps: { value: 123,bandera_editar:bandera_editar },
    backdropDismiss:false
    });
  
    await modal.present();
    modal.onDidDismiss().then(r=>{
      
      if(r.data){
        this.orden=r.data.orden
      }
    })
  }
 
  async presentAlertConfirmPac(item) {
    console.log('Item de medico: ',item);
    const alert = await this.alertController.create({
      header: 'Esta seguro de seleccionar a este Doctor',
      message: '<small>'+item.nom_med+'</small>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
                      }
        }, {
          text: 'Aceptar',
          handler: () => {
            
          this.modalController.dismiss({
            medico:item
          })
          }
        }
      ]
    });
  
    await alert.present();
  }

  dismiss(){
    this.modalController.dismiss()
  }

  async presentModalFormPac(data,tipo) {
    let cod_pac_temp=null;
    if(tipo='edit'){
      cod_pac_temp=data.cod_pac
    }
    const modal = await this.modalController.create({
    component: CrearpacientePage,
    componentProps: { cod_pac_temp: cod_pac_temp }
    });
  
    await modal.present();
  
  }

  async presentModalFormMedicoCompleto(data,tipo) {
    let cod_med_temp=null;
    let bandera_editar=false;
    if(tipo='edit'){
      cod_med_temp=data.cod_med
      bandera_editar=false;
      
    }
    const modal = await this.modalController.create({
    component: IngresoNuevoMedicoPage,
    componentProps: { 
      cod_med_temp: cod_med_temp,
      bandera_editar:bandera_editar
     }
    });
  
    await modal.present();
  
  }

}
