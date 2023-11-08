import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WebRestService } from '../../servicios/intranet/web-rest.service';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { AppConfigService } from '../../utils/app-config-service';
import { TranslateService } from '@ngx-translate/core';
import { AlertLoginPage } from '../../modals/alert-login/alert-login.page';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { BaseService } from 'src/app/servicios/base/base.service';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { GraphqlService } from 'src/app/servicios/graphql.service';
import { Utilidades } from 'src/app/utils/utilidades';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { PolicyLoginPage } from 'src/app/modals/policy-login/policy-login.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm: FormGroup;
  public respuesta;
  public tipo_usuario = "";
  public mobile = false;
  public estilo_pagina = 0;
  public passwordType: string = 'password';
  public passwordIcon: string = 'eye-off';
  public unicoActivo = "";
  public tipoSystem: any;
  public contacto = "";
  public activaLogin = true;
  public mensajeInfo = '';

  public listado_lugar_pedido
  public show_listado_lugar: boolean = true;
  public pedido_enable;
  public pedido_lugar_select;
  public tipo_lugar_pedido;

  public label_externo = "Medico";
  public userActiveByServer;
  public activaProtect = false;


  constructor(
    public modalCtrl: ModalController,
    private fb: FormBuilder,
    private router: Router,
    private varGlobal: VariablesGlobalesService,
    private baseServicios: BaseService,
    private generalService: GeneralService,
    private servicio: WebRestService,
    private utilidades: Utilidades,
    public toastController: ToastController,
    private zone: NgZone,
    private configApp: AppConfigService,
    public loadingController: LoadingController,
    public _translate: TranslateService,
    private queryservice: QueryService,
    private loadingservice: LoadingService,
    private graphqlservice: QueryService,
  ) { }

  ngOnInit() {
    //this.presentModalPolicy()
    //listado_update
    this.tipo_lugar_pedido = this.configApp.active_lugar_pedido;
    this.listado_lugar_pedido = this.configApp.listado_lugar_pedido;
    this.pedido_enable = this.configApp.enablePedidos;
    this.activaProtect = this.configApp.activaProtect;
    console.log("PROTECT", this.activaProtect);


    if (this.pedido_enable) {
      if (this.listado_lugar_pedido)
        this.pedido_lugar_select = this.listado_lugar_pedido[0].codigo;
      console.log("this.varGlobal.getLugarPedido()", this.varGlobal.getLugarPedido());


      if (this.varGlobal.getLugarPedido() != "") {
        console.log("entre pedido getlugar");

        this.pedido_lugar_select = this.varGlobal.getLugarPedido()
      }
      else {
        this.pedido_lugar_select = this.listado_lugar_pedido[0].codigo;
        this.varGlobal.setLugarPedido(this.pedido_lugar_select)
      }

      if (!this.configApp.lugar_default) { this.show_listado_lugar = false }
    }

    //USUARIOS ACTIVOS POR IP DEL SERVER
    this.getUserActiveFromServer()

    console.log("this.listado_lugar_pedido", this.listado_lugar_pedido);
    console.log("this.pedido_enable", this.pedido_enable);

    //DEFAULTS
    this.tipo_usuario = this.configApp.defaultTipoUser;
    this.estilo_pagina = this.configApp.estilo_pagina;
    this.tipoSystem = this.configApp.tipoSystem;
    if (this.configApp.apiBaseType == 1) {//habilito la validacion del token desde la version 3.53
      this.validaTokenGraph();
    }
    this.getContacto();
    //ESTILO PARA UN SOLO TIPO
    //let activos = Object.values(this.configApp.ActivaTiposUsuarios).filter(val => val == true)

    const activos = Object.keys(this.configApp.ActivaTiposUsuarios).filter(tipo => this.configApp.ActivaTiposUsuarios[tipo] == true)
    console.log("activos", activos);

    if (activos && activos.length > 0) {
      activos.forEach((tipo, index) => {
        if (this.configApp.ActiveByHost) {
          if (this.configApp.ActiveByHost[tipo]) {
            if (this.configApp.ActiveByHost[tipo].length > 0 && !this.configApp.ActiveByHost[tipo].includes(window.location.hostname)) {
              activos.splice(index, 1)
            }
          }
        }
      });
    }
    console.log("activos", activos);
    if (activos.length == 1) {
      //SI SOLO HAY UN ACTIVO LO BUSCO
      this.unicoActivo = activos[0]
      this.tipo_usuario = activos[0]
      /*
      Object.keys(this.configApp.ActivaTiposUsuarios).forEach(tipo => {
        console.log(tipo);
        if (this.configApp.ActivaTiposUsuarios[tipo]) {

          this.unicoActivo = tipo
          this.tipo_usuario = tipo
        }
      })
*/
    } else {
      //valido si solo uno tiene permitido desde el host

      this.unicoActivo = ""
    }
    console.log("unico ", this.unicoActivo);


    //this.configApp.ActivaTiposUsuarios.Medico = true
    this.loginForm = this.fb.group({
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

    if (this.configApp.Label_externo && this.configApp.Label_externo != '') {
      this.label_externo = this.configApp.Label_externo
    }
  }

  ionViewWillEnter() {
    this.tipo_usuario = this.configApp.defaultTipoUser;

    //limpia variables
    this.varGlobal.setTokenServer("");
    this.varGlobal.setVarUsuario("");
    this.varGlobal.setVarUsuarioDes("");
    this.varGlobal.setVarUsuarioMail("")
    this.varGlobal.setVarUsuarioTipo("");

  }

  getUserActiveFromServer() {
    //esta validacion preguntara al servidor si tiene activo otro usuario
    if (this.configApp.ActiveByPrivateIp && this.configApp.ActiveByPrivateIp != '') {
      this.generalService.getUserActive(this.configApp.ActiveByPrivateIp).subscribe(resp => {
        console.log("Activa Server", resp);

        this.userActiveByServer = resp;
      }, error => {
        console.log(error);
        console.log("NO HAY RESPUESTA");
        this.userActiveByServer = []
      })
    }
  }
  async validaTokenGraph() {
    this.activaLogin = false;

    return await this.graphqlservice.Testgql().then((result: any) => {
      console.log('result', result);
      if (result.data.test.mensaje) {
        // this.toastservice.presentToast({ message: 'Coneccion graphql exitos', color: 'success', position: 'bottom' })
        console.log("SE CONECTO AL SERVIDOR GRAPHQL");
      }
      this.activaLogin = true;
      this.mensajeInfo = ""
    }, error => {
      this.mensajeInfo = "Problema de conexión GPHQL";
      this.activaLogin = true;//SOLO INDICO EL MENSAJE
      if (error.message) {
        this.presentToast("ERROR CONEXION GraphQL, intente mas tarde " + error.message);
        // this.apollo.removeClient('API_test')
        //this.toastservice.presentToast({ message: 'Ocurrio un error <br>' + error.message, color: 'warning', position: 'bottom' })
      }
      else {
        if (error.message) {
          this.presentToast("ERROR CONEXION GraphQL, intente mas tarde " + error);
          //this.toastservice.presentToast({ message: 'Ocurrio un error <br>' + error, color: 'warning', position: 'bottom' })
        }
        console.log('error GQL', error);
      }
    })
  }

  validAllItemForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(item => {
      const control = formGroup.get(item);
      console.log(control);

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
    return this.loginForm.get(field).invalid && this.loginForm.get(field).touched;
  }
  submit() {
    //submit mSP
    if (!this.loginForm.valid) {
      this.validAllItemForm(this.loginForm)
    } else {
      //RECONOCE QUE BASE VA A USAR
      if (this.configApp.apiBaseType == 1) {

        if (this.tipo_usuario == 'Externo') {
          this.validaLoginExterno(this.loginForm)
        }
        else
          if (this.tipoSystem == 'MSP') {
            this.validaLoginMsp(this.loginForm);
          }
          else {
            this.validaUsuarioAva(this.loginForm);
          }

      } else {
        this.validaUsuario(this.loginForm);
      }
      // this.router.navigate(["/lista-orden"])
    }
  }

  async validaUsuario(form: FormGroup) {
    let loading = await this.presentLoading();
    var formData: any = new FormData();
    let tipo_usr = "O";

    if (this.tipo_usuario == "Empresa")
      tipo_usr = "E";
    else if (this.tipo_usuario == "Paciente")
      tipo_usr = "P"
    else if (this.tipo_usuario == "Medico")
      tipo_usr = "D"
    else {
      tipo_usr = "O"
    }

    formData.append("id_user", form.get('id_user').value);
    formData.append("pwd", form.get('pwd').value);
    formData.append("tipo", tipo_usr);
    formData.append("lng", this._translate.getDefaultLang());

    this.baseServicios.validaLogin(formData).toPromise().then(async (resp) => {
      console.log(resp);
      //DESAPARESCO EL LOADING
      this.respuesta = resp;
      if (resp && resp != null) {

        if (this.respuesta.validacion == 1) {
          this.presentToast(this.respuesta.mensaje);
          //this.router.navigate(["/lista-orden"]);
          this.varGlobal.setTokenServer(this.respuesta.token);
          this.varGlobal.setVarUsuario(this.respuesta.usuario.usuario);
          if (this.respuesta.usuario.usuario.entidades && this.respuesta.usuario.usuario.entidades.length > 1) {
            this.router.navigate(["/usuarios-disponibles"]).then(() => {

              this.loadingController.dismiss();
            });
          } else if (this.respuesta.usuario.usuario.entidades && this.respuesta.usuario.usuario.entidades.length > 0) {
            //SOLO UNA ENTIDAD LO INSERTO DIRECTO A LA LISTA
            this.varGlobal.setVarEntidad(this.respuesta.usuario.usuario.entidades[0]);
            this.router.navigate(["/lista-orden"]).then(() => {

              this.loadingController.dismiss();
            });
          } else {
            this.varGlobal.setVarEntidad({ "tipo": this.respuesta.usuario.usuario.tipoUsuario, "nombre": this.respuesta.usuario.usuario.nombre, "codigo": this.respuesta.usuario.usuario.usuario })
            this.router.navigate(["/lista-orden"]).then(() => {

              this.loadingController.dismiss();
            });;
          }
        } else {
          this.presentModal(this.respuesta.mensaje)
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

  async validaUsuarioAva(form: FormGroup) {
    let loading = await this.presentLoading();
    var formData: any = new FormData();
    let tipo_usr = "";

    if (this.tipo_usuario == "Empresa")
      tipo_usr = "ref";
    else if (this.tipo_usuario == "Paciente")
      tipo_usr = "pat"
    else if (this.tipo_usuario == "Medico")
      tipo_usr = "med"

    //console.log(form);

    formData.append("usuario", form.get('id_user').value);
    formData.append("pwd", form.get('pwd').value);
    formData.append("tipo", tipo_usr);
    formData.append("device", this.utilidades.getNavegador() + "; ip: " + this.varGlobal.getIPBrowser());
    let acro = "";
    if (tipo_usr == 'med')
      acro = 'Dr. '

    this.baseServicios.validaLoginAva(formData).toPromise().then(async (resp) => {
      console.log('resp', resp);
      //DESAPARESCO EL LOADING
      this.respuesta = resp;
      let redirect = "";

      if (resp && resp != null) {
        this.presentToast(this.respuesta.mensaje);

        //SI LA RESPUESTA ES 3 OBLIGAMOS A ACTUALIZar
        if (this.respuesta.validacion == 3) {
          this.varGlobal.setForceUpdate(true)
        }

        if (this.respuesta.validacion == 1 || this.respuesta.validacion == 3) {
          //this.router.navigate(["/lista-orden"]);
          this.varGlobal.setTokenServer(this.respuesta.token);
          //GUARDO USUARIO Y DESCRIPCION
          this.varGlobal.setVarUsuario(form.get('id_user').value);

          //guardo tipo y envio al correspondiente
          this.varGlobal.setVarUsuarioTipo(tipo_usr);
          if (tipo_usr == "med") {
            if (this.configApp.defaultInicioMed) {
              redirect = "home-medico/" + this.configApp.defaultInicioMed;
            } else {
              redirect = "home-medico" + "";
            }

          } else if (tipo_usr == "pat") {
            redirect = "home-paciente/lista-ordenes"
          }
          else if (tipo_usr == "ref")
            redirect = "home-medico"

          if (this.respuesta.result) {
            this.varGlobal.setVarUsuarioDes(acro + this.respuesta.result.description);
            let data_original = this.respuesta.result.original.response;
            console.log('data_original', data_original);

            if (data_original.email) {
              this.varGlobal.setVarUsuarioMail(data_original.email)
            }

            if (data_original.codigo_usuario && data_original.codigo_usuario != '') {

              this.varGlobal.setVarUsuario(data_original.codigo_usuario);
            }

            //si esta habilitado la proteccion de datos, validamos al usuario paciente para ver si ya a aceptado
            if (tipo_usr == "pat" && this.activaProtect) {


              if (data_original.protect != undefined && data_original.protect == 0) {
                //AQUI ABRIRIA EL MODAL Y REVISAMOS SI ACEPTA 
                this.presentModalPolicy(form.get('id_user').value);//codigo de inicio es el codigo paciente
                redirect = ""
              }

            }


          }


          //redirect="home-medico"
          console.log(redirect);

          this.router.navigateByUrl(redirect, { replaceUrl: true }).then(() => {
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


  segmentChanged(ev: any) {
    //console.log('Segment changed', ev);
    this.zone.run(() => {
      this.tipo_usuario = ev.detail.value;
      //console.log("HOLO");

    });
  }

  segmentChanged_pedido(ev: any) {
    console.log('Segment changed', ev);
    this.zone.run(() => {

      this.pedido_lugar_select = ev.detail.value;
      console.log("this.pedido_lugar_select", this.pedido_lugar_select);

      this.varGlobal.setLugarPedido(this.pedido_lugar_select);
      //console.log("HOLO");
      console.log("this.varGlobal.setLugarPedido(this.pedido_lugar_select);", this.varGlobal.getLugarPedido());


    });
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: "top",

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


  async presentModal(mensaje) {
    const modal = await this.modalCtrl.create({
      component: AlertLoginPage,
      cssClass: 'modal-alert-login',
      componentProps: {
        mensaje: mensaje
      }
    });
    return await modal.present();
  }


  async presentModalPolicy(codigoPaciente) {
    const modal = await this.modalCtrl.create({
      component: PolicyLoginPage,
      cssClass: 'modal-policy',
      componentProps: {
        codigoPaciente:codigoPaciente
      }
    });
    await modal.present();
    modal.onDidDismiss()
      .then(async (data) => {
        console.log(data['data']);
        // this.filtrarPeriodo(data['data']);
        if (data['data']) {
          if (data && data['data'] && data['data'].acept&& data['data'].acept=="ok") {
            this.router.navigateByUrl("home-paciente/lista-ordenes", { replaceUrl: true }).then(() => {
              //this.loadingController.dismiss();
            });;
          } else {
            //Borro datos 
            this.varGlobal.setTokenServer("");
            this.varGlobal.setVarUsuario("");
            this.varGlobal.setVarUsuarioDes("");
            this.varGlobal.setVarUsuarioMail("")
            this.varGlobal.setVarUsuarioTipo("");
          }
        }
      })
  }

  validaUsuariosActivos(tipo) {
    let activa = false;
    activa = this.configApp.ActivaTiposUsuarios[tipo]
    if (this.configApp.ActiveByHost && this.configApp.ActiveByHost[tipo]) {//si esta activa son los que tienen restriccion
      let hosts = this.configApp.ActiveByHost[tipo]//contiene una lista de host permitidos
      if (hosts.length > 0) {
        //validamos el host
        activa = hosts.includes(window.location.hostname)
      }
    }
    //esta validacion preguntara al servidor si tiene activo otro usuario
    if (this.userActiveByServer && this.userActiveByServer.length > 0) {
      activa = this.userActiveByServer.includes(tipo)
    }
    return activa
  }

  getContacto() {
    let respuesta
    this.baseServicios.getContactos().subscribe(resp => {
      console.log("CONTACTOS", resp);
      respuesta = resp;
      if (respuesta.response && respuesta.response.data) {
        this.contacto = respuesta.response.data;
      }
    }, error => {
      console.error("ERROR", error);
    })
  }
  //

  forceUppercaseConditionally(formControlName, event) {
    console.log(this.tipo_usuario);
    if (this.configApp.DefaultUpperCase && !this.configApp.DefaultUpperCase[this.tipo_usuario]) {
      return;
    }

    if (this.tipo_usuario == "Externo") {
      return
    }
    if (this.configApp.apiBaseType == 1)
      this.loginForm.get(formControlName).setValue(event.target.value.toUpperCase());

  }

  //Metodo que busca si existe el medico ingresado en el Avalab (cambio para Msp)

  validaLoginMsp(form: FormGroup) {

    console.log('asdassdadas');
    this.loadingservice.present('Inciando Sesión')
    let usuario = form.get('id_user').value;
    let clave = form.get('pwd').value;
    this.baseServicios.validaLoginMsp({ usuario: usuario, clave: clave }).toPromise().then((result: any) => {
      console.log('r', result);

      let data = result[0]
      console.log('r', data.valor);
      if (data.valor == 1) {
        console.log('entre');
        this.checkMedico(data)
      } else {
        this.presentToast('Usuario o clave incorrectas');
        this.loadingservice.dismiss()
      }

    })
  }

  validaLoginExterno(form: FormGroup) {
    this.loadingservice.present('Inciando Sesión')
    let usuario = form.get('id_user').value;
    let clave = form.get('pwd').value;
    console.log({ usuario: usuario, clave: clave });
    this.loadingservice.dismiss();

    let tipo_usr = "";
    var formData: any = new FormData();

    formData.append("usuario", usuario);
    formData.append("pwd", clave);
    this.baseServicios.ValidaLoginExterno(formData).toPromise().then(resp => {
      console.log(resp);
      this.respuesta = resp;
      if (resp && resp != null) {
        this.presentToast(this.respuesta.mensaje);

        //SI LA RESPUESTA ES 3 OBLIGAMOS A ACTUALIZar
        if (this.respuesta.validacion == 3) {
          this.varGlobal.setForceUpdate(true)
        }

        if (this.respuesta.validacion == 1 || this.respuesta.validacion == 3) {
          //this.router.navigate(["/lista-orden"]);
          this.varGlobal.setTokenServer(this.respuesta.token);
          //GUARDO USUARIO Y DESCRIPCION
          this.varGlobal.setVarUsuario(form.get('id_user').value);
          if (this.respuesta.result) {
            this.varGlobal.setVarUsuarioDes(this.respuesta.result.description);
            let data_original = this.respuesta.result.original.response;
            console.log('data_original', data_original);

            if (data_original.email) {
              this.varGlobal.setVarUsuarioMail(data_original.email)
            }


            if (data_original.codigo_usuario && data_original.codigo_usuario != '') {
              console.log('Entreeeee', data_original);
              this.varGlobal.setVarUsuario(data_original.codigo_usuario);
            }

          }
          //guardo tipo y envio al correspondiente
          this.varGlobal.setVarUsuarioTipo("ext");
          let redirect = "";
          //if (tipo_usr == "med") {

          redirect = "home-medico/lista-ordenes";


          console.log("redirect", redirect);


          this.router.navigateByUrl(redirect, { replaceUrl: true }).then(() => {
            this.loadingController.dismiss();
          });;

        }

        this.loadingController.dismiss();

      }
    })
  }

  checkMedico(data) {

    console.log('data', data);
    this.queryservice.getMedicosbyId(data.cedula).then((result: any) => {
      console.log('result_med', result);
      let data_temp = result.data.getMedicobyCed;

      if (data_temp.cod_med == null) {
        let jsondata = JSON.stringify({ nom_med: data.usuario, id_med: data.cedula });
        console.log('jsondata', jsondata);

        this.queryservice.insertMedicoLite(jsondata).then((result_t: any) => {
          console.log('result_t', result_t);
          let data_medico_insert = result_t.data.insertMedicolite;
          if (data_medico_insert.resultado == 'ok') {
            this.loadingservice.dismiss();
            return this.checkMedico(data);
          }

        })
      }
      else {
        let tipo_usr;
        if (this.tipo_usuario == "Empresa")
          tipo_usr = "ref";
        else if (this.tipo_usuario == "Paciente")
          tipo_usr = "pat"
        else if (this.tipo_usuario == "Medico")
          tipo_usr = "med"

        this.presentToast('Ingreso correcto');
        //GUARDO USUARIO Y DESCRIPCION
        this.varGlobal.setVarUsuario(data_temp.cod_med);
        this.varGlobal.setVarUsuarioDes(data_temp.nom_med);
        //guardo tipo y envio al correspondiente
        this.varGlobal.setVarUsuarioTipo(tipo_usr);
        let redirect = "";
        if (tipo_usr == "med")
          redirect = "home-medico"
        else if (tipo_usr == "pat")
          redirect = "lista-orden"
        else if (tipo_usr == "ref")
          redirect = "lista-orden"

        //redirect="home-medico"
        console.log(redirect);


        this.router.navigateByUrl(redirect, { replaceUrl: true }).then(() => {
          //     this.loadingController.dismiss();
          this.loadingservice.dismiss();
        });
        this.loadingservice.dismiss();


        //   this.loadingController.dismiss();

      }
    })
  }

}
