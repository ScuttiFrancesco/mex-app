import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss'],
  standalone: false,
})
export class AddButtonComponent implements OnInit {
  @Input() backgroundAdd: string = '';
  @Input() backgroundLogout: string = '';
  @Input() showSearchInput: boolean = false;
  @Output() showSearchInputChange = new EventEmitter<boolean>();

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {}

  addForm() {
    this.router.navigate(['insert-contact']);
  }
  logout() {
    this.authService.logout();
  }

  search() {
    this.showSearchInput = !this.showSearchInput;
    this.showSearchInputChange.emit(this.showSearchInput);
  }
}


/* import { CommonModule } from '@angular/common';

import {

  Component,

  EventEmitter,

  Input,

  Output,

  numberAttribute,
 
} from '@angular/core';

import { Router } from '@angular/router';
 
@Component({

  selector: 'itk-button',

  standalone: true,

  imports: [CommonModule],

  template: `
 
    <button

        type="button"

        [disabled]="Disabled"

        class="btn mb-4"

        [ngClass]="CssClass"

        [style.width.%]="Size"

        (click)="clicked.emit(true)"
>
<span class="material-icons cursor-pointer"> {{ Icon }} </span>

        {{ Text }}
</button>

 
   

  `,

  styles: `

    .btn-primary, .btn-outline, .btn-primary-disabled, .btn-delete, .btn-delete-secondary, .btn-stylized, .btn-simple {

      border-radius: 8px;

      width: 330px;

      background-color: var(--primary-blue);

      text-transform: uppercase;

      color: white;

      letter-spacing: 2px;

      border: none;

    }

    .btn-primary-disabled{

      background-color: var(--primary-blue-disabled)

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

    .btn-stylized, .btn-simple:hover{

      text-decoration:underline;

      color: var(--primary-blue);

      background-color: white;

      box-shadow: none;

      text-underline-offset: 4px;

      text-decoration-thickness:2px;

    }

    .btn-simple{

      background-color: white;

      color: black;

      box-shadow: none;

      width: fit-content !important;

    }
 
    .material-icons{

      color: white;

    }
 
   

    .

  `

})

export class ButtonComponent {

  @Input() Icon!: string;

  @Input({ required: false }) Text!: string;

  @Input() Disabled!: boolean;

  @Input() CssClass: string = 'btn-primary';

  @Output() clicked: EventEmitter<boolean> = new EventEmitter();

  @Input({ transform: numberAttribute }) Size: number = 100;
 
  constructor(public router: Router){
 
  }

}
  */