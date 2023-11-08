import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }


  fechaFormato(fecha,hora) {

    console.log(fecha);
    if (fecha != null || fecha != '') {
      let f = new Date(fecha);
      if (!f.toLocaleTimeString()) {
        console.log('no existe hora');
      }

      console.log('dia', f.getDate());
      console.log('hora', f.toLocaleTimeString());
      console.log('hora', f.toLocaleTimeString().replace(':', ' '));
      // let hora=f.toLocaleTimeString().replace(':', ' ');
      // hora=hora.replace(':', ' ');
       
      let mes: string = '' + (f.getMonth() + 1);
      let dia: string = '' + (f.getDate());
      if ((f.getMonth() + 1) < 10) { mes = '0' + mes }
      if ((f.getDate() + 1) < 10) { dia = '0' + dia }

      if(hora){
        return f.getFullYear() + '-' + mes + '-' + dia + ' ' + hora;
      }
else{ return f.getFullYear() + '-' + mes + '-' + dia + ' ' + f.toLocaleTimeString();}
     
    } else {
      return null
    }


  }



  soloFecha(fecha) {
    console.log('fecha...', fecha);

    if (fecha != null || fecha != '') {
      let f = new Date(fecha);

      //console.log('fecha creada',f);


      let mes: string = '' + (f.getMonth() + 1);
      let dia: string = '' + (f.getDate());
      if ((f.getMonth() + 1) < 10) { mes = '0' + mes }
      if ((f.getDate()) < 10) { dia = '0' + dia }
      return f.getFullYear() + '-' + mes + '-' + dia;
    } else {
      return null
    }
  }

  soloFechaaddDay(fecha) {
    console.log('fecha...', fecha);

    if (fecha != null || fecha != '') {
      let f = new Date(fecha);
      f.setDate(f.getDate() + 2);

      let final=this.formatDate(f);
      return final
     // let mes: string = '' + (f.getMonth() + 1);
/*
      f.setDate(f.getDate() + 2);
      let dia: string = '' + (f.getDate());
      if ((f.getMonth() + 1) < 10) { mes = '0' + mes }
      if ((f.getDate()) < 10) { dia = '0' + dia }

      console.log("fecha_helper",f);
      */
     // return f.getFullYear() + '-' + mes + '-' + (dia);
    } else {
      return null
    }
  }

   padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }


   formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') 
      /*+
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')*/
    );
  }

  //redondear numeros
  toFixed(num, precision) {
    return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
  }

  //caracter to unicode

  toUnicode(theString) {
    var unicodeString = '';
    for (var i = 0; i < theString.length; i++) {
      var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
      while (theUnicode.length < 4) {
        theUnicode = '0' + theUnicode;
      }
      theUnicode = '\\u' + theUnicode;
      unicodeString += theUnicode;
    }
    return unicodeString;
  }

  calcDemora(demora, dias: string) {
    console.log("demora",demora);
    console.log("dias",dias);
    
    if (demora == 0) {
      return new Date()
    }

    let diasarray;
    let cont = 0;
    let flag = true
    diasarray = dias.split(" ");
    let fecha = new Date();
    let diasnum = [];
    for (let i = 0; i < diasarray.length; i++) {

      switch (diasarray[i]) {
        case "Lun":
          diasnum.push(1);
          break;
        case "Mar":
          diasnum.push(2);
          break;
        case "Mier":
          diasnum.push(3);
          break;
        case "Jue":
          diasnum.push(4);
          break;
        case "Vie":
          diasnum.push(5);
          break;
        case "Sab":
          diasnum.push(6);
          break;
        case "Dom":
          diasnum.push(7);
          break;
      }
    }
    while (flag) {
      fecha.setDate(fecha.getDate() + 1);
      if (diasnum.includes(fecha.getDay())) {
        cont++
      }

      if (cont == demora || cont >= demora) {
        flag = false
      }

        console.log('fecha.getDay()',fecha.getDay());

    }
    console.log('fechaaa', fecha);

    return fecha;


  }

  getJustIp(url) {
    console.log('url', url);
    let data;

    let protocolo = "";
    let puerto = "";
    let ip = "";
    let directory = "";


    if (url.includes('https://')) {
      data = url.split('https://');
      //   console.log('valor',new_ip);
      protocolo = "https://"
    } else if (url.includes('http://')) {
      data = url.split('http://');
      protocolo = "http://"
      //  console.log('valor',new_ip);
    } else {
      return null
    }

    //    new_ip=data[1];
    //  valor=url.split(':');
    console.log('new_ip', data);
    if (data[1].includes(':')) {
      data = data[1].split(':');
      ip = data[0]
    } else {

      if (data[1].includes('/')) {
        data = data[1].split('/');
        ip = data[0]
        directory = data[1]
      }
    }
    console.log('new_ip2', data);
    if (data[1].includes('/')) {
      data = data[1].split('/');
      puerto = data[0];
      directory = data[1];
    } else {
      puerto = data[1]
    }
    console.log('new_ip2', data);

    console.log(ip);
    console.log(protocolo);
    console.log(puerto);
    console.log(directory);

    return { ip: ip, protocolo: protocolo, puerto: puerto, directory: directory }
  }

  checkUrl(url) {
    var patronIp = new RegExp("^([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})$");

  }


  checkFecha(tiempo){
    let fecha_final =new Date();
    console.log('fecha_final',fecha_final);
   
    let fecha_i= new Date();
    fecha_i.setMinutes((fecha_final.getMinutes()-(tiempo*60)));
console.log('fecha_i',fecha_i);
    

return{fecha_i:this.fechaFormato(fecha_i,null),fecha_h:this.fechaFormato(fecha_final,null)}
    //return {fecha_i:fecha_i.toLocaleDateString()+" "+fecha_i.toLocaleTimeString(),fecha_h:fecha_final.toLocaleDateString()+" "+fecha_final.toLocaleTimeString()}
    


  }
}
