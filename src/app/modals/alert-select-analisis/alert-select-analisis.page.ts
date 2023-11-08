import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert-select-analisis',
  templateUrl: './alert-select-analisis.page.html',
  styleUrls: ['./alert-select-analisis.page.scss'],
})
export class AlertSelectAnalisisPage implements OnInit {
  @Input() listaAnalisis = []
  listaAnalisisOrigen = []
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    //guardemos una copia del original 
    this.listaAnalisisOrigen = JSON.parse(JSON.stringify(this.listaAnalisis))

  }
  todos() {
    this.listaAnalisis.forEach(e => {
      e.isChecked = true
    })
    this.modalCtrl.dismiss()
  }
  cerrar() {
    //regreso a lo que estaba
    console.log("ORIGEN",this.listaAnalisis);
    this.modalCtrl.dismiss({cancel:true})


  }

  async buscar() {
    //verifico las checkeadas
    for (let i = 0; i < this.listaAnalisis.length; i++) {
      this.listaAnalisis[i].isChecked= await this.listaAnalisisOrigen[i].isChecked?true:false
      
    }

    setTimeout(() => {
      this.modalCtrl.dismiss()
    }, 100);
  }
}
