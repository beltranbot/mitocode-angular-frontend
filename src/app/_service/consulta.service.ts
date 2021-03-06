import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ConsultaListaExamenDTO } from '../_dto/consultaListaExamenDTO';
import { ConsultaResumenDTO } from '../_dto/consultaResumenDTO';
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

  listarExamenesPorConsulta(idConsulta: number) {
    return this.http.get<ConsultaListaExamenDTO[]>(`${environment.HOST}/consultaexamenes/${idConsulta}`)
  }

  listarResumen() {
    return this.http.get<ConsultaResumenDTO[]>(`${this.url}/listarResumen`);
  }

  generarReporte() {
    return this.http.get(`${this.url}/generarReporte`, {
      responseType: 'blob'
    })
  }

  guardarArchivo(data: File) {
    let formdata :FormData = new FormData();
    formdata.append('adjunto', data);
    return this.http.post(`${this.url}/guardarArchivo`, formdata);
  }

  leerArchivo() {
    return this.http.get(`${this.url}/leerArchivo/1`, {
      responseType: 'blob'
    })
  }
}
