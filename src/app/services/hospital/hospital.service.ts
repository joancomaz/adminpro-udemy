import { Injectable } from '@angular/core';
import { HospitalModel } from '../../models/hospital.model';
import { URL_SERVICIOS } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsuarioModel } from '../../models/usuario.model';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  token: string;
  usuario: UsuarioModel;

  constructor(public http: HttpClient,
              public usuarioService: UsuarioService) {
    // this.cargarStorage();
  }

  /*cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }*/

  cargarHospitales(desde: number = 0) {
    const url = `${ URL_SERVICIOS }/hospital?desde=${ desde }`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => {
          return resp.hospitales;
        })
      );
  }

  obtenerHospital(id: string) {
    const url = `${ URL_SERVICIOS }/hospital/${ id }`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.hospital)
      );
  }

  borrarHospital(id: string) {
    let url = `${ URL_SERVICIOS }/hospital/${ id }`;
    url += '?token=' + this.usuarioService.token;

    return this.http.delete(url)
      .pipe(
        map(resp => {
          Swal.fire(
            'Hospital borrado',
            'El hospital ha sido eliminado correctamente',
            'success'
          );
          return true;
        })
      );
  }

  crearHospital(nombre: string) {
    let url = `${ URL_SERVICIOS }/hospital`;
    url += '?token=' + this.usuarioService.token;

    return this.http.post(url, {nombre})
      .pipe(
        map((resp: any) => {
          return resp.hospital;
        })
      );
  }

  buscarHospital(termino: string) {
    const url = `${ URL_SERVICIOS }/busqueda/coleccion/hospitales/${ termino }`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.hospitales)
      );
  }

  actualizarHospital(hospital: HospitalModel) {
    let url = `${ URL_SERVICIOS }/hospital/${ hospital._id }`;
    url += '?token=' + this.usuarioService.token;

    return this.http.put(url, hospital)
      .pipe(
        map(resp => {
          Swal.fire('Hospital actualizado', hospital.nombre, 'success');
          return true;
        })
      );
  }
}
