import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  clienti=signal([]);
  vetture=signal([]);
  viaggi=signal([]);
  prenotazioni=signal([]);
  servizi=signal([]);
  private http: HttpClient = inject(HttpClient);
  message = signal(new Map<number, string>());
  tipoOggetto = signal(0);
  rigaEdit = signal<string>('');
  rigaDelete = signal<string>('');

  constructor() {
    this.getData('Clienti');
    this.getData('Vetture');
    this.getData('Viaggi');
    this.getData('Prenotazioni');
    this.getData('Servizi');
  }

  getData(tabella: string) {
    this.http.get<any>(`http://localhost:3000/${tabella}`).subscribe(
      (data) => {
        switch (tabella) {
          case 'Clienti':
            this.clienti.set(data);
          break;
          case 'Vetture': 
          this.vetture.set(data);
          break;
          case 'Viaggi':
            this.viaggi.set(data);
          break;
          case 'Prenotazioni':
            this.prenotazioni.set(data);
          break;
          case 'Servizi':
            this.servizi.set(data);
          break;          
          }
          console.log(data);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  insertData(data: any, tabella: string) {
    this.http
      .post<any>(`http://localhost:3000/${tabella}`, data)
      .subscribe((response) => {
        this.getData(tabella);
      });
  }

  deleteData(id: string, tabella: string) {
    this.http
      .delete<any>(`http://localhost:3000/${tabella}/${id}`)
      .subscribe((response) => {
        this.getData(tabella);
      });
  }

  updateDate(id: string, data: any, tabella: string) {
    this.http
      .put<any>(`http://localhost:3000/${tabella}/${id}`, data)
      .subscribe((response) => {
        this.getData(tabella);
      });
  }

  getDataById(id: string, tabella: string) :Observable<any> {
    return this.http.get<any>(`http://localhost:3000/${tabella}/${id}`);
  }
}
