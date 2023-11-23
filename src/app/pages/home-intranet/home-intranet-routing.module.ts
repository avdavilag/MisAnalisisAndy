import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeIntranetPage } from './home-intranet.page';

const routes: Routes = [
  {
    path: '',
    component: HomeIntranetPage,
    children:[
      {
        path: 'lista-ordenes',
       // loadChildren: '../ingreso-pedido/ingreso-pedido.module#IngresoPedidoPageModule'
        loadChildren: () => import('../lista-orden/lista-orden.module').then( m => m.ListaOrdenPageModule),
      },
      {
        path: 'ingreso-orden',
        loadChildren: () => import('../ingreso-orden/ingreso-orden.module').then( m => m.IngresoOrdenPageModule)
      },

      {
        path: 'envio-bloque',
        loadChildren: () => import('../envio-bloque/envio-bloque.module').then( m => m.EnvioBloquePageModule)
      },

      {
        path: 'ingreso-orden-completa',
        loadChildren: () => import('../ingreso-orden-completa/ingreso-orden-completa.module').then( m => m.IngresoOrdenCompletaPageModule)
      },

      {
        path: 'envio-iess',
        loadChildren: () => import('../envio-iess/envio-iess.module').then( m => m.EnvioIessPageModule)
      },
      {
        path: 'busqueda-pacientes',
        loadChildren: () => import('../busqueda-pacientes/busqueda-pacientes.module').then( m => m.BusquedaPacientesPageModule)
      },
    
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'lista-ordenes',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeIntranetPageRoutingModule {}
