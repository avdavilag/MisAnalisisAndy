import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { IngresoOrdenCompletaPage } from 'src/app/pages/ingreso-orden-completa/ingreso-orden-completa.page';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';



@Component({
  selector: 'app-ingreso-nuevo-paciente',
  templateUrl: './ingreso-nuevo-paciente.page.html',
  styleUrls: ['./ingreso-nuevo-paciente.page.scss'],
})
export class IngresoNuevoPacientePage implements OnInit {

  paciente: any = {
    cod_pac: "",
    nom_pac: null,
    ape_pac: null,
    fec_nac: null,
    id_pac: null,
    edad_pac: null,
    mail_pac: '',
    cel_pac: '',
    cod_ori: '',
    sex_pac: null,
    dir_pac: '',
    telf_pac: '',
    pais_nace: '',
    estado_civil: '',
    instruccion: '',
    ocu_pac: '',
    pat_pac: '',
    san_pac: '',
    etnia: '',
  };

poblacion: any ={
  cod_anc:'',
  des_niv:'',
  cod_pob:'',
  des_pob:'',
  fec_ini:'',
  fec_upd:'',
  first_user:'',
  last_user:'',
  lock_pob:'',
}
 paciente_completo:any={
  cod_pac: "",
  nom_pac: "",
  ape_pac: null,
  tit_pac: null,
  sex_pac: null,
  fec_nac:null,
  pais_id:null,
  id_pac:null,
  TIPO_ID:null,
  cod_pob:null,
  dir_pac:null,
  cp_pac:null,
  mail_pac:null,
  telf_pac:null,
  cel_pac:null,
  pais_nace:null,
  ciudad_nace:null,
  cod_ref:null,
  estado_civil:null,
  instruccion:null,
  ocu_pac:null,
  san_pac:null,
  sts_adm:null,
  etnia:null,
  pat_pac:null,
  cod_ori:null,
  last_user:null,
  pic_pac:null,
  profesion:null,
  tip_san:null,
 }

input_id: string = '';
cod_pac_temp:any;
tipo:any;
input_nombre: string = '';
input_apellido: string = '';
input_genero: string = '';
input_telefono: string = '';
input_cell: string = '';
input_mail: string = '';
input_dir: string = '';
input_fec_nac: string='';
input_instr: string = '';
edad: number;
input_pob: string='';
input_est_civil: string='';
input_titulo: string='';
input_pais_doc: null;
input_tipo_documento: null;
input_direccion: string='';
input_cp: string='';
input_email: string='';
input_celular: string='';
input_pais_origen: string='';
input_ciudad: string='';
input_referencia: string='';
input_estadoCivil: string='';
input_instruccion: string='';
input_ocupacion: string='';
input_tipo_sangre: string = '';
input_info_crediticia: string = '';
input_etnia: string = '';
input_patol_pac: string = '';
input_plan_fijo: string = '';
input_doc_fijo: string = '';
input_edad: string='';
edad_number:number;
bandera_editar:boolean;
input_cod_pac;

/////Variables de Poblacion//////


cod_pob:string='';
cod_niv:string='';
des_pob:string='';
fec_ini:string='';
lock_pob:string='';
fec_upd:string='';
last_user:string='';
cod_anc:string='';
first_user:string='';
array_poblacion:any=[];
array_referencia:any=[];
cuidad:string='';
provincia:string='';
cedula:string='';
esCedulaValida:boolean;
esCedulaValidaennumero:number;
esProvincia:string='';
esCiudad='';
codigo_origen:any;



//////////////////
  constructor(      
    private modalcontroller: ModalController,
    private queryservice: QueryService,
    private toastservice: ToastService,
    private loadingservice: LoadingService,
    private alertController:AlertController,
    private varGlobal: VariablesGlobalesService,
    private route: Router
  

    ) {
    }

