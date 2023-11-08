import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConnectionsService } from 'src/app/utils/app-conections-service';

@Injectable({
  providedIn: 'root'
})
export class FirmaService {

  private firmaUrl: string = "";
  constructor(private http: HttpClient, private configApp: AppConnectionsService) {
    //PARA LOS OTROS SERVICIOS PDF MAIL
    /*
      if (this.configApp.apiBaseHttps && this.configApp.apiBaseHttps == true) {
        this.pdfEmailUrl = "https://"
      } else {
        this.pdfEmailUrl = "http://"
      }
  */

    if (window.location.protocol == "http:") {
      this.firmaUrl = "http://"
    } else {
      this.firmaUrl = "https://"
    }

    //si no esta definida uso la general
    if (this.configApp.apiFirma == undefined) {
      if (this.configApp.apiBaseUrl == "") {
        this.firmaUrl += window.location.hostname;
      } else {
        this.firmaUrl += this.configApp.apiBaseUrl;
      }
    } else if (this.configApp.apiFirma == "") {
      this.firmaUrl += window.location.hostname;
    } else {
      this.firmaUrl += this.configApp.apiFirma;
    }

    //si no esta definida uso la general
    if (this.configApp.apiFirmaPuerto == undefined) {

      if (window.location.protocol == "http:") {
        if (this.configApp.apiBasePuerto && this.configApp.apiBasePuerto != "") {
          this.firmaUrl += ":" + this.configApp.apiBasePuerto;
        }
      } else {
        if (this.configApp.apiBasePuertoSsl && this.configApp.apiBasePuertoSsl != "") {
          this.firmaUrl += ":" + this.configApp.apiBasePuertoSsl;
        }
      }

    } else {   //SI EXISTE PUERTO
      if (window.location.protocol == "http:") {

        if (this.configApp.apiFirmaPuerto && this.configApp.apiFirmaPuerto != "") {
          this.firmaUrl += ":" + this.configApp.apiFirmaPuerto;
        }
      } else {

        if (this.configApp.apiFirmaPuertoSsl && this.configApp.apiFirmaPuertoSsl != "") {
          this.firmaUrl += ":" + this.configApp.apiFirmaPuertoSsl;
        }
      }
    }
    //SUBDIR NO PUEDE SER LO MISMO SIEMPRE NECESITO DECLARARLO
    if (this.configApp.apiFirmaSubDir && this.configApp.apiFirmaSubDir != "") {
      this.firmaUrl += "/" + this.configApp.apiFirmaSubDir;
    }

    this.firmaUrl += "/";
  }

  /////////////////////////////SERVICIOS DE PDF Y MAIL


  //ESTE PDF UTILIZA EL MISMO SERVICIO PARA CREACION PDF
  getPDFsign(body) {

    return this.http.post(this.firmaUrl+"signer/sign-intra", body, {
      headers: {
        "Content-Type": "application/json",
      }, responseType: 'arraybuffer'
    });
  }

  
  getPDFsignPrueba() {

    return this.http.get(this.firmaUrl+"signer/prueba", {
      headers: {
        "Content-Type": "application/json",
      }, responseType: 'arraybuffer'
    });
  }
 

}