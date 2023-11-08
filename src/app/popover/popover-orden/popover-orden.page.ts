import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-orden',
  templateUrl: './popover-orden.page.html',
  styleUrls: ['./popover-orden.page.scss'],
})
export class PopoverOrdenPage implements OnInit {
  @Input()  criterio="D"
  @Input()  tipo=""
  constructor(public popoverController: PopoverController) { }

  ngOnInit() {
  }
  selectOption(val){
    console.log(this.criterio);
    
    this.popoverController.dismiss({valor:val,criterio:this.criterio})
    }
    ordena(){
      setTimeout(() => {
    this.popoverController.dismiss({valor:'ordena',criterio:this.criterio})
      }, 100);
    }
}
