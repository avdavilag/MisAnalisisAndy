import { Injectable } from '@angular/core';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';


import gql from 'graphql-tag';
import { ToastService } from './toast.service';
import { AppConfigService } from '../utils/app-config-service';
import { AppConnectionsService } from '../utils/app-conections-service';


//const Token_url="http://192.168.100.190:18080/api_avalab/"
//const Token_url="http://localhost/api_avalab/"


@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  private Token_url = "";

  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private toastservice: ToastService,
    private configApp: AppConnectionsService
    //private queryservice:QueryService,

  ) {
    //LLAMO A LA VARIABLE DE CONFIGURACIONES
    //EL PROTOCOLO ES UNO PARA TODOS
    /*
      if (this.configApp.apiBaseHttps && this.configApp.apiBaseHttps == true) {
        this.Token_url = "https://"
      } else {
        this.Token_url = "http://"
      }
  */

    if (window.location.protocol == "http:") {
      this.Token_url = "http://"
    } else {
      this.Token_url = "https://"
    }

    //si no esta definida uso la general
    if (this.configApp.apiGraphQL == undefined) {
      if (this.configApp.apiBaseUrl == "") {
        this.Token_url += window.location.hostname;
      } else {
        this.Token_url += this.configApp.apiBaseUrl;
      }
    } else //busco la variable
      if (this.configApp.apiGraphQL == "") {
        this.Token_url += window.location.hostname;
      } else {
        this.Token_url += this.configApp.apiGraphQL;
      }

    //si no esta definida uso la general
    if (this.configApp.apiGraphQLPuerto == undefined) {
      if (window.location.protocol == "http:") {

        if (this.configApp.apiBasePuerto && this.configApp.apiBasePuerto != "") {
          this.Token_url += ":" + this.configApp.apiBasePuerto;
        }
      } else {

        if (this.configApp.apiBasePuertoSsl && this.configApp.apiBasePuertoSsl != "") {
          this.Token_url += ":" + this.configApp.apiBasePuertoSsl;
        }
      }
    } else {   //SI EXISTE PUERTO
      if (window.location.protocol == "http:") {

        if (this.configApp.apiGraphQLPuerto && this.configApp.apiGraphQLPuerto != "") {
          this.Token_url += ":" + this.configApp.apiGraphQLPuerto;
        }
      } else {

        if (this.configApp.apiGraphQLPuertoSsl && this.configApp.apiGraphQLPuertoSsl != "") {
          this.Token_url += ":" + this.configApp.apiGraphQLPuertoSsl;
        }
      }
    }
    if (this.configApp.apiGraphQLSubDir && this.configApp.apiGraphQLSubDir != "") {
      this.Token_url += "/" + this.configApp.apiGraphQLSubDir;
    }

    this.Token_url += "/";
    //  this.Token_url = this.configApp.apiGraphQL;
    console.log("Token_url ",this.Token_url);
    
  }

  iniciarGraphql() {
    console.log('TOKEN', this.Token_url);
    this.apollo.removeClient('api_avalab');

    /*
     if(localStorage.getItem('ws_url_presupuesto')){
       this.url_grapqhl =localStorage.getItem('ws_url_presupuesto');
      
     }
     */
    console.log('entre if start grap',);

    this.apollo.create({
      cache: new InMemoryCache(),
      link: this.httpLink.create({
        uri: this.Token_url,
      }),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'ignore',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      }
    }, 'api_avalab')


  }

  test() {
    //this.apollo.removeClient('API_Prod');
    let gqltest = gql`
    {
    test{
     mensaje        
   } 
 }
`;

  return  this.apollo.use('api_avalab').query(
      {
        query: gqltest
      }
    )
    /*.toPromise().then((result: any) => {
      console.log('result', result);
      if (result.data.test.mensaje) {
        // this.toastservice.presentToast({ message: 'Coneccion graphql exitos', color: 'success', position: 'bottom' })
        console.log("SE CONECTO AL SERVIDOR GRAPHQL");

      }
    }, error => {
      if (error.message) {
        this.apollo.removeClient('API_test')
        this.toastservice.presentToast({ message: 'Ocurrio un error <br>' + error.message, color: 'warning', position: 'bottom' })
      }
      else {
        this.toastservice.presentToast({ message: 'Ocurrio un error <br>' + error, color: 'warning', position: 'bottom' })
      } console.log('error', error);
    })
    */
  }


}
