import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { HelperService } from 'src/app/servicios/helpers/helper.service';
import { ToastService } from 'src/app/servicios/toast.service';

@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.page.html',
  styleUrls: ['./analisis.page.scss'],
})
export class AnalisisPage implements OnInit {

  listaAnalisis:any;
  listAnalisis_agregados:any=[];
  des_ana_input:any='';

  listAnalisisSelect:any;

  hidden_resultados:boolean= true;
  hidden_agregados:boolean=true;

  listaTemporal;

  constructor(
    private modalcontroller:ModalController,
    private queryservice:QueryService,
    private helperservice:HelperService,
    private toastservice:ToastService
  ) { }

  ngOnInit() {
    console.log('temp',this.listaTemporal);
    
    /*
    this.listaAnalisis=[
      {nombre:"analisis 1", codigo:"1111111"},
      {nombre:"analisis 2", codigo:"2222222"},
      {nombre:"analisis 3", codigo:"3333333"},
      {nombre:"analisis 4", codigo:"4444444"},
      {nombre:"analisis 5", codigo:"5555555"},
      {nombre:"analisis 6", codigo:"6666666"},
    ]
    */
  }

  searchAnalisis(){
    if(this.des_ana_input===''){
      this.toastservice.presentToast({message:"Ingrese texto",position:"top",color:"warning"});
      return
    }



    this.queryservice.SearchAnalisxMstrs2(this.des_ana_input).then((result:any)=>{
      console.log(result);
      //this.AnalisisList.push(result.data.AnalisisMstrsbyCod[0]);
      if(result.data.searchAnalisisMstrs2.length>0){
      this.hidden_resultados=false;
        let data=JSON.parse(JSON.stringify(result.data.searchAnalisisMstrs2));
        console.table(this.listaAnalisis);
        console.table(this.listAnalisis_agregados);

      if(this.listAnalisis_agregados.length>0){
        this.listAnalisis_agregados.forEach(element => {
          for(let i=0;i<data.length;i++){
            if(element.cod_ana==data[i].cod_ana){
              data.splice(i,1);
              return
            }
          }
        });
      }

      if(this.listaTemporal && this.listaTemporal.length>0){
        this.listaTemporal.forEach(element => {
          for(let i=0;i<data.length;i++){
            if(element.cod_ana==data[i].cod_ana){
              data.splice(i,1);
              return
            }
          }
        });
      }

      this.listaAnalisis=data;
      if(this.listaAnalisis.length>=10){
    //    this.listaAnalisis.push({mensaje:"Si , ser mas específico en la búsqueda",flag:true})
      }
      //console.log('analisis',this.AnalisisList);
      }
      else{
        this.toastservice.presentToast({message:"No se encontro resultados",color:"warning",position:"top"})
      }
     /* 
      setTimeout(() => {
        this.updatePreciosbyPlan('uno',result.data.AnalisisMstrsbyCod[0]);
        this.AnalisisList.push(this.analisis);
      }, 500);
      */

      
      
    },error=>{
      console.log(error);
      
    })
  }

  addAnalisis(data, index){
    
    this.listAnalisis_agregados.push(data);
    this.hidden_agregados=false;
    this.listaAnalisis.splice(index,1);

    if(this.listaAnalisis.length==0){
      this.hidden_resultados=true;
    }
  }

  removeAnalisis(data,index){
    this.listAnalisis_agregados.splice(index,1);
    this.listaAnalisis.push(data);
    
    if(this.listAnalisis_agregados.length==0){
      this.hidden_agregados=true;
    }
    
    if(this.listaAnalisis.length>0){
      this.hidden_resultados=false;
    }

    
  }
  dismiss() {
    this.modalcontroller.dismiss({
      'dismissed': true,
  
    });
    //this.listAnalisisOrden=[];
  }
  
  dismissData() {

    this.modalcontroller.dismiss({
      'dismissed': true,
      'analisisAgregados':this.listAnalisis_agregados
  
    });
    //this.listAnalisisOrden=[]
  }
}
