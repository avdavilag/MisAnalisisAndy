import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { WebRestService } from 'src/app/servicios/intranet/web-rest.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { Utilidades } from 'src/app/utils/utilidades';

@Component({
  selector: 'app-login-intranet',
  templateUrl: './login-intranet.page.html',
  styleUrls: ['./login-intranet.page.scss'],
})
export class LoginIntranetPage implements OnInit {
  loginForm2: FormGroup;
  respuesta;
  mobile = false;
  estilo_pagina = 0;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private servicio: WebRestService,
    private generalServicio: GeneralService,
    public toastController: ToastController,
    private route: ActivatedRoute,
    private zone: NgZone,
    private varGlobal: VariablesGlobalesService,
    private configApp: AppConfigService,
    private utilidades: Utilidades,
    public loadingController: LoadingController,
    public _translate: TranslateService
  ) {
    //LO CAMBIO A LA PANTALLA DE PDF PREVIEW
    this.route.queryParams.subscribe(params => {
      let token = params['tkn'];
      let usuario = params['usr'];
      let usuario_desc = params['usr_des'];
      let flag = params['flag'];
      let parametro1 = params['param1'];

      console.log("token ", token);

      if (token) {
        //seteo
        if (!flag)
          flag = ""
        if (!parametro1)
          parametro1 = ""
        //this.servicio.setTokenServer(token);
        //this.servicio.setVarUsuario(usuario);
        //this.validaUsuario(this.loginForm2,flag+'?param1='+parametro1);
        this.validaTkn(usuario,usuario_desc, token, flag + '?param1=' + parametro1);


      } else {
        console.log("NO EXISTE ROUTER");

      }
    });

  }

  
  ionViewWillEnter() {
    //limpia variables
    this.varGlobal.setTokenServer("");
    this.varGlobal.setVarUsuarioIntra("");
    this.varGlobal.setVarUsuarioIntraDes("");
  }

  ngOnInit() {
    //DEFAULTS+
    this.estilo_pagina = this.configApp.estilo_pagina;
    this.loginForm2 = this.fb.group({
      id_user: new FormControl('', Validators.required),
      pwd: new FormControl('', Validators.required)
    })
    //DETECTO SI ES MOVIL
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

  validAllItemForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(item => {
      const control = formGroup.get(item);
      console.log("🚀 ~ file: login-intranet.page.ts ~ line 104 ~ LoginIntranetPage ~ Object.keys ~ control", control)//CONTRL ALT L
      console.log(item);

      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        console.log("aki");

      } else if (control instanceof FormGroup) {
        this.validAllItemForm(control);
        console.log("aca");
      }
    })
  }

  isItemInvalid(field: any) {
    return this.loginForm2.get(field).invalid && this.loginForm2.get(field).touched;
  }
  submit() {
    if (!this.loginForm2.valid) {
      this.validAllItemForm(this.loginForm2)
    } else {
      //validacion de host
      if(this.configApp.ActiveByHost&&this.configApp.ActiveByHost['Intranet']&&this.configApp.ActiveByHost['Intranet'].length>0&&
      !this.configApp.ActiveByHost['Intranet'].includes(window.location.hostname)){
        this.presentToast("Acceso no permitido desde este host");
      }else{
        if(!this.configApp.onlyPedidos){
          this.validaUsuario(this.loginForm2, 'pdf-preview');
        }else{
        //add av msp 
        this.validaUsuarioWeelab(this.loginForm2, 'home-medico');
        // this.router.navigate(["/lista-orden"])
        }
      }
      
    }
  }

  async validaUsuario(form: FormGroup, router) {
    let loading = await this.presentLoading();
    var formData: any = new FormData();
    formData.append("usuario", form.get('id_user').value);
    formData.append("pwd", form.get('pwd').value);
    formData.append("device", this.utilidades.getNavegador() + "; ip: " + this.varGlobal.getIPBrowser());
    //creo q no va a ir el lenguaje
    //formData.append("lng", this._translate.getDefaultLang());

    this.servicio.validaLoginIntra(formData).toPromise().then(async (resp) => {
      console.log(resp);
      //DESAPARESCO EL LOADING
      this.respuesta = resp;
      if (resp && resp != null) {
        this.presentToast(this.respuesta.mensaje);
        if (this.respuesta.validacion == 1) {
          //this.router.navigate(["/lista-orden"]);
          this.varGlobal.setTokenServer(this.respuesta.token);

          //GUARDO USUARIO Y DESCRIPCION
          this.varGlobal.setVarUsuarioIntra(form.get('id_user').value);
         
          if (this.respuesta.result)
            this.varGlobal.setVarUsuarioIntraDes(this.respuesta.result.description);

          this.router.navigateByUrl(router, { replaceUrl: true }).then(() => {
            this.loadingController.dismiss();
          });;
        }

        this.loadingController.dismiss();

      }

    }, error => {
      //SI HAY ERROR IGUAL DESPARESCO EL LOADING
      setTimeout(() => {
        this.loadingController.dismiss();
      }, 400);
      this.presentToast("Problema con el servidor: " + error.message);
      console.log(error);

    })
  }

  async validaUsuarioWeelab(form: FormGroup, router){
    let loading = await this.presentLoading();
    var formData: any = new FormData();
    formData.append("usuario", form.get('id_user').value);
    formData.append("pwd", form.get('pwd').value);
    formData.append("device", this.utilidades.getNavegador() + "; ip: " + this.varGlobal.getIPBrowser());
    //creo q no va a ir el lenguaje
    //formData.append("lng", this._translate.getDefaultLang());

    this.servicio.validaLoginIntra(formData).toPromise().then(async (resp) => {
      console.log(resp);
      //DESAPARESCO EL LOADING
      this.respuesta = resp;
      if (resp && resp != null) {
        this.presentToast(this.respuesta.mensaje);
        if (this.respuesta.validacion == 1||this.respuesta.validacion == 3) {
          //this.router.navigate(["/lista-orden"]);
          this.varGlobal.setTokenServer(this.respuesta.token);

          //añadido av msp
          this.varGlobal.setVarUsuarioTipo('med');

          //GUARDO USUARIO Y DESCRIPCION
          this.varGlobal.setVarUsuarioIntra(form.get('id_user').value);
          //Guardar codigo de medico por default
          this.varGlobal.setVarUsuario("0");

          if (this.respuesta.result)
            this.varGlobal.setVarUsuarioIntraDes(this.respuesta.result.description);
           
            this.varGlobal.setVarUsuarioDes(this.respuesta.result.description);


          this.router.navigateByUrl(router, { replaceUrl: true }).then(() => {
            this.loadingController.dismiss();
          });;
        }

        this.loadingController.dismiss();

      }

    }, error => {
      //SI HAY ERROR IGUAL DESPARESCO EL LOADING
      setTimeout(() => {
        this.loadingController.dismiss();
      }, 400);
      this.presentToast("Problema con el servidor: " + error.message);
      console.log(error);

    })
  }

  async validaTkn(usr, desc, token, router) {
    let loading = await this.presentLoading();
    var formData: any = new FormData();
    this.generalServicio.validaToken(formData, token).toPromise().then(async (resp) => {
      console.log(resp);

      this.varGlobal.setTokenServer(token);

      //GUARDO USUARIO Y DESCRIPCION
      this.varGlobal.setVarUsuarioIntraDes(desc);
      this.varGlobal.setVarUsuarioIntra(usr);

      this.router.navigateByUrl(router, { replaceUrl: true }).then(() => {
        this.loadingController.dismiss();
      });;

      this.loadingController.dismiss();



    }, error => {
      //SI HAY ERROR IGUAL DESPARESCO EL LOADING
      console.log(error);
      setTimeout(() => {
        this.loadingController.dismiss();
      }, 400);
      if (error.status == 403) {
        this.presentToast("No permitido");
        sessionStorage.clear();
        //this.router.navigate(["/login-"]);
      } else {
        this.presentToast("Problema con el servidor: " + error.message);
      }

    })
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async presentLoading() {
    let mensaje = "";

    this._translate.get('complex.login_loading').subscribe((res: string) => {
      mensaje = res;
    });

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje + '...',
      duration: 10000
    });
    return loading.present();

  }

  cambia_lenguaje(ev: any) {
    console.log(ev.detail.value);
    this.zone.run(() => {

      this._translate.setDefaultLang(ev.detail.value);
    });
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  forceUppercaseConditionally(formControlName, event) {
    this.loginForm2.get(formControlName).setValue(event.target.value.toUpperCase());

  }

}
