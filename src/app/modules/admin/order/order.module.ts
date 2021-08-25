import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { AcceptedOrdersComponent } from './accepted-orders/accepted-orders.component';
import { NewOrdersComponent } from './new-orders/new-orders.component';
import { CompletedOrdersComponent } from './completed-orders/completed-orders.component';
import { CanceledOrdersComponent } from './canceled-orders/canceled-orders.component';
import { OrderListComponent } from './order-list/order-list.component';
import {MatTabsModule} from '@angular/material/tabs';


import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as moment from 'moment';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { tasksRoutes } from 'app/modules/admin/apps/tasks/tasks.routing';
import { TasksComponent } from 'app/modules/admin/apps/tasks/tasks.component';
import { TasksDetailsComponent } from 'app/modules/admin/apps/tasks/details/details.component';
import { TasksListComponent } from 'app/modules/admin/apps/tasks/list/list.component';

@NgModule({
  declarations: [
    AcceptedOrdersComponent,
    NewOrdersComponent,
    CompletedOrdersComponent,
    CanceledOrdersComponent,
    OrderListComponent,
    
    
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    MatTabsModule,
    DragDropModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
    SharedModule
    
  ]
})
export class OrderModule { }
