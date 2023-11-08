import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CheckActive } from './seguridad/CheckActive';
import { CheckActiveIntranet } from './seguridad/CheckActiveIntranet';
import { CheckInactive } from './seguridad/CheckInactive';//NO USO
import { AppConfigService } from 'src/app/utils/app-config-service';
import { CheckActiveMed } from './seguridad/CheckActiveMed';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)

  },
  {
    path: 'lista-orden',
    loadChildren: () => import('./pages/lista-orden/lista-orden.module').then( m => m.ListaOrdenPageModule),
    canActivate: [CheckActive]
  },
  {
    path: 'detalle-orden',
    loadChildren: () => import('./modals/detalle-orden/detalle-orden.module').then( m => m.DetalleOrdenPageModule)
  },
  {
    path: 'popover-usr',
    loadChildren: () => import('./popover/popover-usr/popover-usr.module').then( m => m.PopoverUsrPageModule)
  },
  {
    path: 'popover-filtro',
    loadChildren: () => import('./popover/popover-filtro/popover-filtro.module').then( m => m.PopoverFiltroPageModule)
  },
  {
    path: 'popover-orden',
    loadChildren: () => import('./popover/popover-orden/popover-orden.module').then( m => m.PopoverOrdenPageModule)
  },
  {
    path: 'alert-periodo-filtro',
    loadChildren: () => import('./modals/alert-periodo-filtro/alert-periodo-filtro.module').then( m => m.AlertPeriodoFiltroPageModule)
  },
  {
    path: 'usuarios-disponibles',
    loadChildren: () => import('./pages/usuarios-disponibles/usuarios-disponibles.module').then( m => m.UsuariosDisponiblesPageModule),   
    canActivate: [CheckActive]
  },
  {
    path: 'resultado-orden',
    loadChildren: () => import('./pages/resultado-orden/resultado-orden.module').then( m => m.ResultadoOrdenPageModule)
  },
  {
    path: 'pdf-preview',
    loadChildren: () => import('./pages/pdf-preview/pdf-preview.module').then( m => m.PdfPreviewPageModule),
    canActivate: [CheckActiveIntranet]
  },
  {
    path: 'login-intranet',
    loadChildren: () => import('./pages/login-intranet/login-intranet.module').then( m => m.LoginIntranetPageModule)
  },
  {
    path: 'popover-intrausr',
    loadChildren: () => import('./popover/popover-intrausr/popover-intrausr.module').then( m => m.PopoverIntrausrPageModule)
  },
  {
    path: 'alert-login',
    loadChildren: () => import('./modals/alert-login/alert-login.module').then( m => m.AlertLoginPageModule)
  },
  {
    path: 'select-pdf',
    loadChildren: () => import('./modals/select-pdf/select-pdf.module').then( m => m.SelectPdfPageModule)
  },
  {
    path: 'resultado-orden-intra',
    loadChildren: () => import('./pages/resultado-orden-intra/resultado-orden-intra.module').then( m => m.ResultadoOrdenIntraPageModule)
  },
  {
    path: 'pdf-preview-result',
    loadChildren: () => import('./modals/pdf-preview-result/pdf-preview-result.module').then( m => m.PdfPreviewResultPageModule)
  },
 
  {
    path: 'ingreso-pedido',
    //redirectTo: 'home-medico',
    canActivate: [CheckActiveMed],
    loadChildren: () => import('./pages/home-medico/home-medico.module').then( m => m.HomeMedicoPageModule),
    //loadChildren: () => import('./pages/ingreso-pedido/ingreso-pedido.module').then( m => m.IngresoPedidoPageModule)
  },
  {
    path: 'crearperfil',
    loadChildren: () => import('./modals/crearperfil/crearperfil.module').then( m => m.CrearperfilPageModule)
  },
  {
    path: 'perfiles',
    loadChildren: () => import('./modals/perfiles/perfiles.module').then( m => m.PerfilesPageModule)
  },
  {
    path: 'home-medico',
    loadChildren: () => import('./pages/home-medico/home-medico.module').then( m => m.HomeMedicoPageModule),
    canActivate: [CheckActiveMed]
  },
  {
    path: 'lista-pedidos',
    loadChildren: () => import('./pages/lista-pedidos/lista-pedidos.module').then( m => m.ListaPedidosPageModule)
  },
  {
    path: 'visor-qr',
    loadChildren: () => import('./modals/visor-qr/visor-qr.module').then( m => m.VisorQrPageModule)
  },
  {
    path: 'crearpaciente',
    loadChildren: () => import('./modals/crearpaciente/crearpaciente.module').then( m => m.CrearpacientePageModule)
  },
  {
    path: 'detalle-pedido',
    loadChildren: () => import('./modals/detalle-pedido/detalle-pedido.module').then( m => m.DetallePedidoPageModule)
  },
  {
    path: 'resultado-pedido',
    loadChildren: () => import('./pages/resultado-pedido/resultado-pedido.module').then( m => m.ResultadoPedidoPageModule)
  },
  {
    path: 'perfilesava',
    loadChildren: () => import('./modals/perfilesava/perfilesava.module').then( m => m.PerfilesavaPageModule)
  },
  {
    path: 'listunidad',
    loadChildren: () => import('./modals/listunidad/listunidad.module').then( m => m.ListunidadPageModule)
  },
  {
    path: 'cambioclave',
    loadChildren: () => import('./modals/cambioclave/cambioclave.module').then( m => m.CambioclavePageModule)
  },
  {
    path: 'home-paciente',
    loadChildren: () => import('./pages/home-paciente/home-paciente.module').then( m => m.HomePacientePageModule),
    canActivate: [CheckActive]
  },
  {
    path: 'home-intranet',
    loadChildren: () => import('./pages/home-intranet/home-intranet.module').then( m => m.HomeIntranetPageModule),
    canActivate: [CheckActive]
  },
    {
    path: 'facturas',
    loadChildren: () => import('./modals/facturas/facturas.module').then( m => m.FacturasPageModule)
  },
  {
    path: 'charts-paciente',
    loadChildren: () => import('./pages/charts-paciente/charts-paciente.module').then( m => m.ChartsPacientePageModule),
    canActivate: [CheckActive]
  },
  {
    path: 'entrega',
    loadChildren: () => import('./modals/entrega/entrega.module').then( m => m.EntregaPageModule)
  },
  {
    path: 'paquete-ordenes',
    loadChildren: () => import('./modals/paquete-ordenes/paquete-ordenes.module').then( m => m.PaqueteOrdenesPageModule)
  },
  {
    path: 'chart-visor',
    loadChildren: () => import('./modals/chart-visor/chart-visor.module').then( m => m.ChartVisorPageModule)
  },
  {
    path: 'alert-select-analisis',
    loadChildren: () => import('./modals/alert-select-analisis/alert-select-analisis.module').then( m => m.AlertSelectAnalisisPageModule)
  },
  {
    path: 'alert-wzp-qr',
    loadChildren: () => import('./modals/alert-wzp-qr/alert-wzp-qr.module').then( m => m.AlertWzpQrPageModule)
  },
  {
    path: 'alert-wzp-send',
    loadChildren: () => import('./modals/alert-wzp-send/alert-wzp-send.module').then( m => m.AlertWzpSendPageModule)
  },
  {
    path: 'reimpresion',
    loadChildren: () => import('./modals/reimpresion/reimpresion.module').then( m => m.ReimpresionPageModule)
  },
 {
    path: 'ingreso-orden',
    loadChildren: () => import('./pages/ingreso-orden/ingreso-orden.module').then( m => m.IngresoOrdenPageModule),
    
  },
  {
    path: 'analisis',
    loadChildren: () => import('./modals/analisis/analisis.module').then( m => m.AnalisisPageModule)
  },
  {
    path: 'chequeo-orden',
    loadChildren: () => import('./modals/orden/chequeo-orden/chequeo-orden.module').then( m => m.ChequeoOrdenPageModule)
  },
  {
    path: 'lista-orden-web',
    loadChildren: () => import('./pages/lista-orden-web/lista-orden-web.module').then( m => m.ListaOrdenWebPageModule)
  },
  {
    path: 'pdf-ordenweb',
    loadChildren: () => import('./modals/pdf-ordenweb/pdf-ordenweb.module').then( m => m.PdfOrdenwebPageModule)
  },
  {
    path: 'envio-bloque',
    loadChildren: () => import('./pages/envio-bloque/envio-bloque.module').then( m => m.EnvioBloquePageModule)
  },
  {
    path: 'alert-sbloque-select',
    loadChildren: () => import('./modals/alert-sbloque-select/alert-sbloque-select.module').then( m => m.AlertSbloqueSelectPageModule)
  },
  {
    path: 'list-tipo',
    loadChildren: () => import('./popover/list-tipo/list-tipo.module').then( m => m.ListTipoPageModule)
  },
  {
    path: 'ingreso-orden-completa',
    loadChildren: () => import('./pages/ingreso-orden-completa/ingreso-orden-completa.module').then( m => m.IngresoOrdenCompletaPageModule)
  },
  {
    path: 'search-paciente',
    loadChildren: () => import('./modals/orden/search-paciente/search-paciente.module').then( m => m.SearchPacientePageModule)
  },
  {
    path: 'menuorden',
    loadChildren: () => import('./popover/menuorden/menuorden.module').then( m => m.MenuordenPageModule)
  },
  {
    path: 'muestras',
    loadChildren: () => import('./modals/orden/muestras/muestras.module').then( m => m.MuestrasPageModule)
  },
  {
    path: 'caja',
    loadChildren: () => import('./modals/orden/caja/caja.module').then( m => m.CajaPageModule)
  },
  {
    path: 'popover-pago',
    loadChildren: () => import('./popover/popover-pago/popover-pago.module').then( m => m.PopoverPagoPageModule)
  },
  {
    path: 'informacion',
    loadChildren: () => import('./modals/orden/informacion/informacion.module').then( m => m.InformacionPageModule)
  },
  {
    path: 'facturacion',
    loadChildren: () => import('./modals/orden/facturacion/facturacion.module').then( m => m.FacturacionPageModule)
  },
  {
    path: 'evcalidad',
    loadChildren: () => import('./modals/orden/evcalidad/evcalidad.module').then( m => m.EvcalidadPageModule)
  },
  {
    path: 'notas',
    loadChildren: () => import('./modals/orden/notas/notas.module').then( m => m.NotasPageModule)
  },
  {
    path: 'adjuntos',
    loadChildren: () => import('./modals/orden/adjuntos/adjuntos.module').then( m => m.AdjuntosPageModule)
  },
  {
    path: 'envio-iess',
    loadChildren: () => import('./pages/envio-iess/envio-iess.module').then( m => m.EnvioIessPageModule)
  },
  {
    path: 'presupuesto',
    loadChildren: () => import('./modals/presupuesto/presupuesto.module').then( m => m.PresupuestoPageModule)
  },
  {
    path: 'policy-login',
    loadChildren: () => import('./modals/policy-login/policy-login.module').then( m => m.PolicyLoginPageModule)
  },
  {
    path: 'ingreso-nuevo-paciente',
    loadChildren: () => import('./modals/orden/ingreso-nuevo-paciente/ingreso-nuevo-paciente.module').then( m => m.IngresoNuevoPacientePageModule)
  },
  {
    path: 'search-medico',
    loadChildren: () => import('./modals/orden/search-medico/search-medico.module').then( m => m.SearchMedicoPageModule)
  },
  {
    path: 'ingreso-nuevo-medico',
    loadChildren: () => import('./modals/orden/ingreso-nuevo-medico/ingreso-nuevo-medico.module').then( m => m.IngresoNuevoMedicoPageModule)
  },
  {
    path: 'ingreso-factura',
    loadChildren: () => import('./modals/orden/ingreso-factura/ingreso-factura.module').then( m => m.IngresoFacturaPageModule)
  },
  {
    path: 'eleccion-analisis-factura',
    loadChildren: () => import('./modals/orden/eleccion-analisis-factura/eleccion-analisis-factura.module').then( m => m.EleccionAnalisisFacturaPageModule)
  },
  {
    path: 'get-analisis-individual-orden',
    loadChildren: () => import('./modals/orden/get-analisis-individual-orden/get-analisis-individual-orden.module').then( m => m.GetAnalisisIndividualOrdenPageModule)
  },




];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules,useHash: true  })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
