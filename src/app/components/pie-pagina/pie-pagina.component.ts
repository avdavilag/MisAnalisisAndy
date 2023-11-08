import { Component } from '@angular/core';
import { AppConfigService } from 'src/app/utils/app-config-service';
import { version } from "../../staticVars"
@Component({
  selector: 'app-pie-pagina',
  templateUrl: './pie-pagina.component.html',
  styleUrls: ['./pie-pagina.component.scss'],
})
export class PiePaginaComponent {
  public fecha:Date;
  public nombreApp="";
  public versionApp="";
  constructor(
    private configApp: AppConfigService) { }

  ngOnInit() {
    this.fecha=new Date()
    this.nombreApp = this.configApp.versionApp;
    this.versionApp = version;
  }

}
