import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConnectionsService } from 'src/app/utils/app-conections-service';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { VariablesGlobalesService } from '../variables/variables-globales.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private intraUrl;
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
      this.intraUrl = "http://"
    } else {
      this.intraUrl = "https://"
    }

    if (this.configApp.apiIntranetUrl == undefined) {
      if (this.configApp.apiBaseUrl == "") {
        this.intraUrl += window.location.hostname;
      } else {
        this.intraUrl += this.configApp.apiBaseUrl;
      }
    } else //BUSCO LA VARIABLE 
      if (this.configApp.apiIntranetUrl == "") {
        this.intraUrl += window.location.hostname;
      } else {
        this.intraUrl += this.configApp.apiIntranetUrl;
      }
    //si no esta definida uso la general
    if (this.configApp.apiIntranetPuerto == undefined) {
      if (window.location.protocol == "http:") {
        if (this.configApp.apiBasePuerto && this.configApp.apiBasePuerto != "") {
          this.intraUrl += ":" + this.configApp.apiBasePuerto;
        }
      } else {
        if (this.configApp.apiBasePuertoSsl && this.configApp.apiBasePuertoSsl != "") {
          this.intraUrl += ":" + this.configApp.apiBasePuertoSsl;
        }
      }
    } else {
      //SI EXISTE PUERTO
      if (window.location.protocol == "http:") {
        if (this.configApp.apiIntranetPuerto && this.configApp.apiIntranetPuerto != "") {
          this.intraUrl += ":" + this.configApp.apiIntranetPuerto;
        }
      } else {
        if (this.configApp.apiIntranetPuertoSsl && this.configApp.apiIntranetPuertoSsl != "") {
          this.intraUrl += ":" + this.configApp.apiIntranetPuertoSsl;
        }
      }

    }
    if (this.configApp.apiIntranetSubDir && this.configApp.apiIntranetSubDir != "") {
      this.intraUrl += "/" + this.configApp.apiIntranetSubDir;
    }

    this.intraUrl += "/";
  }



  validaToken(body, tkn) {
    const httpOptions = {
      headers: {
        'Authorization': tkn
      }
    };
    return this.http.post(this.intraUrl + "gen/token_validar", {}, httpOptions);
  }

  refreshTokenIntra(body) {
    const httpOptions = {
      headers: {
        'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "gen/refreshToken", body, httpOptions);
  }

  getFormatosServer() {
    return this.http.get(this.intraUrl + "gen/getNameFormatos");
  }

  getIpClient() {
    return this.http.get(this.intraUrl + "gen/ip-cli");
  }

  getIpServ() {
    return this.http.get(this.intraUrl + "gen/ip-serv");
  }

  getUserActive(privateUrl) {
    return this.http.get(privateUrl + "gen/validate-usr");
  }

  getVersionMisAnalisis(privateUrl) {
    return this.http.get(privateUrl + "gen/validate-usr");
  }


}
