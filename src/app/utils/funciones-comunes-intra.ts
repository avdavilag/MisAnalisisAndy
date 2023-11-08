import { Injectable, SimpleChange } from "@angular/core";
import { EmailValidator } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController, LoadingController, ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { resolve } from "dns";
import { Observable, Observer } from "rxjs";
import { FirmaService } from "../servicios/firma/firma.service";
import { QueryService } from "../servicios/gql/query.service";
import { WebRestService } from "../servicios/intranet/web-rest.service";
import { PdfRenderService } from "../servicios/pdf/pdf-render.service";
import { VariablesGlobalesService } from "../servicios/variables/variables-globales.service";
import { AppConfigService } from "./app-config-service";
import { FuncionesComunes } from "./funciones-comunes";
import { Utilidades } from "./utilidades";

@Injectable({
    providedIn: 'root'
})
export class FuncionesComunesIntra {
    constructor(
        public alertController: AlertController,
        public toastController: ToastController,
        private configApp: AppConfigService,
        private serviciosFirma: FirmaService,
        public router: Router,
        public utilidades: Utilidades,
        public loadingController: LoadingController,
        public serviciosPDF: PdfRenderService,
        private varGlobal: VariablesGlobalesService,

        private queryservice: QueryService,
        private servicios: WebRestService,//INTRA
        public _translate: TranslateService) {
    }

    //EL PDF INTRA REALIZA EL METODO CASI SIMILAR
    async enviarMailIntra(usuarioSesion, orden, versionamiento, mail) {
        let word_complex;
        let word_simple;
        let valores_enviar;
        let respuesta;
        //LO DE i18n
        this._translate.get('complex').subscribe((res: string) => {
            word_complex = res;
        });
        this._translate.get('simple').subscribe((res: string) => {
            word_simple = res;
        });

        //Creo la alerta
        const alert = await this.alertController.create({
            cssClass: 'alert-mail',
            header: word_complex.alert_enviar_titulo,
            inputs: [
                {
                    type: "email",
                    name: 'email',
                    value: mail,
                    placeholder: 'example@example.com'
                }

            ],
            buttons: [
                {
                    text: word_simple.Cancelar,
                    role: 'cancel',
                    cssClass: 'cancel-button-alert',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: word_simple.Enviar,
                    cssClass: 'principal-button-alert',
                    handler: (data) => {
                        if (this.utilidades.isEmail(data.email)) {
                            this.presentLoading();
                            //CODIGO DE ENVIO
                            this.renderizaPDFOrden(orden, versionamiento).then(async (pdf) => {
                                let pdf64Send = await this.utilidades.arrayBufferToBase64(pdf);
                                //ACTUALIZO SELECCIONADOS
                                //  await this.enviarSeleccionados("Email", "MA", "Enviado para " + data.email).then(async () => {
                                //CODIGO DE ENVIO
                                valores_enviar = {
                                    "orden": orden,
                                    "email": data.email,
                                    "file": pdf64Send,
                                    "server": 1
                                }

                                console.log(valores_enviar);
                                this.servicios.sendPDFIntra(valores_enviar).subscribe(async (resp) => {
                                    console.log(resp);

                                    respuesta = resp;
                                    if (respuesta.response) {
                                        console.log(respuesta.response.code);
                                        if (respuesta.response.code != 1) {
                                            this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor intente nuevamente o contacte con soporte.\n<br><small>Codigo error web service: SendPDF/" + respuesta.response.code + "<small>")
                                        }
                                        if (respuesta.response.description) {
                                            this.utilidades.mostrarToast(respuesta.response.description)
                                            //AUDITORIA
                                            this.enviaAuditoria(usuarioSesion, orden, "PRINT", "Enviado para " + data.email)

                                            this.mostrarToast("Proceso realizado correctamente");
                                            this.loadingController.dismiss();
                                        }
                                    }
                                    else {
                                        this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema en ENVIO</b></h2></br>Favor intente nuevamente o contacte con soporte.\n<br><small>NO RESPONSE<small>")
                                    }

                                }, error => {
                                    setTimeout(() => {
                                        this.loadingController.dismiss();
                                    }, 500);

                                    console.error(error);
                                    let nombre_error = "sendPDF"
                                    this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

                                });
                            })
                        } else {
                            this.mostrarToast("Ingrese un correo valido")
                        }

                    }
                }

            ]
        });

        await alert.present();
    }


