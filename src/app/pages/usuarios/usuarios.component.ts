import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: UsuarioModel[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public usuarioService: UsuarioService,
              public modalUploadService: ModalUploadService) {
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.modalUploadService.notificacion
      .subscribe(resp => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe((resp: any) => {
        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;
        this.cargando = false;
      });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;
    console.log(desde);

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino: string) {
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }
    this.usuarioService.buscarUsuarios(termino)
      .subscribe((usuarios: UsuarioModel[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario(usuario: UsuarioModel) {
    if (usuario._id === this.usuarioService.usuario._id) {
      Swal.fire('No puede borrar usuario', 'No se puede borrar a sí mismo', 'error');
      return;
    }

    Swal.fire({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((borrar) => {
      if (borrar.value) {
        this.usuarioService.borrarUsuario(usuario._id)
          .subscribe((borrado: boolean) => {
            console.log(borrado);
            this.cargarUsuarios();
          });
      }
    });
  }

  guardarUsuario(usuario: UsuarioModel) {
    this.usuarioService.actualizarUsuario(usuario)
      .subscribe();
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }

}
