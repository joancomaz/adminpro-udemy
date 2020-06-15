import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HospitalModel } from '../../models/hospital.model';
import { MedicoService } from '../../services/medico/medico.service';
import { HospitalService } from '../../services/hospital/hospital.service';
import { MedicoModel } from '../../models/medico.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: HospitalModel[] = [];
  medico: MedicoModel = new MedicoModel('', '', '', '', '');
  hospital: HospitalModel = new HospitalModel('');

  constructor(public medicoService: MedicoService,
              public hospitalService: HospitalService,
              public router: Router,
              public activatedRoute: ActivatedRoute,
              public modalUploadService: ModalUploadService) {
    activatedRoute.params.subscribe(params => {
      const id = params.id;

      if (id !== 'nuevo') {
        this.cargarMedico(id);
      }
    });
  }

  ngOnInit(): void {
    this.hospitalService.cargarHospitales()
      .subscribe(hospitales => this.hospitales = hospitales);

    this.modalUploadService.notificacion
      .subscribe(resp => {
        this.medico.img = resp.medico.img;
      });
  }

  guardarMedico(f: NgForm) {
    console.log(f.valid);
    console.log(f.value);

    if (f.invalid) {
      return;
    }

    this.medicoService.guardarMedico(this.medico)
      .subscribe(medico => {
        this.medico._id = medico._id;
        this.router.navigate(['/medico', medico._id]);
      });
  }

  cambioHospital(id: string) {
    this.hospitalService.obtenerHospital(id)
      .subscribe(hospital => this.hospital = hospital);
  }

  cargarMedico(id: string) {
    this.medicoService.cargarMedico(id)
      .subscribe(medico => {
        console.log(medico);
        this.medico = medico;
        this.medico.hospital = medico.hospital._id;
        this.cambioHospital(this.medico.hospital);
      });
  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal('medicos', this.medico._id);
  }
}
