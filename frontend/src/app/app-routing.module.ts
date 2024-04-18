import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';
import { RouteGuardService } from './services/route-guard.service';
import { IndexProductComponent } from './IndexProduct/index-product/index-product.component';
import { ProductDetailComponent } from './IndexProduct/index-product/ManageIndex/product-detail/product-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'cafe',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/cafe/dashboard',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren: () =>
          import('./material-component/material.module').then(
            (m) => m.MaterialComponentsModule
          ),
        canActivate: [RouteGuardService],
        data: {
          expectedRole: ['admin', 'user'],
        },
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [RouteGuardService],
        data: {
          expectedRole: ['admin', 'user'],
        },
      },
      {
        path: 'IndexProduct',
        component: IndexProductComponent,
        canActivate: [RouteGuardService],
        data: {
          expectedRole: ['admin', 'user'],
        },
      },
    ],
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
