import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
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
  @ViewChild(MatSort) sort: MatSort; //you can reference by alias or using the class as longs as there is only one occurence of it in the view
  @ViewChild(MatPaginator) paginator : MatPaginator;

  constructor(
    private pacienteService: PacienteService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.pacienteService.listar().subscribe((data) => {
      this.crearTabla(data);
    });

    this.pacienteService.getPacienteCambio().subscribe((data) => {
      this.crearTabla(data);
    });

    this.pacienteService.getMensajeCambio().subscribe((data) => {
      this.snackBar.open(data, 'AVISO', { duration: 2000 });
    });
  }

  eliminar(idPaciente: number) {
    this.pacienteService
      .eliminar(idPaciente)
      .pipe(
        switchMap(() => {
          return this.pacienteService.listar();
        })
      )
      .subscribe((data) => {
        this.pacienteService.setPacienteCambio(data);
        this.pacienteService.setMensajeCambio('SE ELIMINO');
      });
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  crearTabla(data: Paciente[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
