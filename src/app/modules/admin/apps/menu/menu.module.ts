import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { SharedModule } from 'app/shared/shared.module';
import { MenuListComponent } from 'app/modules/admin/apps/menu/list/list.component';
import { NotesLabelsComponent } from 'app/modules/admin/apps/menu/labels/labels.component';
import { menusRoutes } from 'app/modules/admin/apps/menu/menu.routing';
import { FuseCardModule } from '@fuse/components/card';
import { MenusComponent } from './menus.component';
import { SearchFilterPipe } from './pipes/search-filter.pipe';

@NgModule({
    declarations: [
        MenusComponent,
        MenuListComponent,
        NotesLabelsComponent,
        SearchFilterPipe
    ],
    imports     : [
        RouterModule.forChild(menusRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatSidenavModule,
        FuseMasonryModule,
        SharedModule,
        FuseCardModule
    ]
})
export class MenuModule
{
}
