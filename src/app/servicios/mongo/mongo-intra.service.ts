import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConnectionsService } from 'src/app/utils/app-conections-service';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { VariablesGlobalesService } from '../variables/variables-globales.service';

@Injectable({
  providedIn: 'root'
})
export class MongoIntraService {

  private mongoUrl;
  constructor(private http: HttpClient, private configApp: AppConnectionsService, private variablesGlob: VariablesGlobalesService) {

    //ESTA USANDO EL MISMO PAQUETE DE LOS INTRA

    /*
        if (this.configApp.apiBaseHttps && this.configApp.apiBaseHttps == true) {
          this.baseUrl = "https://"
        } else {
          this.baseUrl = "http://"
        }
        */
    if (window.location.protocol == "http:") {
      this.mongoUrl = "http://"
    } else {
      this.mongoUrl = "https://"
    }

    //si no esta definida uso la general
    if (this.configApp.apiMongoUrl == undefined) {
      if (this.configApp.apiBaseUrl == "") {
        this.mongoUrl += window.location.hostname;
      } else {
        this.mongoUrl += this.configApp.apiBaseUrl;
      }
    } else //BUSCO LA VARIABLE 
      if (this.configApp.apiMongoUrl == "") {
        this.mongoUrl += window.location.hostname;
      } else {
        this.mongoUrl += this.configApp.apiMongoUrl;
      }

    //si no esta definida uso la general
    if (this.configApp.apiMongoPuerto == undefined) {

      if (window.location.protocol == "http:") {
        if (this.configApp.apiBasePuerto && this.configApp.apiBasePuerto != "") {
          this.mongoUrl += ":" + this.configApp.apiBasePuerto;
        }
      } else {
        if (this.configApp.apiBasePuertoSsl && this.configApp.apiBasePuertoSsl != "") {
          this.mongoUrl += ":" + this.configApp.apiBasePuertoSsl;
        }
      }

    } else {  //SI EXISTE PUERTO
      if (window.location.protocol == "http:") {
        if (this.configApp.apiMongoPuerto && this.configApp.apiMongoPuerto != "") {
          this.mongoUrl += ":" + this.configApp.apiMongoPuerto;
        }
      } else {
        if (this.configApp.apiMongoPuertoSsl && this.configApp.apiMongoPuertoSsl != "") {
          this.mongoUrl += ":" + this.configApp.apiMongoPuertoSsl;
        }
      }

    }
    if (this.configApp.apiMongoSubDir && this.configApp.apiMongoSubDir != "") {
      this.mongoUrl += "/" + this.configApp.apiMongoSubDir;
    }

    this.mongoUrl += "/";
  }

  savePDFIntra(body) {
    const httpOptions = {
      headers: {
        'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.mongoUrl + "mng/savePDF", body, httpOptions);
  }
  getSavedListPDF(body) {
    const httpOptions = {
      headers: {
        'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    console.log(this.mongoUrl);
    console.error("LA URL",this.mongoUrl);
    
    return this.http.post(this.mongoUrl + "mng/recuperaListaPDF", body, httpOptions);
  }


  getSavedPDF(body) {
    const httpOptions = {
      headers: {
        'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.mongoUrl + "mng/recuperaPDF", body, httpOptions);
  }

  getSavedPDFUid(body) {
    return this.http.post(this.mongoUrl + "mng/recuperaUuidPDF", body);
  }
  getSavedListUidPDF(body) {
    return this.http.post(this.mongoUrl + "mng/recuperaListaUuidPDF", body);
  }
  getLastVersionPDF(body) {
    return this.http.post(this.mongoUrl + "mng/ultimaVersionPDF", body);
  }
  
}
