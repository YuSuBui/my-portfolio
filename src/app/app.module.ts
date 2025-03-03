import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

import { IntersectPlaneComponent } from './component/intersect-plane/intersect-plane.component';
import { ItemAComponent } from './ui/item-a/item-a.component';
import { ParticlePointComponent } from './component/particle-point/particle-point.component';

@NgModule({
  declarations: [
    AppComponent,
    IntersectPlaneComponent,
    ItemAComponent,
    ParticlePointComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule, //PrimeNG
    ButtonModule, //PrimeNG
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
