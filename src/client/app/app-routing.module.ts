import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultComponent } from './components/default.component';

const appRoutes: Routes = [
  { path: 'default', component: DefaultComponent },
  { path: 'lazy', loadChildren: './components/lazy/lazy.module#LazyModule' },
  { path: '', redirectTo: '/default', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
