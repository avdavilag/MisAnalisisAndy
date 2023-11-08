import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chart-visor',
  templateUrl: './chart-visor.page.html',
  styleUrls: ['./chart-visor.page.scss'],
})
export class ChartVisorPage implements OnInit {
  @Input()dataChart;
  @Input()tipo="resultado";
  view;
  mobile = false;
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    this.view=[550,350];
    if (window.screen.width < 600 || window.innerWidth < 700) { // 768px portrait        
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    window.onresize = () => {
      if (window.screen.width < 600 || window.innerWidth < 700) { // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    };
  }
  ionViewDidEnter(){
    this.view=undefined
    setTimeout(() => {
      this.setPointsLine()
      this.wrapTextSvg()
    }, 1500);  
  }
  cerrar(){
    this.modalCtrl.dismiss();
  }
  
  onResize(ev) {
    console.log(ev);

   setTimeout(async () => {
      this.setPointsLine()
      
    }, 1500);

  }

  async setPointsLine() {

    console.log("PUNTOS");
    //  var circles=document.getElementsByClassName("circle-pointer");
    //  console.log(el.parentElement.parentElement);
    var divsToRemove = document.getElementsByClassName("circle-pointer");
    for (var i = divsToRemove.length - 1; i >= 0; i--) {
      await divsToRemove[i].remove();
    }

    var setOut;
    clearTimeout(setOut)
    setOut = setTimeout(() => {
      let charts = document.getElementsByClassName("ng-chart")
      for (let index = 0; index < charts.length; index++) {
        charts[index].querySelectorAll("g.line-series path").forEach(async (el) => {
          let atr = el.getAttribute("d")
          let color = el.getAttribute("stroke")
          let positions = atr.substring(1, atr.length).split(",")
          //console.log(positions);
          if (positions.length > 2) {
            //primer punto
            el.parentElement.insertAdjacentHTML("afterend", `<circle cx="${positions[0]}" cy="${positions[1].split("L")[0]}" r="5" fill="${color}" class="circle-pointer" pointer-events="all"></circle>`);
            let j = 1;
            for (j; j < positions.length - 2; j++) {
              el.parentElement.insertAdjacentHTML("afterend", `<circle cx="${positions[j].split("L")[1]}" cy="${positions[j + 1].split("L")[0]}" r="5" fill="${color}" class="circle-pointer" pointer-events="all"></circle>`);
            }
            //la ultima posicion cambio el formato
            //FONDO
            el.parentElement.insertAdjacentHTML("afterend", `<circle cx="${positions[j].split("L")[1]}" cy="${positions[j + 1
            ].split("L")[0]}" r="6" fill="#ffff00" class="circle-pointer last-point" pointer-events="all"></circle>`);
            //MARCO
            el.parentElement.insertAdjacentHTML("afterend", `<circle cx="${positions[j].split("L")[1]}" cy="${positions[j + 1
            ].split("L")[0]}" r="8" fill="#00b2ae" class="circle-pointer" pointer-events="all"></circle>`);

          } else {

            el.parentElement.insertAdjacentHTML("afterend", `<circle cx="${positions[0]}" cy="${positions[1].split("Z")[0]}" r="5" fill="${color}" class="circle-pointer" pointer-events="all"></circle>`);
          }

          //console.log("Atributo", el.getAttribute("d"));
          //    el.parentElement.insertAdjacentHTML("afterend", `<circle cx="${positions[1].split("L")[1]}" cy="${positions[2]}" r="5" fill="${color}" class="circle-data-0circle" pointer-events="all"></circle>`);


          //   el.setAttribute("stroke-width", "10");
          //   el.setAttribute("stroke-linecap", "round");
        });

      }

    }, 0);
  }

  async wrapTextSvg() {
    console.log("WRAP");
    //  var circles=document.getElementsByClassName("circle-pointer");
    //  console.log(el.parentElement.parentElement);
    var gElement = document.getElementsByClassName("tick");
    for (var i = gElement.length - 1; i >= 0; i--) {
      //agarro el texto y separo por espacio
      const label = gElement[i].getElementsByTagName("title")[0].innerHTML.split(" ")
      if (label.length > 1) {//SEPARO
        const tspanFecha = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
        const tspanHora = document.createElementNS('http://www.w3.org/2000/svg', 'tspan')
        //[0] fecha [1] hora
        tspanFecha.textContent = label[0]
        tspanHora.textContent = label[1]
        //añado un espacio
        tspanHora.setAttribute('dy', '1em');
        tspanHora.setAttribute('x', '0');
        gElement[i].getElementsByTagName("text")[0].innerHTML = ""
        gElement[i].getElementsByTagName("text")[0].append(tspanFecha)
        gElement[i].getElementsByTagName("text")[0].append(tspanHora)
        gElement[i].getElementsByTagName("text")[0].classList.add("tick-text")

      }


      //  await divsToRemove[i].remove();
    }
  }

  selectParamLeyend(param) {
    console.log(param);
    param.active = param.active ? false : true;
    this.dataChart.parametros=this.dataChart.parametros_origen.filter(m=>m.active)    
      setTimeout(() => {
      this.setPointsLine()
      this.wrapTextSvg()
    }, 1500);

  }
  
}
