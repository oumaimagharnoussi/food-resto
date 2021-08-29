import { Component, OnInit } from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { InventoryListComponent } from '../list/inventory.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private _productListComponent: InventoryListComponent) { }

  ngOnInit(): void {
    this._productListComponent.matDrawer.open();
  }

      /**
     * Close the drawer
     */
       closeDrawer(): Promise<MatDrawerToggleResult>
       {
           return this._productListComponent.matDrawer.close();
       }

           /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        // Listen for matDrawer opened change
        this._productListComponent.matDrawer.openedChange
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(opened => opened)
            )
            .subscribe(() => {

              
            });
    }

}
