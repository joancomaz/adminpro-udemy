import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { UsuarioModel } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  usuario: UsuarioModel;

  constructor(public usuarioService: UsuarioService,
              public router: Router) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
  }

  buscar(termino: string) {
    // console.log(termino);
    this.router.navigate(['/busqueda', termino]);
  }

}