    //AUDITORIA
    enviaAuditoria(usuario, orden, accion, detalle) {
        let que = "";
        if (accion == "Impreso") {
            que = "PRINT"
        } else if (accion == "Descarga") {
            que = "PRINT"
        } else if (accion == "Email") {
            que = "MAIL"
        } else if (accion == "WhatsApp") {
            que = "WHATSAPP"
        } else {
            que = accion
        }

        let donde = "Navegador: " + this.utilidades.getNavegador() + "; IP: " + this.varGlobal.getIPBrowser();
        let modify = "'" + usuario + "' as who_log, '" + que + "' as what_log, '" + donde + "' as where_log,'" + detalle + "' as why_log";
        console.log("MODIFY", modify);
        var formData: any = new FormData();
        formData.append("orden", orden);
        formData.append("modify", modify);
        console.log(formData);
        let respuesta;
        this.servicios.setAuditoria(formData).subscribe((resp) => {
            console.log(resp);
            respuesta = resp;
            if (respuesta && respuesta.response) {
                if (respuesta.response.code != 1) {
                    this.presentAlert("Tuvimos un problema auditoria", "Problema al cargar datos: " + respuesta.response.description + ", intente nuevamente");
                } else {
                    console.log("AUDITORIA OK")
                }
            }
            else {
                this.presentAlert("Tuvimos un problema auditoria", "Problema al cargar datos (sin response)");
            }
        }, error => {
            let nombre_error = "envia-auditoria"
            this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

        })

    }

    //EL DE PDF INTRA VA A SEGUIR HACIENDO ESTO EN SU PROPIO COMPONENTE
    async renderizaPDFOrden(orden, versionamiento, formato = "") {
        return new Promise<ArrayBuffer>(async (resolve, reject) => {
            try {
                await this.cargoOrdenOriginal(orden).then(async (datos_orden) => {
                    await this.cargaTodosParametrosOrden(orden).then(async (parametros) => {
                        await this.getFirmasGraphsUser(datos_orden).then(async (firmas: any[]) => {//CAMBIO POR EL OTRO
                            await this.cargarDatosAdjuntos(orden).then(async (adjuntos) => {
                                //CARGO LOS DATOS DE LA FIRMA
                                await this.getImagesAnalisis(orden).then(async (imagenes: any[]) => {
                                    if (this.configApp.activaFirma) {
                                        this.getFirmaElecUser(datos_orden).then((firmae) => {
                                            this.cargarPDF(versionamiento, datos_orden, parametros, adjuntos, formato, firmas, imagenes, firmae).then(async (pdf) => {
                                                resolve(pdf)
                                            }, error => {
                                                console.error(error);
                                                //  console.log(error.message);
                                                this.utilidades.alertErrorService("carga-pdf", "REVISE CONSOLA: " + error.message)
                                            })
                                        }, error => {
                                            console.error('firma electronica' + error);

                                        })
                                    } else {
                                        this.cargarPDF(versionamiento, datos_orden, parametros, adjuntos, formato, firmas, imagenes).then(async (pdf) => {
                                            resolve(pdf)
                                        }, error => {
                                            console.error(error);
                                            //  console.log(error.message);
                                            this.utilidades.alertErrorService("carga-pdf", "REVISE CONSOLA: " + error.message)
                                        })
                                    }
                                }, error => {
                                    console.error(error);
                                    this.utilidades.alertErrorService("datos-imagenes-analisis", "REVISE CONSOLA: " + error.message)
                                })

                            }, error => {
                                console.error(error);
                                //  console.log(error.message);
                                this.utilidades.alertErrorService("datos-adjuntos", "REVISE CONSOLA: " + error.message)
                            })
                        }, error => {
                            console.error(error);
                            this.utilidades.alertErrorService("firmas-graph", "REVISE CONSOLA: " + error.message)
                        })
                    }, error => {
                        console.error(error);
                        //  console.log(error.message);
                        this.utilidades.alertErrorService("get-all-parametros-orden", "REVISE CONSOLA: " + error.message)
                    })
                }, error => {
                    console.error(error);
                    //  console.log(error.message);
                    this.utilidades.alertErrorService("datos-orden", "REVISE CONSOLA: " + error.message)
                })
            } catch (error) {
                console.log(error);
                reject("ERROR AL CARGAR LOS DATOS")
            }
        })

    }
    //firmas de los validadores
    async getFirmasGraphsUser(orden_original) {
        let activa_firma_list = this.configApp.activaFirmaList
        //saco los usuarios q validan la orden
        // this.loadingFirma()
        return new Promise(async (resolve) => {
            if (activa_firma_list) {//ESTO ACTIVA SOLO PARA INTRANET
                let usuarios = [...new Set(orden_original.map(item => item.usuario_validacion_peticion))];
                console.log("USUARIOS VALIDADORES", usuarios);
                let data = { users: usuarios.toString() }
                await this.queryservice.getGraphUsers(data).then(async (result: any) => {
                    console.log("las firmas de los usuarios", result);//encode_file
                    if (result && result.data && result.data.getGraphUsers && result.data.getGraphUsers != null) {

                        resolve(result.data.getGraphUsers)

                    } else {
                        resolve([])
                    }
                })

            } else {
                resolve([])
            }

        })


    }


