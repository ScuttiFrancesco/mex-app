import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TablesPageRoutingModule } from './tables-routing.module';

import { TablesPage } from './tables.page';
import { ItkTablesComponent } from 'src/app/components/itk-tables/itk-tables.component';
import { ItkButtonComponent } from 'src/app/components/itk-button/itk-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TablesPageRoutingModule,
    ItkTablesComponent,
    ItkButtonComponent
  ],
  declarations: [TablesPage]
})
export class TablesPageModule {}
