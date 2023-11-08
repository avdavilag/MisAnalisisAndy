import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
//ESTO LLAMA AL ARCHIVO DE CONFIGURACION
export class AppConfigService {

  private appConfig: any;

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    let file = "configuration/config.json"
    //USO UNO DIFERENTE EN DESARROLLO
    if (!environment.production) {
      file = "configuration/config_des.json"
    }

    return this.http.get(file)
      .toPromise()
      .then(data => {
        this.appConfig = data;
      });
  }

  get apiBaseType() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    //2=mongo;1=avalab
    return this.appConfig.apiBaseType;
  }

  get defaultTipoUser() {

    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }

    return this.appConfig.tipoUserDef;
  }
  get formatoFecha() {

    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }

    return this.appConfig.formatoFechaDisplay;
  }

  get enableLog() {

    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }

    return this.appConfig.enableLog;
  }

  get defaultLenguaje() {

    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }

    return this.appConfig.defaultLenguaje;
  }

  get nombreLab() {

    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }

    return this.appConfig.nombreLab;
  }

  get configDetalle() {

    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }

    return this.appConfig.detalleOrden;
  }

  get defaultPaginacion() {

    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }

    return this.appConfig.paginacion;
  }
  get pdfEncabezado() {

    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }

    return this.appConfig.pdfEncabezado;
  }
  get pdfPie() {

    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }

    return this.appConfig.pdfPie;
  }
  get estilo_pagina() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.estilo;
  }

  get rootPath() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.rootPath;
  }

  get tiempoInactividad() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.tiempoInactividad;
  }
  get parametrosPDF() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.parametrosPDF;
  }

  get ActivaTiposUsuarios() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.ActivaTiposUsuarios;
  }


  get redirectWeb() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.redirectWeb;
  }
  get activaVersionamiento() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.activaVersionamiento;
  }
  get parametrosPDFOrden() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.parametrosPDFOrden;
  }

  //consguir tipo de Login cambio para MSP
  get tipoSystem() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.tipoSystem;
  }

  get enablePedidos() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.enablePedidos;
  }

  get defaultInicioMed() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.defaultInicioMed;
  }
  get versionApp() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.versionApp;
  }
  get activaMail() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.activaMail;
  }
  get activaWhatsApp() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.activaWhatsApp;
  }

  get onlyPedidos() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.onlyPedidos;
  }
  get progressPDF() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.progressPDF;
  }

  get formatoRefPDF() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.formatoRefPDF;
  }

  get activaLiberacion() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.activaLiberacion;
  }


  get unidad_pedido() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.unidad_pedido;
  }

  get diagnostico_pedido() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.diagnostico_pedido;
  }

  get diagnostico_extra_pedido() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.diagnostico_extra_pedido;
  }
  get messageWebAnalisis() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.messageWebAnalisis;
  }

  get listado_lugar_pedido() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.listado_lugar_pedido;
  }

  get max_pedidos_turno() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.max_pedidos_turno;
  }

  get active_lugar_pedido() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.active_lugar_pedido;
  }

  get active_turno() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.active_turno;
  }

  get fechaInicioChart() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.fechaInicioChart;

  }
  get messageWebAnalisisStsWeb() {

    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.messageWebAnalisisStsWeb;
  }

  get ActiveByHost() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.ActiveByHost;
  }

  get ActiveByPrivateIp() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.ActiveByPrivateIp;
  }

  get pac_fec_nac() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.pac_fec_nac;

  }

  get pac_sex() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.pac_sex;

  }
  get Label_externo() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.label_externo;

  }
  get activaFirma() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.activaFirma;
  }

  get lugar_default() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.lugar_default;
  }

  get enable_pedido_referencia() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.enable_pedido_referencia;
  }

  get enabe_hora_turno() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.enabe_hora_turno;
  }
  get activaFirmaList() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.activaFirmaList;
  }
  get activaImagenesAnalisis() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.activaImagenesAnalisis;
  }

  get check_ped_ord() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.check_ped_ord;
  }

  get printer_name() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.printer_name;
  }

  /*
        get enableOrden(){
          if (!this.appConfig) {
              throw Error('Config file not loaded!');
            } 
            return this.appConfig.enableOrden;
        }
  
        */

  get enable_orden_referencia() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.enable_orden_referencia;
  }

  get cod_med_default() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.cod_med_default;
  }

  get intra_envio_bloque() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.intra_envio_bloque;
  }

  get tipoWhatsapp() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.tipoWhatsapp;
  }

  get formatoDefIntra() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.formatoDefIntra;
  }

  get DefaultUpperCase() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.DefaultUpperCase;
  }

  get enable_orden_completa() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.enable_orden_completa;
  }

  get enable_envio_iess() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.enable_envio_iess;
  }

  get enable_presupuesto() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.enable_presupuesto;
  }

  get observaciones_pedido() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.observaciones_pedido;
  }

  get refentrega_pedido() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.refentrega_pedido;
  }
  

  
  get activaProtect() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.activaProtect;
  }
  get permiteSoloAdjuntos() {
    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }
    return this.appConfig.permiteSoloAdjuntos;
  }
  
  
}