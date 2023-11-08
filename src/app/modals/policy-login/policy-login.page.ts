import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Utilidades } from 'src/app/utils/utilidades';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { VariablesGlobalesService } from 'src/app/servicios/variables/variables-globales.service';

@Component({
  selector: 'app-policy-login',
  templateUrl: './policy-login.page.html',
  styleUrls: ['./policy-login.page.scss'],
})
export class PolicyLoginPage implements OnInit {
  htmlContent;
  checkButton = false
  detalle;
  @Input() codigoPaciente;
  constructor(private http: HttpClient, private modalController: ModalController, private sanitizer: DomSanitizer, private queryservice: QueryService,
    private varGlobal: VariablesGlobalesService,
    public utilidades: Utilidades) { }

  ngOnInit() {
    
    this.detalle = "Navegador: " + this.utilidades.getNavegador() + "; IP: " + this.varGlobal.getIPBrowser();
    const htmlFileUrlText = './docs/policy_text.html';
    this.loadHtmlContentText(htmlFileUrlText);

    //const htmlFileUrl = './docs/policy.html';
    //this.loadHtmlContent(htmlFileUrl);
  }

  loadHtmlContentText(url: string) {
    this.http.get(url, { responseType: 'text' }).subscribe(
      (html: string) => {
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(html);
      },
      (error) => {
        console.error('Error cargando el contenido HTML:', error);
      }
    );
  }


  loadHtmlContent(url: string) {
    this.http.get(url, { responseType: 'text' }).subscribe(
      (html: string) => {
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(html);
      },
      (error) => {
        console.error('Error cargando el contenido HTML:', error);
      }
    );
  }
  cancel() {
    this.modalController.dismiss()
  }

  acept() {
     let data = { cod_pac: this.codigoPaciente, protect_ok: 0, protect_fecha: new Date().toISOString(), protect_detail: this.detalle };
    if (this.checkButton) {
      data.protect_ok=1;
      this.actualizaEstado(data)
    } else {
      this.utilidades.mostrarToast("Acepte la politica para continuar")
    }
  }

  actualizaEstado(data) {
    console.log('data', data)
    this.queryservice.setPolicyPac({json_data:JSON.stringify(data)}).then((result: any) => {
      console.log('result', result);
      let data = result.data.setJsonPolicyPac;
      if (data && data != null) {
        if (data.protect_ok == 1||data.protect_ok == "1") {
          this.modalController.dismiss({ acept: "ok" })

        } else {
          this.utilidades.mostrarToastError(data.description)
        }
      } else {

        if (result.errors && result.errors.length > 0) {
          this.utilidades.mostrarToastError(result.errors[0].message)
        } else {
          this.utilidades.mostrarToastError("OCURRIO UN PROBLEMA")
        }
      }
      //  this.loadingservice.dismiss()
    }, error => {
      console.error('error', error);
      // this.loadingservice.dismiss()
      this.utilidades.alertErrorService("qpql-setJsonPolicyPac", error.status)

    })

  }

}
