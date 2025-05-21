import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SliderComponent } from './slider/slider.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    // No declarations needed for standalone components

  ],
  imports: [
    CommonModule,
    NavBarComponent,
    SliderComponent,
    RouterModule

  ],
  exports: [
    NavBarComponent,
    SliderComponent,
    RouterModule
  ]
})
export class CoreModule { }
