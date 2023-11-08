import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
  })
  //ESTO LLAMA AL ARCHIVO DE CONFIGURACION
  export class AppConnectionsService {
  
    private appConfig: any;
  
    constructor(private http: HttpClient) { }
  
    loadAppConfig() {
      let file="configuration/config.json"
      //USO UNO DIFERENTE EN DESARROLLO
      if (!environment.production) {   
          file="configuration/config_des.json"
      }
      
      return this.http.get(file)
        .toPromise()
        .then(data => {
          this.appConfig = data;
        });
    }

    get apiBaseUrl() {

        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiBaseUrl;
      }

      get apiBasePuerto() {
  
        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiBasePuerto;
      }

      get apiBasePuertoSsl() {
  
        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiBasePuertoSsl;
      }

      get apiBaseHttps() {
  
        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiBaseHttps;
      }

      get apiBaseSubDir() {
  
        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiBaseSubDir;
      }

      get apiPdfMailUrl() {

        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiPdfMailUrl;
      }

      get apiPdfMailPuerto() {
  
        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiPdfMailPuerto;
      }

      get apiPdfMailPuertoSsl() {
  
        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiPdfMailPuertoSsl;
      }

      get apiPdfMailSubDir() {
  
        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiPdfMailSubDir;
      }

      get apiIntranetUrl() {

        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiIntranet;
      }

      get apiIntranetPuerto() {
  
        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiIntranetPuerto;
      }

      get apiIntranetPuertoSsl() {
  
        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiIntranetPuertoSsl;
      }

      get apiIntranetSubDir() {
        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
        return this.appConfig.apiIntranetSubDir;
      }

      get apiMongoUrl() {

        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiMongo;
      }

      get apiMongoPuerto() {
  
        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiMongoPuerto;
      }

      get apiMongoPuertoSsl() {
  
        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
    
        return this.appConfig.apiMongoPuertoSsl;
      }

      get apiMongoSubDir() {
        if (!this.appConfig) {
          throw Error('Config file not loaded!');
        }
        return this.appConfig.apiMongoSubDir;
      }
      get apiGraphQL(){
        if (!this.appConfig) {
            throw Error('Config file not loaded!');
          } 
          return this.appConfig.apiGraphQL;
      }
      get apiGraphQLPuerto(){
        if (!this.appConfig) {
            throw Error('Config file not loaded!');
          } 
          return this.appConfig.apiGraphQLPuerto;
      }
      get apiGraphQLPuertoSsl(){
        if (!this.appConfig) {
            throw Error('Config file not loaded!');
          } 
          return this.appConfig.apiGraphQLPuertoSsl;
      }
      get apiGraphQLSubDir(){
        if (!this.appConfig) {
            throw Error('Config file not loaded!');
          } 
          return this.appConfig.apiGraphQLSubDir;
      }
      
      get apiFirma(){
        if (!this.appConfig) {
            throw Error('Config file not loaded!');
          } 
          return this.appConfig.apiFirma;
      }
      get apiFirmaPuerto(){
        if (!this.appConfig) {
            throw Error('Config file not loaded!');
          } 
          return this.appConfig.apiFirmaPuerto;
      }
      get apiFirmaPuertoSsl(){
        if (!this.appConfig) {
            throw Error('Config file not loaded!');
          } 
          return this.appConfig.apiFirmaPuertoSsl;
      }
      get apiFirmaSubDir(){
        if (!this.appConfig) {
            throw Error('Config file not loaded!');
          } 
          return this.appConfig.apiFirmaSubDir;
      }
}