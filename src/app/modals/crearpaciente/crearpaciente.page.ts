import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { QueryService } from 'src/app/servicios/gql/query.service';
import { LoadingService } from 'src/app/servicios/loading.service';
import { ToastService } from 'src/app/servicios/toast.service';


@Component({
  selector: 'app-crearpaciente',
  templateUrl: './crearpaciente.page.html',
  styleUrls: ['./crearpaciente.page.scss'],
})
export class CrearpacientePage implements OnInit {

  paciente: any = {
    cod_pac: "",
    nom_pac: null,
    ape_pac: null,
    fec_nac: null,
    id_pac: null,
    edad_pac: null,
    mail_pac: '',
    cel_pac: '',
    cod_ori: '',
    sex_pac: null,
    dir_pac: '',
    telf_pac: '',
    pais_nace: '',
    estado_civil: '',
    instruccion: '',
    ocu_pac: '',
    pat_pac: '',
    san_pac: '',
    etnia: '',

  };
  cod_pac_temp:any;
  tipo:any;
  input_nombre: string = '';
  input_apellido: string = '';
  input_id: string = '';
  input_genero: string = '';
  input_telefono: string = '';
  input_cell: string = '';
  input_mail: string = '';
  input_dir: string = '';
  input_fec_nac: string = '';
  constructor(
    private modalcontroller: ModalController,
    private queryservice: QueryService,
    private toastservice: ToastService,
    private loadingservice: LoadingService
  ) {
    console.log("cod_pac_temp2", this.cod_pac_temp);
  }

  ngOnInit() {

    console.log("cod_pac_temp", this.cod_pac_temp);
    if (this.cod_pac_temp) {
      this.queryservice.getPacientesbyCod(this.cod_pac_temp).then((r: any) => {
        console.log('r', r);
        let data = r.data.getPacientebyCod;

        this.input_nombre =data.nom_pac;
        this.input_apellido =data.ape_pac;
        this.input_id =data.id_pac;
        this.input_genero =data.sex_pac;
        this.input_telefono =data.telf_pac;
        this.input_cell =data.cel_pac;
        this.input_mail =data.mail_pac;
        this.input_dir =data.dir_pac;
        this.input_fec_nac =data.fec_nac;

      })
    }
  }

  dismiss() {
    this.modalcontroller.dismiss({
      'dismissed': true,
      // 'flag_origen': this.flag_origen
    }, "blank");
    //    this.orden = [];
  }

  dismissData(data, tipo) {
    this.modalcontroller.dismiss({
      'dismissed': true,
      'data_pac': data,
      'tipo': tipo
    }, "data");
    //    this.orden = [];
  }

  CheckPaciente() {

    if (this.input_apellido == '' || this.input_nombre == '') {
      this.toastservice.presentToast({ message: 'Ingresar nombres y apellidos por favor', color: "warning", position: "top" })
      return
    }

    console.log("this.paciente.fec_nac=this.input_fec_nac", this.input_fec_nac);

    if (this.input_fec_nac == '') {
      this.input_fec_nac = null;
    }

    this.loadingservice.present('Ingresando Paciente')
    this.paciente.nom_pac = this.input_nombre
    this.paciente.id_pac = this.input_id
    this.paciente.ape_pac = this.input_apellido
    this.paciente.mail_pac = this.input_mail
    this.paciente.cel_pac = this.input_cell
    this.paciente.sex_pac = this.input_genero
    this.paciente.telf_pac = this.input_telefono
    this.paciente.dir_pac = this.input_dir
    this.paciente.fec_nac = this.input_fec_nac


    console.log(this.paciente.nom_pac);

    console.log('this.paciente', JSON.stringify(this.paciente));


    console.log('this.paciente', this.paciente);


    if (this.input_id != '') {
      this.queryservice.getPacientesbyId(this.input_id).then((r: any) => {
        console.log(r);
        if (r.data.getPaciente.id_pac != null) {
          this.dismissData(this.paciente, "check")
          this.toastservice.presentToast({ message: "Ya existe un usuario registrado con esa cédula.", position: "middle", color: "warning", duration: 2000 })
          this.loadingservice.dismiss();
          return
        } else {
          this.insertarPaciente(this.paciente)
        }
      })

    } else {
      this.insertarPaciente(this.paciente)
    }
    return

  }

  insertarPaciente(data) {
    console.log("data del paciente", data);

    this.queryservice.insertPacientelite(JSON.stringify(data)).then((result: any) => {
      console.log('result', result);
      let data = result.data.insertPacientelite;
      if (data.resultado == 'ok') {
        this.toastservice.presentToast({ message: data.mensaje, color: "success", position: "top" });
        this.dismissData(JSON.parse(data.data), "insert");

      }
      this.loadingservice.dismiss()
    }, error => {
      console.log('error', error);
      this.toastservice.presentToast({ message: error, color: "warning", position: "top" });
      this.loadingservice.dismiss()
    })

  }
}
