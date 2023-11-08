import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';

@Component({
  selector: 'app-ingreso-nuevo-medico',
  templateUrl: './ingreso-nuevo-medico.page.html',
  styleUrls: ['./ingreso-nuevo-medico.page.scss'],
})
export class IngresoNuevoMedicoPage implements OnInit {
  input_cod_med:'';
  input_medico:'';
  input_bloqueo:'';
  input_cedula:'';
  input_email:'';
  input_especialidad:'';
  input_fec_nac:Date;
  input_colegio:'';
  input_celular:'';
  input_telefono:'';
  input_direccion:'';
  input_observacion:'';
  bandera_editar:boolean;
  cod_med_temp:String='';
  bloqueoTemp:'';
  input_bloqueo1: string = ""; //
  bandera_bloqueo:any;

medico:any={
  nom_med:'',
  lock_med:'',
  id_med:'',
  mail_med:'',
  esp_med:'',
  fec_nac:null,
  col_med:'',
  cel_med:'',
  telf_med:'',
  dir_med:'',
  obs_med:''
}

  constructor(private modalcontroller: ModalController,private queryservice: QueryService,private toastservice: ToastService,private loadingservice: LoadingService) {    
  }


  ngOnInit() {          
    if(!this.bandera_editar){
      if(this.cod_med_temp){
         this.queryservice.getMedicosbyCod(this.cod_med_temp).then((r: any) => {
          
          let datos=r.data.getMedicobyCod;
          this.input_cod_med=datos.cod_med;
          this.input_medico=datos.nom_med;                 
          this.input_bloqueo =datos.lock_med;
          this.input_cedula=datos.id_med;
          this.input_email=datos.mail_med;
          this.input_especialidad=datos.esp_med;
          this.input_fec_nac=datos.fec_nac;
          this.input_colegio=datos.col_med;
          this.input_telefono=datos.telf_med;
          this.input_direccion=datos.dir_med;
          this.input_celular=datos.cel_med;
          this.input_observacion=datos.obs_med;
        }).catch((error) => {
          console.error('Error al obtener los datos del médico:', error);
        });
        }
    }else{
      console.log('editar tiene que true: '+this.bandera_editar);
    }

  }

  ActualzarMedico(){
    let fechaupd=new Date();
    console.log('Input Actualizar Cod_Med: ',this.input_cod_med);
    this.loadingservice.present('Actualizando Perfil');
    let data = {      
      nom_med:this.input_medico,                
      lock_med:this.input_bloqueo,
      id_med:this.input_cedula,
      mail_med:this.input_email,
      esp_med:this.input_especialidad,
      fec_nac:this.input_fec_nac,
      col_med:this.input_colegio,
      telf_med:this.input_telefono,
      dir_med:this.input_direccion,
      cel_med:this.input_celular,
      obs_med:this.input_observacion,
      fec_upd:fechaupd,
      cod_med:this.input_cod_med
    }

    
    this.queryservice.actualizarMedico(JSON.stringify(data)).then((result: any) => {
      let data = result.data
      console.log('datos despues de actualizar: ',data);
      this.toastservice.presentToast({ message: data.UpdateMedico.mensaje, position: 'top', color: 'success' })
      this.loadingservice.dismiss();
      this.dismissData(this.medico, "check")
       }, error => {
      console.log(error);
      this.toastservice.presentToast({ message:'Intentelo mas tarde '+ error.mensaje, position: 'top', color: 'warning' })
      this.loadingservice.dismiss()
    })




  }
  CheckMedico(){
    this.medico.nom_med=this.input_medico;
    this.medico.lock_med=this.input_bloqueo;
    this.medico.id_med=this.input_cedula;
    this.medico.mail_med=this.input_email;
    this.medico.esp_med=this.input_especialidad;
    this.medico.fec_nac=this.input_fec_nac;
    this.medico.col_med=this.input_colegio;
    this.medico.cel_med=this.input_celular;
    this.medico.telf_med=this.input_telefono;
    this.medico.dir_med=this.input_direccion;
    this.medico.obs_med=this.input_observacion;


console.log('bloqueo Medico: ',this.medico.lock_med);
    this.insertarMedico(this.medico);

  }
  dismiss() {
    this.modalcontroller.dismiss({ 
      'dismissed': true,
    }, "blank");
  }
  dismissData(data, tipo) {
    this.modalcontroller.dismiss({
      'dismissed': true,
      'data_pac': data,
      'tipo': tipo
    }, "data");
  }
  insertarMedico(data) {
    this.queryservice.insertMedicoComplete(JSON.stringify(data)).then((result: any) => {
    console.log('Result: ',result);
    let data = result.data.insertMedicoLite;
    if (data.resultado == 'ok') {
      this.toastservice.presentToast({ message: data.mensaje, color: "success", position: "center" });
      this.dismissData(JSON.parse(data.data), "insert");
    }
    this.loadingservice.dismiss()
  }, error => {
    this.toastservice.presentToast({ message: error, color: "warning", position: "top" });
    this.loadingservice.dismiss()
  })
}


}
