import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop/shop.component';
import { HomeComponent } from './home/home/home.component';
import { RegisterComponent } from './identity/register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop',component: ShopComponent },
  { path: 'register', component: RegisterComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
