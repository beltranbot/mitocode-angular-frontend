import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Medico } from 'src/app/_model/medico';
import { Paciente } from 'src/app/_model/paciente';
import { MedicoService } from 'src/app/_service/medico.service';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-consulta-especial',
  templateUrl: './consulta-especial.component.html',
  styleUrls: ['./consulta-especial.component.css'],
})
export class ConsultaEspecialComponent implements OnInit {
  form: FormGroup;
  pacientes: Paciente[];
  medicos: Medico[];

  // utiles para autocomplete
  myControlPaciente: FormControl = new FormControl();
  pacientesFiltrados$: Observable<Paciente[]>;
  myControlMedico: FormControl = new FormControl();
  medicosFiltrados$: Observable<Medico[]>;

  constructor(
    private pacienteService: PacienteService,
    private medicoService: MedicoService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      paciente: this.myControlPaciente,
      especialidad: new FormControl(),
      medico: this.myControlMedico,
      fecha: new FormControl(new Date()),
      diagnostico: new FormControl(''),
      tratamiento: new FormControl(''),
    });

    this.listarPacientes();
    this.listarMedicos();
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

  aceptar() {}
}
