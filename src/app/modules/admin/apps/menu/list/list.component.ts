import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

import { NotesLabelsComponent } from 'app/modules/admin/apps/menu/labels/labels.component';

import { cloneDeep } from 'lodash-es';
import { MenuService } from '../services/menu.service';
import { ProductService } from '../../ecommerce/services/product.service';
import { environment } from 'environments/environment';

@Component({
    selector       : 'menu-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuListComponent implements OnInit, OnDestroy
{
    server=environment.S3_url;
    menus:any;
    showAll:boolean=false;


    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    filter$: BehaviorSubject<string> = new BehaviorSubject('notes');
    searchQuery$: BehaviorSubject<string> = new BehaviorSubject(null);
    masonryColumns: number = 4;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    selectedMenu: any;
    products: any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _matDialog: MatDialog,


        private _menuService : MenuService,
        private _productService: ProductService
    )
    {
        this._matDialog.afterAllClosed.subscribe(
            res=>{
                this.getMenus()
                this.getAllProducts()
                this.showAll=true
                this.selectedMenu=null
                
            }
        )
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the filter status
     */
    get filterStatus(): string
    {
        return this.filter$.value;
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

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode and drawerOpened if the given breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                // Set the masonry columns
                //
                // This if block structured in a way so that only the
                // biggest matching alias will be used to set the column
                // count.
                if ( matchingAliases.includes('xl') )
                {
                    this.masonryColumns = 5;
                }
                else if ( matchingAliases.includes('lg') )
                {
                    this.masonryColumns = 4;
                }
                else if ( matchingAliases.includes('md') )
                {
                    this.masonryColumns = 3;
                }
                else if ( matchingAliases.includes('sm') )
                {
                    this.masonryColumns = 2;
                }
                else
                {
                    this.masonryColumns = 1;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
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
    getAllProducts(){
        this.showAll=!this.showAll
        if(this.showAll==true){
            this._productService.getProducts().subscribe(
                res=>{
                    this.products=res;
                       // Mark for check
                       this._changeDetectorRef.markForCheck();
                }
            )
        }

    }
    totalMenuPrice(){
        if(this.selectedMenu){
            if(this.selectedMenu.products.length==0){
                return 0
            }else{
                let sum=0;
                this.selectedMenu.products.forEach(element => {
                    if(element.unitPrice){
                        sum+=element.unitPrice
                    }
                });
                return sum;
    
            }
        }

    }

  
    getMenus(){
        this._menuService.getMenus().subscribe(
            (res)=>{
                this.menus=res
                if(res.length>0){
                    this.selectedMenu=res[0];
                }
                  // Mark for check
                  this._changeDetectorRef.markForCheck();
            }
        )
    }

    addProductToMenu(p){
        
        this.selectedMenu.products.push(p);
        this._menuService.updateMenu(this.selectedMenu,this.selectedMenu.id).subscribe(
            res=>{
                console.log(res)
            }
        )
    }
    removeProductFromMenu(p){
        let x=-1
        let index=-1
        this.selectedMenu.products.forEach(element => {
            x=x+1
            if(element.id==p.id) index=x
        });
        if(index>=0){
            this.selectedMenu.products.splice(index, 1);
            this._menuService.updateMenu(this.selectedMenu,this.selectedMenu.id).subscribe(
                res=>{
                    console.log(res)
                }
            )
        }
        
    }

     contain(p):boolean{
         let res =false;
         if(this.selectedMenu){
            if(this.selectedMenu.products.length==0){
                console.log(p,"mch mawjoud")
                return false;
                 
            }else{
                this.selectedMenu.products.forEach(element => {
                    if(p.id==element.id){
                        console.log(p,"mawjoud")
                       res=true;
                    }
                    if(res==true){
                        return true
                    }
                    
                });
                return res;
            }
         }else{
             return false
         }

      

    }
 

    /**
     * Open the edit labels dialog
     */
    openEditLabelsDialog(): void
    {
        this._matDialog.open(NotesLabelsComponent, {autoFocus: false, disableClose: true});
    }



    /**
     * Filter by archived
     */
    filterByArchived(): void
    {
        this.filter$.next('archived');
    }

    /**
     * Filter by label
     *
     * @param labelId
     */
    filterByLabel(labelId: string): void
    {
        const filterValue = `label:${labelId}`;
        this.filter$.next(filterValue);
    }

    /**
     * Filter by query
     *
     * @param query
     */
    filterByQuery(query: string): void
    {
        this.searchQuery$.next(query);
    }

    /**
     * Reset filter
     */
    resetFilter(): void
    {
        this.filter$.next('notes');
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

    showMenu(m){
        this.selectedMenu=m;
          // Mark for check
          this._changeDetectorRef.markForCheck();
        console.log(m)
    }
}
