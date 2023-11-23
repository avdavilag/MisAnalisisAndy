import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { CrearpacientePage } from '../../crearpaciente/crearpaciente.page';
import { IngresoNuevoPacientePage } from '../ingreso-nuevo-paciente/ingreso-nuevo-paciente.page';


@Component({
  selector: 'app-search-paciente',
  templateUrl: './search-paciente.page.html',
  styleUrls: ['./search-paciente.page.scss'],
})
export class SearchPacientePage implements OnInit {

  cedula:any="";
  codigo:any="";
  nombre:any="";
  apellido:any="";
  list_result=[];
  focusedIndex = -1;
  previousFocusedIndex = -1; 
  constructor(
    private queryservice:QueryService,
    private toastservice:ToastService,
    private alertController:AlertController,
    private modalController:ModalController
  ) { }

  ngOnInit() {
  }

  buscarPaciente(){
    if(this.cedula=='' && this.codigo=='' && this.nombre=='' && this.apellido==''){
      this.toastservice.presentToast({message:"Ingrese al menos un campo de busqueda",position:"top",color:"warning", duration:1500})
      return
    }
    this.list_result=[]
    this.queryservice.SearchPacienteDynamic(
      {cedula:this.cedula,codigo:this.codigo,nombre:this.nombre,apellido:this.apellido}
    ).then((r:any)=>{
      console.log("r",r);
      let data=r.data.searchPacienteDynamic
      if(data.length>0){
        this.list_result=data
      }else{
        this.toastservice.presentToast({message:"No se encuentran resultados",position:"middle",color:"warning", duration:1500})
      }
      
    })
  }
  
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' && this.focusedIndex > 0) {
      this.focusedIndex--;
      this.setFocus(this.focusedIndex);
    } else if (event.key === 'ArrowDown' && this.focusedIndex < this.list_result.length - 1) {
      this.focusedIndex++;
      this.setFocus(this.focusedIndex);
      
    }
  }

  handleMouseClick(index: number) {
    this.previousFocusedIndex = this.focusedIndex;
    this.focusedIndex = index;
  }

  setFocus(index: number) {
    const targetTabIndex = index + 1; // Sumamos 1 para coincidir con el atributo tabindex
    const targetElement = document.querySelector(`[tabindex="${targetTabIndex}"]`);
    if (targetElement instanceof HTMLElement) {
      targetElement.focus();
    }
  }


  showConsoleMessage(item: any) {
    console.log('Se presionó la tecla Enter en el elemento de la lista.', item);
    this.presentAlertConfirmPac(item);
  }
  
  Reset(){
    this.list_result=[];
   this.cedula="";
   this.codigo="";
   this.nombre="";
   this.apellido="";
  }


  async createModalNewPaciente() {
    let bandera_editar=true;
    const modal = await this.modalController.create({
    component: IngresoNuevoPacientePage,
    componentProps: { value: 123,
    bandera_editar:bandera_editar },
    backdropDismiss:false
    });
  
    await modal.present();
    modal.onDidDismiss().then(r=>{
      console.log('r.datar.datar.datar.datar.datar.data: ',r);
  
      let cod_pac_search=r.data.data_pac[0].cod_pac;
      console.log('r.datar.datar.datar.datar.datar.data: ',cod_pac_search);
      this.queryservice.getPacientesbyCod(cod_pac_search).then((r:any)=>{
        console.log('Verifica R dentro del query servicesss: ',r.data);
        this.presentAlertConfirmPac(r.data);
      });
     })

      
  }
 
  async presentAlertConfirmPac(item) {
    console.log('Item: ',item);
    


    const alert = await this.alertController.create({
      header: 'Esta seguro de seleccionar a este paciente',
      message: '<small>'+item.nombre_completo+'</small>',
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
            console.log('Confirm Okay',item);
          this.modalController.dismiss({
            paciente:item
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
    component: IngresoNuevoPacientePage,
    componentProps: { cod_pac_temp: cod_pac_temp }
    });
  
    await modal.present();
    modal.onDidDismiss().then(r=>{
      
      if(r.data){
      //  this.paciente=r.data.orden
      console.log('r.datar.datar.datar.datar.datar.data: ',r.data);
      }
    })
  
  }
}
