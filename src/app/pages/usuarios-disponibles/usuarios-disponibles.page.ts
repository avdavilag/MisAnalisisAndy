import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WebRestService } from 'src/app/servicios/intranet/web-rest.service';
import { IonBackButtonDelegate } from '@ionic/angular';
import { FuncionesComunes } from '../../utils/funciones-comunes';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';

@Component({
  selector: 'app-usuarios-disponibles',
  templateUrl: './usuarios-disponibles.page.html',
  styleUrls: ['./usuarios-disponibles.page.scss'],
})
export class UsuariosDisponiblesPage implements OnInit {
  @ViewChild(IonBackButtonDelegate, { static: false }) backButton: IonBackButtonDelegate;
  public usuario;
  public entidades;
  public select_user;
  constructor(public router:Router,
    private servicios: WebRestService ,
    private varGlobal: VariablesGlobalesService,
    public funcionesComunes: FuncionesComunes) { }

  ngOnInit() {
    this.usuario = this.varGlobal.getVarUsuario();
    console.log(this.usuario);


    if(this.usuario.entidades){
      this.entidades=this.usuario.entidades;
      
    }
  }
  ionViewDidEnter() {
   // console.log('ionViewDidEnter');
 //   this.setUIBackButtonAction();
  }
  resultados(){
    console.log(this.select_user);
    this.varGlobal.setVarEntidad(this.select_user);
 
      
    this.router.navigate(["/lista-orden"]);
    
  }
  setUIBackButtonAction() {
    this.backButton.onClick = (resp) => {
      // handle custom action here
      console.log(resp);
      
      console.log("ACTION");
      
      sessionStorage.clear();
    };
  }
  back(){
    console.log(this.varGlobal.getEntidad());   
    console.log(Object.keys(this.varGlobal.getEntidad()).length);
    
    if(Object.keys(this.varGlobal.getEntidad()).length !== 0)
      this.router.navigate(["/lista-orden"])
      else{
        this.funcionesComunes.cerrarSesion();
        sessionStorage.clear();
    
      }
  }

  
}
