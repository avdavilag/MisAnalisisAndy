import { Component, ElementRef, HostListener, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonSelect, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { Utilidades } from 'src/app/utils/utilidades';
import { formatDate } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { ChartVisorPage } from 'src/app/modals/chart-visor/chart-visor.page';
import { AlertSelectAnalisisPage } from 'src/app/modals/alert-select-analisis/alert-select-analisis.page';
import { AppConfigService } from 'src/app/utils/app-config-service';
@Component({
  selector: 'app-charts-paciente',
  templateUrl: './charts-paciente.page.html',
  styleUrls: ['./charts-paciente.page.scss'],
})
export class ChartsPacientePage implements OnInit {
  //multi: any[];
  //view: any[] = [700, 300];
  view = undefined
  viewSmall;
  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Fecha';
  timeline: boolean = false;
  listaAnalisis;
  listaAnalisisOrigen;
  listaResultados;
  gridResultados;
  ticksFechas = [];
  analisisActivos = []

  setOut;
  @Input() codigoPaciente;
  fHasta;
  fDesde;
  codigoAnalisis;
  @ViewChild("chartLine", { read: ElementRef, static: false })
  chartLine: ElementRef;
  @ViewChild('select1') select: IonSelect;
  mobile = false;
  tiempoCargaPuntos = 500;//por cada chart

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  multi = []
  gridLabelResultados = [];
  multi_origen;
  nombre_pac = "";
  scrollRowAnalisis = false;

  tipoGrafica = "resultado"
  accordionPrincipal = ['table', 'chart']
  scrollIntoButtonChart: boolean = false;
  tipoPanelMobile = "table"//table o chart
  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    public toastController: ToastController,
    private configApp: AppConfigService,
    public modalCtrl: ModalController,
    private queryservice: QueryService, private zone: NgZone, private route: ActivatedRoute,
    public utilidades: Utilidades) {
      this.viewSmall= [100, 30];

  }
  ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {
      console.log("params-router", params); // { order: "popular" }
      if (params && params.cod_pac) {
        this.codigoPaciente = params.cod_pac
        this.nombre_pac = params.nombre
        let fecha_hoy = new Date()
        this.fHasta = fecha_hoy.toISOString().split("T")[0]
        this.fDesde = new Date(this.configApp.fechaInicioChart).toISOString().split("T")[0]
        //this.codigoPaciente = 294601;
        this.getData()
      } else {
        this.utilidades.alertErrorService("NO PAC", "ROUTER")
      }


    }
    );
    if (this.mobile) {
      setTimeout(() => {
        //this.select.open()
        this.openModalAlertSelect()
      }, 300);
    }
  }

  ngOnInit() {
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

  onSelect(data): void {
    //console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    //this.highlights = [];
    //this.highlights.push(data);
    data = "1" + data

  }
  onLabelClick(evnt, chart) {
    console.log("CHART");

    console.log(evnt);
    console.log(chart);


  }
  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
    // this.highlights = [...this.highlights_copy];
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    //this.highlights = [...this.highlights_copy];
  }



  getData() {
    //this.dataOrden.cod_med = this.varGlobal.getVarUsuario()
    //this.presentLoading();
    this.listaAnalisis = [];
    this.listaAnalisisOrigen = [];
    this.listaResultados = [];
    this.multi = []
    this.multi_origen = []
    this.gridLabelResultados = []
    this.gridResultados = []
    let data = { cod_pac: this.codigoPaciente, f_desde: this.fDesde + " 00:00", f_hasta: this.fHasta + " 23:59" }
    console.log("data", data);

    this.queryservice.getAnalisisPacienteByCod(data).then(async (result: any) => {
      console.log('resultpedido', result);
      if (result && result.data) {
        this.listaAnalisis = result.data.getAnalisisPacienteByCod;
        this.listaAnalisisOrigen = result.data.getAnalisisPacienteByCod;
        console.log('Analisis', this.listaAnalisis);
        //veo si tiene scroll
        this.validaScrollContainer()
      } else {
        if (result.errors && result.errors.length > 0) {
          this.utilidades.mostrarToast(result.errors[0].message)
        } else {
          this.utilidades.mostrarToast("OCURRIO UN PROBLEMA AL CARGAR ANALISIS")
        }
      }

      setTimeout(async () => {
        const isLoadingOpen = await this.loadingController.getTop();
        if (isLoadingOpen) {
          this.loadingController.dismiss()
        }

      }, 300);


    }, error => {
      console.log(error);
      const isLoadingOpen = this.loadingController.getTop();
      if (isLoadingOpen) {
        this.loadingController.dismiss()
      }
      this.utilidades.alertErrorService("get-list-orders", error.status)

      //this.loadingController.dismiss();
    })



  }


  async getDataResultados(codigo_analisis) {
    //this.dataOrden.cod_med = this.varGlobal.getVarUsuario()
    let data = { cod_pac: this.codigoPaciente, f_desde: this.fDesde + " 00:00", f_hasta: this.fHasta + " 23:59", cod_ana: codigo_analisis }
    console.log("data", data);

    await this.queryservice.getParametrosAnalisisPac(data).then(async (result: any) => {
      console.log('resultpedido', result);
      if (result && result.data) {
        this.listaResultados.push(...result.data.getParametrosAnalisisPac);
        console.log('Resultados', this.listaResultados);
        // this.organizaChart()

      } else {
        if (result.errors && result.errors.length > 0) {
          this.utilidades.mostrarToast(result.errors[0].message)
        } else {
          this.utilidades.mostrarToast("OCURRIO UN PROBLEMA AL CARGAR Resultados")
        }
      }
      /*
            setTimeout(async () => {
              const isLoadingOpen = await this.loadingController.getTop();
              if (isLoadingOpen) {
                this.loadingController.dismiss()
              }
      
            }, 300);
      */

    }, error => {
      console.log(error);
      const isLoadingOpen = this.loadingController.getTop();
      if (isLoadingOpen) {
        this.loadingController.dismiss()
      }
      this.utilidades.alertErrorService("get-list-orders", error.status)

      //this.loadingController.dismiss();
    })



  }
  gridYearsDates = []
  //ESTE ES EL METODO PRINCIPAL
  async organizaChart() {
    this.viewSmall = [100, 30]
    this.view=[300,215]
    this.multi = [];
    this.gridResultados = []
    this.gridLabelResultados = []
    let parametro = [];
    let unidad = [];
    let parametroGrid = [];
    let colorPosition = 0;
    let formatoFecha = 'dd/MM/yyyy HH:mm'
    let formatoFechaGrid = 'yyyy-MM-ddTHH:mm'

    this.gridYearsDates = []
    if (this.listaResultados.length > 0) {

      let fecha = formatDate(this.listaResultados[0].fecha_creacion_resultado.replace(" ", "T"), formatoFecha, 'es-MX').toUpperCase();
      let fechaGrid = formatDate(this.listaResultados[0].fecha_creacion_resultado.replace(" ", "T"), formatoFechaGrid, 'es-MX');//corto los segundos

      //grid el primero
      this.gridLabelResultados.push(fechaGrid)
      //empiezo a recorrer los resultados
      this.listaResultados.forEach(resultado => {
        //igualo el nombre para que se unifiquen
        resultado.descripcion_parametro = resultado.descripcion_parametro.toLowerCase()
        // fecha = new Date(resultado.fecha_creacion_resultado).toLocaleDateString();
        fecha = formatDate(resultado.fecha_creacion_resultado.replace(" ", "T"), formatoFecha, 'es-MX').toUpperCase();
        fechaGrid = formatDate(resultado.fecha_creacion_resultado.replace(" ", "T"), formatoFechaGrid, 'es-MX');
        //fecha = new Date(resultado.fecha_creacion_resultado).toLocaleDateString();
        //PARA ORGANIZAR EL GRID
        if (!this.gridLabelResultados.some(e => e === fechaGrid)) {
          this.gridLabelResultados.push(fechaGrid)
          //ordeno grid
          this.gridLabelResultados.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        }

        parametroGrid = this.gridResultados.filter(e => e.cod === resultado.codigo_parametro)
        if (parametroGrid.length > 0) {//si existe creo el nuevo campo con la fecha
          parametroGrid[0][fechaGrid] = resultado.resultado
        } else {
          //si no existe lo creo 
          parametroGrid = [{
            "parametro": resultado.descripcion_parametro,
            "cod_ana": resultado.codigo_analisis,
            "orden_analisis":this.listaAnalisis.filter(e=>e.codigo_analisis==resultado.codigo_analisis)[0].orden_analisis,
            "orden_tipo_analisis":this.listaAnalisis.filter(e=>e.codigo_analisis==resultado.codigo_analisis)[0].orden_tipo_analisis
          }]
          parametroGrid[0][fechaGrid] = resultado.resultado;
          parametroGrid[0]["active"] = true
          parametroGrid[0]["tipo"] = resultado.tipo_resultado
          parametroGrid[0]["cod"] = resultado.codigo_parametro
          parametroGrid[0]["unidad"] = resultado.unidad_resultado
          this.gridResultados.push(parametroGrid[0])
        }

        //solo numero para la grafica
        if (resultado.tipo_resultado === "N" && !isNaN(resultado.resultado)) {
          unidad = this.multi.filter(m => m.unidad === resultado.unidad_resultado)
          //  console.log("entra u", unidad);
          if (unidad.length > 0) {
            parametro = unidad[0].parametros.filter(e => e.name === resultado.descripcion_parametro)
            //parametro = unidad[0].parametros.filter(e => e.code === resultado.codigo_parametro)
            //console.log("entra param", parametro);
            //si esq existe ya deberia tener uno ingresado
            if (parametro.length > 0) {
              //si hay repetido vamos a cambiarle el nombre
              if (parametro[0].code != resultado.codigo_parametro) {
                parametro[0].name = parametro[0].name + " (" + resultado.codigo_analisis + ")" //modifico el que ya tengo
                //ingreso uno nuevo
                unidad[0].parametros.push({
                  "name": resultado.descripcion_parametro,
                  "code": resultado.codigo_parametro,
                  "color": this.colorScheme.domain[unidad[0].parametros.length % this.colorScheme.domain.length],
                  "active": true,
                  "series": [{
                    "value": resultado.resultado,
                    "name": fecha
                  }]
                })
                //AÑADO A LOS COLORES
                unidad[0].colors.push({ "name": resultado.descripcion_parametro, "value": this.colorScheme.domain[(unidad[0].parametros.length - 1) % this.colorScheme.domain.length] })
                // colorPosition=colorPosition==this.colorScheme.domain.length-1?0:colorPosition+1
              } else {
                parametro[0].series.push({
                  "value": resultado.resultado,
                  "name": fecha
                })
              }
            } else {// si no existe el parametro en la uunidad
              unidad[0].parametros.push({
                "name": resultado.descripcion_parametro,
                "code": resultado.codigo_parametro,
                "color": this.colorScheme.domain[unidad[0].parametros.length % this.colorScheme.domain.length],
                "active": true,
                "series": [{
                  "value": resultado.resultado,
                  "name": fecha
                }]
              })
              //AÑADO A LOS COLORES
              unidad[0].colors.push({ "name": resultado.descripcion_parametro, "value": this.colorScheme.domain[(unidad[0].parametros.length - 1) % this.colorScheme.domain.length] })
              // colorPosition=colorPosition==this.colorScheme.domain.length-1?0:colorPosition+1
            }
          } else {//ingreso todo nuevo 
            // console.log("entra nuevo");
            colorPosition = 0;
            //resultado.unidad_resultado = resultado.unidad_resultado == null ? "" : resultado.unidad_resultado

            this.multi.push(
              {
                "unidad": resultado.unidad_resultado,

                //a cada unidad asigno la paleta de colores es por lo que se puede deshabilitar no perder los colores
                //esto funciona para graficas con unidad
                "colors": [{ "name": resultado.descripcion_parametro, "value": this.colorScheme.domain[colorPosition] }],
                "parametros": [
                  //inicializo el primer parametro
                  {
                    "name": resultado.descripcion_parametro,
                    "code": resultado.codigo_parametro,
                    "color": this.colorScheme.domain[colorPosition],
                    "active": true,
                    "series": [{
                      "value": resultado.resultado,
                      "name": fecha
                    }]
                  }
                ]
              }
            )
            colorPosition++;
            //colorPosition=colorPosition==this.colorScheme.domain.length-1?0:colorPosition+1

          }

        }
      });
      console.log("El chart", this.multi);
      //evita que se unan
      //EL MULTI ORIGEN YA NO LO USO
      //this.multi_origen = JSON.parse(JSON.stringify(this.multi));
      //GUARDO CADA PARAMETRO ORIGINAL
      this.multi.forEach(unidad => {
        if (unidad.parametros && unidad.parametros.length > 0) {
          //PARA QUE NO SE IMPRIMA SI EXISTE UN SOLO PUNTO
          unidad.parametros = unidad.parametros.filter(par => (par.series && par.series.length > 1))
        }

        unidad.parametros_origen = JSON.parse(JSON.stringify(unidad.parametros))
      });

      const isLoadingOpen = await this.loadingController.getTop();
      //SI ES MOBIL LO PARO EN ESTE PUNTO EL LOADING YA QUE NO SE VE LA GRAFICA AUN
      if (this.mobile) {
        console.log("CIERRA LOADING MOBILE");

        if (isLoadingOpen) {
          this.loadingController.dismiss()
        }
      }
      //CHART DE CADA RESULTADO
      this.gridResultados.forEach(e => {
        if (e.tipo === "N") {
          e.chart = this.findChartParam(e)
          if (e.chart && e.chart.length > 0) {
            e.colorScheme = { domain: [e.chart[0].color] }
          }
        } else {
          e.chart = []
        }
      });
      
      //ORDENO LA TABLA
      this.gridResultados.sort((a,b)=>a.orden_analisis-b.orden_analisis)
      .sort((c,d)=>c.orden_tipo_analisis - d.orden_tipo_analisis) //los parametros ya vienen ordenado

      //LOS LABELS DEL GRID
      //let arrayYear=[...new Set(this.gridLabelResultados.map(x => x.split('-')[0]))];
      this.gridLabelResultados.forEach((date, i) => {
        //separo los años
        if (this.gridYearsDates.filter(e => e.year === date.split("-")[0]).length > 0) {
          //inserto en el mismo año
          this.gridYearsDates.filter(e => e.year === date.split("-")[0])[0].dates.push(date)
        } else {
          this.gridYearsDates.push({ "year": date.split("-")[0], "color": this.setColorRandom(i), "dates": [date] })
        }
      })

      //VALIDAMOS LOS GRAFICOS--- POR LOS PUNTOS VACIOS
      let total_validos = this.multi.filter(e => e.parametros_origen.length > 0)
      if (!total_validos || total_validos.length == 0) {
        this.multi = []
      }

      console.log("LOS YEARS", this.gridYearsDates);
      console.log("El chart_orig", this.multi_origen);
      console.log("El grid", this.gridResultados);
      //SCROLL FIN TABLA
      setTimeout(() => {
        let gridTable = document.querySelector("#table-result")
        // if (this.divFinScroll&&this.elementToolbar.offsetHeight + this.elementToolbar.scrollTop >= this.elementToolbar.scrollHeight) {
        if (gridTable.clientHeight < gridTable.scrollHeight) {
          gridTable.getElementsByClassName("dif-scroll")[0].classList.add("transparent-content")
        }

      }, 300);
      if (this.multi && this.multi.length > 0) {
        //this.view=undefined
        //pongo los puntos
        clearTimeout(this.setOut)
        this.setOut = setTimeout(async () => {
          //formateo el texto
          this.wrapTextSvg()
          this.setPointsLine();
          //cierra el loading
          //en el mobil lo cierro antes
          console.log(this.mobile);
          //tengo q mejorar estos loading
          const isLoadingOpen2 = await this.loadingController.getTop();
          if (!this.mobile) {
            if (isLoadingOpen2) {
              this.loadingController.dismiss()
            }
          }
        }, this.multi.length > 4 ? this.tiempoCargaPuntos * this.multi.length : 2000);

        //HAGO ESTO PARA ACTIVAR EL EVENTO RESIZE YA QUE NO ESTA FUNCIONANDO EN EL GRID
        setTimeout(() => {
          this.viewSmall = undefined
        }, 1000);

      } else {
        //si no existe graficas no espera tanto
        setTimeout(async () => {

          const isLoadingOpen2 = await this.loadingController.getTop();
          if (!this.mobile) {
            if (isLoadingOpen2) {
              this.loadingController.dismiss()
            }
          }
        }, 500);
      }
    } else {
      setTimeout(() => {

        this.loadingController.dismiss()

      }, 500);
    }

  }

  async actualizaResultados() {
    console.log(this.codigoAnalisis);
    if (this.codigoAnalisis == "todos") {
      //this.selectAllResultados();
      this.codigoAnalisis = this.listaAnalisis
    } else {

      //this.getDataResultados(this.codigoAnalisis.codigo_analisis)
      //ESTAMOS HACIENDO PUSH EN CADA RESULTADO
      this.presentLoading()
      this.listaResultados = []
      for (let i = 0; i < this.codigoAnalisis.length; i++) {
        await this.getDataResultados(this.codigoAnalisis[i].codigo_analisis)
      }
      console.log("ORGANIZAA");

      this.organizaChart()
    }

  }

  async actualizaResultados2() {

    this.presentLoading()
    this.listaResultados = []
    for (let i = 0; i < this.listaAnalisis.length; i++) {
      if (this.listaAnalisis[i].isChecked) {
        await this.getDataResultados(this.listaAnalisis[i].codigo_analisis)
      }
    }

    this.organizaChart()
  }

  async selectAllResultados() {
    this.listaResultados = []
    this.presentLoading()
    for (let i = 0; i < this.listaAnalisis.length; i++) {
      this.listaAnalisis[i].active = true;
      console.log("index", i);

      await this.getDataResultados(this.listaAnalisis[i].codigo_analisis)

    }
    //this.codigoAnalisis = this.listaAnalisis
    this.organizaChart()

  }
  clearResultados() {
    this.listaResultados = []
    this.organizaChart()
    this.listaAnalisis.forEach(ana => {
      ana.active = false
    });
  }

  validaFecha() {
    let fecha_hoy = new Date()
    let dias = 30
    let espera = 100
    if (this.fDesde == '') {
      espera = 150;
      setTimeout(() => {
        this.fDesde = new Date(fecha_hoy.setDate(fecha_hoy.getDate() - dias)).toISOString().split("T")[0]
      }, 100);
    }
    if (this.fHasta == '') {
      espera = 150;
      setTimeout(() => {
        this.fHasta = fecha_hoy.toISOString().split("T")[0]
      }, 100);
    }
    setTimeout(() => {
      this.getData()
    }, espera);
  }

  formattingTic(ev) {
    //PUEDO FORMATEAR LAS FECHAS
    // console.log("hello", ev);
    // tspan.textContent="HE";
    return ev
  }

  activaResultado(ev, resultados) {
    console.log(ev);

    console.log("result", resultados);
    setTimeout(() => {
      resultados.active = resultados.active ? false : true;
      console.log("result", resultados);

      let position_unidad = 0;
      //let unidad_origen;
      position_unidad = this.multi.findIndex(m => m.unidad === resultados.unidad)
      //unidad_origen = this.multi_origen.filter(m => m.unidad === resultados.unidad)
      console.log("position", position_unidad);
      let parametro_origen;
      let color_origen;

      if (position_unidad >= 0) {
        //unidad[0] = unidad_origen[0].parametros.filter(m => m.name !== resultados.parametro)
        parametro_origen = this.multi[position_unidad].parametros_origen.filter((m => m.name === resultados.parametro))
        if (parametro_origen && parametro_origen.length > 0) {
          if (resultados.active) {//ACTIVO LO AÑADO
            parametro_origen[0].active = true;
          } else {//SI NO LO ELIMINO
            parametro_origen[0].active = false;
          }
          /*
          //select color
          color_origen = parametro_origen[0].color
          let indice_color = this.multi[position_unidad].colors.domain.indexOf(color_origen);
          if (indice_color === -1) {
            //INSERTO EN LA POSICION original
            this.multi[position_unidad].colors.domain.splice(this.colorScheme.domain.indexOf(color_origen),0,color_origen)
          } else {
            this.multi[position_unidad].colors.domain.splice(indice_color, 1)
          }
          */
        } else {
          console.error("NO EXISTE EL PARAMETRO")
        }

        this.multi[position_unidad].parametros = this.multi.filter(m => m.unidad === resultados.unidad)[0].parametros_origen.filter(m => m.active)
        //asigno nuevos colores
        if (this.tipoGrafica == 'resultado') {
          this.view = [300, 215]
        }
        console.log(this.multi);
        // console.log(this.multi_origen);
        //pongo los puntos
        clearTimeout(this.setOut)
        this.setOut = setTimeout(() => {
          this.setPointsLine();
        }, 1000);
      }
    }, 100)
  }

  activaTodosResultados(ev) {
    console.log(ev.target.checked);
    let value = ev.target.checked //activo es false
    if (value) {
      this.gridResultados.forEach(result => {
        if (result.active) {
          result.active = false
        }
      });
      //no es necesario buscar ya que la idea es desactivar todos
      this.multi.forEach(unidad => {
        //a cada unidad quitamos los parametros y dejamos los origen 
        unidad.parametros = []
      })
      //VALIDAMOS LOS GRAFICOS--- POR LOS PUNTOS VACIOS
      let total_validos = this.multi.filter(e => e.parametros_origen.length > 0)
      if (!total_validos || total_validos.length == 0) {
        this.multi = []
      }

    } else {
      this.organizaChart()

    }

  }

  async valideAnalisis(analisis) {
    console.log("analisis", analisis);
    let activo = !analisis.active

    setTimeout(() => {
      analisis.active = analisis.active ? false : true;
    }, 300);

    const isLoadingOpen = await this.loadingController.getTop();
    if (!isLoadingOpen) {
      this.presentLoading()
    }

    if (activo) {

      //hace push cada que ingresa 
      await this.getDataResultados(analisis.codigo_analisis)
      this.organizaChart();
    } else {
      this.listaResultados = await this.listaResultados.filter(e => e.codigo_analisis !== analisis.codigo_analisis)

      this.organizaChart()
    }

  }

  findChartParam(resultados) {
    let chart
    let unidad_origen = this.multi.filter(m => m.unidad === resultados.unidad)
    // console.log("mini unidad ",unidad_origen);
    chart = unidad_origen[0].parametros_origen.filter(m => m.name === resultados.parametro)
    if (chart.length > 0) {
      // console.log("mini chart ",chart[0]);
      return chart
      // chart.draw(dataTable, options);
    } else {
      chart = []
    }
    return chart
  }



  identify(index, item) {
    return item.id;
  }

  focusChart(resultados) {
    console.log(resultados);
    if (resultados.active) {
      this.tipoPanelMobile = "chart"
      let elemntFocus;
      setTimeout(() => {//en mobil se demora en hacer el cambio de panel y nop se hace focus
        if (this.tipoGrafica == 'resultado') {
          elemntFocus = document.getElementById(resultados.parametro)
        } else {
          elemntFocus = document.getElementById(resultados.unidad)
        }
        console.log(elemntFocus);
        if (elemntFocus && elemntFocus != null) {
          elemntFocus.focus();
          elemntFocus.blur();
          elemntFocus.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'center'
          });
          elemntFocus.classList.toggle('focused');
          setTimeout(() => {
            elemntFocus.classList.remove('focused');
          }, 700);

        } else {
          console.error("NO SE LOGRO HACER FOCUS")
        }
      }, this.mobile ? 500 : 0)

    }
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
  onResize(ev) {
    console.log(ev);

    clearTimeout(this.setOut)
    this.setOut = setTimeout(async () => {
      this.setPointsLine()
    }, this.multi.length > 4 ? this.tiempoCargaPuntos * this.multi.length : 2000);

  }

  loadEvent(event) {
    console.log("SMALL");
    this.viewSmall = undefined
  }

  yearLabelGrid() {
    //el formato es yyyy-MM-dd
    return [...new Set(this.gridLabelResultados.map(x => x.split('-')[0]))];
  }

  columLabelByYearGrid(year) {
    //el formato es yyyy-MM-dd
    return this.gridLabelResultados.filter(e => e.split("-")[0] === year)
  }

  valAcordion = ["ana"]
  @HostListener('ionScroll', ['$event']) // for window scroll events
  onScroll(event) {
    return;
    //console.log(event.detail.scrollTop);
    if (event.detail.scrollTop < 40) {
      this.valAcordion = ["ana"]
      this.validaScrollContainer()
    } else {
      this.valAcordion = []
      this.scrollRowAnalisis = false;


      let changeChartElement = document.getElementById("title-accordion-chart")
      //console.log(changeChartElement);
      //console.log(changeChartElement&&(window.pageYOffset + changeChartElement.getBoundingClientRect().top)<0);
      if ((window.pageYOffset + changeChartElement.getBoundingClientRect().top) > 0) {
        this.scrollIntoButtonChart = false;
      } else {
        this.scrollIntoButtonChart = true
      }

    }

  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScrollDivAnalisis($event) {
    //console.log($event);
    let myDiv = $event.srcElement
    if (myDiv.offsetHeight + myDiv.scrollTop <= myDiv.scrollHeight) {
      this.scrollRowAnalisis = true
    } else {
      this.scrollRowAnalisis = false
    }
  }
  validaScrollContainer() {
    setTimeout(() => {
      var container = document.getElementById("row-analisis")
      //console.log("CONTENEDOR", container);
      if (container && container.clientHeight < container.scrollHeight) {
        this.scrollRowAnalisis = true
      } else {
        this.scrollRowAnalisis = false
      }
    }, 300);

  }

  colores_grid = ["#ffffd4", "#dfffd4", "#d4f4ff", "#ffd4fb"]
  setColorRandom(indice) {
    //retorno el color
    return this.colores_grid[indice % this.colores_grid.length]

  }
  trackByFn(index, item) {
    // return item.someUniqueIdentifier;
    // or if you have no unique identifier:
    return index;
  }
  cambiaGrafica(ev) {
    console.log('Segment changed', ev);
    this.zone.run(() => {
      this.accordionPrincipal = ['table', 'chart']
      this.tipoGrafica = ev.detail.value;
      console.log("this.pedido_lugar_select", this.tipoGrafica);
      if (this.tipoGrafica == 'resultado') {
        this.view = [300, 215]
      } else {
        this.view = undefined
      }
      //pongo los puntos
      clearTimeout(this.setOut)
      this.setOut = setTimeout(() => {
        //formateo el texto
        this.wrapTextSvg()
        this.setPointsLine();
      }, this.multi.length > 4 ? this.tiempoCargaPuntos * this.multi.length : 2000);

      //HAGO ESTO PARA ACTIVAR EL EVENTO RESIZE YA QUE NO ESTA FUNCIONANDO EN EL GRID
      setTimeout(() => {
        this.viewSmall = undefined
      }, 1000);


    });
  }
  classSearch = "inactive";
  anaFiltrado = "";
  onSearchChange(ev) {
    console.log("WORD", this.anaFiltrado);
    this.listaAnalisis = this.listaAnalisisOrigen.filter(e => e.descripcion_analisis.toLowerCase().indexOf(this.anaFiltrado.toLowerCase()) > -1)
    this.validaScrollContainer()


  }
  appearSearch() {
    this.classSearch = this.classSearch == "inactive" ? "active" : "inactive"
    console.log("clase", this.classSearch);
    this.anaFiltrado = "";
    this.listaAnalisis = this.listaAnalisisOrigen
  }
  selectParamLeyend(param) {
    console.log(param);
    let parametro = this.gridResultados.filter(e => e.parametro == param.name)
    if (parametro && parametro.length > 0) {
      this.activaResultado(null, parametro[0]);
      setTimeout(() => {
        this.setPointsLine()
        this.wrapTextSvg()
      }, 100);
      //parametro[0].active = parametro[0].active ? false : true;
    }
  }
  scrollUp(el: HTMLElement) {
    let scrollSize = 30;
    el.scrollTop += scrollSize
  }
  scrollDown(el: HTMLElement) {
    let scrollSize = 30;
    if (el.scrollTop > 30) {
      el.scrollTop -= scrollSize
    }
  }
  cambiaPanel(ev) {//SOLO MOBIL
    console.log('Segment changed', ev);
    //como funciona solo para mobile le mando los tamños
    this.view = [350, 300]
    setTimeout(() => {
      this.setPointsLine()
    }, this.multi.length > 4 ? this.tiempoCargaPuntos * this.multi.length : 2000);
    this.zone.run(() => {

      this.tipoPanelMobile = ev.detail.value;
      console.log("this.tipoPanelMobile", this.tipoPanelMobile);
      //pongo los puntos


    });
  }
  async openModalChart(chart) {
    console.log("CHART", chart);
    console.log("TIPO", this.tipoGrafica);
    const modal = await this.modalCtrl.create({
      component: ChartVisorPage,
      cssClass: 'modal-detalle-orden',
      componentProps: {
        dataChart: chart,
        tipo: this.tipoGrafica
      }
    });
    return await modal.present();

  }

  async openModalAlertSelect() {
    const modal = await this.modalCtrl.create({
      component: AlertSelectAnalisisPage,
      cssClass: 'modal-alert',
      componentProps: {
        listaAnalisis: this.listaAnalisis
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        console.log("DATOS", this.listaAnalisis);

        // console.log(data['data']);
        if (data && data['data'] && data['data'].cancel) {
          console.log("SE CANCELO");

        } else {
          this.actualizaResultados2();
        }

      });
    return await modal.present();

  }

  async presentLoading() {
    console.log("CREO LOADING");
    let mensaje = "Cargando...";
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje,
      backdropDismiss: true,
      duration: 15000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  async presentAlert(titulo, mensaje) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }

  resizeTable() {
    console.log("ICONO RESIZE");
    this.view = [250, 150]
    setTimeout(() => {
      this.view = undefined
      this.onResize(null)
    }, 1000);
  }
}
