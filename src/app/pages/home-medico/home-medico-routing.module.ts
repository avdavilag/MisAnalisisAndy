import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeMedicoPage } from './home-medico.page';

import {CheckActivePedidos} from '../../seguridad/CheckActivePedidos'

const routes: Routes = [
  {
    path: '',
    component: HomeMedicoPage,
    children: [
      {
        path: 'ingreso-orden',
       // loadChildren: '../ingreso-pedido/ingreso-pedido.module#IngresoPedidoPageModule'
        loadChildren: () => import('../ingreso-orden/ingreso-orden.module').then( m => m.IngresoOrdenPageModule),
        
      },  
      {
        path: 'ingreso-pedido',
       // loadChildren: '../ingreso-pedido/ingreso-pedido.module#IngresoPedidoPageModule'
        loadChildren: () => import('../ingreso-pedido/ingreso-pedido.module').then( m => m.IngresoPedidoPageModule),
        canActivate:[CheckActivePedidos]
      },  
      {
        path: 'lista-ordenes',
       // loadChildren: '../ingreso-pedido/ingreso-pedido.module#IngresoPedidoPageModule'
        loadChildren: () => import('../lista-orden/lista-orden.module').then( m => m.ListaOrdenPageModule),
      },
      {
        path: 'lista-pedidos',
       // loadChildren: '../ingreso-pedido/ingreso-pedido.module#IngresoPedidoPageModule'
        loadChildren: () => import('../lista-pedidos/lista-pedidos.module').then( m => m.ListaPedidosPageModule),
        canActivate:[CheckActivePedidos]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'lista-ordenes',
      },
      {
        path: 'lista-ordenes-web',
       // loadChildren: '../ingreso-pedido/ingreso-pedido.module#IngresoPedidoPageModule'
        loadChildren: () => import('../lista-orden-web/lista-orden-web.module').then( m => m.ListaOrdenWebPageModule),
      },



    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeMedicoPageRoutingModule { }
