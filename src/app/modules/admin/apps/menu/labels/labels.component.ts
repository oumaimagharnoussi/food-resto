import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';


import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { MenuService } from '../services/menu.service';
import { MenuListComponent } from '../list/list.component';


@Component({
    selector       : 'notes-labels',
    templateUrl    : './labels.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesLabelsComponent implements OnInit, OnDestroy
{

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    menus: any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notesService: MenuService,
        private _menuService: MenuService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.getMenus()
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getMenus(){
        this._menuService.getMenus().subscribe(
            res=>{
                this.menus=res
                 // Mark for check
                 this._changeDetectorRef.markForCheck();
            }
        )
    }
    deleteMenu(id){
        this._menuService.deleteMenu(id).subscribe(
            res=>{
                this.getMenus()

            }
        )
    }

    updateMenu(menu){
        this._menuService.updateMenu(menu,menu.id).subscribe(
            res=>{
                this.getMenus()

            }
        )
    }
    addMenu(label){
        this._menuService.getRestaurant().subscribe(
            resto=>{
                this._menuService.addMenu({label:label,restaurant:'api/restaurants/'+resto[0].id}).subscribe(
                    res=>{
                        this.getMenus()
                    }
                )
            }
        )


    }




    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