    //IMAGENES ANALISIS
    async getImagesAnalisis(orden) {
        console.log("ENTRO A PROBAR IMAGNES");

        let activa_imagenes_analisis = this.configApp.activaImagenesAnalisis
        //saco los usuarios q validan la orden
        // this.loadingFirma()
        return new Promise(async (resolve) => {
            if (activa_imagenes_analisis) {//ESTO ACTIVA SOLO PARA INTRANET
                // let analisis = [...new Set(this.orden_original.map(item => item.codigo_analisis))];

                let data = { nro_ord: orden }
                await this.queryservice.getImagesAdjunto(data).then(async (result: any) => {
                    console.log("las imagenes de la orden", result);//encode_file
                    if (result && result.data && result.data.getImagesAdjunto && result.data.getImagesAdjunto != null) {
                        resolve(result.data.getImagesAdjunto);

                    } else
                        resolve([])
                })

            } else {
                resolve([])
            }

        })

    }

    //nueva forma FIRMA
    async getFirmaElecUser(orden_original) {
        //this.dataOrden.cod_med = this.varGlobal.getVarUsuario()
        //this.presentLoading();

        return new Promise(async (resolve) => {
            let firma = {
                firma_archivo: null,
                firma_codigo: null
            };
            if (orden_original) {

                //cojo el ultimo usuario
                let usuario_peticion = orden_original[orden_original.length - 1].usuario_validacion_peticion

                let data = { usuario: usuario_peticion }
                console.log("data FIRMA", data);


                await this.queryservice.getArchivoFirma(data).then(async (result: any) => {
                    console.log('DATA FIRMA', result);
                    if (result && result.data && result.data.getArchivoFirma && result.data.getArchivoFirma != null) {
                        firma.firma_codigo = result.data.getArchivoFirma.codigo;
                        //ESTA CODIFICADO
                        firma.firma_archivo = result.data.getArchivoFirma.encode_file;
                        if (firma.firma_archivo == null)
                            // this.presentAlert("SIN FIRMA", "EL USUARIO QUE FIRMA ESTA ORDEN '" + usuario_peticion + "' NO CONTIENE FIRMA ELECTRONICA")
                            console.error("NO CONTIENE FIRMA ELECTRONICA");
                        resolve("")
                    } else {
                        if (result.errors && result.errors.length > 0) {
                            this.utilidades.mostrarToast(result.errors[0].message)
                        } else {
                            this.utilidades.mostrarToast("OCURRIO UN PROBLEMA AL CARGAR FIRMA")
                        }
                        resolve("")
                    }


                })

            } else {
                resolve("")
            }

        })

    }
    async cargoOrdenOriginal(orden) {
        let formData: any = new FormData();
        formData.append("orden", orden);
        return new Promise<any>(async (resolve, reject) => {
            await this.servicios.getOrdenOriginalIntra(formData).toPromise().then(async (datos_orden) => {

                resolve(datos_orden)


            });
        })

    }

