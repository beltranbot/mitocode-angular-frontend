import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Medico } from '../_model/medico';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class MedicoService extends GenericService<Medico> {
  private medicoCambio = new Subject<Medico[]>();
  private mensajeCambio = new Subject<string>();
  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/medicos`);
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
