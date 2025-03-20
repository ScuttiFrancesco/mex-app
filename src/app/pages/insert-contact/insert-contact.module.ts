import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InsertContactPageRoutingModule } from './insert-contact-routing.module';

import { InsertContactPage } from './insert-contact.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InsertContactPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [InsertContactPage]
})
export class InsertContactPageModule {}
