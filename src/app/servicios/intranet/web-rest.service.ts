import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../utils/app-config-service';
import { VariablesGlobalesService } from '../variables/variables-globales.service';
import { AppConnectionsService } from 'src/app/utils/app-conections-service';
@Injectable({
  providedIn: 'root'
})
export class WebRestService {

  private intraUrl;
  constructor(private http: HttpClient, private configApp: AppConnectionsService, private variablesGlob: VariablesGlobalesService) {
    this.inicializaApis();
  }
  inicializaApis() {

    //PARA INTRANET

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
    } else {//SI EXISTE PUERTO

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


  validaLoginIntra(body) {
    return this.http.post(this.intraUrl + "intranet/login", body);
  }


  getOrdenIntra(body) {
    return this.http.post(this.intraUrl + "intranet/orden", body);
  }



  getDatosPacienteIntra(body) {
    const httpOptions = {
      headers: {
        //  'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "intranet/datos_paciente", body, httpOptions);
  }

  getDatosUsuarioPeticionIntra(body) {
    const httpOptions = {
      headers: {
        'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "intranet/datos_usuario_peticion", body, httpOptions);
  }

  setValidaAccion(body) {
    const httpOptions = {
      headers: {
        'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "intranet/lista_analisis", body, httpOptions);
  }

  setAuditoria(body) {
    const httpOptions = {
      headers: {
        // 'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "intranet/setAuditoria", body, httpOptions);
  }


  sendPDFIntra(body) {
    let headers = {
      'Authorization': this.variablesGlob.getTokenServer()
    }
    //  return this.http.post(this.intraUrl + "intranet/sendPDF", body, {headers,responseType:"arraybuffer"});   return this.http.post(this.intraUrl + "intranet/sendPDF", body, {headers,responseType:"arraybuffer"});
    return this.http.post(this.intraUrl + "intranet/sendPDF", body, { headers });

  }



  getAttachmentPDF(body) {
    const httpOptions = {
      headers: {
        //'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "intranet/get_attachment", body, httpOptions);
  }

  getQrPDF(body) {
    const httpOptions = {
      headers: {
        //'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "intranet/get_qr", body, httpOptions);
  }

  getShortUrl(body) {
    const httpOptions = {
      headers: {
        'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "intranet/get-shorturl", body, httpOptions);
  }


  getResourceParametro(body) {
    const httpOptions = {
      headers: {
        'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "intranet/getResourceParam", body, httpOptions)
  }


  getPermiso(body) {
    const httpOptions = {
      headers: {
        'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "intranet/getPermiso", body, httpOptions)
  }

  getUrlOrden(body) {
    const httpOptions = {
      headers: {
        'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "intranet/get_url_orden", body, httpOptions)
  }

  //ESTAS ESTAN PUBLICAS PARA RECUPERAR
  getOrdenOriginalIntra(body) {
    const httpOptions = {
      headers: {
        //'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "intranet/orden_origen", body, httpOptions);
  }
  getResourceParametroOrden(body) {
    const httpOptions = {
      headers: {
        //  'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "intranet/getResourceParamOrder", body, httpOptions)
  }
  
  getAllResourceParametroOrden(body) {
    const httpOptions = {
      headers: {
        //  'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "intranet/getAllResourceParamOrder", body, httpOptions)
  }

  getOrderbyUid(body) {
    const httpOptions = {
      headers: {
        //'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    return this.http.post(this.intraUrl + "intranet/get_uid_order", body, httpOptions)
  }

  getStatusWzp(){
    return this.http.get(this.intraUrl + "intranet/estadoWzp")
  }


  printTicket(body){
    const httpOptions = {
      headers: {
        //'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    console.log(body);
    
    return this.http.post("http://localhost:9500/ticket", body, httpOptions)
  }

  getIpbyCSservice(){
    const httpOptions = {
      headers: {
        'Content-Type': 'text/plain'
        //'Authorization': this.variablesGlob.getTokenServer()
      }
    };
 
    
    return this.http.get("http://localhost:9500/getIp", httpOptions)
  }


  sendMassiveMails(body) {
    
    const httpOptions = {
      headers : {
        'Content-Type': 'application/json',
      }
    };
   return this.http.post(this.intraUrl + "intranet/send-masive-order", body, httpOptions)
  }
/*
  DownloadMassiveMails(body) {
    
    const httpOptions = {
      headers : {
        'Content-Type': 'application/json',
      }
    };
   return this.http.post(this.intraUrl + "intranet/download-masive-order", body, httpOptions)
  }
  */
  DownloadMassiveMails(body) {
    
    const httpOptions = {
      headers : {
        'Content-Type': 'application/json',
      }
    };
    body.push(
      {url_server:this.intraUrl + "intranet"})
   return this.http.post("http://localhost:9500/download-rbloque", body, httpOptions)
  }
  downloadIess(body,extra_data){
    console.log("extra_data",extra_data);
    let extra_parm:any={};
    //this.intraUrl + "intranet
    const httpOptions = {
      headers: {
        //'Authorization': this.variablesGlob.getTokenServer()
      }
    };
    extra_parm.url_server=this.intraUrl + "intranet"
    console.log("body",body);
if(extra_data.length>0){
  extra_parm.flag=true,
  extra_parm.cert=extra_data[0].cert,
  extra_parm.pass=extra_data[0].pass
}else{
  extra_parm.flag=false
}
   body.push(extra_parm)
   console.log("body",body);
    return this.http.post("http://localhost:9500/download-iess", body, httpOptions)
  }

}
