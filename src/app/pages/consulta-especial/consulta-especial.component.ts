import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-consulta-especial',
  templateUrl: './consulta-especial.component.html',
  styleUrls: ['./consulta-especial.component.css'],
})
export class ConsultaEspecialComponent implements OnInit {
  form: FormGroup;
  pacientes: Paciente[];

  // utiles para autocomplete
  myControlPaciente: FormControl = new FormControl();
  pacientesFiltrados$: Observable<Paciente[]>;

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      paciente: this.myControlPaciente,
      especialidad: new FormControl(),
      medico: new FormControl(),
      fecha: new FormControl(new Date()),
      diagnostico: new FormControl(''),
      tratamiento: new FormControl(''),
    });

    this.listarPacientes();
    this.pacientesFiltrados$ = this.myControlPaciente.valueChanges.pipe(
      map((val) => this.filtrarPacientes(val))
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

  aceptar() {}
}
