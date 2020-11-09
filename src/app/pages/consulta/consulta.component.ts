import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Especialidad } from 'src/app/_model/especialidad';
import { Examen } from 'src/app/_model/examen';
import { Medico } from 'src/app/_model/medico';
import { Paciente } from 'src/app/_model/paciente';
import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { ExamenService } from 'src/app/_service/examen.service';
import { MedicoService } from 'src/app/_service/medico.service';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.css'],
})
export class ConsultaComponent implements OnInit {
  pacientes: Paciente[];
  pacientes$: Observable<Paciente[]>; // allows to directly assignate an observa10ble
  medicos$: Observable<Medico[]>;
  especialidades$: Observable<Especialidad[]>;
  examenes$: Observable<Examen[]>;
  idPacienteSeleccionado: number;
  idMedicoSeleccionado: number;
  idExamenSeleccionado: number;
  idEspecialidadSeleccionado: number;

  maxFecha: Date = new Date();
  fechaSeleccionada: Date = new Date();

  constructor(
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private examenService: ExamenService,
    private especialidadService: EspecialidadService
  ) {}

  ngOnInit(): void {
    this.listarPacientes();
    this.pacientes$ = this.pacienteService.listar();
    this.medicos$ = this.medicoService.listar();
    this.examenes$ = this.examenService.listar();
    this.especialidades$ = this.especialidadService.listar();
  }

  listarPacientes() {
    // this.pacienteService.listar().subscribe(data => this.pacientes = data)
    this.pacientes$ = this.pacienteService.listar();
  }
}
