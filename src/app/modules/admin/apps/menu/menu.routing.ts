import { Route } from '@angular/router';

import { MenuListComponent } from 'app/modules/admin/apps/menu/list/list.component';
import { MenusComponent } from './menus.component';

export const menusRoutes: Route[] = [
    {
        path     : '',
        component: MenusComponent,
        children : [
            {
                path     : '',
                component: MenuListComponent
            }
        ]
    }
];
