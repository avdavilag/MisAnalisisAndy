import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appAppearHeader]'
})
export class AppearHeaderDirective implements OnInit {

  @Input('appAppearHeader') toolbar;
  elementToolbar: HTMLElement;
  divFinScroll;

  constructor(private domCtrl: DomController, private renderer: Renderer2) { }
  ngOnInit() {
    //console.log("TEST", this.toolbar);
    this.elementToolbar = this.toolbar.el

    this.divFinScroll = this.elementToolbar.querySelector(".dif-scroll")

  }
  @HostListener('scroll', ['$event']) onContentScroll($event) {
    //console.log($event);
    let scrollTop = $event.srcElement.scrollTop;
    let scrollLeft = $event.srcElement.scrollLeft;
    //let widthContent = $event.srcElement.clientWidth;
    let listElementDom = this.elementToolbar.getElementsByClassName("title-grid")
    let startResultsDates = this.elementToolbar.getElementsByClassName("row-dates")[0].getBoundingClientRect().left
    //console.log(scrollTop);
    //console.log(scrollLeft);
    //console.log(startResultsDates);



    if (scrollTop > 10) {
      this.domCtrl.write(() => {
        if (listElementDom.length > 0) {
          // this.elementToolbar.getElementsByClassName("title-grid")[0].classList.add("toolbar-not-top")
          listElementDom[0].classList.add("toolbar-not-top")
        }
        //this.elementToolbar.style.setProperty('--background', `#f3f5f8${hexDist}`)
        //this.elementToolbar.classList.add("toolbar-not-top")
      })
    } else {
      this.domCtrl.write(() => {
        //this.elementToolbar.style.setProperty('--background', `#f3f5f8${hexDist}`)
        if (listElementDom.length > 0) {
          //  this.elementToolbar.getElementsByClassName("title-grid")[0].classList.remove("toolbar-not-top")
          listElementDom[0].classList.remove("toolbar-not-top")
        }

        //this.elementToolbar.classList.remove("toolbar-not-top")
      })
    }

    if (scrollLeft > 10) {
      let columns = this.elementToolbar.getElementsByClassName("col-param")
      this.domCtrl.write(() => {
        for (let index = 0; index < columns.length; index++) {
          if (startResultsDates < 0) {
            if (columns[index].classList.contains("col-param-compex")) {
              columns[index].classList.add("column-results")
            } else {
              columns[index].classList.remove("column-not-rigth")
            }

          } else {
            columns[index].classList.add("column-not-rigth")
            columns[index].classList.remove("column-results")
          }
        }

        //this.elementToolbar.style.setProperty('--background', `#f3f5f8${hexDist}`)
        //this.elementToolbar.classList.add("toolbar-not-top")
      })

    } else {
      let columns = this.elementToolbar.getElementsByClassName("col-param")
      this.domCtrl.write(() => {
        //this.elementToolbar.style.setProperty('--background', `#f3f5f8${hexDist}`

        for (let index = 0; index < columns.length; index++) {

          columns[index].classList.remove("column-not-rigth")
          columns[index].classList.remove("column-results")

        }
        //this.elementToolbar.classList.remove("toolbar-not-top")

      })
    }

    //quitamos el scroll final

    if (this.divFinScroll && this.elementToolbar.offsetHeight + this.elementToolbar.scrollTop >= this.elementToolbar.scrollHeight) {
      this.divFinScroll.classList.remove("transparent-content")
    } else {
      this.divFinScroll.classList.add("transparent-content")
    }
    //console.log(hexDist);

  }
}
