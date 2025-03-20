import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InsertContactPage } from './insert-contact.page';

const routes: Routes = [
  {
    path: '',
    component: InsertContactPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsertContactPageRoutingModule {}
