import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Especialidad } from '../_model/especialidad';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadService extends GenericService<Especialidad> {
  private especialidadCambio = new Subject<Especialidad[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/especialidades`);
  }

  //** get set subjects */
  getEspecialidadCambio() {
    return this.especialidadCambio.asObservable();
  }

  setEspecialidadCambio(especialidades: Especialidad[]) {
    this.especialidadCambio.next(especialidades);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
