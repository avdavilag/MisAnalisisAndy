import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { registerLocaleData } from '@angular/common';//PARA registrar locales

//importo los locales
import localeEn from '@angular/common/locales/en';
import localesEs from '@angular/common/locales/es';

import { AppConfigService } from './utils/app-config-service';
//I18N
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { Title }  from '@angular/platform-browser';

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { BnNgIdleService } from 'bn-ng-idle' 
//ESTO ES PARA i18N
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

//----------------------------------------------------------------//
import { QRCodeModule } from 'angularx-qrcode';
//-------------------------components-----------------------------//
//import {PiePaginaComponent} from './components/pie-pagina/pie-pagina.component'
//---------------------------------------------------------------//
import { ComponentsModule } from './components/components.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ApolloModule} from 'apollo-angular';
import { AppConnectionsService } from './utils/app-conections-service';
//import { GraphQLModule } from './graphql.module'; ya no le uso como modulo xq salta error si no inicia




//registro
registerLocaleData(localeEn, 'en');
registerLocaleData(localesEs, 'es');
@NgModule({
  declarations: [AppComponent
    //PiePaginaComponent
  ],
  imports: [BrowserModule,IonicModule.forRoot({innerHTMLTemplatesEnabled:true}), AppRoutingModule ,ApolloModule,BrowserAnimationsModule,
    NgxChartsModule,
    FormsModule,
    ReactiveFormsModule, //PONER ESTE PARA LOS FORMS
    HttpClientModule, 
    PdfViewerModule,
    QRCodeModule,//PARA GENERAR QR
    //ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production, registrationStrategy: 'registerImmediately' }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
   ComponentsModule,
    //GraphQLModule,    
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },//par hacerle ingles español
    Title,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          //Make sure to return a promise!
          return appConfigService.loadAppConfig();
        };
      }
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConnectionsService],
      useFactory: (appConfigService: AppConnectionsService) => {
        return () => {
          //Make sure to return a promise!
          return appConfigService.loadAppConfig();
        };
      }
    },
    BnNgIdleService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

