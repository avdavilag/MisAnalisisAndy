import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-muestras',
  templateUrl: './muestras.page.html',
  styleUrls: ['./muestras.page.scss'],
})
export class MuestrasPage implements OnInit {

  listMuestras:any
  constructor(
    private modalController:ModalController
  ) { }

  ngOnInit() {
  }
  ngAfterViewInir(){
    console.log('this.listMuestras',this.listMuestras);
    
  }

  dismiss(){
    this.modalController.dismiss()
  }

}
