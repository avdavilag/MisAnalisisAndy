import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from "@angular/router";
import { WebRestService } from "../servicios/intranet/web-rest.service";
import { VariablesGlobalesService } from "../servicios/variables/variables-globales.service";
@Injectable({
  providedIn: "root"
})
export class CheckActiveIntranet implements CanActivate {

  private cadena;
  constructor(private router: Router,private varGlobal:VariablesGlobalesService,) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log("route",route);
    console.log("state",state);
    let token= route.queryParams["tkn"];
   // this.usr = this.servicios.getUsrIntra();
   //W this.pwd = this.servicios.getPwdIntra();
    this.cadena = this.varGlobal.getTokenServer();
   // let url: string = state.url;
   if(token&&token!=''){ //SI ENTRA CON TOKEN DEJA PASAR
    return true;
   }

   if (this.cadena == undefined || this.cadena == ""|| Object.keys(this.cadena).length === 0) {
    this.router.navigate(["login-intranet"]);
      return false;
    }else{
    return true;
    }

  }
}