import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ItkButtonComponent } from '../itk-button/itk-button.component';
import { Data } from '@angular/router';
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
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let riga of righe">
            <td *ngFor="let cella of riga">
              {{ cella }}
            </td>
            <td>
              <div class="button-container">
                <app-itk-button
                  [Text]="'elimina'"
                  [CssClass]="'btn-delete'"
                  [Size]="100"
                  (clicked)="delete(riga[0])"
                />
                <app-itk-button
                  [Text]="'modifica'"
                  [CssClass]="'btn-insert'"
                  [Size]="100"
                  (clicked)="update(riga[0])"
                />
              </div>
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
        margin: 10vh auto;
        padding: 0;
      }

      td,
      th {
        border: 1px solid black;
        padding: 5px;
        text-align: center;
      }
      th {
        font-size: 1.25em;
        color: rgb(157, 43, 43);
        // width: 20%;
      }
      .button-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        gap: 5px;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, ItkButtonComponent],
})
export class ItkTablesComponent {
  dataService: DataService = inject(DataService);
  @Input() colonne: string[] = [];
  @Input() righe: any[] = [];
  @Input() elimina: string = 'Elimina';
  @Output() deleteRow = new EventEmitter<string>();

  delete(id: string) {
    this.deleteRow.emit(id);
    this.dataService.rigaDelete.set(id);
  }
  update(id: string) {
    this.dataService.rigaEdit.set(id);
  }
}