    //PARAMETROS POR ORDEN
    async cargaTodosParametrosOrden(orden) {
        let formData: any = new FormData();
        formData.append("orden", orden);
        let respuesta;
        let parametros = [];
        return new Promise<any>(async (resolve, reject) => {

            await this.servicios.getAllResourceParametroOrden(formData).toPromise().then(async (resp) => {
                console.log(resp);
                respuesta = resp;
                if (respuesta && respuesta.response) {
                    if (respuesta.response.code == 1) {
                        if (respuesta.response.parameters && respuesta.response.parameters.length != 0) {
                            for (const parametro of respuesta.response.parameters) {
                                if (parametro && parametro != null && parametro.code) {
                                    await parametros.push({ "nombre": parametro.code, "valor": parametro.data })
                                    if (parametro.code == "advice_pac" && parametro.data && parametro.data != "") //ALERTA USUARIO
                                        this.presentAlert("ALERTA", parametro.data)
                                } else {
                                    console.error("LLEGO NULL", resp)
                                    this.utilidades.mostrarToastError("LLEGO PARAMETRO NULL")
                                }

                            }

                            resolve(parametros)
                        }
                    } else
                        this.mostrarToast("Error al cargar parametros desc: " + respuesta.response.description)
                    reject("Error al cargar parametros desc: " + respuesta.response.description)
                } else {
                    this.mostrarToast("Error al cargar parametros no existe response")
                    reject("Error al cargar parametros no existe response")
                }
            }, error => {


                let nombre_error = "get-all-parametros-orden"
                this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")

                reject()
            })
            console.log("PARAMETROS PDF", parametros);

        })
    }

    async cargarDatosAdjuntos(orden) {
        return new Promise<any>(async (resolve, reject) => {
            var formData: any = new FormData();
            formData.append("orden", orden);
            //formData.append("orden", this.orden.id_orden);
            let datosAdjuntos
            await this.servicios.getAttachmentPDF(formData).toPromise().then(async (resp) => {
                console.log(resp);
                datosAdjuntos = resp;
                if (datosAdjuntos.response.code > 0 && datosAdjuntos.response.files != null) {
                    resolve(datosAdjuntos.response.files)
                } else {
                    resolve("")
                }
            }, error => {
                console.error(error);
                let nombre_error = "datos-adjuntos"
                this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
                reject()
                //  this.loadingController.dismiss()
            });
        })
    }

    async cargarPDF(versionamiento, datos, parametros, adjuntos, formato = "", firmas = [], imagenes = [], firmaElectronica = null): Promise<ArrayBuffer> {
        let pdfArrayBuffer;
        let orden = await this.validarOrdenOriginal(datos, firmas, imagenes);
        let valores_enviar = {
            "nombreLab": "",
            "firma": "",
            "formato": formato,
            "qr": "",
            "qr2": "",
            "adjuntos": adjuntos,
            "orden": orden,
            "parametros": parametros,
            "versionamiento": versionamiento
            // "orden": orden
        }
        console.log("envio al pdf", valores_enviar);
        return new Promise<ArrayBuffer>(async (resolve, reject) => {
            if (orden && orden != null) {
                await this.serviciosPDF.getPDFIntra(valores_enviar).toPromise().then(async (resp) => {
                    console.log("EL PDF", resp);
                    //this.pdf64 = resp// this.base64ToArrayBuffer(respuesta.data);
                    pdfArrayBuffer = resp
                    //SI EXISTE LO INTENTO FIRMAR
                    if (firmaElectronica && firmaElectronica != null) {
                        let archivoFirma = {
                            bytePDF: await this.utilidades.arrayBufferToBase64(pdfArrayBuffer),
                            byteFirma: firmaElectronica.firma_archivo,
                            codigo: firmaElectronica.firma_codigo,
                            formato: formato
                        }
                        await this.serviciosFirma.getPDFsign(archivoFirma).toPromise().then(async (firmado) => {
                            console.log("firmado", firmado);

                            resolve(firmado)

                        });
                    } else {
                        resolve(pdfArrayBuffer)

                    }
                }, error => {
                    let nombre_error = "pdf-intra"
                    this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></br>Favor contacte con soporte.\n<br><small>Codigo error: " + nombre_error + "/" + error.status + "<small>")
                    console.log(error);

                    return null
                });


            } else {
                //this.presentAlert('','')
                this.presentAlert('No se genero el pdf', 'No existe informacion de examenes para la orden solicitada');
                // let nombre_error=""
                //this.presentAlert("", "<ion-icon name='alert-circle' size='large'></ion-icon><h2><b>Oops! Tuvimos un problema</b></h2></h1></br>Favor contacte con soporte.\n<br><small>Codigo error: "+nombre_error+"<small>")
                return null;
            }
        })
    }


