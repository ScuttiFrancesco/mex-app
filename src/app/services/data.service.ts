import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  message = signal(new Map<number, string>());

  constructor() { }
}
