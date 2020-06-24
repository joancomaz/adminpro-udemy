import { Injectable } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: UsuarioModel;
  token: string;
  menu: any = [];

  constructor(public http: HttpClient,
              public router: Router,
              public subirArchivoService: SubirArchivoService) {
    this.cargarStorage();
  }

  renuevaToken() {
    let url = `${URL_SERVICIOS}/login/renuevatoken`;
    url += `?token=${this.token}`;

    return this.http.get(url)
      .pipe(
        map((resp: any) => {
          this.token = resp.token;
          localStorage.setItem('token', this.token);
          console.log('Token renovado');
          return true;
        }), catchError(err => {
          this.router.navigate(['/login']);
          Swal.fire('No se pudo renovar el token', 'No se pudo renovar el token', 'error');
          return throwError(err);
        })
      );
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
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage(id: string, token: string, usuario: UsuarioModel, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle(token: string) {
    const url = `${URL_SERVICIOS}/login/google`;
    return this.http.post(url, { token })
      .pipe(
        map((resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
          console.log(resp);
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
          this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
          return true;
        }), catchError(err => {
          // console.log(err.error.mensaje);
          Swal.fire('Error en el login', err.error.mensaje, 'error');
          return throwError(err);
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
        }), catchError(err => {
          // console.log(err.error.mensaje);
          Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
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
            this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
          }

          Swal.fire('Usuario actualizado', usuario.nombre, 'success');
          return true;
        }), catchError(err => {
          // console.log(err.error.mensaje);
          Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        })
      );
  }

  cambiarImagen(file: File, id: string) {
    this.subirArchivoService.subirArchivo(file, 'usuarios', id)
      .then((resp: any) => {
        this.usuario.img = resp.usuario.img;
        Swal.fire('Imagen actualizada', this.usuario.nombre, 'success');
        this.guardarStorage(id, this.token, this.usuario, this.menu);
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
