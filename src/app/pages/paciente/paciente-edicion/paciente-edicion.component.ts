import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-paciente-edicion',
  templateUrl: './paciente-edicion.component.html',
  styleUrls: ['./paciente-edicion.component.css'],
})
export class PacienteEdicionComponent implements OnInit {
  form: FormGroup; // links to the form in the view
  id: number;
  edicion: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(0),
      nombres: new FormControl(''),
      apellidos: new FormControl(''),
      dni: new FormControl(''),
      telefono: new FormControl(''),
      direccion: new FormControl(''),
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });
  }

  private initForm() {
    if (this.edicion) {
      this.pacienteService.listarPorId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          id: new FormControl(data.idPaciente),
          nombres: new FormControl(data.nombres),
          apellidos: new FormControl(data.apellidos),
          dni: new FormControl(data.dni),
          telefono: new FormControl(data.telefono),
          direccion: new FormControl(data.direccion),
        });
      });
    }
  }

  operar() {
    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];

    if (this.edicion) {
      // modificar
      this.pacienteService.modificar(paciente).subscribe(() => {
        this.pacienteService.listar().subscribe((data) => {
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.setMensajeCambio('SE MODIFICO');
        });
      });
    } else {
      // registar
      this.pacienteService.registrar(paciente).subscribe(() => {
        this.pacienteService.listar().subscribe((data) => {
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.setMensajeCambio('SE REGISTRO');
        });
      });
    }

    this.router.navigate(['paciente']);
  }
}
