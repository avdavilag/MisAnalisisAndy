import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';

@Component({
  selector: 'app-perfilesava',
  templateUrl: './perfilesava.page.html',
  styleUrls: ['./perfilesava.page.scss'],
})
export class PerfilesavaPage implements OnInit {

  ListPerfiles: any = [];
  ListPerfilesactive: any = [];
  ListPerfilesactivefiltro: any = []
  activeList
  grupos: any = [];
  analisisfinal: any = [];
  textofiltro: any = "";


  constructor(
    private queryservice: QueryService,
    private modalcontroller: ModalController,
    private loadingservice:LoadingService,
    private toastservice:ToastService
  ) { }
   
  ngOnInit() {
    this.loadingservice.present("Cargando datos");
    this.queryservice.getPerfilesAva().then((result: any) => {
      
      console.log('result', result);
      let data = JSON.parse(JSON.stringify(result.data.ListPerfilesAvalab));
      this.ListPerfiles = data;
      data.forEach(element => {
        element.checked = false;
        element.show = false;
        element.style = "";
        element.des_perfiltro = element.des_per;

        element.Analisis.forEach(element2 => {
          element2.checked = false;
          element2.des_anafiltro = element2.des_ana;

        });
        element.Analisisfiltro = element.Analisis;
        this.grupos.push(element.grupo)
      });


      let grupotemp = this.grupos.filter((item, index) => {
        return this.grupos.indexOf(item) === index;
      })
      this.grupos = grupotemp;
      console.log('er', grupotemp);
      console.log('lista', this.ListPerfiles);

      this.activeListePerfiles(0);

      this.loadingservice.dismiss();
    },error=>{
      this.toastservice.presentToast({message:"ocurrio un error "+error,color:"warning",position:"top"})
      this.loadingservice.dismiss();
    })
  }

  activeListePerfiles(index) {

    this.ListPerfiles.forEach(element => {
      if (element.grupo == this.grupos[index]) {
        this.ListPerfilesactive.push(element);
        //  this.ListPerfilesactivefiltro.push(element);
      }
    });
  }


  cambio(ev) {
    console.log('ev', ev);
    this.ListPerfilesactive = [];
    this.ListPerfiles.forEach(element => {
      if (element.grupo == ev.detail.value) {
        this.ListPerfilesactive.push(element);
      }
    });

    this.filtro('');

  }
  cambiocheckboxG(ev, item) {
    console.log('enteee', ev, item);

    let checked = ev.detail.checked
    //let checked = ev.target.checked
    this.ListPerfiles.forEach(element => {
      if (element.cod_per == item.cod_per) {

        element.Analisis.forEach((elementq, index) => {
          elementq.checked = checked
        });
        return
      }

    })
  }

  showList(item) {
    console.log('entre');
    console.log(item);

    this.ListPerfiles.forEach(element => {
      if (element.cod_per == item.cod_per) {
        element.show = (element.show ? false : true)
        return
      }
    });

  }

  AgregarAnalisis() {
    this.analisisfinal = [];
    this.ListPerfiles.forEach(element => {
      element.Analisis.forEach(element2 => {
        if (element2.checked) {
          this.analisisfinal.push(element2)
        }
      });
    });
    this.AceptarPerfiles();
  }


  dismiss() {
    this.modalcontroller.dismiss({
      'dismissed': true,
      // 'flag_origen': this.flag_origen
    });
    //    this.orden = [];
  }

  AceptarPerfiles() {
    if (this.analisisfinal.length == 0) {
      this.dismiss();
      return
    }
    let analisis_final_t=[]
    for (let index = 0; index < this.analisisfinal.length; index++) {
      const element = this.analisisfinal[index];
      if(analisis_final_t.length==0){
        analisis_final_t.push(element)
      }
      else{
        let temp= analisis_final_t.filter(element_temp=>{
         return element_temp.cod_ana==element.cod_ana
        })
        if(temp.length==0){
          analisis_final_t.push(element)
       }
      }

    }

  console.log('analisis_final_t',analisis_final_t);
  
    this.modalcontroller.dismiss({
      'dismissed': true,
      'analisis': analisis_final_t
    });
  }

  show_sinresultados:boolean=false;
  filtro(event) {
    let contador=0;
    let comparador=this.ListPerfilesactive.length;
  this.show_sinresultados=false;
    if (event != '') { this.textofiltro = event.detail.value; }

   
    for (let index = 0; index < this.ListPerfilesactive.length; index++) {

      this.ListPerfilesactive[index].style = "";
   
      if (!this.ListPerfilesactive[index].des_perfiltro.toLowerCase().includes(this.textofiltro.toLowerCase())) {

        this.ListPerfilesactive[index].Analisisfiltro = this.ListPerfilesactive[index].Analisis.filter((item) => {
      //    this.show_sinresultados=false
          return item.des_anafiltro.includes(this.textofiltro.toLowerCase()) || item.des_anafiltro.includes(this.textofiltro.toUpperCase());
        })
        
        ;
        if (this.ListPerfilesactive[index].Analisisfiltro.length == 0) {
          contador++;
          this.ListPerfilesactive[index].style = "block_col"
        }

      }
      else {
        console.log('this.ListPerfilesactive[index]', this.ListPerfilesactive[index]);
       
       this.ListPerfilesactive[index].Analisisfiltro = this.ListPerfilesactive[index].Analisis

      }
    }


  if(contador==comparador){
    this.show_sinresultados=true;
  }

  }

  transforword(palabra, filtrotext) {
    console.log('palabra', palabra);
    console.log('filtrotext', filtrotext);
    filtrotext = filtrotext.toUpperCase();
    var cadena = palabra.toUpperCase();
    let cadenan = "";
    var cadenareplace = "<span style='background:yellow'>" + filtrotext + "</span>";
    // encuentra la primer posición de "filtro"
    var posicion = cadena.indexOf(filtrotext);
    console.log(posicion, 'posicion');
    console.log('cadenareplace', cadenareplace, cadenareplace.length);


    // y mientras tengas una posición mayor o igual que 0,
    // (recuerda que -1 significa que no lo encontró)

    while (posicion >= 0) {
      cadenan = cadenan + cadena.slice(0, posicion) + cadenareplace + cadena.slice(posicion + filtrotext.length);
      // remplaza "ato" por "atito"
      cadena = cadena.slice(0, posicion) + cadena.slice(posicion + cadena.length);
      // busca la siguiente ocurrencia de la palabra
      posicion = cadena.indexOf(filtrotext);
      console.log(posicion);

    }
    return cadenan
  }
}
