import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { BaseService } from 'src/app/servicios/base/base.service';
import { WebRestService } from 'src/app/servicios/intranet/web-rest.service';
import { PdfRenderService } from 'src/app/servicios/pdf/pdf-render.service';
import { Utilidades } from 'src/app/utils/utilidades';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.page.html',
  styleUrls: ['./facturas.page.scss'],
})
export class FacturasPage implements OnInit {
  @Input() orden: any;
  @Input() facturas: any;
  constructor(
    private servicios: BaseService,
    private serviciosPdf: PdfRenderService,
    private modalcontroller: ModalController,
    private loadingController: LoadingController,
    private utilidades: Utilidades,

  ) { }

  ngOnInit() {


    /*
        console.log('orden', this.orden);
    
        var formData: any = new FormData();
        formData.append("orden", this.orden);
    
        this.serviciosIntra.getListFacturas(formData).toPromise().then(r => {
          console.log('r', r);
          this.facturas = r
        },error=>{
          this.utilidades.alertErrorService("get-list-fact",error.status)
        })
      */
  }

  dismiss() {
    this.modalcontroller.dismiss({
      'dismissed': true,
      // 'flag_origen': this.flag_origen
    });
    //    this.orden = [];
  }


  modificaFecha(fecha) {
    return fecha.replace(" ", "T")
  }

  descargarxml(data) {
    var formData: any = new FormData();
    formData.append("orden", this.orden);
    formData.append("sid", data.sri_id);

    this.servicios.getXmlFactura(formData).toPromise().then(r => {
      console.log('r', r);
      var element = document.createElement('a');
      element.setAttribute('href', 'data:application/xml;charset=utf-8,' + encodeURIComponent(r[0].xml_autorizado));
      element.setAttribute('download', data.numero);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

    }, error => {
      this.utilidades.alertErrorService("getXMLFact", error.status)
    })
  }

  creaPDF(data) {
    this.presentLoading()
    var formData: any = new FormData();
    formData.append("orden", this.orden);
    formData.append("sid", data.sri_id);
    let string_xml = "";
    let xml_final;
    this.servicios.getXmlFactura(formData).toPromise().then(r => {
      console.log('r', r);
      string_xml = r[0].xml_autorizado
      xml_final = this.separaXML(string_xml)
      //console.log(this.parseXml(this.separaXML(string_xml)));
      let valores_enviar = {
        "formato": data.cod_documento,
        "xmlString": xml_final,
      }

      this.serviciosPdf.getPDFFactura(valores_enviar).subscribe(resp => {
        const blob = new Blob([new Uint8Array(resp)], { type: "application/pdf" });
        //const exportUrl = URL.createObjectURL(blob);
        saveAs(blob, "" + data.numero + ".pdf");

        setTimeout(() => {
          this.loadingController.dismiss()
        }, 100);

      }, error => {
        this.utilidades.alertErrorService("render-fact", error.status)

        setTimeout(() => {
          this.loadingController.dismiss()
        }, 100);

      })

    }, error => {
      this.utilidades.alertErrorService("getXMLFact", error.status)

      setTimeout(() => {
        this.loadingController.dismiss()
      }, 100);

    })
  }

  parseXml(xmlStr) {
    return new window.DOMParser().parseFromString(xmlStr, "text/xml");
  }

  separaXML(xmlStr: String) {
    let xml_result = "";
    let nodo_insertar;
    if (xmlStr.search("<numeroAutorizacion>") > 0) {
      //sumo los caracteres de la busqueda ya que me devuelve el primero
      nodo_insertar = xmlStr.slice(xmlStr.search("<numeroAutorizacion>"), xmlStr.search("</fechaAutorizacion>") + 20);
    }
    console.log("nodo insert", nodo_insertar);

    if (xmlStr.search("<!\\[CDATA\\[") > 0) {
      xml_result = xmlStr.slice(xmlStr.search("<!\\[CDATA\\[") + 9, xmlStr.search("\\]\\]></comprobante>"))
      //inserto el nodo antes que acabe el nodo info tributaria
      xml_result = xml_result.slice(0, xml_result.search("</infoTributaria>")) + nodo_insertar + xml_result.slice(xml_result.search("</infoTributaria>"))
    }
    console.log("RESULT", xml_result);

    return xml_result

  }


  async presentLoading() {
    let mensaje = "Generando...";

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: mensaje,
      duration: 15000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
}
