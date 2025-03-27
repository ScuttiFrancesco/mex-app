import { Component, effect, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  Form,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ItkButtonComponent } from '../itk-button/itk-button.component';
import { CommonModule } from '@angular/common';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-form',
  template: `
    <div>
      <h1>Form</h1>
      <form class="container" [formGroup]="form" (ngSubmit)="submit()">
        @for (item of validators(this.oggettoArray); track $index) { @if
        ((formControlli[item].dirty || formControlli[item].touched) &&
        formControlli[item].errors?.['required']) {

        <div class="error-message">
          {{ formControlli[item].errors?.['required'].message}}
        </div>
        } @if(this.object){
        <input [formControlName]="item" [placeholder]="item + '*'" />}@else{

        <input [formControlName]="item" [placeholder]="item + '*'" />}}

        <app-itk-button
          [Text]="'Invia'"
          [CssClass]="form.valid ? 'btn-primary' : 'btn-primary-disabled'"
          [Disabled]="form.invalid"
          [Size]="100"
        ></app-itk-button>
      </form>
    </div>
  `,
  styles: [
    `
      h1 {
        font-size: 2em;
        color: rgb(157, 43, 43);
        text-align: center;
        margin-top: 4vh;
      }
      input {
        width: 35%;
        padding: 10px;
        margin: 10px 0;
        border-radius: 5px;
        border: 1px solid black;
      }
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 3vh;
        margin-bottom: 3vh;
      }
      .error-message {
        color: red;
      }
    `,
  ],
  standalone: true,
  imports: [ReactiveFormsModule, ItkButtonComponent, CommonModule],
})
export class FormComponent implements OnInit {
  oggettoArray = 0;
  form!: FormGroup;
  mappaInput = new Map();
  mappa = new Map();
  object: any;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.mappa.set(1, 'Clienti');
    this.mappa.set(2, 'Vetture');
    this.mappa.set(3, 'Viaggi');
    this.mappa.set(4, 'Prenotazioni');
    this.mappa.set(5, 'Servizi');
    this.mappaInput.set(1, ['nome', 'cognome', 'indirizzo', 'telefono']);
    this.mappaInput.set(2, ['targa', 'modello', 'marca']);
    this.mappaInput.set(3, ['data', 'destinazione']);
    this.mappaInput.set(4, [
      'id_prenotazione',
      'id_cliente',
      'id_viaggio',
      'data_prenotazione',
      'stato',
    ]);
    this.mappaInput.set(5, [
      'id_servizio',
      'nome_servizio',
      'descrizione',
      'prezzo',
    ]);
    this.oggettoArray = Number(this.dataService.tipoOggetto());
    if (this.oggettoArray === 1) {
      this.form = this.fb.group({
        nome: ['', this.requiredWithMessage('nome')],
        cognome: ['', this.requiredWithMessage('cognome')],
        indirizzo: [''],
        telefono: [''],
      });
    } else if (this.oggettoArray === 2) {
      this.form = this.fb.group({
        targa: ['', this.requiredWithMessage('targa')],
        modello: [''],
        marca: [''],
      });
    } else if (this.oggettoArray === 3) {
      this.form = this.fb.group({
        data: ['', this.requiredWithMessage('data')],
        destinazione: ['', this.requiredWithMessage('destinazione')],
      });
    } else if (this.oggettoArray === 4) {
      this.form = this.fb.group({
        id_prenotazione: ['', this.requiredWithMessage('id')],
        id_cliente: ['', this.requiredWithMessage('id')],
        id_viaggio: ['', this.requiredWithMessage('id')],
        data_prenotazione: [
          '',
          [this.requiredWithMessage('data'), this.dateValidator],
        ],
        stato: [''],
      });
    } else if (this.oggettoArray === 5) {
      this.form = this.fb.group({
        id_servizio: ['', this.requiredWithMessage('id')],
        nome_servizio: ['', this.requiredWithMessage('nome')],
        descrizione: [''],
        prezzo: [''],
      });
    }
    effect(() => {
      const rigaid = this.dataService.rigaEdit();
      const rigaDeleteId = this.dataService.rigaDelete();
      console.log('Effect triggered, valore attuale rigaId:', rigaid);
      if (rigaid) {
        this.onUpdate(rigaid);
      }
      if (this.object && rigaDeleteId === this.object.id) {
       this.form.reset();
      }
    });
  }

  ngOnInit() {}

  get formControlli() {
    return this.form.controls;
  }

  submit() {
    if (!this.object) {
     
      this.dataService.insertData(
        this.form.value, 
        this.mappa.get(this.oggettoArray)
      );
    } else {
      
      const data = {
        id: this.object.id,
          ...this.form.value
       
      };
      console.log('Dati da inviare per update:', data);
      
      this.dataService.updateDate(
        this.object.id, 
        data, 
        this.mappa.get(this.oggettoArray)
      );
    }
    this.form.reset();
    this.object = undefined; 
    this.dataService.rigaEdit.set('');
  }

  validators(num: number): string[] {
    return this.mappaInput.get(num);
  }

  private dateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(control.value)) {
        // Restituisce un oggetto con la proprietà personalizzata per l'errore
        return {
          dateFormat: { message: 'Formato data non valido (YYYY-MM-DD)' },
        };
      }

      return null;
    };
  }

  private requiredWithMessage(fieldName: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.length === 0) {
        return { required: { message: `${fieldName} è obbligatorio` } };
      }
      return null;
    };
  }

  onUpdate(id: string) {
    this.dataService
      .getDataById(id, this.mappa.get(this.oggettoArray).toString())
      .subscribe((data) => {
        this.object = data;
        this.form.patchValue(data);
      });
  }
}
