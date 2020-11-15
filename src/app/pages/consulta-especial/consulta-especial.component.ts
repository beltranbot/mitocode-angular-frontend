import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Consulta } from 'src/app/_model/consulta';
import { DetalleConsulta } from 'src/app/_model/detalleConsulta';
import { Especialidad } from 'src/app/_model/especialidad';
import { Examen } from 'src/app/_model/examen';
import { Medico } from 'src/app/_model/medico';
import { Paciente } from 'src/app/_model/paciente';
import { ConsultaService } from 'src/app/_service/consulta.service';
import { EspecialidadService } from 'src/app/_service/especialidad.service';
import { ExamenService } from 'src/app/_service/examen.service';
import { MedicoService } from 'src/app/_service/medico.service';
import { PacienteService } from 'src/app/_service/paciente.service';
import * as moment from 'moment';
import { ConsultaListaExamenDTO } from 'src/app/_dto/consultaListaExamenDTO';

@Component({
  selector: 'app-consulta-especial',
  templateUrl: './consulta-especial.component.html',
  styleUrls: ['./consulta-especial.component.css'],
})
export class ConsultaEspecialComponent implements OnInit {
  form: FormGroup;
  pacientes: Paciente[];
  medicos: Medico[];
  especialidades: Especialidad[];
  examenes: Examen[];

  detalleConsulta: DetalleConsulta[] = [];
  examenesSeleccionados: Examen[] = [];

  mensaje: string;
  examenSeleccionado: Examen;

  maxFecha: Date = new Date();

  // utiles para autocomplete
  myControlPaciente: FormControl = new FormControl();
  pacientesFiltrados$: Observable<Paciente[]>;
  myControlMedico: FormControl = new FormControl();
  medicosFiltrados$: Observable<Medico[]>;
  myControlFecha: FormControl = new FormControl(new Date());
  constructor(
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private especialidadService: EspecialidadService,
    private examenService: ExamenService,
    private consultaService: ConsultaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      paciente: this.myControlPaciente,
      especialidad: new FormControl(),
      medico: this.myControlMedico,
      fecha: this.myControlFecha,
      diagnostico: new FormControl(''),
      tratamiento: new FormControl(''),
    });

    this.listarPacientes();
    this.listarMedicos();
    this.listarEspecialidad();
    this.listarExamenes();
    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(
      map((val) => this.filtrarPacientes(val))
    );
    this.medicosFiltrados$ = this.myControlMedico.valueChanges.pipe(
      map((val) => this.filtrarMedicos(val))
    );
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe((data) => {
      this.pacientes = data;
    });
  }

  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(
        (el) =>
          el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) ||
          el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) ||
          el.dni.includes(val.dni)
      );
    }
    return this.pacientes.filter(
      (el) =>
        el.nombres.toLowerCase().includes(val?.toLowerCase()) ||
        el.apellidos.toLowerCase().includes(val?.toLowerCase()) ||
        el.dni.includes(val)
    );
  }

  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  listarMedicos() {
    this.medicoService.listar().subscribe((data) => {
      this.medicos = data;
    });
  }

  filtrarMedicos(val: any) {
    if (val != null && val.idMedico > 0) {
      return this.medicos.filter(
        (option) =>
          option.nombres.toLowerCase().includes(val.nombres.toLowerCase()) ||
          option.apellidos.toLowerCase().includes(val.apellidos.toLowerCase())
      );
    }
    return this.medicos.filter(
      (el) =>
        el.nombres.toLowerCase().includes(val?.toLowerCase()) ||
        el.apellidos.toLowerCase().includes(val?.toLowerCase()) ||
        el.cmp.includes(val)
    );
  }

  mostrarMedico(val: Medico) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }

  listarEspecialidad() {
    this.especialidadService.listar().subscribe((data) => {
      this.especialidades = data;
    });
  }

  listarExamenes() {
    this.examenService.listar().subscribe((data) => {
      this.examenes = data;
    });
  }

  agregar() {
    if (
      this.form.value['diagnostico'] != null &&
      this.form.value['diagnostico'].length > 0 &&
      this.form.value['tratamiento'] != null &&
      this.form.value['tratamiento'].length > 0
    ) {
      let det = new DetalleConsulta();
      det.diagnostico = this.form.value['diagnostico'];
      det.tratamiento = this.form.value['tratamiento'];
      this.detalleConsulta.push(det);
      this.form.controls['diagnostico'].reset();
      this.form.controls['tratamiento'].reset();
    } else {
      this.mensaje = `Debe agregar un diagnóstico y tratamiento`;
      this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
    }
  }

  removerDiagnostico(index: number) {
    this.detalleConsulta.splice(index, 1);
  }

  agregarExamen() {
    if (this.examenSeleccionado) {
      let cont = 0;
      for (let i = 0; i < this.examenesSeleccionados.length; i++) {
        let examen = this.examenesSeleccionados[i];
        if (examen.idExamen === this.examenSeleccionado.idExamen) {
          cont++;
          break;
        }
      }
      if (cont > 0) {
        this.mensaje = `El examen se encuentra en la lista`;
        this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
      } else {
        this.examenesSeleccionados.push(this.examenSeleccionado);
      }
    } else {
      this.mensaje = `Debe agregar un examen`;
      this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
    }
  }

  removerExamen(index: number) {
    this.examenesSeleccionados.splice(index, 1);
  }

  isRegistrarDisabled() {
    return (
      this.detalleConsulta.length === 0 ||
      this.form.value['paciente'] === null ||
      typeof this.form.value['paciente'] !== 'object' ||
      this.form.value['paciente'].idPaciente === 0 ||
      this.form.value['medico'] === null ||
      typeof this.form.value['medico'] !== 'object' ||
      this.form.value['medico'].idMedico === 0 ||
      this.form.value['especialidad'] === null ||
      typeof this.form.value['especialidad'] !== 'object' ||
      this.form.value['especialidad'].idEspecialidad === 0
    );
  }

  aceptar() {
    let consulta = new Consulta();
    consulta.paciente = this.form.value['paciente'];
    consulta.medico = this.form.value['medico'];
    consulta.especialidad = this.form.value['especialidad'];
    consulta.numConsultorio = 'C1';
    consulta.fecha = moment(this.form.value['fecha']).format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    consulta.detalleConsulta = this.detalleConsulta;
    let consultaListaExamenDTO = new ConsultaListaExamenDTO();
    consultaListaExamenDTO.consulta = consulta;
    consultaListaExamenDTO.lstExamen = this.examenesSeleccionados;

    this.consultaService.registrarTransaccion(consultaListaExamenDTO).subscribe(() => {
      this.snackBar.open("Se registro", "Aviso", {duration: 2000});

      setTimeout(() => {
        this.limpiarControles();
      }, 200)
    })
  }

  limpiarControles() {
    this.detalleConsulta = [];
    this.examenesSeleccionados = [];
    this.form.controls['diagnostico'].reset();
    this.form.controls['tratamiento'].reset();
    this.form.controls['paciente'].reset();
    this.form.controls['medico'].reset();
    this.form.controls['especialidad'].reset();
    this.form.controls['fecha'].setValue(new Date());
    this.examenSeleccionado = null;
    this.mensaje = '';
  }
}
