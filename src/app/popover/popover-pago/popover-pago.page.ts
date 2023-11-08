import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CajaPage } from 'src/app/modals/orden/caja/caja.page';

@Component({
  selector: 'app-popover-pago',
  templateUrl: './popover-pago.page.html',
  styleUrls: ['./popover-pago.page.scss'],
})
export class PopoverPagoPage implements OnInit {

dcto_ord:any=""
dcto_val:any=""
val_ord :any=""
pre_ord :any=""
  constructor(
    private modalController:ModalController
  ) { }

  ngOnInit() {
  }

async presentModalPago() {
  const modal = await this.modalController.create({
  component: CajaPage,
  componentProps: { value: 123 }
  });

  await modal.present();

} 

}
