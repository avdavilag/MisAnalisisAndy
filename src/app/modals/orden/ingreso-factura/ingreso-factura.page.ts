import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { HelperService } from 'src/app/servicios/helpers/helper.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';
import { FuncionesComunesIntra } from 'src/app/utils/funciones-comunes-intra';
import { EleccionAnalisisFacturaPage } from '../eleccion-analisis-factura/eleccion-analisis-factura.page';
import { forceUpdate } from 'ionicons/dist/types/stencil-public-runtime';

@Component({
  selector: 'app-ingreso-factura',
  templateUrl: './ingreso-factura.page.html',
  styleUrls: ['./ingreso-factura.page.scss'],
})
export class IngresoFacturaPage implements OnInit {

  dcto_ord:any;
  dcto_val:any;
  val_ord:any;
  codigo_orden_completa:any;
  variableUsuario:any;
  json_data:any;
  tabla_Pagos:any;
  selectedOption:any;
  cod_ori:any;
  array_ptoxori:any=[];
  array_ptoxori_enviar_factura:any=[];

  constructor(
    private varGlobal: VariablesGlobalesService,
    private queryservice:QueryService,
    private alertController:AlertController,
    private modalController:ModalController,
    private toastservice:ToastService,
    private helper:HelperService,
    private popoverController:PopoverController,
    private loadingservice: LoadingService,
    private funcionesComunes: FuncionesComunesIntra,
  ) { }

  ngOnInit() {
console.log('dcto_ord:', this.dcto_ord);
console.log('dcto_val:', this.dcto_val);
console.log('val_ord:', this.val_ord);
console.log('codigo_orden_completa:', this.codigo_orden_completa);
console.log('variableUsuario:', this.variableUsuario);
console.log('json_data:', this.json_data);
console.log('tabla_Pagos:', this.tabla_Pagos);
this.cod_ori=1;
  }

async Buscar_PtoxoribyOri_Cod_Origen(){
  try {
    const response: any = await this.queryservice.PtoxoribyOri(this.cod_ori);
    console.log('response: ',response.data.PtoxoribyOri);
    this.array_ptoxori=[];
    response.data.PtoxoribyOri.forEach(element => {
      this.array_ptoxori.push(element);
    });
    console.log('this.array_ptoxori Mira la longitudddddddddddddddd: ',this.array_ptoxori.length);

    /////
if(this.array_ptoxori.length<2 && this.array_ptoxori.length>0){
  this.array_ptoxori_enviar_factura=this.array_ptoxori[0];

  console.log('this.array_ptoxori_enviar_factura REVISA TODO POR FAVOR DENTRO DEL IF: ',this.array_ptoxori_enviar_factura);
 this.presentModalEleccionAnalisisFactura();
}else{
  console.log('this.array_ptoxori.length ELSE::: ',this.array_ptoxori.length);
  this.array_ptoxori_enviar_factura=[];
    const alert=await this.alertController.create({
      header: 'Escoge un punto de Emision',
      inputs: this.array_ptoxori.map((option,index)=>({
        type:'radio',
        label:option.sucursal.des_suc,
        value:index,
        array:option
      })),
      backdropDismiss:false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Selección cancelada');
          },
        },
        {
          text: 'Aceptar',
          handler: (selectedIndex) => {
            if (selectedIndex !== undefined) {
              this.selectedOption = this.array_ptoxori[selectedIndex];
              // console.log('Opción seleccionada:',this.selectedOption);                
              this.array_ptoxori_enviar_factura=this.selectedOption;
              this.presentModalEleccionAnalisisFactura();
            } else {
              console.log('Ninguna opción seleccionada');
            }
          },
        },
      ],    
    });
    await alert.present();
  }
  } catch (error) {
    console.error('Error al buscar PtoxoribyOri:', error);
  }

}

  async presentModalEleccionAnalisisFactura() {
    // console.log('Entra ala eleccion de Analisis Factura: '+this.selectedOption.cod_suc);
    const modal = await this.modalController.create({
      component: EleccionAnalisisFacturaPage,
      componentProps: {
        'dcto_ord': this.dcto_ord,
        'dcto_val': this.dcto_val,
        'val_ord': this.val_ord,
        // 'pre_ord': this.pre_ord,
        'codigo_orden_completa': this.codigo_orden_completa,
        'variableUsuario': this.variableUsuario,
        json_data: this.json_data,
        'tabla_Pagos': this.tabla_Pagos,
        'array_ptoxori_enviar_factura':this.array_ptoxori_enviar_factura
        // 'cod_suc':this.selectedOption.cod_suc
      },
    });
    modal.onDidDismiss()
      .then((result: any) => {
      });
    await modal.present();
  }
  
}
