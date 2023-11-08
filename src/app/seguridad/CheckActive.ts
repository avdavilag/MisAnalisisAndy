import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { WebRestService } from "../servicios/intranet/web-rest.service";
import { VariablesGlobalesService } from "../servicios/variables/variables-globales.service";
import { AppConfigService } from "../utils/app-config-service";
@Injectable({
  providedIn: "root"
})
export class CheckActive implements CanActivate {
  private cadena;
  private entity;
  private tipo;
  constructor(private router: Router,private varGlobal:VariablesGlobalesService,private appVariables:AppConfigService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
   // console.log(route);
    this.cadena = this.varGlobal.getVarUsuario();
    this.entity = this.varGlobal.getEntidad();
    this.tipo = this.appVariables.apiBaseType;
    let url: string = state.url;

    if (this.cadena == undefined || this.cadena == ""|| Object.keys(this.cadena).length === 0) {
      console.log("TIENE PERMISO", url);
      
      this.router.navigate(["login"]);
      return false;
    }else{
      console.log("NO TIENE PERMISO", url);
      console.log(this.entity);
      console.log(url);
      if(this.tipo!=1){
        if (url!="/usuarios-disponibles" &&(this.entity == undefined || this.entity == ""|| Object.keys(this.entity).length === 0)) {
          this.router.navigate(["/usuarios-disponibles"])
        }
      }
      
    return true;
    }

  }
}