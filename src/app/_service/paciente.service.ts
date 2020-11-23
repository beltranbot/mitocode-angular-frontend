import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Paciente } from '../_model/paciente';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class PacienteService extends GenericService<Paciente> {
  private pacienteCambio = new Subject<Paciente[]>();
  private mensajeCambio = new Subject<string>();

  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/pacientes`);
  }

  //** get set subjects */
  getPacienteCambio() {
    return this.pacienteCambio.asObservable();
  }

  listarPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  setPacienteCambio(pacientes: Paciente[]) {
    this.pacienteCambio.next(pacientes);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
