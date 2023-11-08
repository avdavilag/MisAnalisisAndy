import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConnectionsService } from 'src/app/utils/app-conections-service';
import { AppConfigService } from 'src/app/utils/app-config-service';

@Injectable({
  providedIn: 'root'
})
export class PdfRenderService {

  private pdfEmailUrl: string = "";
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
      this.pdfEmailUrl = "http://"
    } else {
      this.pdfEmailUrl = "https://"
    }

    //si no esta definida uso la general
    if (this.configApp.apiPdfMailUrl == undefined) {
      if (this.configApp.apiBaseUrl == "") {
        this.pdfEmailUrl += window.location.hostname;
      } else {
        this.pdfEmailUrl += this.configApp.apiBaseUrl;
      }
    } else if (this.configApp.apiPdfMailUrl == "") {
      this.pdfEmailUrl += window.location.hostname;
    } else {
      this.pdfEmailUrl += this.configApp.apiPdfMailUrl;
    }

    //si no esta definida uso la general
    if (this.configApp.apiPdfMailPuerto == undefined) {

      if (window.location.protocol == "http:") {
        if (this.configApp.apiBasePuerto && this.configApp.apiBasePuerto != "") {
          this.pdfEmailUrl += ":" + this.configApp.apiBasePuerto;
        }
      } else {
        if (this.configApp.apiBasePuertoSsl && this.configApp.apiBasePuertoSsl != "") {
          this.pdfEmailUrl += ":" + this.configApp.apiBasePuertoSsl;
        }
      }

    } else {   //SI EXISTE PUERTO
      if (window.location.protocol == "http:") {

        if (this.configApp.apiPdfMailPuerto && this.configApp.apiPdfMailPuerto != "") {
          this.pdfEmailUrl += ":" + this.configApp.apiPdfMailPuerto;
        }
      } else {

        if (this.configApp.apiPdfMailPuertoSsl && this.configApp.apiPdfMailPuertoSsl != "") {
          this.pdfEmailUrl += ":" + this.configApp.apiPdfMailPuertoSsl;
        }
      }
    }
    //SUBDIR NO PUEDE SER LO MISMO SIEMPRE NECESITO DECLARARLO
    if (this.configApp.apiPdfMailSubDir && this.configApp.apiPdfMailSubDir != "") {
      this.pdfEmailUrl += "/" + this.configApp.apiPdfMailSubDir;
    }

    this.pdfEmailUrl += "/";
  }

  /////////////////////////////SERVICIOS DE PDF Y MAIL

  getPDF(body) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8'
      })

    };
    return this.http.post(this.pdfEmailUrl + "jasper-ws/render", body, httpOptions);
  }


  sendMailPDF(body) {
    return this.http.post(this.pdfEmailUrl + "mail-ws/email", body);
  }

  //ESTE PDF UTILIZA EL MISMO SERVICIO PARA CREACION PDF
  getPDFIntra(body) {

    return this.http.post(this.pdfEmailUrl + "jasper-ws/render/pdfIntra", body, {
      headers: {
        "Content-Type": "application/json",
      }, responseType: 'arraybuffer'
    });
  }

  //ESTE PDF UTILIZA EL MISMO SERVICIO PARA CREACION PDF
  getPDFPedido(body) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8'
      })

    };
    return this.http.post(this.pdfEmailUrl + "jasper-ws/render/pdfPedido", body, httpOptions);
  }

  getPDFOrdenWeb(body) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8'
      })

    };
    return this.http.post(this.pdfEmailUrl + "jasper-ws/render/pdfOrdenWeb", body, httpOptions);
  }
  

  //ESTE PDF UTILIZA EL MISMO SERVICIO PARA CREACION PDF
  getPDFFactura(body) {

    return this.http.post(this.pdfEmailUrl + "jasper-ws/render/pdfFactura", body, {
      headers: {
        "Content-Type": "application/json",
      }, responseType: 'arraybuffer'
    });
  }

  getPDFPresupuesto(body) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;charset=UTF-8'
      })

    };
    return this.http.post(this.pdfEmailUrl + "jasper-ws/render/pdfPresupuesto", body, httpOptions);
  }

}
