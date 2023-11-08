import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConnectionsService } from 'src/app/utils/app-conections-service';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { VariablesGlobalesService } from '../variables/variables-globales.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private baseUrl: string = "";
  constructor(private http: HttpClient, private configApp: AppConnectionsService, private variablesGlob: VariablesGlobalesService) {
/*
    if (this.configApp.apiBaseHttps && this.configApp.apiBaseHttps == true) {
      this.baseUrl = "https://"
    } else {
      this.baseUrl = "http://"
    }
    */
    if (window.location.protocol == "http:") {
      this.baseUrl = "http://"
    } else {
      this.baseUrl = "https://"
    }

    if (this.configApp.apiBaseUrl == "") {
      this.baseUrl += window.location.hostname;
    } else {
      this.baseUrl += this.configApp.apiBaseUrl;
    }
    //SI EXISTE PUERTO
    if (window.location.protocol == "http:") {

      if (this.configApp.apiBasePuerto && this.configApp.apiBasePuerto != "") {
        this.baseUrl += ":" + this.configApp.apiBasePuerto;
      }

    } else {
      if (this.configApp.apiBasePuertoSsl && this.configApp.apiBasePuertoSsl != "") {
        this.baseUrl += ":" + this.configApp.apiBasePuertoSsl;
      }
    }
    if (this.configApp.apiBaseSubDir && this.configApp.apiBaseSubDir != "") {
      this.baseUrl += "/" + this.configApp.apiBaseSubDir;
    }

    this.baseUrl += "/";
  }

  validaLogin(body) {
    return this.http.post(this.baseUrl + "usr/login", body);
  }

  getListaResultados(body) {
    const httpOptions = {
      headers: {
        'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.baseUrl + "result/resultados", body, httpOptions);
  }

  getResultado(body) {
    return this.http.post(this.baseUrl + "result/resultado_orden", body);
  }

  getAnularTurno(body) {
    return this.http.post(this.baseUrl + "result/anulaTurno", body);
  }

  getListOrden() {
    return this.http.get(this.baseUrl + "result/all");
  }


  //SERVICIOS AVALAB
  validaLoginAva(body) {
    console.log(body,"asdadsa");
    
    return this.http.post(this.baseUrl + "result/login", body);
  }

  ActualizarUsuario(body) {
    return this.http.post(this.baseUrl + "result/actualizarUsuario", body);
  }

  setTurnoPedido(body) {

    const httpOptions = {
      headers: {
        //   'Authorization': this.variablesGlob.getTokenServer()
      }
    };

    return this.http.post(this.baseUrl + "result/setTurno", body, httpOptions)
  }


  getListOrders(body) {
    const httpOptions = {
      headers: {
       // 'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.baseUrl + "result/getListOrder", body, httpOptions)
  }

  getListFacturas(body){
    const httpOptions = {
      headers: {
       // 'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.baseUrl + "result/getListFactura", body, httpOptions)
  }

  getXmlFactura(body){
    const httpOptions = {
      headers: {
       // 'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.baseUrl + "result/getFacturaXML", body, httpOptions)
  }

  //Av ...............Servicio extra ministerio login
  validaLoginMsp(data) {
    let url: string = "http://viaclinica.hgms.gob.ec:8888/usuario/"
    return this.http.get(url + "'" + data.usuario + "'/'" + data.clave + "'");
  }
  
  getContactos() {
    let parametroForm: any = new FormData();
    parametroForm.append("parametro","mail_contacto")
    return  this.http.post(this.baseUrl + "intranet/getResourceParam", parametroForm)
  }

  ValidaLoginExterno(body){
    console.log(body);
    
    //http://192.168.57.69:8080
    //return this.http.post("http://192.168.57.69:8080/result/loginExterno", body);
  return this.http.post(this.baseUrl + "result/loginExterno", body);
  }
  


}
