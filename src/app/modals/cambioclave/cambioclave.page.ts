import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlertController, ModalController } from '@ionic/angular';
import { BaseService } from 'src/app/servicios/base/base.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { Utilidades } from 'src/app/utils/utilidades';

@Component({
  selector: 'app-cambioclave',
  templateUrl: './cambioclave.page.html',
  styleUrls: ['./cambioclave.page.scss'],
})
export class CambioclavePage implements OnInit {
  passwordTypeactual:string="password";
  passwordIconactual:string="eye";
  passwordTypenueva:string="password";
  passwordIconnueva:string="eye";
  passwordTypenrepita:string="password";
  passwordIconnrepita:string="eye";


  inputclaveactual:string="";
  inputclavenueva:string="";
  inputclavenrepita:string="";
  inputemail:string="";

  formularioclaves: FormGroup;

  isSubmitted = false;
  disable_button:boolean=true;
  forceUpdate:boolean=false;
 // textClave:string="Las contraseñas no coinciden"
  constructor(
    public formBuilder: FormBuilder,
    private modalcontroller:ModalController,
    private variablesglobales:VariablesGlobalesService,
    private baseServicios: BaseService,
    private utilidades:Utilidades,
    private toastservice:ToastService,
    public alertController: AlertController,
  ) {
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    this.formularioclaves = this.formBuilder.group({
      claveactual: ['', [Validators.required]],
      clavenueva: ['', [Validators.required]],
      clavenrepita: ['',[Validators.required]],
      correo: [this.variablesglobales.getVarUsuarioEmail(),[Validators.required,Validators.pattern(regexp)]],
     
    })
   }

   spanconfig:any={
     texclave:"Las contraseñas no coinciden",
     color:"danger",
     hide:"true"

   } 
  ngOnInit() {
    console.log(this.variablesglobales.getVarUsuario());
    console.log(this.variablesglobales.getVarUsuarioTipo( ));
    if(this.variablesglobales.getForceUpdate()===true){
      this.forceUpdate=true;
    }

  }

 
  hideShowPassword(tipo) {
    switch(tipo){
      case "actual":
        console.log(tipo);
        
        this.passwordTypeactual = this.passwordTypeactual === 'text' ? 'password' : 'text';
        this.passwordIconactual = this.passwordIconactual === 'eye-off' ? 'eye' : 'eye-off';
        break
      ;
      case "nueva":
        this.passwordTypenueva = this.passwordTypenueva === 'text' ? 'password' : 'text';
        this.passwordIconnueva = this.passwordIconnueva === 'eye-off' ? 'eye' : 'eye-off';
        break
      ;
      case "nrepita":
        this.passwordTypenrepita = this.passwordTypenrepita === 'text' ? 'password' : 'text';
        this.passwordIconnrepita = this.passwordIconnrepita === 'eye-off' ? 'eye' : 'eye-off';
        break
      ;

    }
    
  }

  forceUppercaseConditionally(formControlName, event) {
      this.formularioclaves.get(formControlName).setValue(event.target.value.toUpperCase());

  }

  checkClaves(){

    if(this.formularioclaves.value.correo==''){
  
    }
    console.log(this.variablesglobales.getVarUsuario());
    console.log(this.formularioclaves.value.clavenueva);
    
    if(this.formularioclaves.value.clavenueva==this.variablesglobales.getVarUsuario()){//NO PUEDE SER LA MISMA QUE EL USUARIO
      this.spanconfig.textclave="La contraseña no puede ser la misma que el usuario";
      this.spanconfig.color="danger";
      this.spanconfig.hide="false";
      this.disable_button=true;
      return;
    }
  
    if(this.formularioclaves.value.clavenrepita=='' ||this.formularioclaves.value.clavenueva=='' || this.formularioclaves.value.claveactual==''){
      this.spanconfig.hide="true"
      this.spanconfig.textclave="";
      this.spanconfig.color="warning";
      this.disable_button=true;
      return
    }

  
    if(this.formularioclaves.value.clavenueva==this.formularioclaves.value.clavenrepita){
      this.spanconfig.textclave="Las contraseñas coinciden";
      this.spanconfig.color="success";
      this.spanconfig.hide="false";
      this.disable_button=false;
    }
    else{
      this.spanconfig.textclave="Las contraseñas no coinciden";
      this.spanconfig.color="danger";
      this.spanconfig.hide="false";

      this.disable_button=true;
    }



  }

  get errorControl() {
    
    return this.formularioclaves.controls;
  }

  validarFormulario(){
    console.log(this.formularioclaves.value)
    this.isSubmitted = true;
    if (!this.formularioclaves.valid) {
      
      this.toastservice.presentToast({message:"Verifique que los campos del correo sean los correctos",position:"top",color:"warning"})
      return false;
    } else {
      this.disable_button=false
      console.log(this.formularioclaves.value)
      //codigo si el formulario es valido

      console.log(this.variablesglobales.getVarUsuario());
      console.log(this.variablesglobales.getVarUsuarioTipo());

      var formData: any = new FormData();
   
      formData.append("usuario", this.variablesglobales.getVarUsuario());
      formData.append("pwd", this.formularioclaves.value.claveactual);
      formData.append("tipo", this.variablesglobales.getVarUsuarioTipo());
      formData.append("device", this.utilidades.getNavegador() + "; ip: " + this.variablesglobales.getIPBrowser());
      formData.append("pwd_new", this.formularioclaves.value.clavenueva);
      formData.append("email", this.formularioclaves.value.correo);

      console.log('formData',formData);
      
    this.baseServicios.ActualizarUsuario(formData).toPromise().then((result:any)=>{
      console.log('r',result);
      let data=result.response;
      if(data.code==2){
        this.toastservice.presentToast({message:data.description,position:"top",color:"success"});
        this.dismiss();
        this.variablesglobales.setForceUpdate(false)
        this.forceUpdate=false;

      }
      else{
        this.toastservice.presentToast({message:data.description,position:"top",color:"warning"});
        
      }
    },error=>{
      let nombre_error = 'get-list-orders'
      this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
     
    })


    }
  }

  dismiss() {
    this.modalcontroller.dismiss({
      'dismissed': true,
      // 'flag_origen': this.flag_origen
    });
    //    this.orden = [];
  }


  async presentAlert(titulo, mensaje) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }


}
