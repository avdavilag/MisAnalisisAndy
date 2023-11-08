import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { environment } from '../environments/environment';
import { AppConfigService } from './utils/app-config-service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { GraphqlService } from './servicios/graphql.service';
import { VariablesGlobalesService } from './servicios/variables/variables-globales.service';
import { GeneralService } from './servicios/general/general.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private configApp: AppConfigService,
    private translate: TranslateService,
    private titleService: Title,
    private servicioBase: VariablesGlobalesService,
    private servicioGeneral: GeneralService,
    private router: Router,
    private location: Location,
    private graphqlservice: GraphqlService,


  ) {
    JSON.parse(localStorage.getItem("HEF"))
    //MENSAJE DEL LOG
    console.log("%cPOWERED BY CUBOSOFT", "font: 2.5em roboto; color: #fff; background-color: #03a9f4;padding:5px");
    //CON ESTO DESHABILITO LOS LOGS PARA MODO PRODUCCION
    if (environment.production && this.configApp.enableLog) {
      console.log = function () { }   // DESHABILITA LOS LOGS
    }

    this.initializeApp();

    //PONGO EL LENGUAJE POR DEFECTO
    translate.setDefaultLang(this.configApp.defaultLenguaje);
    //REGISTRO LOS LENGUAJES
    translate.addLangs(['es', 'en'])
    //AÑADO EL TITULO DE PAGINA
    this.titleService.setTitle(this.configApp.nombreLab);
    //BUSCO LA IP CLIENTE Y INIALIZO PARA UTILIZARLA
    this.ipClientBrowser();
    //BUSCO LA IP DEL SERVIDOR
    this.ipServerAccess();
    //LE CREO UN ID POR TAB
    var tabID = sessionStorage.tabID ?
      sessionStorage.tabID :
      sessionStorage.tabID = Math.random();
    //VEMOS SI ESTA EN EL LOCALSTORAGE
    if (localStorage.tabID = tabID) {
      //SI ESTA ESTAMOS EN LA MISMA PANTALLA
    }
    else {//SI NO PUES CERRAMOS LA ANTERIOR Y GUARDAMOS EL TABID
      localStorage.tabID = tabID;
    }
    localStorage.count = localStorage.count ? parseInt(localStorage.count) + 1 : 1
    if (window.addEventListener) {
      window.addEventListener("storage", this._listener, false);
    }
  }
  private _listener = () => {
    // your logic here
    console.log("CAMBIO");
    if (localStorage.tabID != sessionStorage.tabID) {
      console.log("DIFERENTE TAB");

      window.open(window.location + "", '_self').close();

    } else {
      console.log("MISMO TAB");

    }
    //window.removeEventListener("storage", this._listener, false);

  }

  ipClientBrowser() {
    let respuesta;
    /*
        this.servicioBase.loadIp().subscribe(resp => {
          console.log("NAVEGADOR", resp);
          respuesta = resp;
          this.servicioBase.setIPBrowser(respuesta.ip);
        }, error => {
          console.error(error);
          this.servicioBase.setIPBrowser("0.0.0.0");
    
        })
        */
    this.servicioGeneral.getIpClient().subscribe(resp => {
      console.log("IP-CLIENT", resp);
      respuesta = resp;
      this.servicioBase.setIPBrowser(respuesta.ip);
    }, error => {
      console.error(error);
      this.servicioBase.setIPBrowser("0.0.0.0");

    })
  }

  ipServerAccess() {
    let respuesta;
    this.servicioGeneral.getIpServ().subscribe(resp => {
      console.log("IP-SERVER", resp);
      respuesta = resp;
      this.servicioBase.setIPServer(respuesta.ip);
    }, error => {
      console.error(error);
      this.servicioBase.setIPServer("0.0.0.0");

    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
    /*  
      if (this.platform.is('android')) {
        console.log("running on Android device!");
        alert("ssdfssd")
    }
    if (this.platform.is('ios')) {
        console.log("running on iOS device!");
    }
    if (this.platform.is('mobileweb')) {
        console.log("running in a browser on mobile!");
    }
      */
      //console.log(this.router.url);
      console.log(this.location.path());

      if (this.configApp.enablePedidos) {
      }
      //PARA TODOS AHORA GPQL desde la 3.53
      this.graphqlservice.iniciarGraphql();
      this.graphqlservice.test();

      if (environment.production) {
        if (!this.location.path() || this.location.path() == "") {
          console.log("REDIRIJO ROOT");
          this.router.navigate([this.configApp.rootPath]);
        }
      }


    });
  }
}
