import { Injectable } from '@angular/core';

import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(
    private apollo: Apollo
  ) {

  }

  Testgql() {

    let gqltest = gql`
        {
        test{
         mensaje        
       } 
     }
       
`;
    let result: any = this.apollo.use('api_avalab').query({
      query: gqltest,

    }).toPromise();
    console.log(result);
    return result;

  }



  getListOrigen() {
    let gqlListOrigen = gql`
        {
        ListOrigen{
          des_ori,
          cod_ori,
          ubicaciones{
            nombre_ubicacion
            id_ubicacion
          }   
          hora_ori
       } 
     }
       
`;
    let result: any = this.apollo.use('api_avalab').query({
      query: gqlListOrigen
    }).toPromise();
    console.log(result);
    return result;
  }

  getListOrdenByCodOri(cod_ori) {
    let getOrden = gql`
    query ListOrdenCompleto($cod_ori: String!) {
         ListOrdenCompleto(cod_ori:$cod_ori)  {
         cod_pac
         nro_ord
         sts_ord
         fec_ord
         val_ord
         cod_pac
         des_sts
         det_sts
         paciente{
           
           nombre_completo
           fec_nac
         }
       }}
     
     `;
    let result =
      this.apollo.use('api_avalab').query({
        query: getOrden,
        variables: {
          cod_ori: cod_ori
        }
      }).toPromise();
    return result;
  }

  getListEstatus() {
    let ListEstatus = gql`
    {
      ListEstatus{
        des_sts
        cod_sts
        det_sts
      }
    }`;
    let result = this.apollo.use('api_avalab').query({
      query: ListEstatus
    }).toPromise()

    return result;

  }

  //-------------------------------------------------------- Querys Filtros-----------------//
  getOrdenByOrd(nroOrd) {
    let gqlSearch = gql`
    query OrdenByOrd($nroOrd: Int!) {
      OrdenByOrd(nroOrd:$nroOrd)  {
        nro_ord
        cod_ori
        fec_ini
        fec_upd
        cod_med
        cod_pac
        pre_ord
        dcto_ord
        val_ord
        fec_ord
        sts_ord
        des_sts
        sts_adm
        dcto_val
        stat_ord
        cod_ref
        txt_ord
        id_plan
        cod_suc
        fec_ent
        tip_ord
        fac_ter
        cod_uni
        lock_ord
        ca1_ord 
        ca2_ord 
        last_user 
        first_user 
        cod_emp 
        cod_pac2 
        pwd_ord 
        exp_ord 
        pet_adi 
        FEC_ENT2 
        nro_ext 
        mst_ext 
        obs_ext 
        tip_ped 
        cod_ped 
        des_ped 
        iess_tseg 
        iess_dx 
        iess_tben 
        iess_tder 
        iess_nder 
        iess_tcon 
        iess_dx2 
        iess_id 
        nro_aux 
        iess_dep 
        mail_ent 
        mail_ent_det 
        dicta_ent 
        dicta_ent_det 
        envio_ent 
        envio_ent_det 
        cod_med2 
        copia_ent 
        pedido_ent 
        exclusive_ent 
        grupo_ord 
         paciente{
           id_pac
           nombre_completo
           fec_nac
         }
       }}
     
     `;

    let result = this.apollo.use('api_avalab').query({
      query: gqlSearch,
      variables: {
        nroOrd: nroOrd,
      }
    }).toPromise();

    return result;
  }

  getOrdenByNum(ordenD, ordenH) {
    let gqlSearch = gql`
    query OrdenByNum($nroD: Int!, $nroH: Int!) {
      OrdenByNum(nroD:$nroD,nroH:$nroH)  {
         cod_pac
         nro_ord
         sts_ord
         fec_ord
         val_ord
         cod_pac
         des_sts
         det_sts
         paciente{
           
           nombre_completo
           fec_nac
         }
       }}
     
     `;

    let result = this.apollo.use('api_avalab').query({
      query: gqlSearch,
      variables: {
        nroD: ordenD,
        nroH: ordenH
      }
    }).toPromise();

    return result;
  }

  getOrdenByFecha(fechaD, fechaH) {
    let gqlSearch = gql`
    query OrdenByFecha($fechaD: String!, $fechaH: String!) {
      OrdenByFecha(fechaD:$fechaD,fechaH:$fechaH)  {
         cod_pac
         nro_ord
         sts_ord
         fec_ord
         val_ord
         cod_pac
         des_sts
         det_sts
         paciente{
          id_pac
           nombre_completo
           fec_nac
         }
       }}
     
     `;
    let result =
      this.apollo.use('api_avalab').query({
        query: gqlSearch,
        variables: {
          fechaD: fechaD,
          fechaH: fechaH
        }
      }).toPromise();

    return result;
  }

  getOrdenByMed(cod_med, nom_med) {
    let gqlSearch = gql`
    query OrdenByMed($cod_med: String!, $nom_med: String!) {
      OrdenByMed(cod_med:$cod_med,nom_med:$nom_med)  {
         cod_pac
         nro_ord
         sts_ord
         fec_ord
         val_ord
         cod_pac
         des_sts
         det_sts
         paciente{
           
           nombre_completo
           fec_nac
         }
       }}
     
     `;
    let result =
      this.apollo.use('api_avalab').query({
        query: gqlSearch,
        variables: {
          cod_med: cod_med,
          nom_med: nom_med
        }
      }).toPromise();

    return result;
  }

  getOrdenByPac(cod_pac, nom_pac, ape_pac) {
    let gqlSearch = gql`
    query OrdenByPac($cod_pac: String!,$nom_pac: String!,$ape_pac: String!) {
      OrdenByPac(cod_pac:$cod_pac,nom_pac:$nom_pac,ape_pac:$ape_pac)  {
         cod_pac
         nro_ord
         sts_ord
         fec_ord
         val_ord
         cod_pac
         des_sts
         det_sts
         paciente{
           
           nombre_completo
           fec_nac
         }
       }}
     
     `;

    let result =
      this.apollo.use('api_avalab').query({
        query: gqlSearch,
        variables: {
          cod_pac: cod_pac,
          nom_pac: nom_pac,
          ape_pac: ape_pac
        }
      }).toPromise()

    return result;

  }

  getOrdenByEstatus(cod_sts) {
    let gqlquery = gql`
    query OrdenByEstatus($cod_sts:String!){
      OrdenByEstatus(cod_sts:$cod_sts){
        cod_pac
       nro_ord
       sts_ord
       fec_ord
       val_ord
       cod_pac
       des_sts
       det_sts
       paciente{
         
         nombre_completo
         fec_nac
       }
      }
    }`;

    let result = this.apollo.use('api_avalab').query({
      query: gqlquery,
      variables: {
        cod_sts: cod_sts
      }
    }).toPromise();

    return result

  }

  getUnidadByCod(data) {

    let query = gql`
query  getUnidadbyCod($cod_uni:Int!){
  getUnidadbyCod(cod_uni:$cod_uni){
      cod_uni
      des_uni
      lock_uni
    }
  }`;

    let result = this.apollo.use('api_avalab').query({
      query: query,
      variables: {
        cod_uni: data
      }
    }).toPromise();
    return result;
  }
  //-------------------------------------------------------- Fin Querys Filtros-----------------//

  //---------------------------------------------------------querys para la orden---------------------//
  gqltest = gql`
query test($jsonText:String!){
  test(jsonText:$jsonText){
    resultado
  }
}
`;


  getListSeguro() {
    let query = gql`
  {
    ListSeguro{
      cod_seg
      des_seg
      lock_seg
      Plan{
        cod_lpr
        cod_seg
        id_plan
        des_plan
        lock_plan
        fac_plan
        por_seg
      }
    }
  }`;

    let result = this.apollo.use('api_avalab').query({
      query: query,
    }).toPromise();
    return result;

  }

  getPlanxIdplan(data) {
    let query = gql`
    query  PlanxIdplan($id_plan:String!){
      PlanxIdplan(id_plan:$id_plan){
        cod_lpr
        cod_seg
        id_plan
        des_plan
        lock_plan
        fac_plan
        por_seg
      }    
    }`;

    let result = this.apollo.use('api_avalab').query({
      query: query,
      variables: data
    }).toPromise();
    return result;

  }

  getListReferencia() {
    let query = gql`
  {
    ListReferencia{
      cod_ref
      des_ref
      lock_ref
      
    }
  }`;

    let result = this.apollo.use('api_avalab').query({
      query: query,
    }).toPromise();
    return result;

  }
  
  insertPacienteComplete(data) {
    let gqldata = gql`
  mutation insertPacienteComplete(
      $json_pac:String,
     ) {
      insertPacienteComplete(
        json_pac:$json_pac,
   ) {
      mensaje
      resultado
      data
    }
}`;
    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: {
          json_pac: data,
        }
      }).toPromise();

    return result;
  }