  ngOnInit() {


    this.queryservice.getListPoblacion().then((r:any)=>
    {
      let data=r.data.ListPoblacion;
        for(let i=0;i<data.length;i++){
            if(data[i].cod_niv===1){

              this.esProvincia='Provincia';
            }
            if(data[i].cod_niv===2){
              this.esCiudad='Ciudad';
            }
        }

       this.array_poblacion=data;

    });

    this.queryservice.getListReferencia().then((r:any)=>
    {
      let datos=r.data.ListReferencia;
      this.array_referencia=datos;
    });


   
    if (this.cod_pac_temp) {
      this.queryservice.getPacientesbyCod(this.cod_pac_temp).then((r: any) =>
        {


        this.input_cod_pac=this.cod_pac_temp;
        let data = r.data.getPacientebyCod;
          console.log('Data para verifiicar por favor: ',data);

        this.cedula=data.id_pac;
        this.input_nombre =data.nom_pac;
        this.input_apellido =data.ape_pac;
        this.input_id =data.id_pac;
        this.input_genero =data.sex_pac;
        this.input_telefono =data.telf_pac;
        this.input_cell =data.cel_pac;
        this.input_email=data.mail_pac;
        this.input_dir =data.dir_pac;
        this.input_fec_nac =data.fec_nac;        
        // this.input_titulo=data.profesion;
        this.input_titulo=data.tit_pac;
        this.input_celular=data.cel_pac;
        this.input_telefono=data.telf_pac;
        this.input_pob=data.pais_id;
        this.input_direccion=data.dir_pac;
        this.input_cp=data.cp_pac;
        this.input_pais_origen=data.pais_nace;
        this.input_ciudad=data.ciudad_nace;
        this.input_referencia=data.cod_ref;
        this.input_estadoCivil=data.estado_civil;
        this.input_instruccion=data.instruccion;
        this.input_ocupacion=data.ocu_pac;
        this.input_tipo_sangre=data.tip_san;
        // this.input_info_crediticia=data.//////verificar el estado administrativo//////////
        this.input_etnia=data.etnia;
        this.input_patol_pac=data.pat_pac;
        this.edad=data.edad;

        
        })
     }
  }

  dismiss() {
    this.modalcontroller.dismiss({
      'dismissed': true,
    }, "blank");
  }
  dismissData(data, tipo) {
    this.modalcontroller.dismiss({
      'dismissed': true,
      'data_pac': data,
      'tipo': tipo
    }, "data");
    //    this.orden = [];
  }




  actualizarPaciente(codigo_paciente:String) 
  { 
    let fechaupd=new Date();
    this.loadingservice.present('Actualizando Perfil');
    let listadostring: string = "";

    console.log('this.input_titulo actualizarPaciente: ',this.input_titulo)

      if(this.input_titulo===undefined){
        this.input_titulo=null;
      }

     let data = {
      nom_pac:this.input_nombre,
      ape_pac:this.input_apellido,
      tit_pac:this.input_titulo,
      sex_pac:this.input_genero,
      fec_nac:this.input_fec_nac,        
      pais_id:this.input_pob,   
      id_pac:this.cedula,
      // TIPO_ID:null,
      cod_pob:this.input_pob,
      dir_pac:this.input_direccion,
      cp_pac:this.input_cp,
      mail_pac:this.input_email,
      telf_pac:this.input_telefono,
      cel_pac:this.input_celular,
      pais_nace:this.input_pais_origen,
      ciudad_nace:this.input_ciudad,
      cod_ref:this.input_referencia,
      estado_civil:this.input_estadoCivil,
      instruccion:this.input_instruccion,
      ocu_pac:this.input_ocupacion,
      tip_san:this.input_tipo_sangre,
      sts_adm:this.input_info_crediticia,
      etnia:this.input_etnia,
      pat_pac:this.input_patol_pac,
      cod_pac:this.input_cod_pac,
      cod_ori:this.varGlobal.getOrigenOrden().cod_ori,
      last_user:this.varGlobal.getVarUsuario(),
      pic_pac:null,
      profesion:null,
      san_pac:null,      
    }
 console.log('Datosssssss: en update verifica por favor',data);
 this.queryservice.actualizarPaciente(JSON.stringify(data)).then((result: any) => {
      let data = result.data
      console.log('result mutation', result);
      console.log('dataDelModificar: ',data);
      this.toastservice.presentToast({ message: data.UpdatePaciente.mensaje, position: 'top', color: 'success' })
      this.loadingservice.dismiss();
      this.dismissData(this.paciente, "check")
      // this.dismissData();
    }, error => {
      console.log(error);
      this.toastservice.presentToast({ message:'Intentelo mas tarde '+ error.mensaje, position: 'top', color: 'warning' })
      this.loadingservice.dismiss()
    })

  }


