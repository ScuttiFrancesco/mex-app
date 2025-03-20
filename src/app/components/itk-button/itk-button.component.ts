import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  numberAttribute,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-itk-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="Type"
      [disabled]="Disabled"
      [ngClass]="CssClass"
      [style.width.%]="Size"
      (click)="clicked.emit(true)"
    >
      <span class="material-icons cursor-pointer"> {{ Icon }} </span>

      {{ Text }}
    </button>
  `,
  styles: [
    `
      .btn-primary,
      .btn-outline,
      .btn-primary-disabled,
      .btn-delete,
      .btn-delete-secondary,
      .btn-stylized,
      .btn-simple {
        border-radius: 5px;
        width: 15vw;
        height: 5vh;
        background-color:rgb(216, 226, 248);
        text-transform: uppercase;
        color: black;
        letter-spacing: 2px;
        border: solid 1px black;
        padding: 0.5rem;
      }

      .btn-primary-disabled {
        background-color: var(--primary-blue-disabled);
      }

      .btn-outline {
        background-color: white;
        color: var(--primary-blue);
        border: 2px solid var(--primary-blue);
      }

      .btn-delete {
        background-color: var(--primary-red);
        color: white;
      }

      .btn-delete-secondary {
        background-color: var(--secondary-red);
        color: var(--primary-red);
      }

      .btn-stylized,
      .btn-simple:hover {
        text-decoration: underline;
        color: var(--primary-blue);
        background-color: white;
        box-shadow: none;
        text-underline-offset: 4px;
        text-decoration-thickness: 2px;
      }

      .btn-simple {
        background-color: white;
        color: black;
        box-shadow: none;
        width: fit-content !important;
      }

      .material-icons {
        color: white;
      }
    `,
  ],
})
export class ItkButtonComponent implements OnInit {
  @Input() Type!: string;
  @Input() Icon!: string;
  @Input({ required: false }) Text!: string;
  @Input() Disabled!: boolean;
  @Input() CssClass: string = 'btn-primary';
  @Output() clicked: EventEmitter<boolean> = new EventEmitter();
  @Input({ transform: numberAttribute }) Size: number = 100;

  constructor(public router: Router) {}

  ngOnInit() {}
}