////////////////////ANDERSON INGRESO DE DOCTOR/////// /////////////////////////////////////
insertMedicoComplete(data) {
  console.log('Data Ionic: ',data);
  let gqldata = gql`
  mutation insertMedicoLite(
      $json_med:String,
     ) {
      insertMedicoLite(
        json_med:$json_med
   ) {
      mensaje
      resultado
      data
    }
}`;
  let result =
    this.apollo.use('api_avalab').mutate({
      mutation: gqldata,
      variables: {
        json_med: data
      }
    }).toPromise();
    console.log('result GRAPHQL: ',result);
  return result;
}


///////////////////MEDICO ELABORADO POR ANDERSON//////////////////////////////////////
SearchMedicoDynamic(data) {
  let gqlgetMedicos = gql`
  query searchMedicoDynamic($id_med:String,$nom_med:String,$cel_med:String,$cod_med:String,$col_med:String){
  searchMedicoDynamic(id_med:$id_med,nom_med:$nom_med,cel_med:$cel_med,cod_med:$cod_med,col_med:$col_med){   
  cod_med
  nom_med
  cel_med
  col_med
  mail_med 
  pic_med  
  id_med
  telf_med
  dir_med  
  fec_nac  
  fec_upd  
  last_user  
  esp_med  
  obs_med  
  cod_esp  
  cod_aux
}
} `;
  let result = this.apollo.use('api_avalab').query({
    query: gqlgetMedicos,
    variables: data
  }).toPromise();
  return result;
}
/////////////////////////////////////////////////////////////////////////////////////////////

  actualizarMedico(data) {
    console.log('Clase Graph: '+data);
    let gqldata = gql`
  mutation UpdateMedico(
      $json_medico_upd:String,
     ) {
      UpdateMedico(
        json_medico_upd:$json_medico_upd
   ) {
      mensaje
      resultado
      data
    }
  }`;
  
    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: {
          json_medico_upd: data
        }
      }).toPromise();
  
    return result;
  }
  

  actualizarPaciente(data) {
    console.log('Clase Graph: '+data);
    let gqldata = gql`
  mutation UpdatePaciente(
      $json_paciente_upd:String,
     ) {
      UpdatePaciente(
        json_paciente_upd:$json_paciente_upd
   ) {
      mensaje
      resultado
      data
    }
  }`;
  
    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: {
          json_paciente_upd: data
        }
      }).toPromise();
  
    return result;
  }
  getListPoblacion() {
    let gqlquery = gql`
   {ListPoblacion{
   cod_pob
   cod_niv
   des_pob
   fec_ini
   lock_pob
   fec_upd
   last_user
   cod_anc
   first_user
   }} `;
   let result = this.apollo.use('api_avalab').query({
       query: gqlquery,
     }).toPromise();
   
     return result
   }
   
  getListUnidad() {
    let query = gql`
  {
    ListUnidad{
      cod_uni
      des_uni
      lock_uni
    }
  }`;

    let result = this.apollo.use('api_avalab').query({
      query: query,
    }).toPromise();
    return result;

  }

  searchUnidad(data) {

    let query = gql`
query  searchUnidad($text:String!){
  searchUnidad(text:$text){
      cod_uni
      des_uni
      lock_uni
    }
  }`;

    let result = this.apollo.use('api_avalab').query({
      query: query,
      variables: {
        text: data
      }
    }).toPromise();
    return result;

  }

  getPacientesbyId(id_pac) {
    let gqlgetPacientes = gql`
  query getPaciente($id_pac:String!){
  getPaciente(id_pac:$id_pac){
    nombre_completo
    edad
    ape_pac
    cel_pac
    ciudad_nace
    cod_ori
    cod_pac
    cod_ref
    cp_pac
    dir_pac
    estado_civil
    etnia
    fec_nac
    fec_upd
    first_user
    id_pac
    instruccion
    last_user
    mail_pac
    nom_pac
    nro_card
    nro_form
    ocu_pac
    pais_id
    pais_nace
    pat_pac
    profesion
    sex_pac
    telf_pac
    tip_san
    ven_card
    
  }
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqlgetPacientes,
      variables: { id_pac: id_pac }
    }).toPromise();
    return result;
  }

 
  getPacientesbyCod(cod_pac) {
    let gqlgetPacientes = gql`
  query getPacientebyCod($cod_pac:String!){
    getPacientebyCod(cod_pac:$cod_pac){
    nombre_completo
    edad
    ape_pac
    cel_pac
    ciudad_nace
    cod_ori
    cod_pac
    cod_ref
    cp_pac
    dir_pac
    estado_civil
    etnia
    fec_nac
    fec_upd
    first_user
    id_pac
    instruccion
    last_user
    mail_pac
    nom_pac
    nro_card
    nro_form
    ocu_pac
    pais_id
    pais_nace
    pat_pac
    profesion
    sex_pac
    telf_pac
    tip_san
    ven_card
    
  }
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqlgetPacientes,
      variables: { cod_pac: cod_pac }
    }).toPromise();
    return result;
  }


  SearchPaciente(text) {
    let gqlgetPacientes = gql`
  query searchPaciente2($text:String!){
    searchPaciente2(text:$text){
    nombre_completo
    edad
    ape_pac
    cel_pac
    ciudad_nace
    cod_ori
    cod_pac
    cod_ref
    cp_pac
    dir_pac
    estado_civil
    etnia
    fec_nac
    fec_upd
    first_user
    id_pac
    instruccion
    last_user
    mail_pac
    nom_pac
    nro_card
    nro_form
    ocu_pac
    pais_id
    pais_nace
    pat_pac
    pcte_card
    pic_pac
    profesion
    sex_pac
    telf_pac
    tip_san
    ven_card
    
  }
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqlgetPacientes,
      variables: { text: text }
    }).toPromise();
    return result;
  }

  SearchPacienteCmplt(text) {
    let gqlgetPacientes = gql`
  query searchPacienteComplete($text:String!){
    searchPacienteComplete(text:$text){
    nombre_completo
    edad
    ape_pac
    cel_pac
    ciudad_nace
    cod_ori
    cod_pac
    cod_ref
    cp_pac
    dir_pac
    estado_civil
    etnia
    fec_nac
    fec_upd
    first_user
    id_pac
    instruccion
    last_user
    mail_pac
    nom_pac
    nro_card
    nro_form
    ocu_pac
    pais_id
    pais_nace
    pat_pac
    pcte_card
    pic_pac
    profesion
    sex_pac
    telf_pac
    tip_san
    ven_card
    
  }
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqlgetPacientes,
      variables: { text: text }
    }).toPromise();
    return result;
  }

  getMedicosbyCod(cod_med) {
    let gqlgetMedicobyCod = gql`
query  getMedicobyCod($cod_med:String!){
  getMedicobyCod(cod_med:$cod_med){
    cod_med
    cel_med
    mail_med
    pic_med
    nom_med
    id_med
    telf_med
    dir_med
    fec_nac
    fec_upd
    last_user
    esp_med
    obs_med
    cod_esp
    cod_aux
  }
}
`;

    let result = this.apollo.use('api_avalab').query({
      query: gqlgetMedicobyCod,
      variables: { cod_med: cod_med }
    }).toPromise();

    return result
  }

  insertMedicoLite(data) {

    let gqldata = gql`
    mutation insertMedicoLite(
        $jsonMedico:String,
       ) {
        insertMedicoLite(
          jsonMedico:$jsonMedico
     ) {
        mensaje
        resultado
        data
      }
  }`;

    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: {
          jsonMedico: data
        }
      }).toPromise();

    return result;


  }

  getMedicosbyId(id_med) {
    let gqlgetMedicobyId = gql`
query  getMedicobyCed($id_med:String!){
  getMedicobyCed(id_med:$id_med){
    cod_med
    cel_med
    mail_med
    pic_med
    nom_med
    id_med
    telf_med
    dir_med
    fec_nac
    fec_upd
    last_user
    esp_med
    obs_med
    cod_esp
    cod_aux
  }
}
`;

    let result = this.apollo.use('api_avalab').query({
      query: gqlgetMedicobyId,
      variables: { id_med: id_med }
    }).toPromise();

    return result
  }

  SearchMedico(text) {
    let gqlsearchMedico = gql`
  query  searchMedico2($text:String!){
    searchMedico2(text:$text){
      cod_med
      cel_med
      mail_med
      pic_med
      nom_med
      id_med
      telf_med
      dir_med
      fec_nac
      fec_upd
      last_user
      esp_med
      obs_med
      cod_esp
      cod_aux
    }
  }

    `;

    let result = this.apollo.use('api_avalab').query({
      query: gqlsearchMedico,
      variables: { text: text }
    }).toPromise();

    return result
  }

  SearchAnalisxMstrs(analisisbuscar) {
    let gqlSearchAnalisxMstrs = gql`
 query AnalisisMstrsbyCod($cod_ana:String!){
   AnalisisMstrsbyCod(cod_ana:$cod_ana){
   cod_ana
   des_ana
   iess_codigo
   tip_ser
   dias_proceso
   demora
   muestras
   cod_muestras
  
   }
 }
 `;

    let result = this.apollo.use('api_avalab').query({
      query: gqlSearchAnalisxMstrs,
      variables: {
        cod_ana: analisisbuscar

      }
    }).toPromise()

    return result;
  }

  SearchAnalisxMstrs2(analisisbuscar) {
    let gqlSearchAnalisxMstrs = gql`
  query searchAnalisisMstrs2($des_ana:String!){
    searchAnalisisMstrs2(des_ana:$des_ana){
    cod_ana
    des_ana
    iess_codigo
    tip_ser
    dias_proceso
    demora
    muestras
    cod_muestras
    }
  }
  `;

    let result = this.apollo.use('api_avalab').query({
      query: gqlSearchAnalisxMstrs,
      variables: {
        des_ana: analisisbuscar

      }
    }).toPromise()

    return result;
  }

  getPagoxOrden(nro_ord) {
    let gqlPagoxOrden = gql`
  query PagoxOrden($nro_ord:Int!){
    PagoxOrden(nro_ord:$nro_ord){
      cod_cli
      cod_ori
      cod_suc
      cod_tdp
      doc_pag
      exp_anu
      exp_pag
      fac_seg
      fec_ini
      fec_upd
      first_user
      ins_pag
      last_user
      lock_pxg
      nro_ord
      obs_pag
      res_pag
      seg_pag
      sri_id
      val_pag
      val_seg
    }
  }
  `;
    let result = this.apollo.use('api_avalab').query({
      query: gqlPagoxOrden,
      variables: {
        nro_ord: nro_ord,
      }
    }).toPromise();
    return result
  }

  getMstxOrden(nro_ord) {
    let gqlMstxOrden = gql`
  query MuestraxOrden($nro_ord:String!){
    MuestraxOrden(nro_ord:$nro_ord){
      cod_mst
      cod_suc
      cop_mst
      fec_ent
      fec_ini
      fec_toma
      fec_upd
      first_user
      hem_mst
      id_mxo
      imp_mst
      last_user
      lock_mst
      nro_ord
      per_toma
    }
  }
  `;
    let result = this.apollo.use('api_avalab').query({
      query: gqlMstxOrden,
      variables: {
        nro_ord: nro_ord,
      }
    }).toPromise();
    return result
  }

  getPrecios(cod_ana, cod_lpr) {
    let gqlgetPrecios = gql`
query PreciosbySeguro($cod_ana:String!,$cod_lpr:String!){
  PreciosbySeguro(cod_ana:$cod_ana,cod_lpr:$cod_lpr){
  cod_fac
  por_seg
  pre_ana
  
}
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqlgetPrecios,
      variables: {
        cod_ana: cod_ana,
        cod_lpr: cod_lpr
      }
    }).toPromise();
    return result
  }

  searchMuestras(element) {
    let gqlSearchMuestras = gql`
  query MuestrabyCod($cod_mst:String!){
    MuestrabyCod(cod_mst:$cod_mst){
      des_mst
  cod_mst
  id_mst
    }
  }
  `;

    let result = this.apollo.use('api_avalab').query(
      {
        query: gqlSearchMuestras,
        variables: {
          cod_mst: element
        }
      }
    ).toPromise()

    return result
  }
  //--------------------------------------------------------- finquerys para la orden---------------------//

  getMenuFav(usuario) {
    let gqlgetMenuFav = gql`
  query MenuFavbyUsuario($usuario:String!){
    MenuFavbyUsuario(usuario:$usuario){
      config
      usuario
    
  }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqlgetMenuFav,
      variables: {
        usuario: usuario,

      }
    }).toPromise();
    return result
  }


  //-----------------------------------------
  getAnalisisbyCod(cod_ana) {
    let gqldata = gql`
  query AnalisisMstrsbyCod($cod_ana: String!) {
    AnalisisMstrsbyCod(cod_ana:$cod_ana)  {
      des_ana
      cod_ana
      dias_proceso
      demora
    }
    }
    `;

    let result =
      this.apollo.use('api_avalab').query({
        query: gqldata,
        variables: {
          cod_ana: cod_ana
        }
      }).toPromise();

    return result;
  }
  ///////INSERT PAGO PILAS////////////

  insertPago(data) {
    console.log('Data de pagos en el graphQl: ',data);
    let gqldata = gql`
    mutation InsertOrdenxPago(
        $json_data:String,    
       ) {
        InsertOrdenxPago(
          json_data:$json_data
     
      )
      {
    cod_cli
    cod_ori
    cod_suc
    cod_tdp
    doc_pag
      }
  }`;
    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables:data
      }).toPromise();

    return result;
  }
  //////////////////////////////
  insertOrden(data) {
    console.log('Data en GRaphQL: ',data);
    let gqldata = gql`
    mutation insertOrdenCompleta(
        $jsonOrden:String,
        $jsonMuestras:String,
        $jsonAnalisis:String
       ) {
        insertOrdenCompleta(
        jsonOrden:$jsonOrden,
        jsonMuestras:$jsonMuestras,
        jsonAnalisis:$jsonAnalisis,
     ) {
        mensaje
        resultado
        data
      }
  }`;

    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: data

      }).toPromise();

    return result;
  }
