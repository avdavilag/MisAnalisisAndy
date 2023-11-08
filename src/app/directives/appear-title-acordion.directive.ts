import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appAppearTitleAcordion]'
})
export class AppearTitleAcordionDirective implements OnInit {

  @Input('appAppearTitleAcordion') toolbar;
  elementToolbar: HTMLElement;

  constructor(private domCtrl: DomController) { }
  ngOnInit() {
    console.log("IONCONTENT", this.toolbar.el);
    this.elementToolbar = this.toolbar.el
  }

  @HostListener('ionScroll', ['$event']) onContentScroll($event) {
    //console.log($event);
    let scrollTop = $event.detail.scrollTop;
    let container = $event.srcElement;
    
    let listElementDom= this.elementToolbar.getElementsByClassName("acordion-ana")
    //console.log(changeChartElement);
    
    //console.log(scrollTop);
    
    

    //console.log( this.elementToolbar.getElementsByClassName("header-acordion-ana"))
    //console.log(scrollTop)
    //if (container && container.clientHeight < container.scrollHeight) {
      if (scrollTop > 40) {
        this.domCtrl.write(() => {
          if(listElementDom.length>0){
  
     
            //this.elementToolbar.getElementsByClassName("acordion-ana")[0].classList.add("acordion-not-top")
            listElementDom[0].classList.add("acordion-not-top")
            
  
          }
          //this.elementToolbar.style.setProperty('--background', `#f3f5f8${hexDist}`)
          //this.elementToolbar.classList.add("toolbar-not-top")
        })

        
      } else {
        this.domCtrl.write(() => {
          //this.elementToolbar.style.setProperty('--background', `#f3f5f8${hexDist}`)
          if(listElementDom.length>0){
            //this.elementToolbar.getElementsByClassName("acordion-ana")[0].classList.remove("acordion-not-top")
            listElementDom[0].classList.remove("acordion-not-top")
  
          }
          //this.elementToolbar.classList.remove("toolbar-not-top")
        })
//      }
  
    } 
    
    //console.log(hexDist);

  }
  }
