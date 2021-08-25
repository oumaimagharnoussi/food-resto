import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksTaskResolver } from '../apps/tasks/tasks.resolvers';
import { NewOrdersComponent } from './new-orders/new-orders.component';

import { OrderListComponent } from './order-list/order-list.component';

const routes: Routes = [
  {
    path:'',
    component:NewOrdersComponent,
    resolve      : {
      task: TasksTaskResolver
  }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
