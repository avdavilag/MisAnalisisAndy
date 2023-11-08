import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { AdjuntosPage } from 'src/app/modals/orden/adjuntos/adjuntos.page';
import { EvcalidadPage } from 'src/app/modals/orden/evcalidad/evcalidad.page';
import { FacturacionPage } from 'src/app/modals/orden/facturacion/facturacion.page';
import { InformacionPage } from 'src/app/modals/orden/informacion/informacion.page';
import { NotasPage } from 'src/app/modals/orden/notas/notas.page';

@Component({
  selector: 'app-menuorden',
  templateUrl: './menuorden.page.html',
  styleUrls: ['./menuorden.page.scss'],
})
export class MenuordenPage implements OnInit {

  constructor(
    private modalController: ModalController,
    private popovercontroller:PopoverController
  ) { }

  ngOnInit() {
  }

  async presentModal(tipo) {
    let page;
    switch (tipo) {
      case "adjuntos":
        page = AdjuntosPage;
        break;
      case "informacion":
        page = InformacionPage
        break;
      case "evcalidad":
        page = EvcalidadPage
        break;
      case "notas":
        page = NotasPage
        break;
      case "facturacion":
        page = FacturacionPage
        break;

    }

    const modal = await this.modalController.create({
      component: page,
      componentProps: { value: 123 }
    });

    await modal.present();
    this.popovercontroller.dismiss()

  }

}
