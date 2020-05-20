import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {

  public tipo: string;
  public id: string;

  public oculto: string = 'oculto';

  public notificacion = new EventEmitter<any>();

  constructor() {
    console.log('Modal Upload listo');
  }

  ocultarModal() {
    this.oculto = 'oculto';
    this.tipo = null;
    this.id = null;

  }

  mostrarModal(tipo: string, id: string) {
    this.oculto = '';
    this.tipo = tipo;
    this.id = id;
  }
}
