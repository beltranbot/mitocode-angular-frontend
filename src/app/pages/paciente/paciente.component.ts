import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css'],
})
export class PacienteComponent implements OnInit {
  displayedColumns = ['idPaciente', 'nombres', 'apellidos', 'acciones'];
  dataSource: MatTableDataSource<Paciente>;

  constructor(
    private pacienteService: PacienteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.pacienteService.listar().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.pacienteService.getPacienteCambio().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.pacienteService.getMensajeCambio().subscribe((data) => {
      this.snackBar.open(data, 'AVISO', {duration: 2000});
    });
  }

  eliminar(idPaciente) {}
}
