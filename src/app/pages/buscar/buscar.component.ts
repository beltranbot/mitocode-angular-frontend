import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FiltroConsultaDTO } from 'src/app/_dto/FiltroConsultaDTO';
import { ConsultaService } from 'src/app/_service/consulta.service';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Consulta } from 'src/app/_model/consulta';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BuscarDialogoComponent } from './buscar-dialogo/buscar-dialogo.component';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
})
export class BuscarComponent implements OnInit {
  form: FormGroup;
  maxFecha: Date = new Date();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = [
    'paciente',
    'medico',
    'especialidad',
    'fecha',
    'acciones',
  ];
  dataSource: MatTableDataSource<Consulta>;

  constructor(
    private consultaservice: ConsultaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      dni: new FormControl(''),
      nombreCompleto: new FormControl(''),
      fechaConsulta: new FormControl(),
    });
  }

  buscar() {
    let fecha =
      this.form.value['fechaConsulta'] !== null
        ? moment(this.form.value['fechaConsulta']).format('YYYY-MM-DDTHH:mm:ss')
        : null;
    let filtro = new FiltroConsultaDTO(
      this.form.value['dni'],
      this.form.value['nombreCompleto'],
      fecha
    );

    if (filtro.fechaConsulta) {
      delete filtro.dni;
      delete filtro.nombreCompleto;
    } else {
      delete filtro.fechaConsulta;
      if (filtro.dni.length === 0) {
        delete filtro.dni;
      }

      if (filtro.nombreCompleto.length === 0) {
        delete filtro.nombreCompleto;
      }
    }

    this.consultaservice.buscar(filtro).subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  verDetalle(consulta: Consulta) {
    this.dialog.open(BuscarDialogoComponent, {
      data: consulta
    });
  }
}
