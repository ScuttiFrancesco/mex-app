import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AddButtonComponent } from '../components/add-button/add-button.component';



@NgModule({
  declarations: [AddButtonComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[AddButtonComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
