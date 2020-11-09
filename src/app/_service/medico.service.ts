import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Medico } from '../_model/medico';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private medicoCambio = new Subject<Medico[]>();
  private mensajeCambio = new Subject<string>();

  private url: string = `${environment.HOST}/medicos`;
  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Medico[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<Medico>(`${this.url}/${id}`);
  }

  registrar(medico: Medico) {
    return this.http.post(this.url, medico);
  }

  modificar(medico: Medico) {
    return this.http.put(this.url, medico);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  //** get set subjects */
  getMedicoCambio() {
    return this.medicoCambio.asObservable();
  }

  setMedicoCambio(medicos: Medico[]) {
    this.medicoCambio.next(medicos);
  }

  getMensajeCambio() {
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string) {
    this.mensajeCambio.next(mensaje);
  }
}
