import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { ToastService } from 'src/app/servicios/toast.service';

@Component({
  selector: 'app-get-analisis-individual-orden',
  templateUrl: './get-analisis-individual-orden.page.html',
  styleUrls: ['./get-analisis-individual-orden.page.scss'],
})
export class GetAnalisisIndividualOrdenPage implements OnInit {

item:any=[]
modalId: string;
  constructor(
    private modalController :ModalController,
    private queryservice:QueryService,
    private toastservice:ToastService,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    console.log('Bienvenito a get analisis individual: ',this.item);
    this.modalId = this.navParams.get('modalId');
    console.log('Modal Id: ',this.modalId);
  }

    dismiss(){
    this.modalController.dismiss({
      },"blank");

    
  }

}
