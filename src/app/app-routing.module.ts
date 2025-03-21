import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'chat/:id',
    loadChildren: () =>
      import('./pages/chat/chat.module').then((m) => m.ChatPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'contact-details/:id',
    loadChildren: () =>
      import('./pages/contact-details/contact-details.module').then(
        (m) => m.ContactDetailsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'insert-contact',
    loadChildren: () => import('./pages/insert-contact/insert-contact.module').then( m => m.InsertContactPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'update-contact/:userId',
    loadChildren: () => import('./pages/update-contact/update-contact.module').then( m => m.UpdateContactPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'tables',
    loadChildren: () => import('./pages/tables/tables.module').then( m => m.TablesPageModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
