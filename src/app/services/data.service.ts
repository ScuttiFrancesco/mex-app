import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  data: any[] = [];
  private http:HttpClient = inject(HttpClient);
  message = signal(new Map<number, string>());
  tipoOggetto = signal(0);

  constructor() { 
    this.getData();
    console.log(this.data);
  }

  getData() {
    this.http.get<any[]>('./assets/dati-api.json').subscribe(
      (data) => {
        data.forEach((element: any) => {
          this.data.push(element);} );
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
