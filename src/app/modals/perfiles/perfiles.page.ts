import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import {CrearperfilPage} from '../../modals/crearperfil/crearperfil.page';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.page.html',
  styleUrls: ['./perfiles.page.scss'],
})
export class PerfilesPage implements OnInit {


  mobile:any;
 listPerfiles:any=[];
  constructor(
    private modalcontroller:ModalController,
    private queryservice:QueryService,
    private varGlobal: VariablesGlobalesService,
    private toastservice:ToastService,
    private loadingservice: LoadingService
  ) { 

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

  ngOnInit() {
   this.updatePerfiles();
}

updatePerfiles(){
  this.queryservice.getPerfilesbyMed(this.varGlobal.getVarUsuario()).then((r:any)=>{
    console.log('r',r);
    let data=r.data;
      this.listPerfiles=data.PerfilesbyCodMed;
    

  
})
}

  dismiss() {
    this.modalcontroller.dismiss({
      'dismissed': true,
     // 'flag_origen': this.flag_origen
    });
    //    this.orden = [];
  }

  async presentModalNuevoPerfil() {
    const modal = await this.modalcontroller.create({
    component: CrearperfilPage,
   // componentProps: { value: 123 },
   backdropDismiss:false
    });
    
    modal.onDidDismiss().then((result:any)=>{
      console.log(result);

      let data=result.data

     if(data.flag_ingreso){
        this.updatePerfiles()
      }
      
    })
    await modal.present();
  
  }

  seleccionarPerfil(data){
    this.modalcontroller.dismiss({
      'dismissed': true,
     'perfil': data
    });
  }

  async presentModalActualizarPerfil(id) {
    const modal = await this.modalcontroller.create({
    component: CrearperfilPage,
    componentProps: { id_perfil: id,flag_tipo:'actualizar'},
   backdropDismiss:false
    });
    
    modal.onDidDismiss().then((result:any)=>{
      console.log(result);

      let data=result.data

     if(data.flag_ingreso){
        this.updatePerfiles()
      }
      
    })
    await modal.present();
  
  }

  borrarPerfil(item){

    this.loadingservice.present('Eliminando perfil')
    let data={
      id_perfiles:item.id_perfiles
    }
    console.log(data);
    
    this.queryservice.deletePerfil(JSON.stringify(data)).then((result: any) => {
      let data = result.data.DeletePerfiles
      if(data.resultado=='ok'){
      console.log('result mutation', result);
      this.toastservice.presentToast({ message: data.mensaje, position: 'top', color: 'success' })
        this.updatePerfiles();
    }
      this.loadingservice.dismiss();
      
    }, error => {
      console.log(error);
      this.toastservice.presentToast({ message:'Intentelo mas tarde '+ error.mensaje, position: 'top', color: 'warning' })
      this.loadingservice.dismiss()
    })
  };
}
