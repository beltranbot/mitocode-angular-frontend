import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConsultaListaExamenDTO } from '../_dto/consultaListaExamenDTO';
import { FiltroConsultaDTO } from '../_dto/FiltroConsultaDTO';
import { Consulta } from '../_model/consulta';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class ConsultaService extends GenericService<Consulta> {
  constructor(protected http: HttpClient) {
    super(http, `${environment.HOST}/consultas`);
  }

  registrarTransaccion(consultaDTO: ConsultaListaExamenDTO) {
    return this.http.post(this.url, consultaDTO);
  }

  buscar(filtroConsulta: FiltroConsultaDTO) {
    return this.http.post<Consulta[]>(`${this.url}/buscar`, filtroConsulta);
  }
}
