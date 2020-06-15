import { Component, OnInit } from '@angular/core';
import { MedicoModel } from '../../models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: MedicoModel[] = [];

  constructor(public medicoService: MedicoService) {
  }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.medicoService.cargarMedicos()
      .subscribe(medicos => this.medicos = medicos);
  }

  buscarMedico(termino: string) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this.medicoService.buscarMedicos(termino)
      .subscribe(medicos => this.medicos = medicos);
  }

  crearMedico() {

  }

  borrarMedico(medico: MedicoModel) {
    this.medicoService.borrarMedico(medico._id)
      .subscribe(() => this.cargarMedicos());
  }
}
