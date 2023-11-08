import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { WebRestService } from "../servicios/intranet/web-rest.service";
import { VariablesGlobalesService } from "../servicios/variables/variables-globales.service";

@Injectable({
  providedIn: "root"
})
export class CheckInactive implements CanActivate {
   private cadena;
   private entity;
  constructor(private router: Router,private varGlobal:VariablesGlobalesService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    this.cadena = this.varGlobal.getVarUsuario()
    this.entity = this.varGlobal.getEntidad()
    
    if (this.cadena&&this.cadena!=""&&Object.keys(this.cadena).length !== 0) {
      if(this.entity&&this.entity!=""&&Object.keys(this.entity).length !== 0){
        this.router.navigate(["/lista-orden"])
      }else{
        this.router.navigate(["/usuarios-disponibles"])
      }
      return false
      }
    

    return true;
  }
}