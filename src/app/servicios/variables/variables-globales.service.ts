import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariablesGlobalesService {

  private ipBrowser;
  private ipServer;
  private token = "";
  private usuario;
  private usuario_des;
  private usuario_tipo;
  private usuario_intra;
  private usuario_intra_des;
  private usuario_email;
  private entidad;
  private pedido_d;
  private orden_view;
  private forceUpdate;

  //modulo pedidos
  private cod_lugar_pedido;

  constructor(public http:HttpClient) { }
  
  //DIR IP PARA GUARDAR
  loadIp() {
    return this.http.get('https://jsonip.com');
  }
//guardar datos del pedido duplicado
  getPedido_d(){
    return this.pedido_d;
  }
  setPedido_d(pedido_d){
     this.pedido_d=pedido_d;
  }

  getIPBrowser(){
    return this.ipBrowser;
  }

  setIPBrowser(ipBrowser){
     this.ipBrowser=ipBrowser;
  }

  getIPServer(){
    return this.ipServer;
  }

  setIPServer(ipServer){
     this.ipServer=ipServer;
  }

  setForceUpdate(forceUpdate){
    sessionStorage.setItem("force_u", btoa(JSON.stringify(forceUpdate)))
    this.forceUpdate = forceUpdate;
  }
  
  setVarUsuario(usuario) {
    sessionStorage.setItem("usr", btoa(JSON.stringify(usuario)))
    this.usuario = usuario;
  }
  
  setVarUsuarioDes(usuario_descripcion) {
    sessionStorage.setItem("usr_des", btoa(JSON.stringify(usuario_descripcion)))
    this.usuario_des = usuario_descripcion;
  }

  setVarUsuarioMail(usuario_email) {
    sessionStorage.setItem("usr_email", btoa(JSON.stringify(usuario_email)))
    this.usuario_email = usuario_email;
  }

  setVarUsuarioTipo(usuario_tipo) {
    sessionStorage.setItem("usr_tp", btoa(JSON.stringify(usuario_tipo)))
    this.usuario_tipo = usuario_tipo;
  }

  setVarUsuarioIntra(usuario) {
    sessionStorage.setItem("usr_int", btoa(JSON.stringify(usuario)))
    this.usuario_intra = usuario;
  }
  setVarUsuarioIntraDes(usuario_descripcion) {
    sessionStorage.setItem("usr_int_des", btoa(JSON.stringify(usuario_descripcion)))
    this.usuario_intra_des = usuario_descripcion;
  }

  setVarEntidad(entidad) {
    sessionStorage.setItem("entity", btoa(JSON.stringify(entidad)))
    this.entidad = entidad;
    console.log("SE INSERTO LA ENTIDAD");
  }

  setTokenServer(tkn) {
    sessionStorage.setItem("cs_tkn", btoa(JSON.stringify(tkn)))
    this.token = tkn
  }


  setLugarPedido(cod_lugar_pedido) {
    console.log("cod_lugar_pedido",cod_lugar_pedido);
    
    sessionStorage.setItem("cod_lugar_pedido", btoa(JSON.stringify(cod_lugar_pedido)))
    this.cod_lugar_pedido = cod_lugar_pedido
  }

  getVarUsuario() {
    if (!this.usuario || this.usuario == null) {
      if (sessionStorage.getItem("usr"))
        return JSON.parse(atob(sessionStorage.getItem("usr")))
      else
        return ""
    } else {
      return this.usuario;
    }
  }


  getForceUpdate() {
    if (!this.forceUpdate || this.forceUpdate == null) {
      if (sessionStorage.getItem("force_u"))
        return JSON.parse(atob(sessionStorage.getItem("force_u")))
      else
        return ""
    } else {
      return this.forceUpdate;
    }
  }

    
  getVarUsuarioDes() {
    if (!this.usuario_des || this.usuario_des == null) {
      console.log(sessionStorage.getItem("usr_des"));
      
      if (sessionStorage.getItem("usr_des"))
        return JSON.parse(atob(sessionStorage.getItem("usr_des")))
      else
        return ""
    } else {
      return this.usuario_des;
    }
  }
  
  getVarUsuarioEmail() {
    if (!this.usuario_email || this.usuario_email == null) {
      console.log(sessionStorage.getItem("usr_email"));
      
      if (sessionStorage.getItem("usr_email"))
        return JSON.parse(atob(sessionStorage.getItem("usr_email")))
      else
        return ""
    } else {
      return this.usuario_email;
    }
  }
    
  getVarUsuarioTipo() {
    if (!this.usuario_tipo || this.usuario_tipo == null) {
      console.log(sessionStorage.getItem("usr_tp"));
      
      if (sessionStorage.getItem("usr_tp"))
        return JSON.parse(atob(sessionStorage.getItem("usr_tp")))
      else
        return ""
    } else {
      return this.usuario_tipo;
    }
  }
  
  getVarUsuarioIntra() {
    if (!this.usuario_intra || this.usuario_intra == null) {
      if (sessionStorage.getItem("usr_int"))
        return JSON.parse(atob(sessionStorage.getItem("usr_int")))
      else
        return ""
    } else {
      return this.usuario_intra;
    }
  }

    
  getVarUsuarioIntraDes() {
    if (!this.usuario_intra_des || this.usuario_intra_des == null) {
      if (sessionStorage.getItem("usr_int_des"))
        return JSON.parse(atob(sessionStorage.getItem("usr_int_des")))
      else
        return ""
    } else {
      return this.usuario_intra_des;
    }
  }

  getEntidad() {
    if (!this.entidad || this.entidad == null) {
      if (sessionStorage.getItem("entity"))
        return JSON.parse(atob(sessionStorage.getItem("entity")))
      else
        return {}
    } else {
      return this.entidad;
    }
  }

  getTokenServer() {
    if (!this.token || this.token == null) {
      if (sessionStorage.getItem("cs_tkn"))
        return JSON.parse(atob(sessionStorage.getItem("cs_tkn")))
      else
        return ""
    } else {
      return this.token;
    }
  }


  getLugarPedido() {
    if (!this.cod_lugar_pedido || this.cod_lugar_pedido == null) {
      if (sessionStorage.getItem("cod_lugar_pedido"))
        return JSON.parse(atob(sessionStorage.getItem("cod_lugar_pedido")))
      else
        return ""
    } else {
      return this.cod_lugar_pedido;
    }
  }


  getOrigenOrden(){
    if(localStorage.getItem("origen_lab")){
      return JSON.parse(atob(localStorage.getItem("origen_lab")))
    }
    else{
      return null
    }
  }

  setOrigenOrden(data){
    localStorage.setItem("origen_lab",btoa(JSON.stringify(data)))
  }

  //guardar datos del pedido duplicado
  getOrden_view(){
    return this.orden_view;
  }
  setOrden_view(orden_view){
     this.orden_view=orden_view;
  }

}
