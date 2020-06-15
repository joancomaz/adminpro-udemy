import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/hospital/hospital.service';
import { HospitalModel } from '../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  cargando: boolean = true;
  desde: number = 0;
  hospitales: HospitalModel[] = [];
  totalRegistros: number = 0;

  // nombreNuevoHospital: string = '';

  constructor(public hospitalService: HospitalService,
              public modalUploadService: ModalUploadService) {
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.modalUploadService.notificacion
      .subscribe(() => this.cargarHospitales());
  }

  buscarHospital(termino: string) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.hospitalService.buscarHospital(termino)
      .subscribe((hospitales: HospitalModel[]) => {
        this.hospitales = hospitales;
        this.cargando = false;
      });

  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde)
      .subscribe((resp: any) => {
        console.log(resp);
        this.hospitales = resp.hospitales;
        this.totalRegistros = resp.total;
        this.cargando = false;
      });
  }

  crearHospital() {

    Swal.fire({
      title: 'Escribe el nombre del hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Crear',
      showLoaderOnConfirm: true
    }).then((result) => {

      if (!result.value || result.value.length === 0) {
        return;
      }

      this.hospitalService.crearHospital(result.value)
        .subscribe( () => {
          this.cargarHospitales();
        });


      // Swal.fire('Hospital creado', result.value, 'success');

    });

    /*this.hospitalService.crearHospital()
      .subscribe(resp => {
        console.log(resp);
      });*/
  }

  guardarHospital(hospital: HospitalModel) {
    this.hospitalService.actualizarHospital(hospital).subscribe();
  }

  borrarHospital(hospital: HospitalModel) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + hospital.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar'
    }).then((borrar) => {
      if (borrar.value) {
        this.hospitalService.borrarHospital(hospital._id)
          .subscribe((borrado: boolean) => {
            console.log(borrado);
            this.cargarHospitales();
          });
      }
    });
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('hospitales', id);
  }

  /*cambiarDesde(valor: number) {
    console.log(valor);
  }

  mostrarModal(id: string) {
    console.log(id);
  }*/

}
