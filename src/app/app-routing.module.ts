import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntersectPlaneComponent } from './component/intersect-plane/intersect-plane.component';

const routes: Routes = [
  { path: '', redirectTo: 'intersection', pathMatch: 'full' },
  { path: 'intersection', component: IntersectPlaneComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
