import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { WebRestService } from "../servicios/intranet/web-rest.service";
import { VariablesGlobalesService } from "../servicios/variables/variables-globales.service";
import { AppConfigService } from "../utils/app-config-service";
@Injectable({
    providedIn: "root"
})
export class CheckActivePedidos implements CheckActivePedidos {
    private usuario;
    private tipo;
    private tipo_usr;
    private enablePedidos;
    private flag_pedido_ref:boolean=false
    constructor(private router: Router, private varGlobal: VariablesGlobalesService, private appVariables: AppConfigService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // console.log(route);
        this.usuario = this.varGlobal.getVarUsuario();
        this.tipo_usr = this.varGlobal.getVarUsuarioTipo();
        this.tipo = this.appVariables.apiBaseType;
        this.enablePedidos=this.appVariables.enablePedidos;
        
        let url: string = state.url;

        console.log(url);
        console.log(this.usuario);
        console.log(this.tipo);
        console.log(this.tipo_usr);

        if(this.tipo_usr=='ref'&&this.appVariables.enable_pedido_referencia&&this.appVariables.enablePedidos){
            return true
        }

    
      if (!this.enablePedidos   || this.tipo_usr != "med") {            
            console.log('No esta autorizado a ingresar aqui');
            
          //  this.router.navigate(["/"]);
            return false;
        } else {

            return true;
        }

    }
}