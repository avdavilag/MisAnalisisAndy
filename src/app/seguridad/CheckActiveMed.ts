import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { WebRestService } from "../servicios/intranet/web-rest.service";
import { VariablesGlobalesService } from "../servicios/variables/variables-globales.service";
import { AppConfigService } from "../utils/app-config-service";
@Injectable({
    providedIn: "root"
})
export class CheckActiveMed implements CheckActiveMed {
    private usuario;
    private tipo;
    private tipo_usr;
    constructor(private router: Router, private varGlobal: VariablesGlobalesService, private appVariables: AppConfigService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // console.log(route);
        this.usuario = this.varGlobal.getVarUsuario();
        this.tipo_usr = this.varGlobal.getVarUsuarioTipo();
        this.tipo = this.appVariables.apiBaseType;
        let url: string = state.url;

        console.log(url,"url");
        console.log(this.usuario,"usuario");
        console.log(this.tipo,"tipo");
        console.log(this.tipo_usr,"tipo-usr");

        if (this.usuario == undefined || this.usuario == "" || this.tipo != 1 || this.tipo_usr == "pat"|| this.tipo_usr == "int"|| this.tipo_usr == "") {
            console.log('ente if guardasdadsa');
            
            sessionStorage.clear()
            this.router.navigate(["login"]);
            return false;
        } else {
           // this.router.navigate(["/home-medico"]);
            return true;
        }

    }
}