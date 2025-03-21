import { Component, inject, OnInit } from '@angular/core';
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
  pageSize: number = 2;
  totalPages: number = 1;
  page:any[] = [];

  ngOnInit() {
    const data = this.dataService.data;
    const oggettoArray = Number(this.dataService.tipoOggetto());
    const oggetto = Tabelle[oggettoArray].toString();
    const currentObj = data[oggettoArray - 1];
    this.tableTitle = oggetto.toUpperCase();

    if (currentObj && currentObj[oggetto] && currentObj[oggetto].length > 0) {
      const firstItem = currentObj[oggetto][0];
      this.colonne = Object.keys(firstItem);
      this.righe = currentObj[oggetto].map((item: any) => Object.values(item));
    }

    this.totalPages = Math.ceil(this.righe.length / this.pageSize);
    this.updatePaged();
    console.log(this.righe);
    console.log(this.colonne);
    
  }

  updatePaged() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.page = this.righe.slice(start, start + this.pageSize);
    console.log(this.page);
    console.log(this.currentPage);
    
    
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
}
