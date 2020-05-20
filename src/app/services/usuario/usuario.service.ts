import { Injectable } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: UsuarioModel;
  token: string;

  constructor(public http: HttpClient,
              public router: Router,
              public subirArchivoService: SubirArchivoService) {
    this.cargarStorage();
  }

  estaLogueado() {
    if (this.token) {
      return (this.token.length > 5);
    }
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage(id: string, token: string, usuario: UsuarioModel) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    const url = `${URL_SERVICIOS}/login/google`;
    return this.http.post(url, { token })
      .pipe(
        map((resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario);
          return true;
        })
      );
  }

  login(usuario: UsuarioModel, recordar: boolean = false) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = `${URL_SERVICIOS}/login`;
    return this.http.post(url, usuario)
      .pipe(
        map((resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario);
          return true;
        })
      );
  }

  crearUsuario(usuario: UsuarioModel) {
    const url = `${URL_SERVICIOS}/usuario`;
    return this.http.post(url, usuario)
      .pipe(
        map((resp: any) => {
          Swal.fire('Usuario creado', usuario.email, 'success');
          return resp.usuario;
        })
      );
  }

  actualizarUsuario(usuario: UsuarioModel) {
    let url = `${URL_SERVICIOS}/usuario/${usuario._id}`;
    url += '?token=' + this.token;

    return this.http.put(url, usuario)
      .pipe(
        map((resp: any) => {

          if (usuario._id === this.usuario._id) {
            const usuarioDB: UsuarioModel = resp.usuario;
            this.guardarStorage(usuarioDB._id, this.token, usuarioDB);
          }

          Swal.fire('Usuario actualizado', usuario.nombre, 'success');
          return true;
        })
      );
  }

  cambiarImagen(file: File, id: string) {
    this.subirArchivoService.subirArchivo(file, 'usuarios', id)
      .then((resp: any) => {
        this.usuario.img = resp.usuario.img;
        Swal.fire('Imagen actualizada', this.usuario.nombre, 'success');
        this.guardarStorage(id, this.token, this.usuario);
      })
      .catch(resp => {
        console.error(resp);
      });
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${URL_SERVICIOS}/usuario/?desde=${desde}`;
    return this.http.get(url);
  }

  buscarUsuarios(termino: string) {
    const url = `${URL_SERVICIOS}/busqueda/coleccion/usuarios/${termino}`;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.usuarios)
      );
  }

  borrarUsuario(id: string) {
    let url = `${URL_SERVICIOS}/usuario/${id}`;
    url += '?token=' + this.token;

    return this.http.delete(url)
      .pipe(
        map(resp => {
          Swal.fire(
            'Usuario borrado',
            'El usuario ha sido eliminado correctamente',
            'success'
          );
          return true;
        })
      );
  }
}
