import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { DetalleConsulta } from 'src/app/_model/detalleConsulta';
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

  diagnostico: string;
  tratamiento: string;

  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  constructor(
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private examenService: ExamenService,
    private especialidadService: EspecialidadService,
    private snackBar : MatSnackBar
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

  agregar() {
    if (this.diagnostico != null && this.tratamiento != null) {
      let det = new DetalleConsulta();
      det.diagnostico = this.diagnostico;
      det.tratamiento = this.tratamiento;

      this.detalleConsulta.push(det);

      this.diagnostico = null;
      this.tratamiento = null;
    }
  }

  removerDiagnostico(index: number) {
    this.detalleConsulta.splice(index, 1);
  }

  agregarExamen() {
    if (this.idExamenSeleccionado > 0) {
      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.idExamenSeleccionado) {
          cont++;
          break;
        }
      }

      if (cont > 0) {
        let mensaje = 'El examen se encuentra en la lista';
        this.snackBar.open(mensaje, 'AVISO', { duration: 2000 });
      } else {
        this.examenService
          .listarPorId(this.idExamenSeleccionado)
          .subscribe((data) => {
            this.examenesSeleccionados.push(data);
          });
      }
    }
  }

  removerExamen(index: number) {
    this.examenesSeleccionados.splice(index, 1);
  }
}
