import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-filtro',
  templateUrl: './popover-filtro.page.html',
  styleUrls: ['./popover-filtro.page.scss'],
})
export class PopoverFiltroPage implements OnInit {

  constructor(public popoverController: PopoverController,
    public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  selectOption(val) {
    this.popoverController.dismiss(val)
  }

}