  onInputChange() {
    this.input_nombre = this.input_nombre.toUpperCase();
    this.input_apellido=this.input_apellido.toUpperCase();
    this.input_titulo=this.input_titulo.toUpperCase();
  }


  onInputChangeMinusculas() {
    this.input_email= this.input_email.toLowerCase();    
  }

  CheckPaciente() {
  this.paciente_completo.nom_pac = this.input_nombre ? this.input_nombre : null;
  this.paciente_completo.ape_pac = this.input_apellido ? this.input_apellido : null;
  this.paciente_completo.tit_pac = this.input_titulo ? this.input_titulo : null;
  this.paciente_completo.sex_pac = this.input_genero ? this.input_genero : null;
  this.paciente_completo.fec_nac = this.input_fec_nac ? this.input_fec_nac : null;
  this.paciente_completo.pais_id = this.input_pais_doc ? this.input_pais_doc : null;
  this.paciente_completo.id_pac = this.cedula ? this.cedula : null;
  this.paciente_completo.cod_pob = this.input_pob ? this.input_pob : null;
  this.paciente_completo.dir_pac = this.input_direccion ? this.input_direccion : null;
  this.paciente_completo.cp_pac = this.input_cp ? this.input_cp : null;
  this.paciente_completo.mail_pac = this.input_email ? this.input_email : null;
  this.paciente_completo.telf_pac = this.input_telefono ? this.input_telefono : null;
  this.paciente_completo.cel_pac = this.input_celular ? this.input_celular : null;
  this.paciente_completo.pais_nace = this.input_pais_origen ? this.input_pais_origen : null;
  this.paciente_completo.ciudad_nace = this.input_ciudad ? this.input_ciudad : null;
  this.paciente_completo.cod_ref = this.input_referencia ? this.input_referencia : null;
  this.paciente_completo.estado_civil = this.input_estadoCivil ? this.input_estadoCivil : null;
  this.paciente_completo.instruccion = this.input_instruccion ? this.input_instruccion : null;
  this.paciente_completo.ocu_pac = this.input_ocupacion ? this.input_ocupacion : null;
  this.paciente_completo.tip_san = this.input_tipo_sangre ? this.input_tipo_sangre : null;
  this.paciente_completo.sts_adm = this.input_info_crediticia ? this.input_info_crediticia : null;
  this.paciente_completo.etnia = this.input_etnia ? this.input_etnia : null;
  this.paciente_completo.pat_pac = this.input_patol_pac ? this.input_patol_pac : null; 
 
  this.codigo_origen=this.varGlobal.getOrigenOrden().cod_ori;
  if(this.codigo_origen === '' || this.codigo_origen === null){
    this.paciente_completo.cod_ori=null;
  }else{
    this.paciente_completo.cod_ori=this.codigo_origen;
  }
this.last_user=this.varGlobal.getVarUsuario();
  if(this.last_user=== '' || this.last_user === null){
    this.paciente_completo.last_user=null;
  }else{
    this.paciente_completo.last_user=this.last_user;
  }
if(this.cedula!==''){
this.queryservice.getPacientesbyId(this.cedula).then((r: any) => {
  
          if (r.data.getPaciente.id_pac != null) {
          this.dismissData(this.paciente, "check")
                  
        this.toastservice.presentToast2({ message: "Ya existe un  registrado con esa cédula.", position: "middle", color: "danger", duration: 2000});
                 
          if(this.paciente_completo.fec_nac===undefined){ 
        this.toastservice.presentToast({ message: "Campo de fecha vacio.", position: "middle", color: "warning", duration: 2000 });        
      }                  
        //  this.loadingservice.dismiss();
          // return
        } else {          
        if(this.paciente_completo.nom_pac === '' && this.paciente_completo.ape_pac === ''){
          this.toastservice.presentToast2({ message: "Ingresa Nombre/Apellido.", position: "middle", color: "warning", duration: 2000 });
          this.loadingservice.dismiss();  
        } else{
          if(this.paciente_completo.sex_pac===''){             
            this.toastservice.presentToast2({ message: "Elige el genero del paciente.", position: "middle", color: "warning", duration: 2000 });
            this.loadingservice.dismiss();  
          }else{
            if(this.paciente_completo.mail_pac === ''){
              this.toastservice.presentToast2({ message: "Por favor ingresa el campo correo.", position: "middle", color: "warning", duration: 2000 });
            }else{
            if(getVerificarEmail(this.paciente_completo.mail_pac)){              
              if(this.paciente_completo.fec_nac===undefined){             
                this.toastservice.presentToast2({ message: "Por favor ingrese la fecha de nacimiento.", position: "middle", color: "warning", duration: 2000 });
                this.loadingservice.dismiss();    
              } else{
                console.log('Paciente en MAYUSCULAS POR FAVOR: ',this.paciente_completo);
                 this.insertarPacientecomplete(this.paciente_completo); ////AQUI DEBES DESCOMENTAR SSOLO ES PRUEBA;
                this.toastservice.presentToast({ message: "Usuario Guardado Correctamente.", position: "middle", color: "success", duration: 2000 });
                this.loadingservice.dismiss();  
                return
                }
            }else{
              this.toastservice.presentToast2({ message: "Correo Electronico no Valido.", position: "middle", color: "danger", duration: 2000 });
              this.loadingservice.dismiss();  
            }
            
            }
      
           }      
          }                           
        }
      })
    return
}else{
      // this.toastservice.presentToast({ message: "Deseas guardar el paciente sin cedula.", position: "middle", color: "tertiary", duration: 2000 });
      //         this.loadingservice.dismiss(); 
      if (this.paciente_completo.nom_pac === '' && this.paciente_completo.ape_pac === '') {
        this.toastservice.presentToast2({ message: "Debes ingresar Nombre/Apellido.", position: "middle", color: "danger", duration: 2000 });
        this.loadingservice.dismiss();
        return;
      } else {
        if (this.paciente_completo.nom_pac === null || this.paciente_completo.ape_pac === null) {
          console.log('revisa el paciente en null: ', this.paciente_completo.nom_pac);
          this.toastservice.presentToast2({ message: "Debes ingresar Nombre/Apellido.", position: "middle", color: "danger", duration: 2000 });
          this.loadingservice.dismiss();
        } else {
          this.presentAlert();
          console.log('revisa el paciente_completo.nom_pac: ', this.paciente_completo.nom_pac);
        }
      }
    }



  }
  


  
  

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '! Deseas guardar !',
      // subHeader: 'Paciente',
      message: `Deseas guardar al paciente ${this.paciente_completo.nom_pac} sin cédula `,
      buttons: [
        {
          text: 'No',
          role: 'Cancelar',
          cssClass: 'secondary',
          handler: () => {
            console.log('No clicked');
            // Puedes agregar acciones adicionales al hacer clic en "No"
          }
        },
        {
          text: 'Sí',
          handler: () => {
            console.log('Sí clicked::: ',this.paciente_completo);
            this.insertarPacientecomplete(this.paciente_completo); ////AQUI DEBES DESCOMENTAR SSOLO ES PRUEBA;
            this.toastservice.presentToast({ message: "Usuario Guardado Correctamente.", position: "middle", color: "success", duration: 2000 });
            this.loadingservice.dismiss();              
            
            

            // Puedes agregar acciones adicionales al hacer clic en "Sí"
          }
        }
      ]
    });
  
    await alert.present();
  }

  onDateKeyUp(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.calculateAge();
    }
  }
  onDateKeyCedula(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.getValidarcedula();      
      }
  }
  EventoCalcularFecha(event: KeyboardEvent) {

    if (event.keyCode === 13) {
      this.edad_number = Number(this.edad);
      this.calcularFechaNacimiento(this.edad_number);
    }
  }


  calcularFechaNacimiento(edad: number) {   
               
      if (edad <= 0) {
        return null; 
        }
      const fechaActual = new Date();
      const anioNacimiento = fechaActual.getFullYear() - edad;
      const fechaNacimiento = new Date(anioNacimiento, fechaActual.getMonth());    
      const fecha = new Date(fechaNacimiento);
    const fecha_date_nacimiento = fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });     
      
      // this.input_fec_nac=fechaFormateada;
      
      return fecha_date_nacimiento;     
  }


  getCurrentDate(): string {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = (hoy.getMonth() + 1).toString().padStart(2, '0');
    const dia = hoy.getDate().toString().padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  calculateAge() {
    const hoy = new Date();
    let sumaanio=hoy.getFullYear()+1;
    let hoyanio=hoy.getFullYear();

    const cumple = new Date(this.input_fec_nac);

    if(hoyanio<sumaanio){
    let anio = hoy.getFullYear() - cumple.getFullYear();
    const monthDiff = hoy.getMonth() - cumple.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && hoy.getDate() < cumple.getDate())) {
        anio--;
      }

      this.edad = anio;

    }else{
    this.edad=0;
    }
  }



  insertarPacientecomplete(data) {

    this.queryservice.insertPacienteComplete(JSON.stringify(data)).then((result: any) => {
      console.log('Result: ',result);
    let data = result.data.insertPacienteComplete;
    if (data.resultado == 'ok') {
      this.toastservice.presentToast({ message: data.mensaje, color: "success", position: "top" });
      console.log('Data parse antes del parse: ',data);

      this.dismissData(JSON.parse(data.data), "insert");
    }
    this.loadingservice.dismiss()
  }, error => {
    this.toastservice.presentToast({ message: error, color: "warning", position: "top" });
    this.loadingservice.dismiss()
  })
}

 getCedula(cedula:String):boolean{
    if (cedula.length !== 10) {
      return false;
    }
    const provincia = parseInt(cedula.substring(0, 2), 10);
    if (provincia < 1 || provincia > 24) {
      return false;
    }
     const digitos = cedula.split('').map(Number);
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let mult = (i % 2 === 0) ? 2 : 1;
      let resultado = digitos[i] * mult;
      if (resultado > 9) {
        resultado -= 9;
      }
      suma += resultado;
    }
    const decenaSuperior = Math.ceil(suma / 10) * 10;
    const ultimoDigito = decenaSuperior - suma;
    return digitos[9] === ultimoDigito;
  }

  verificarPasaporteEcuatoriano(numeroPasaporte: string): boolean {
  
    if (numeroPasaporte.length !== 8) {
      return false;
    }   
    for (let i = 0; i < 3; i++) {
      const c = numeroPasaporte.charAt(i);
      if (!/[a-zA-Z]/.test(c)) {
        return false;
      }
    }      
    for (let i = 3; i < 8; i++) {
      const c = numeroPasaporte.charAt(i);
      if (!/\d/.test(c)) {
        return false;
      }
    }
    return true;
  }


