import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Tabelle } from 'src/app/models/Tabelle';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-itk-tables',
  template: `
    <div>
      <table>
        <thead>
          <tr>
            <th *ngFor="let col of colonne">
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let riga of righe">
            <td *ngFor="let cella of riga">
              {{ cella }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      table {
        width: 90%;
        border-collapse: collapse;
        margin: 10vh auto;
      }
      td,
      th {
        border: 1px solid black;
        padding: 10px;
        text-align: center;
      }
      th {
        font-size: 1.25em;
        color: rgb(157, 43, 43);
        width: 20%;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule],
})
export class ItkTablesComponent {
  @Input() colonne: string[] = [];
  @Input() righe: any[] = [];

  
}
