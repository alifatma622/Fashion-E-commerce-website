import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IdentityRoutingModule } from './identity-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
// import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [


    // LoginComponent,
    RegisterComponent


  ],
  imports: [
    CommonModule,
    IdentityRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,


  ]
})
export class IdentityModule { }
