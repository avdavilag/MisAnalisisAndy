import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { WebRestService } from 'src/app/servicios/intranet/web-rest.service';

@Component({
  selector: 'app-select-pdf',
  templateUrl: './select-pdf.page.html',
  styleUrls: ['./select-pdf.page.scss'],
})
export class SelectPdfPage implements OnInit {
  @Input() lista_pdfs;
  select_pdf;
  select_flag=false;
  constructor(public modalCtrl: ModalController, 
    public alertController: AlertController,private elRef:ElementRef) { }

  ngOnInit() {
  }
  seleccion(item){
    console.log(item);
    //this.getArchivoPDF(this.select_pdf);
    this.select_flag=true;
    this.elRef.nativeElement.parentElement.classList.add('item-select');
    setTimeout(() => {
      
    this.modalCtrl.dismiss(item);
    }, 300);
  }

  cerrar(){
    this.modalCtrl.dismiss();
  }

  imprimir(){
    if(this.select_pdf.archivo&&this.select_pdf.archivo!=null){
      let pdfWindow = window.open("");
      pdfWindow.document.write("<iframe title='Preview' width='100%' height='100%' src='data:application/pdf;base64,"+encodeURI(this.select_pdf.archivo)+"'></iframe>");
      pdfWindow.document.title = 'Preview';
    }else{
      this.presentAlert("Tuvimos un problema","Intente nuevamente");
    }
   
  }

  modificar(){
    if(this.select_pdf.archivo&&this.select_pdf.archivo!=null)
      this.modalCtrl.dismiss(this.select_pdf);
      else{
        this.presentAlert("Tuvimos un problema","Intente nuevamente");
      }
  }


  async presentAlert(titulo, mensaje) {
    const alert = await this.alertController.create({
      cssClass: 'mensajes-pdf',
      header: titulo,
      message: mensaje,
      backdropDismiss: false,
      buttons: [

        {
          text: 'OK',
          handler: () => {
            console.log('Confirm Okay');
            //this.router.navigate([this.redireccion_principal])
          }
        }
      ]
    });

    await alert.present();
  }
}
