import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
} from '@angular/core';
import { ItkButtonComponent } from '../itk-button/itk-button.component';
import {
  Form,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule, IonTextarea } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  template: `
    <div class="modal">
      <h2>{{ title }}</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <ion-textarea
          #textarea
          formControlName="message"
          id="message"
        ></ion-textarea>
        <div
          *ngIf="
            formControlli['message'].invalid &&
            (formControlli['message'].dirty || formControlli['message'].touched)
          "
          class="error-message"
        >
          <div *ngIf="formControlli['message'].errors?.['required']">
            L'input è obbligatorio.
          </div>
        </div>
        <app-itk-button
        [CssClass]="'btn-primary'"
          Text="Invia"
          [Size]="100"
          type="submit"
          [disabled]="!form.valid"
        ></app-itk-button>
      </form>
      <app-itk-button
      [CssClass]="'btn-primary'"
        Text="Chiudi"
        [Size]="100"
        (click)="chiudiModale()"
      ></app-itk-button>
    </div>
  `,
  styles: [
    `
      .modal {
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 1rem;
        top: 50%;
        left: 50%;
        width: 30%;
        height: 40%;
        transform: translate(-50%, -50%);
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        z-index: 1000;
      }

      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 90%;
        gap: 1rem;
        ion-textarea {
          width: 100%;
          border: 1px solid black;
          background: rgb(242, 242, 242);
        }
      }

      .error-message {
        color: red;
        font-size: 0.8em;
        margin-top: 5px;
      }
    `,
  ],
  imports: [ItkButtonComponent, ReactiveFormsModule, CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalComponent implements OnInit {
  @ViewChild('textarea') textarea: IonTextarea | undefined;
  @Input() title: string | undefined = '';
  @Input() message: string | undefined = '';
  @Output() closeModal = new EventEmitter<string>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.textarea?.setFocus();
    }, 100);
  }

  chiudiModale(param: string = '') {
    return this.closeModal.emit(param ? param : '');
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.message = this.form.value.message;
    console.log(this.message);
    this.chiudiModale(this.message);
  }

  get formControlli() {
    return this.form.controls;
  }
}
