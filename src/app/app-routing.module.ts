import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IntersectPlaneComponent } from './component/intersect-plane/intersect-plane.component';
import { ParticlePointComponent } from './component/particle-point/particle-point.component';

const routes: Routes = [
  { path: '', redirectTo: 'intersect-plane', pathMatch: 'full' },
  { path: 'intersect-plane', component: IntersectPlaneComponent },
  { path: 'particle-point', component: ParticlePointComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
