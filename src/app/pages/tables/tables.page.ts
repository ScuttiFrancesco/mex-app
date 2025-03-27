import { Component, effect, inject, OnInit } from '@angular/core';
import { Tabelle } from 'src/app/models/Tabelle';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.page.html',
  styleUrls: ['./tables.page.scss'],
  standalone: false,
})
export class TablesPage implements OnInit {

  private dataService: DataService = inject(DataService);
  tableTitle: string = '';
  processedData: any = {};
  colonne: string[] = [];
  righe: any[] = [];

  currentPage: number = 1;
  pageSize: number = 3;
  totalPages: number = 1;
  page: any[] = [];

  constructor() {
    effect(() => {
      this.processData();
    });
  }

  ngOnInit() {
    this.processData();
  }

  processData() {
    const data = [];
    data.push(this.dataService.clienti());
    data.push(this.dataService.vetture());
    data.push(this.dataService.viaggi());
    data.push(this.dataService.prenotazioni());
    data.push(this.dataService.servizi());
    const oggettoArray = Number(this.dataService.tipoOggetto());
    const oggetto = Tabelle[oggettoArray].toString();
    const currentObj = data[oggettoArray - 1] as any;
    this.tableTitle = oggetto.toUpperCase();
    if (Tabelle[oggettoArray] === 'Clienti') {
      console.log('Clienti');
    }

    if (currentObj && currentObj.length > 0) {
      const firstItem = currentObj[0];
      this.colonne = Object.keys(firstItem);
      this.righe = currentObj.map((item: any) => Object.values(item));
    }

    this.totalPages = Math.ceil(this.righe.length / this.pageSize);
    this.updatePaged();
  }

  updatePaged() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.page = this.righe.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaged();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaged();
    }
  }

  onDelete(id: string) {
    this.dataService.deleteData(id, Tabelle[Number(this.dataService.tipoOggetto())].toString());
    this.processData();
  }


}


