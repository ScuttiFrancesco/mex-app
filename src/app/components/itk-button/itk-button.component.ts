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
      .btn-outline{
        border-radius: 5px;
        width: 15vw;
        height: 5vh;
        background-color:rgb(216, 226, 248);
        text-transform: uppercase;
        color: black;
        letter-spacing: 2px;
        border: solid 1px black;   
        padding-right: 5px;
        padding-left: 5px;     
      }

      .btn-delete{
        border-radius: 5px;
        width: 15vw;
        height: 5vh;
        background-color:rgb(188, 42, 42);
        text-transform: uppercase;
        color: white;
        letter-spacing: 2px;
        border: solid 1px black;
        padding-right: 5px;
        padding-left: 5px; 
      }

      .btn-insert{
        border-radius: 5px;
        width: 15vw;
        height: 5vh;
        background-color:rgb(19, 131, 53);
        text-transform: uppercase;
        color: white;
        letter-spacing: 2px;
        border: solid 1px black;
        padding-right: 5px;
        padding-left: 5px; 
      }

      .btn-primary-disabled {
        border-radius: 5px;
        width: 15vw;
        height: 5vh;
        background-color:rgb(255, 255, 255);
        text-transform: uppercase;
        color: black;
        letter-spacing: 2px;
        border: solid 1px black;
        padding-right: 5px;
        padding-left: 5px;         
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
  @Input() CssClass: string = '';
  @Output() clicked: EventEmitter<boolean> = new EventEmitter();
  @Input({ transform: numberAttribute }) Size: number = 100;

  constructor(public router: Router) {}

  ngOnInit() {}
}
