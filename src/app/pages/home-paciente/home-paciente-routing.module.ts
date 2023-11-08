import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePacientePage } from './home-paciente.page';

const routes: Routes = [
  
  {
    path: '',
    component: HomePacientePage,
    children:[
      {
        path: 'lista-ordenes',
       // loadChildren: '../ingreso-pedido/ingreso-pedido.module#IngresoPedidoPageModule'
        loadChildren: () => import('../lista-orden/lista-orden.module').then( m => m.ListaOrdenPageModule),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'lista-ordenes',
      }
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePacientePageRoutingModule {}
