import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
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
import * as moment from 'moment'
import { ConsultaListaExamenDTO } from 'src/app/_dto/consultaListaExamenDTO';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css'],
})
export class WizardComponent implements OnInit {
  @ViewChild("stepper") stepper : MatStepper;

  isLinear: boolean = false;
  primerFormGroup: FormGroup;
  segundoFormGroup: FormGroup;

  pacientes: Paciente[] = [];
  especialidades: Especialidad[] = [];
  medicos: Medico[] = [];
  examenes: Examen[] = [];

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  diagnostico: string;
  tratamiento: string;
  mensaje: string;

  detalleConsulta: DetalleConsulta[] = [];
  examenSeleccionado: Examen;
  examenesSeleccionados: Examen[] = [];

  medicoSeleccionado: Medico;
  especialidadSeleccionada: Especialidad;
  pacienteSeleccionado: Paciente;

  consultorios: number[] = [];
  consultorioSeleccionado: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private pacienteService: PacienteService,
    private especialidadService: EspecialidadService,
    private medicoService: MedicoService,
    private examenService: ExamenService,
    private consultaService: ConsultaService
  ) {}

  ngOnInit(): void {
    this.primerFormGroup = this.formBuilder.group({
      cboPaciente: ['', Validators.required],
      fecha: ['', new FormControl(new Date(), [Validators.required])],
      diagnostico: new FormControl(''),
      tratamiento: new FormControl(''),
    });

    this.segundoFormGroup = this.formBuilder.group({
      hidden: ['', Validators.required],
    });

    this.listarPacientes();
    this.listarExamenes();
    this.listarMedicos();
    this.listarEspecialidad();
    this.listarConsultorios();
  }

  listarPacientes() {
    this.pacienteService.listar().subscribe((data) => {
      this.pacientes = data;
    });
  }

  listarExamenes() {
    this.examenService.listar().subscribe((data) => {
      this.examenes = data;
    });
  }

  listarMedicos() {
    this.medicoService.listar().subscribe((data) => {
      this.medicos = data;
    });
  }

  listarEspecialidad() {
    this.especialidadService.listar().subscribe((data) => {
      this.especialidades = data;
    });
  }

  listarConsultorios() {
    for (let i = 1; i <= 20; i++) {
      this.consultorios.push(i);
    }
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.value;
  }

  seleccionarEspecialidad(e: any) {
    this.especialidadSeleccionada = e.value;
  }

  seleccionarMedico(medico: Medico) {
    this.medicoSeleccionado = medico;
  }

  seleccionarConsultorio(c: number) {
    this.consultorioSeleccionado = c;
  }

  agregar() {
    if (
      this.primerFormGroup.value['diagnostico'] != null &&
      this.primerFormGroup.value['diagnostico'].length > 0 &&
      this.primerFormGroup.value['tratamiento'] != null &&
      this.primerFormGroup.value['tratamiento'].length > 0
    ) {
      let det = new DetalleConsulta();
      det.diagnostico = this.primerFormGroup.value['diagnostico'];
      det.tratamiento = this.primerFormGroup.value['tratamiento'];
      this.detalleConsulta.push(det);
      this.primerFormGroup.controls['diagnostico'].reset();
      this.primerFormGroup.controls['tratamiento'].reset();
    } else {
      this.mensaje = 'Debe agregar un diagnóstico y tratamiento';
      this.snackBar.open(this.mensaje, 'Aviso', { duration: 2000 });
    }
  }

  removedDiagnostico(index: number) {
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

  nextManualStep() {    
    if (this.consultorioSeleccionado > 0) {
      this.stepper.linear = false;
      this.stepper.next()
    } else {
      this.snackBar.open('DEBES SELECCIONAR ASIENTO', 'INFO', {duration: 2000})
    }
  }

  isRegistrarDisabled() {
    return (
      this.detalleConsulta.length === 0 ||
      this.primerFormGroup.value['cboPaciente'] === null ||
      typeof this.primerFormGroup.value['cboPaciente'] !== 'object' ||
      this.primerFormGroup.value['cboPaciente'].idPaciente === 0 ||
      this.medicoSeleccionado === null ||
      this.especialidadSeleccionada === null ||
      this.consultorioSeleccionado === 0
    );
  }

  registrar() {
    let consulta = new Consulta();
    consulta.paciente = this.primerFormGroup.value['cboPaciente'];
    consulta.medico = this.medicoSeleccionado;
    consulta.especialidad = this.especialidadSeleccionada;
    consulta.numConsultorio = `c${this.consultorioSeleccionado}`;
    consulta.fecha = moment(this.primerFormGroup.value['fecha']).format(
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
    this.primerFormGroup.controls['diagnostico'].reset();
    this.primerFormGroup.controls['tratamiento'].reset();
    this.primerFormGroup.controls['cboPaciente'].reset();
    this.medicoSeleccionado = undefined;
    this.especialidadSeleccionada= undefined;
    this.consultorioSeleccionado = 0;
    this.primerFormGroup.controls['fecha'].setValue(new Date());
    this.consultorioSeleccionado = 0; 
    this.examenSeleccionado = null;
    this.mensaje = '';
    this.stepper.reset();
  }
}