//////////////////Insert of Factura//////////////////////////////
inserFactura(data) {
  console.log('Insert-Factra: ',data);
  let gqldata = gql`
  mutation InsertFactura(
      $json_factura:String,
      $json_analisis:String,
     ) {
      InsertFactura(
        json_factura:$json_factura,
      json_analisis:$json_analisis 
   ) {
      mensaje
      resultado
      data
    }
}`;

  let result =
    this.apollo.use('api_avalab').mutate({
      mutation: gqldata,
      variables: data
    }).toPromise();

  return result;
}










  insertPerfil(data) {
    let gqldata = gql`
  mutation insertPerfil(
      $jsonPerfil:String,
     ) {
      insertPerfil(
        jsonPerfil:$jsonPerfil
   ) {
      mensaje
      resultado
      data
    }
}`;

    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: {
          jsonPerfil: data
        }
      }).toPromise();

    return result;
  }

  actualizarPerfil(data) {
    let gqldata = gql`
  mutation UpdatePerfiles(
      $jsonPerfilesUpd:String,
     ) {
      UpdatePerfiles(
        jsonPerfilesUpd:$jsonPerfilesUpd
   ) {
      mensaje
      resultado
      data
    }
}`;

    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: {
          jsonPerfilesUpd: data
        }
      }).toPromise();

    return result;
  }


  deletePerfil(data) {
    let gqldata = gql`
  mutation DeletePerfiles(
      $jsonPerfilesDelete:String,
     ) {
      DeletePerfiles(
        jsonPerfilesDelete:$jsonPerfilesDelete
   ) {
      mensaje
      resultado
      data
    }
}`;

    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: {
          jsonPerfilesDelete: data
        }
      }).toPromise();

    return result;
  }

  // ---------------------------------Perfiles-----------------------------------------//
  getPerfilesbyMed(cod_med) {
    let gqldata = gql`
 query PerfilesbyCodMed($cod_med:Float!){
  PerfilesbyCodMed(cod_med:$cod_med){
    nombre
    detalle
    cod_med
    observaciones
    id_perfiles
   
 }
 } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: {
        cod_med: cod_med,

      }
    }).toPromise();
    return result
  }

  getPerfilesbyId(id_perfil) {
    let gqldata = gql`
 query PerfilesbyId($id_perfil:Float!){
  PerfilesbyId(id_perfil:$id_perfil){
    nombre
    detalle
    cod_med
    observaciones
    id_perfiles
   
 }
 } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: {
        id_perfil: id_perfil,

      }
    }).toPromise();
    return result
  }

  searchDiagnostico(des_diagnostico) {
    let gqldata = gql`
  query searchDiagnostico($des_diagnostico:String!){
    searchDiagnostico(des_diagnostico:$des_diagnostico){
      codigo
      descripcion
      tipo
    
  }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: {
        des_diagnostico: des_diagnostico,

      }
    }).toPromise();
    return result
  }

  getDiagnosticoById(cod_diagnostico) {
    let gqldata = gql`
  query DiagnosticoId($codigo_diagnostico:String){
    DiagnosticoId(codigo_diagnostico:$codigo_diagnostico){
      codigo
      descripcion
      tipo
    
  }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: {
        codigo_diagnostico: cod_diagnostico,

      }
    }).toPromise();
    return result
  }

  //---------------------pedidos
  getPedidosbyMedPag(data) {
    console.log(data);

    let gqldata = gql`
 query ListPedidosbyMedpag( $fechai:String, $fechaf:String,$texto:String,$cod_med:String){
  ListPedidosbyMedpag(cod_med:$cod_med, fechai:$fechai ,fechaf:$fechaf ,texto:$texto){
    id_pedidos
  cod_med
  cod_pac
  codigo_diagnostico
  fec_ord
  fec_examen
  observaciones
  codigo_diagnostico
  uuid_pedido
  codigo_diagnostico2
  cod_unidad
  cod_lugar
  estado_pedido
  nro_habitacion
  nombre_paciente
  id_pac
  fec_nac
  nom_med
 descripcion_diagnostico
  descripcion_diagnostico_extra
  des_uni
  anular_pedido
  Analisis{
    cod_ana
    des_ana
  }

  Paciente{
    nombre_completo
    edad
    ape_pac
    cod_pac
    fec_nac
    id_pac
    nom_pac
    
  }
 }
 } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: {
        cod_med: data.cod_med,
        fechai: data.fechai,
        fechaf: data.fechaf,
        texto: data.texto

      }
    }).toPromise();
    return result
  }



  getPedidosbyMed(cod_med) {
    let gqldata = gql`
 query ListPedidosbyMed($cod_med:String!){
  ListPedidosbyMed(cod_med:$cod_med){
    id_pedidos
  cod_med
  cod_pac
  codigo_diagnostico
  fec_ord
  fec_examen
  observaciones
  codigo_diagnostico
  uuid_pedido
  codigo_diagnostico2
  cod_unidad
  cod_lugar
  estado_pedido
  nro_habitacion
  nombre_paciente
  id_pac
  fec_nac
  nom_med
 descripcion_diagnostico
  descripcion_diagnostico_extra
  des_uni
  anular_pedido
  Analisis{
    cod_ana
    des_ana
  }

  Paciente{
    nombre_completo
    edad
    ape_pac
    cod_pac
    fec_nac
    id_pac
    nom_pac
    
  }
 }
 } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: {
        cod_med: cod_med,

      }
    }).toPromise();
    return result
  }


  getMuestrasxAna(data) {
    console.log("data", data);

    let gqldata = gql`
    query GetMuestrasxAnalisis(
      $json_data:String,
     ) {
      GetMuestrasxAnalisis(
        json_data:$json_data,
   ) {
      mensaje
      resultado
      data
    }
}`;

    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: {
          json_data: data,
        }
      }).toPromise();

    return result;
  }

  getPedidosbyUuid(uuid) {
    let gqldata = gql`
query PedidoUuid($uuid:String!){
  PedidoUuid(uuid:$uuid){
    id_pedidos
    cod_med
    cod_pac
    codigo_diagnostico
    fec_ord
    fec_examen
    observaciones
    codigo_diagnostico
    uuid_pedido
    codigo_diagnostico2
    cod_unidad
    cod_lugar
    estado_pedido
    nro_habitacion
    nombre_paciente
    id_pac
  fec_nac
    nom_med
   descripcion_diagnostico
    descripcion_diagnostico_extra
    des_uni
    anular_pedido
    Analisis{
      cod_ana
      des_ana
    }
  
    Paciente{
      nombre_completo
      edad
      ape_pac
      cod_pac
      fec_nac
      id_pac
      nom_pac
      
    }
}
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: {
        uuid: uuid,

      }
    }).toPromise();
    return result
  }


  getPedidosbyId(id) {
    let gqldata = gql`
query PedidobyId($id:String!){
  PedidobyId(id:$id){
    id_pedidos
    cod_med
    cod_pac
    codigo_diagnostico
    fec_ord
    fec_examen
    observaciones
    codigo_diagnostico
    uuid_pedido
    codigo_diagnostico2
    cod_unidad
    cod_lugar
    estado_pedido
    nro_habitacion
    nombre_paciente
    id_pac
  fec_nac
    nom_med
   descripcion_diagnostico
    descripcion_diagnostico_extra
    des_uni
    anular_pedido
    tipo_user
    Analisis{
      cod_ana
      des_ana
    }
  
    Paciente{
      nombre_completo
      edad
      ape_pac
      cod_pac
      fec_nac
      id_pac
      nom_pac
      
    }
}
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: {
        id: id,

      }
    }).toPromise();
    return result
  }


  anularPedido(data) {
    let gqldata = gql`
  mutation PedidoAnular(
      $jsonPedido:String,
     ) {
      PedidoAnular(
        jsonPedido:$jsonPedido
   ) {
      mensaje
      resultado
      data
    }
}`;

    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: {
          jsonPedido: data
        }
      }).toPromise();

    return result;
  }

  insertPedido(dataPedido, dataAnalisis) {
    let gqldata = gql`
  mutation insertPedido(
      $jsonPedido:String,
      $jsonAnalisis:String
     ) {
      insertPedido(
        jsonPedido:$jsonPedido,
        jsonAnalisis:$jsonAnalisis,
   ) {
      mensaje
      resultado
      data
    }
}`;

    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: {
          jsonPedido: dataPedido,
          jsonAnalisis: dataAnalisis
        }
      }).toPromise();

    return result;
  }

  insertPacientelite(data) {
    let gqldata = gql`
  mutation insertPacientelite(
      $json_pac:String,
     ) {
      insertPacientelite(
        json_pac:$json_pac,
   ) {
      mensaje
      resultado
      data
    }
}`;

    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: {
          json_pac: data,
        }
      }).toPromise();

    return result;
  }




  insertPaciente(data) {
    let gqldata = gql`
  mutation insertPaciente(
      $cod_ori:String,
      $nom_pac:String!,
      $ape_pac:String!,
      $fec_nac:String!,
      $edad_pac:String,
      $id_pac:String!,
      $mail_pac:String,
      $cel_pac:String,
      $sex_pac:String,
      $dir_pac:String,
      $telf_pac:String,
      $pais_nace:String,
      $estado_civil:String,
      $instruccion:String,
      $ocu_pac:String,
      $pat_pac:String,
      $san_pac:String,
      $etnia:String,
    ) {
    insertPaciente(
      nom_pac:$nom_pac,
      ape_pac:$ape_pac,
      fec_nac:$fec_nac,
      edad_pac:$edad_pac,
      id_pac:$id_pac,
      mail_pac:$mail_pac,
      cel_pac:$cel_pac,
      sex_pac:$sex_pac,
      dir_pac:$dir_pac,
      telf_pac:$telf_pac,
      pais_nace:$pais_nace,
      estado_civil:$estado_civil,
      instruccion:$instruccion,
      ocu_pac:$ocu_pac,
      pat_pac:$pat_pac,
      san_pac:$san_pac,
      etnia:$etnia,
      cod_ori:$cod_ori
      ) {
      mensaje
      resultado
    }
}`;
    let result = this.apollo.use('api_avalab').mutate({
      mutation: gqldata,
      variables: {
        nom_pac: data.nom_pac,
        ape_pac: data.ape_pac,
        fec_nac: data.fec_nac,
        edad_pac: data.edad_pac,
        id_pac: data.id_pac,
        mail_pac: data.mail_pac,
        cel_pac: data.cel_pac,
        sex_pac: data.sex_pac,
        dir_pac: data.dir_pac,
        telf_pac: data.telf_pac,
        pais_nace: 'EC',
        estado_civil: data.estado_civil,
        instruccion: '',
        ocu_pac: data.ocu_pac,
        pat_pac: data.pat_pac,
        san_pac: data.san_pac,
        etnia: data.etnia,
        cod_ori: data.cod_ori


      }

    }).toPromise()
    return result
  }

  getPerfilesAva() {
    let gqldata = gql`
  query {ListPerfilesAvalab{
    des_per
    cod_per
    grupo
    color
    Analisis{
      des_ana
      cod_ana
      cod_per
      orden
    }
    
  }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,

    }).toPromise();
    return result
  }


  //metodos resultados
  getOrdenResultados(data) {
    let gqldata = gql`
    query OrdenResultadosbyparam($codigo:String!,$tipo:String!){
      OrdenResultadosbyparam(codigo:$codigo,tipo:$tipo){
      cod_ori
      nombre_completo
      nro_ord
      fec_ord
      fec_upd
      cod_pac
      cod_med
      apellido
      nombre_medico
      nombre
      sts_ord
      cod_ref
      id_pac
      mail_pac
      mail_ref
      saldo
      des_sts
      listo
      
        
  }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: {
        codigo: data.codigo,
        tipo: data.tipo

      }
    }).toPromise();
    return result
  }


  getAnalisisPacienteByCod(data) {
    let gqldata = gql`
    query getAnalisisPacienteByCod($cod_pac:String!,$f_desde:String!,$f_hasta:String!){
    getAnalisisPacienteByCod(cod_pac:$cod_pac,f_desde:$f_desde,f_hasta:$f_hasta){
    descripcion_analisis
    codigo_analisis
    count_orden
    orden_analisis
    codigo_tipo_analisis
    descripcion_tipo_analisis
    orden_tipo_analisis
    }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result
  }

  getAnalisisxOrden(data) {
    let gqlAnalisisxOrden = gql`
  query searchAnalisisxOrden($nro_ord:String!){
    searchAnalisisxOrden(nro_ord:$nro_ord){
    des_ana
    cant_pet
    cod_ana
    cod_aux1
    cod_aux2
    cod_ref
    cod_suc
    dcto_pet
    dcto_val
    des_pet
    des_sts
    fec_ent
    fec_ini
    fec_ref
    fec_ref_res
    fec_sig
    fec_upd
    fec_upload
    fec_val
    first_user
    how_ent
    id_fac
    id_med
    id_plan
    imp_pet
    last_user
    lock_pet
    n_print
    nro_fac
    nro_ord
    num_pri
    paq_pet
    pet_adi
    pre_pac
    pre_seg
    pre_uni
    ref_pet
    rep_pet
    sts_adm
    sts_pet
    tip_ser
    upl_pet
    upload
    usu_ref
    usu_sig
    usu_val
    valor_pet
    entrega
    }
  }
  `;
    let result = this.apollo.use('api_avalab').query({
      query: gqlAnalisisxOrden,
      variables: data
    }).toPromise();
    return result
  }


  getParametrosAnalisisPac(data) {
    let gqldata = gql`
    query getParametrosAnalisisPac($cod_pac:String!,$f_desde:String!,$f_hasta:String!,$cod_ana:String!){
      getParametrosAnalisisPac(cod_pac:$cod_pac,f_desde:$f_desde,f_hasta:$f_hasta,cod_ana:$cod_ana){
        orden
        fecha_orden
        codigo_analisis
        fecha_creacion_resultado
        codigo_parametro
        descripcion_parametro
        resultado
        tipo_resultado
        unidad_resultado
    }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result
  }


  getOrdenPacienteEntrega(data) {
    let gqldata = gql`
    query getOrdPaciente($nro_orden:Int!){
      getOrdPaciente(nro_ord:$nro_orden){
        nro_ord
        stat_ord
        cod_ori
        name_med
        fec_ord
        cod_pac
        name_pac
        nom_pac
        ape_pac
        id_pac
        edad
        fec_ent
        txt_ord
        saldo
        pendientes
    }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result
  }


  insertSgcEvent(data) {

    let gqldata = gql`
    mutation insertSgcEvent(
      $id_detsgc:Int,
      $cod_suc:Int,
      $nro_ord:Int,
      $cod_usr:String,
      $obs_sgc:String,
       ) {
        insertSgcEvent(
          id_detsgc:$id_detsgc,
          cod_suc:$cod_suc,
          nro_ord:$nro_ord,
          cod_usr:$cod_usr,
          obs_sgc:$obs_sgc

     ) {
        id_sgc
        res_sgc
      }
  }`;

    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: data
      }).toPromise();

    return result;


  }

  getDetallesSGC() {
    let gqldata = gql`
    query getDetalleSgc{
      getDetalleSgc{
        id
        form_sgc
        tip_eve
        tip_pro
        det_eve
         }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata
    }).toPromise();
    return result
  }

  getArchivoFirma(data) {
    let gqldata = gql`
    query getArchivoFirma($usuario:String!){
      getArchivoFirma(usuario:$usuario){
        usuario
        codigo
        encode_file
         }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result
  }

  getGraphUsers(data) {
    let gqldata = gql`
    query getGraphUsers($users:String!){
      getGraphUsers(users:$users){
        usuario
        codigo
        encode_file
         }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result
  }

  getImagesAdjunto(data) {
    let gqldata = gql`
    query getImagesAdjunto($nro_ord:Int){
      getImagesAdjunto(nro_ord:$nro_ord){
        des_par
        nro_ord
        cod_ana
        nombre
        url_image_ana
         }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result

  }
  updateStatusPet(data) {
    let gqldata = gql`
  mutation updateStsPeticion(
      $jsonPet:String,
     ) {
      updateStsPeticion(
        jsonPet:$jsonPet
   ) {    
    code
    description
    }
}`;
    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: {
          jsonPet: data
        }
      });

    return result;
  }

  getFeriadobyFecha(data) {
    let gqldata = gql`
    query getFeriadobyFecha($fecha:String!){
      getFeriadobyFecha(fecha:$fecha){
        des_fer
        max_turnos
        fec_fer
    }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result

  }

  getFeriadosmbyFecha(data) {
    let gqldata = gql`
    query getFeriadosmbyFecha($fecha:String!){
      getFeriadosmbyFecha(fecha:$fecha){
        des_fer
        max_turnos
        fec_fer
    }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result
  }

  countPedidosbyFecha(data) {
    let gqldata = gql`
    query CountPedidobyFecha($fecha:String!){
      CountPedidobyFecha(fecha:$fecha){
        data_total
        des_count
    }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result
  }

  /* Añadido AV  */


  getCsParms(data) {
    let gqldata = gql`
  query getCsParms($cs_name:String!){
    getCsParms(cs_name:$cs_name){
      cod_parm
  data_parm
  des_parm
  }
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result
  }


  getPedidosbyTipo(data) {
    let gqldata = gql`
  query ListPedidosbyTipo($json_data:String!){
    ListPedidosbyTipo(json_data:$json_data){
      id_pedidos
      cod_med
      cod_pac
      codigo_diagnostico
      fec_ord
      fec_examen
      observaciones
      codigo_diagnostico
      uuid_pedido
      codigo_diagnostico2
      cod_unidad
      cod_lugar
      estado_pedido
      nro_habitacion
      nombre_paciente
      id_pac
    fec_nac
      nom_med
     descripcion_diagnostico
      descripcion_diagnostico_extra
      des_uni
      anular_pedido
      tipo_user
      Analisis{
        cod_ana
        des_ana
      }
    
      Paciente{
        nombre_completo
        edad
        ape_pac
        cod_pac
        fec_nac
        id_pac
        nom_pac
        
      }
     
  }
} `;

    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result
  }

  /* -----------------------*/


  //--------------------nuevo cambio quexana 07/02/2023
  getQuexAna(data) {
    let gqldata = gql`
  query GetQuexAna($cod_ana:String!){
    GetQuexAna(cod_ana:$cod_ana){
      cod_ana
  cod_que
  }
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result

  }

  checkordbyfecha(data) {
    let gqldata = gql`
  query checkordbyfecha($cod_pac:String!,$fecha_i:String!,$fecha_h:String!){
    checkordbyfecha(cod_pac:$cod_pac,fecha_i:$fecha_i,fecha_h:$fecha_h){
      nro_ord
      fec_ent
        fec_upd
  }
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result

  }

  getPetxOrdenes(data) {
    let gqldata = gql`
  query getPetxOrd($nro_ord_list:String!){
    getPetxOrd(nro_ord_list:$nro_ord_list){
     cod_ana
  }
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result

  }

  getLabetTicketbyMxo(data) {
    console.log("data label", data);

    let gqldata = gql`
  query getTicketLabel($tipo:String!,$data:String!){
    getTicketLabel(tipo:$tipo,data:$data){
      ticket_label
  }
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result
  }


  UpdateMuestra(data) {
    console.log("json_m,st", data);

    let gqldata = gql`
query UpdateMuestra(
    $json_data:String,
   ) {
    UpdateMuestra(
      json_data:$json_data,
 ) {
    mensaje
    resultado
  }
}`;

    let result =
      this.apollo.use('api_avalab').query({
        query: gqldata,
        variables: data
      }).toPromise();

    return result;
  }

  getReferenciabyCod(data) {
    let gqldata = gql`
  query ReferenciaByCod($cod_ref:String!){
    ReferenciaByCod(cod_ref:$cod_ref){
      cod_ref
      des_ref
      id_plan
      cod_ori
  }
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result

  }

  getOrigenbyCod(data) {
    let gqlListOrigen = gql`
  query OrigenByCod($cod_ori:String!){
    OrigenByCod(cod_ori:$cod_ori){
        des_ori,
        cod_ori,
        ubicaciones{
          nombre_ubicacion
          id_ubicacion
        }   
        hora_ori
     } 
   }
     
`;
    let result: any = this.apollo.use('api_avalab').query({
      query: gqlListOrigen,
      variables: data
    }).toPromise();
    console.log(result);
    return result;
  }

  getListOrdersWeb(data) {
    let gqlquery = gql`
  query getOrdersWebbyFiltro($cod_user:String!,$type_user:String!,$fdesde:String!,$fhasta:String!,$dato:String!){
    getOrdersWebbyFiltro(cod_user:$cod_user,type_user:$type_user, fdesde:$fdesde, fhasta:$fhasta,dato:$dato){
      nombre_medico
      nombre_completo
      nro_ord
      origen
      fec_ini
      nro_ext 
      mst_ext 
      obs_ext 
   }
  }
`;
    let result: any = this.apollo.use('api_avalab').query({
      query: gqlquery,
      variables: data
    }).toPromise();
    console.log(result);
    return result;
  }

  searchReferencia(data) {

    let gqlquery = gql`
  query searchReferencia($buscador:String!){
    searchReferencia(buscador:$buscador){
      cod_ref
      des_ref
      id_plan
      cod_ori
  }
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqlquery,
      variables: data
    }).toPromise();
    return result
  }


  getListMedicos() {

    let gqlquery = gql`
{ListMedicos{
 cod_med
  cel_med
  mail_med
  pic_med
  nom_med
  id_med
  telf_med
  dir_med
  fec_nac
  fec_upd
  last_user
  esp_med
  obs_med
  cod_esp
  cod_aux
}} `;



    let result = this.apollo.use('api_avalab').query({
      query: gqlquery,
    }).toPromise();

    return result
  }


  getOrdenResultadosSB(data) {
let finaldata={
  codigo:'',
  tipo:'',
  desde:'',
  hasta:'',
  orderby:'',
  cod_med:'',
  id_ref:'',
  id_plan:'',
  complete:'',
  nro_orden:'',
  cod_uni:'',
  listo_imprime:'',
  stsList:''
};

if(data.codigo){  finaldata.codigo=data.codigo}
if(data.tipo){  finaldata.tipo=data.tipo}
if(data.desde){  finaldata.desde=data.desde}
if(data.hasta){  finaldata.hasta=data.hasta}
if(data.orderby){  finaldata.orderby=data.orderby}
if(data.cod_med){  finaldata.cod_med=data.cod_med}
if(data.id_ref){  finaldata.id_ref=data.id_ref}
if(data.id_plan){  finaldata.id_plan=data.id_plan}
if(data.complete){  finaldata.complete=data.complete}
if(data.nro_orden){  finaldata.nro_orden=data.nro_orden}
if(data.cod_uni){  finaldata.cod_uni=data.cod_uni}
if(data.listo_imprime){  finaldata.listo_imprime=data.listo_imprime}
if(data.stsList){  finaldata.stsList=data.stsList}

    let gqldata = gql`
  query getOrdentoResultadosDynamic(
    $codigo:String,
    $tipo:String,
    $desde:String,
    $hasta:String,
    $orderby:String,
    $cod_med:String,
    $id_ref:String,
    $id_plan:String,
    $complete:String,
    $nro_orden:String,
    $cod_uni:String,
    $listo_imprime:String,
    $stsList:String
    ){
      getOrdentoResultadosDynamic(
      codigo: $codigo,
      tipo:$tipo,
      desde:$desde,
      hasta:$hasta,
      orderby:$orderby,
      cod_med:$cod_med,
      id_ref:$id_ref,
      id_plan:$id_plan,
      complete:$complete,
      nro_orden:$nro_orden
      cod_uni:$cod_uni,
      listo_imprime:$listo_imprime
      stsList:$stsList
    ){
    cod_ori
    nombre_completo
    nro_ord
    fec_ord
    fec_upd
    cod_pac
    cod_med
    apellido
    nombre_medico
    nombre
    sts_ord
    cod_ref
    id_pac
    mail_pac
    mail_ref
    saldo
    des_sts
    listo
    listo_imprime
    mail_med
    
      
}
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: finaldata
    }).toPromise();
    return result
  }


  getDbParms(data) {
    let gqldata = gql`
    query getCsDbParms($cod_par:String!){
      getCsDbParms(cod_par:$cod_par){
        cod_par
        val_par
        des_parm
    }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result
  }

  getPermisoUsuario(data) {
    let gqldata = gql`
    query getPermisoXUsuario($usuario:String!,$cod_per:String){
      getPermisoXUsuario(usuario:$usuario,cod_per:$cod_per){
        cod_gru
        usuario
    cod_per
    tipo_per
    }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result
  }

  getNotasOrden(data) {
    let gqldata = gql`
    query getNotasOrden($nro_ord:Int!,$tipo:String){
      getNotasOrden(nro_ord:$nro_ord,tipo:$tipo){
        data
    }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result
  }

  SearchPacienteDynamic(data) {
    let gqlgetPacientes = gql`
  query searchPacienteDynamic($nombre:String,$apellido:String,$codigo:String,$cedula:String){
    searchPacienteDynamic(nombre:$nombre, apellido:$apellido, codigo:$codigo, cedula:$cedula){
    nombre_completo
    edad
    ape_pac
    cel_pac
    ciudad_nace
    cod_ori
    cod_pac
    cod_ref
    cp_pac
    dir_pac
    estado_civil
    etnia
    fec_nac
    fec_upd
    first_user
    id_pac
    instruccion
    last_user
    mail_pac
    nom_pac
    nro_card
    nro_form
    ocu_pac
    pais_id
    pais_nace
    pat_pac
    pcte_card
    pic_pac
    profesion
    sex_pac
    telf_pac
    tip_san
    ven_card
    
  }
} `;
    let result = this.apollo.use('api_avalab').query({
      query: gqlgetPacientes,
      variables: data
    }).toPromise();
    return result;
  }


  getListTdpAvailable() {
    let gqldata = gql`
    query {
      ListTipoPagoAvailable{
        cod_tdp
        des_pag
        lock_tdp
        tip_tdp
      }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
    }).toPromise();
    return result
  }
/////////////////////////////Anderson PtoxoribyOri///////////////////////////////////// 
  PtoxoribyOri(cod_ori){    
  let gqldataPtoxoribyOri = gql`
  query PtoxoribyOri($cod_ori:String!){  
  PtoxoribyOri(cod_ori:$cod_ori){
    cod_ori
  cod_suc
  lock_pxo
  matriz
  tip_emi
  sri_estab
  pto_emi
  sucursal{
    nombre_comercial
    des_suc
    sri_ruc
    nombre_comercial
    sri_razon
  }
  origen{
    cod_ori
    des_ori
    cod_suc
    unidad_medica
    dir_ori
    tel_ori
    ciu_ori
    hora_ori
    centro_proceso
    col_ori
    depot
    dia_ori
    hab_ori
    path_report
    sri_estab
    sri_mat
    sri_ptos
    unidad_medica
    url_acess
    user_director   
  }
    }
  }`;
  let result = this.apollo.use('api_avalab').query({
    query: gqldataPtoxoribyOri,
    variables: { cod_ori: cod_ori }    
  }).toPromise();
  return result
  }


  getListSucursal(){
    let gqldata = gql`
    query{ ListSucursal{
      cod_suc
      des_suc
      lock_suc
      sri_razon
      sri_ruc
      cert
      pwd_cert
  } }`;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata
    }).toPromise();
    return result
  }

  getListEstatusDynamic(data){
    let finaldata={
      ingresa:"", 
      valida:"", 
      imprime:"", 
      entrega:"", 
      calcula:"", 
      repite:"", 
      firma:"", 
      web:"", 
      sts_sys:""
    };
    
    if(data.ingresa){  finaldata.ingresa=data.ingresa}
    if(data.valida){  finaldata.valida=data.valida}
    if(data.imprime){  finaldata.imprime=data.imprime}
    if(data.entrega){  finaldata.entrega=data.entrega}
    if(data.calcula){  finaldata.calcula=data.calcula}
    if(data.repite){  finaldata.repite=data.repite}
    if(data.firma){  finaldata.firma=data.firma}
    if(data.web){  finaldata.web=data.web}
    if(data.sts_sys){  finaldata.sts_sys=data.sts_sys}

    let gqlquery = gql`
    query ListEstatusDynamic($ingresa:String,$valida:String,$imprime:String,$entrega:String,$calcula:String,$repite:String,$firma:String,$web:String,$sts_sys:String){
      ListEstatusDynamic(ingresa:$ingresa, valida:$valida, imprime:$imprime, entrega:$entrega, calcula:$calcula, repite:$repite, firma:$firma, web:$web, sts_sys:$sts_sys){
        cod_sts
        des_sts
        det_sts
    }
  } `;
      let result = this.apollo.use('api_avalab').query({
        query: gqlquery,
        variables: finaldata
      }).toPromise();
      return result;

  }

  getListPlanes(){
    let gqldata=gql`
    query{
      ListSeguro{
        cod_seg
        des_seg
        Plan{
          cod_lpr
          des_plan
          por_seg
          cod_seg
          id_plan
        }
      }
    }
    `;

    let result: any = this.apollo.use('api_avalab').query({
      query: gqldata
    }).toPromise();
    console.log(result);
    return result;
  }



  setPolicyPac(data) {
    let gqldata = gql`
    mutation setJsonPolicyPac(
      $json_data:String) {

        setJsonPolicyPac(
        json_data:$json_data ) {
        cod_pac
        protect_ok
        protect_fecha
        protect_detail
      }
  }`;

    let result =
      this.apollo.use('api_avalab').mutate({
        mutation: gqldata,
        variables: data
      }).toPromise();

    return result;


  }


  getPeticionesExternas(data) {
    let gqldata = gql`
    query getPeticionesExternas($nro_ord:Int!){
      getPeticionesExternas(nro_ord:$nro_ord){
        cod_ana
    }
  } `;
    let result = this.apollo.use('api_avalab').query({
      query: gqldata,
      variables: data
    }).toPromise();
    return result
  }
}
