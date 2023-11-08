import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { log } from 'console';
import { QueryService } from 'src/app/servicios/gql/query.service';

@Component({
  selector: 'app-list-tipo',
  templateUrl: './list-tipo.page.html',
  styleUrls: ['./list-tipo.page.scss'],
})
export class ListTipoPage implements OnInit {

  constructor(
    private queryservice: QueryService,
    private popoveroncontroller: PopoverController
  ) { }
  tipo: any = ''
  data: any = ''
  filtro_select: any;
  list: any;
  input_search = "";
  list_plan_temp: any;



  ngOnInit() {
    console.log('tipo', this.tipo);
    console.log("pospago".includes("stand"));
    

    if (this.tipo == 'ref') {
      this.loadRefencias()
    }

    if (this.tipo == 'med') {
      this.loadMedicos()
    }

    if (this.tipo == 'plan') {
      this.loadPlan()
    }

    if (this.tipo == 'uni') {
      this.loadUnidad()
    }

    
    if (this.tipo == 'sts') {
      this.loadEstatus()
    }


  }

  loadUnidad(){
    this.queryservice.getListUnidad().then((r:any)=>{
      console.log(r);
      this.list = r.data.ListUnidad
    })
  }

  loadRefencias() {
    this.queryservice.getListReferencia().then((r: any) => {
      console.log(r);
      this.list = r.data.ListReferencia
    })
  }

  loadMedicos() {
    this.queryservice.getListMedicos().then((r: any) => {
      console.log(r);
      this.list = r.data.ListMedicos
    })
  }

  loadPlan() {
    this.queryservice.getListSeguro().then((r: any) => {
      console.log('planes', r);
      this.list = r.data.ListSeguro;
      this.list_plan_temp = r.data.ListSeguro;
      // this.planSelected = this.listSeguro[0].Plan[0];

    })
  }

  loadEstatus(){
    this.queryservice.getListEstatusDynamic({imprime:"1"}).then((r:any)=>{
      console.log(r);
      let tempList=[]
      tempList.push({
        checked:true,
        cod:null,
        des_sts:'Todos',
        det_sts:'Todos los estados para imprimir'
      })
      let data=r.data.ListEstatusDynamic;
      data.forEach(element => {
        element.checked=true;
        tempList.push(element)
      });
      this.list=tempList
    })
  }

  searchPlan() {
    if (this.input_search != '') {
      console.log('this.input_search', this.input_search);
      let temp_list = []
      temp_list.push({
        cod_seg:999,
        des_seg: 'Filtro',
        Plan:[]
      })
      for (let index = 0; index < this.list.length; index++) {
        const element = this.list[index];
        console.log("element", element);
       
        console.log(temp_list);
        
          for (let index2 = 0; index2 < element.Plan.length; index2++) {
            const element2 = element.Plan[index2];
            let des_plan=element2.des_plan.toLowerCase()
            let id_plan=element2.id_plan+""
            console.log(des_plan);
            console.log(id_plan);
            if (des_plan.includes(this.input_search.toLowerCase()) || id_plan.includes(this.input_search)) {
              console.log("entree",temp_list);

              temp_list[0].Plan.push(element2)
            }

          
        }
      }
      console.log('this.temp_list', temp_list);
      this.list_plan_temp=temp_list
      console.log('this.list_plan_temp', this.list_plan_temp);

    }
    else { this.list_plan_temp = this.list }



  }



  searchData() {
    if (this.tipo == 'ref') {
      if (this.input_search == '') {
        this.loadRefencias()
        return
      }

      if (this.input_search != '' && this.input_search.length >0 ) {

        this.queryservice.searchReferencia({ buscador: this.input_search }).then((r: any) => {
          console.log(r);
          this.list = r.data.searchReferencia
          return

        })

      }
    }

    if (this.tipo == 'med') {
      if (this.input_search == '') {
        this.loadMedicos()
        return
      }
      if (this.input_search != '' && this.input_search.length > 0) {
        this.queryservice.SearchMedico(this.input_search).then((r: any) => {
          console.log(r);
          this.list = r.data.searchMedico2
          return
        })
      }
    }

    
    if (this.tipo == 'uni') {
      if (this.input_search == '') {
        this.loadUnidad()
        return
      }
      if (this.input_search != '' && this.input_search.length > 0) {
        this.queryservice.searchUnidad(this.input_search).then((r: any) => {
          console.log(r);
          this.list = r.data.searchUnidad
          return
        })
      }
    }
  }

  selectItem(data) {
    console.log(data);
    let data_final: any;
    if(this.tipo=='sts'){
      console.log("list",this.list);
      if(this.list[0].checked){
        data_final = {
          cod: null,
          des: 'todos'
        }
      }
      else{
          let cod="";
          for (let index = 1; index < this.list.length; index++) {
            const element = this.list[index];
          
            cod+= (index<( this.list.length-1) && this.list[index].checked)? this.list[index].cod_sts+",":
            (index==( this.list.length-1) && this.list[index].checked)?this.list[index].cod_sts:''
            
          }
          console.log('cod',cod);
          data_final={
            cod: cod,
          des: cod
          }
      }
    }

    
    if (data == null && this.tipo!='sts') {
      data_final = {
        cod: null,
        des: 'todos'
      }


    } else {

      if (this.tipo == 'ref') {
        data_final = {
          cod: data.cod_ref,
          des: data.des_ref
        }
      }

      if (this.tipo == 'med') {
        data_final = {
          cod: data.cod_med,
          des: data.nom_med
        }
      }

      if (this.tipo == 'plan') {
        data_final = {
          cod: data.id_plan,
          des: data.des_plan
        }
      }

      if (this.tipo == 'uni') {
        data_final = {
          cod: data.cod_uni,
          des: data.des_uni
        }
      }

     
    }
    this.popoveroncontroller.dismiss({

      data_select: data_final,
      tipo: this.tipo
    })
  }

  checkedEstatus(item){
   // console.log(ev);
    if(this.tipo!='sts'){
      return
    }
    console.log('item',item);
   
    if(item.cod_sts=='todos'){
      let flag_checked=item.checked;
      for (let index = 0; index < this.list.length; index++) {
        const element = this.list[index];
        if(flag_checked){
          element.checked=false;
          
        }else{element.checked=true;}
      }
   
    }
    else{

      if(item.checked){
        if(this.list[0].checked){this.list[0].checked=false}
        item.checked=false;
        
      }else{item.checked=true;}
    }
   }

}