    async validarOrdenOriginal(datos, firmas, imagenes) {
        let ordenModificada = await JSON.parse(JSON.stringify(datos));

        let web_analisis;
        let listo_web;
        //añado este nodo por que se elimino
        console.log("LAS FIRMAS", firmas);//ESTE LLEGA VACIO SI NO ESTA ACTIVADO
        console.log("LAS IMAGENES", imagenes);//ESTE LLEGA VACIO SI NO ESTA ACTIVADO
        let imagenesAnalisis;//EL FILTRO POR UN ANALISIS 

        for (let i = 0; i < ordenModificada.length; i++) {
            //voy a buscar las firmas de cada usuario cuando cambie pero tengo q ponerle al ultimo 
            //selecciono el primero
            ordenModificada[i].FIRMAUSUARIO = ""
            if (firmas && firmas.length > 0) {
                if (i != ordenModificada.length - 1 && ordenModificada[i].codigo_tipo_analisis != ordenModificada[i + 1].codigo_tipo_analisis) {
                    ordenModificada[i].FIRMAUSUARIO = firmas.filter(e => e.usuario == ordenModificada[i].usuario_validacion_peticion)[0].encode_file
                }

                if (i == ordenModificada.length - 1) {
                    ordenModificada[i].FIRMAUSUARIO = firmas.filter(e => e.usuario == ordenModificada[i].usuario_validacion_peticion)[0].encode_file
                }

            }
            ordenModificada[i].IMAGEANALISIS = null
            if (imagenes && imagenes.length > 0) {
                //   ordenModificada[i].IMAGEANALISIS = ""
                imagenesAnalisis = imagenes.filter(e => e.cod_ana == ordenModificada[i].codigo_analisis);
                console.log("IMAGENES", JSON.stringify(imagenesAnalisis));

                if (i != ordenModificada.length - 1 && ordenModificada[i].codigo_analisis != ordenModificada[i + 1].codigo_analisis) {
                    ordenModificada[i].IMAGEANALISIS = JSON.stringify(imagenesAnalisis);

                }
                if (i == ordenModificada.length - 1) {
                    ordenModificada[i].IMAGEANALISIS = JSON.stringify(imagenesAnalisis);
                }
            }


            ordenModificada[i] = { "ava_misanalisis_report": ordenModificada[i] };

            web_analisis = ordenModificada[i].ava_misanalisis_report.web_analisis;
            listo_web = ordenModificada[i].ava_misanalisis_report.listo_web; //la variable listo ya le pone en proceso
            // console.log(web_analisis);
            if (web_analisis == 1) {
                console.log("MODIFICO EL ANALISIS", ordenModificada[i]);
                //this.presentAlert("", this.configApp.messageWebAnalisis);
                ordenModificada[i].ava_misanalisis_report.resultado = this.configApp.messageWebAnalisis
                ordenModificada[i].ava_misanalisis_report.unidad_resultado = ""
                ordenModificada[i].ava_misanalisis_report.vdr_resultado = ""
                ordenModificada[i].ava_misanalisis_report.obs_resultado = ""
            } else if (listo_web != undefined && listo_web === 0) {
                console.log("MODIFICO EL ANALISIS", ordenModificada[i]);
                //this.presentAlert("", this.configApp.messageWebAnalisis);
                ordenModificada[i].ava_misanalisis_report.resultado = this.configApp.messageWebAnalisisStsWeb
                ordenModificada[i].ava_misanalisis_report.unidad_resultado = ""
                ordenModificada[i].ava_misanalisis_report.vdr_resultado = ""
                ordenModificada[i].ava_misanalisis_report.obs_resultado = ""
            }

        }
        console.log(ordenModificada);
        return ordenModificada;

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
                    cssClass: 'principal-button-alert',
                    handler: () => {
                        console.log('Confirm Okay');
                        //   this.router.navigate([this.redireccion_principal])
                    }
                }
            ]
        });

        await alert.present();
    }


    async mostrarToast(mensaje) {
        const toast = await this.toastController.create({
            message: mensaje,
            duration: 4000
        });
        toast.present();
    }

    async presentLoading() {
        let mensaje = "";

        this._translate.get('simple.Cargando').subscribe((res: string) => {
            mensaje = res;
        });

        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: mensaje + '...',
            duration: 15000
        });
        await loading.present();

        const { role, data } = await loading.onDidDismiss();
        console.log('Loading dismissed!');
    }
}