validarRucEcuatoriano(ruc: string): boolean {
    ruc = ruc.replace(/\s|-/g, '');
      if (ruc.length !== 10 && ruc.length !== 13) {
      return false;
    }
      if (!/^\d+$/.test(ruc)) {
      return false;
    }
  
    const provincia = Number(ruc.substr(0, 2));
  
    if (provincia < 1 || provincia > 24) {
      return false;
    }
  
    const tercerDigito = Number(ruc.charAt(2));
  
    if (tercerDigito < 0 || (tercerDigito !== 6 && tercerDigito !== 9)) {
      return false;
    }
  
    
    const coeficientes = [3, 2, 7, 6, 5, 4, 3, 2];
    const sumatoria = coeficientes.reduce((acc, coeficiente, index) => {
      const digito = Number(ruc.charAt(index));
      return acc + (coeficiente * digito);
    }, 0);
  
    let digitoVerificador = 11 - (sumatoria % 11);
  
    if (digitoVerificador === 11) {
      digitoVerificador = 0;
    }
  
    if (digitoVerificador !== Number(ruc.charAt(9))) {
      return false;
    }
  
    return true;
  }
getValidarcedula(){
  if(this.cedula===''){
      this.esCedulaValidaennumero=-1;
  }else{
    const cedbandera=this.cedula;
    const regexNumero = /^[0-9]/;
    

    if(regexNumero.test(cedbandera)){
   
      if(this.cedula.length>10){        
    if(this.validarRucEcuatoriano(this.cedula)){
      this.esCedulaValidaennumero=4;
       }else{
      this.esCedulaValidaennumero=5;
        }
      }else{
        if(this.getCedula(this.cedula)){    
          this.esCedulaValidaennumero=0;        
        }else{  
          this.esCedulaValidaennumero=1;      
        }
      }
    }else{
      if(this.verificarPasaporteEcuatoriano(this.cedula)){
        this.esCedulaValidaennumero=2;       
      }else{
        this.esCedulaValidaennumero=3;           
          }
        }       
       }
}


}
function getVerificarEmail(correo: string): boolean {
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const result: boolean = expression.test(correo); 
  return result;
  
}


