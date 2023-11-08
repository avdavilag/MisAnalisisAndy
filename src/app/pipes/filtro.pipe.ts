import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {
//filtro para listado de unidades
  arregloin:any=[];
  transform(data: any [], texto: string): any [] {
    if(texto.length=== 0) {return data}
    console.log('datapipe',data);
    console.log('texto',texto);
    
    //texto=texto.toLowerCase();

    return data.filter(data=>{
      console.log(data,'filtro');
      if(data.des_uni){
        return data.des_uni.includes(texto.toLowerCase) || data.des_uni.includes(texto.toUpperCase()); 
      }

      if(data.des_ana){
        if(data.des_ana.includes(texto.toLowerCase) || data.des_ana.includes(texto.toUpperCase())){
      //    data.color="secondary"
        }
          return data.des_ana.includes(texto.toLowerCase) || data.des_ana.includes(texto.toUpperCase()); 
       
      }
    })
    //return null;
  }

}
