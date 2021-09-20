import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';

import { FormControl, FormGroup } from '@angular/forms';
import { OrderService } from '../services/order.service';

@Component({
    selector       : 'tasks-list',
    templateUrl    : './list.component.html',
    styles         : [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksListComponent implements OnInit, OnDestroy
{
    campaignOne: FormGroup;
    campaignTwo: FormGroup;
    show: {
        pending:boolean,
        all:boolean,
        prepared:boolean,
        rejected:boolean,
        delivered:boolean,
        accepted:boolean,
        picked:boolean
    }

    type: {
        all:boolean,
        delivery:boolean,
        takeaway:boolean
    }
    
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    drawerMode: 'side' | 'over';
    selectedTask: Task;
   
    tasksCount: any = {
        completed : 0,
        incomplete: 0,
        total     : 0
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    orders: any;
  
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
       
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _orderService: OrderService
    )
    { this.type={
        all:true,
        delivery:false,
        takeaway:false
    }
        this.showAll()
       
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
    
        this.campaignOne = new FormGroup({
          start: new FormControl(new Date(year, month, 13)),
          end: new FormControl(new Date(year, month, 16))
        });
    
        this.campaignTwo = new FormGroup({
          start: new FormControl(new Date(year, month, 15)),
          end: new FormControl(new Date(year, month, 19))
        });
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    getOrders(){
        this._orderService.getOrders().subscribe(
            res=>  {
                this.orders=res
                 // Mark for check
                 this._changeDetectorRef.markForCheck();
            }
            
           
        )
    }
    /**
     * On init
     */
    ngOnInit(): void
    {
       // this.getOrders()

        // Get the tags
     

        // Subscribe to media query change
        this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {

                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts

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
    showAll(){
        this.show={all:true,pending:false,accepted:false,rejected:false,prepared:false,delivered:false,picked:false}
        if(this.type.all){
            this._orderService.getOrders().subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.type.takeaway){
            this._orderService.getOrders(null,'TAKEAWAY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.type.delivery){
            this._orderService.getOrders(null,'DELIVERY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

    }
    showPending(){
        this.show={all:false,pending:true,accepted:false,rejected:false,prepared:false,delivered:false,picked:false}
        if(this.type.all){
            this._orderService.getOrders('ORDERED').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.type.takeaway){
            this._orderService.getOrders('ORDERED','TAKEAWAY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.type.delivery){
            this._orderService.getOrders('ORDERED','DELIVERY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

    }
    showRejected(){
        this.show={all:false,pending:false,accepted:false,rejected:true,prepared:false,delivered:false,picked:false}
        if(this.type.all){
            this._orderService.getOrders('REJECTED').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.type.takeaway){
            this._orderService.getOrders('REJECTED','TAKEAWAY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.type.delivery){
            this._orderService.getOrders('REJECTED','DELIVERY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
    }
    showAccepted(){
        this.show={all:false,pending:false,accepted:true,rejected:false,prepared:false,delivered:false,picked:false}
        if(this.type.all){
            this._orderService.getOrders('ACCEPTED').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.type.takeaway){
            this._orderService.getOrders('ACCEPTED','TAKEAWAY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.type.delivery){
            this._orderService.getOrders('ACCEPTED','DELIVERY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
    }
    showDelivered(){
        this.show={all:false,pending:false,accepted:false,rejected:false,prepared:false,delivered:true,picked:false}

        if(this.type.all){
            this._orderService.getOrders('DELIVERED').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.type.takeaway){
            this._orderService.getOrders('DELIVERED','TAKEAWAY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.type.delivery){
            this._orderService.getOrders('DELIVERED','DELIVERY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
    }
    showPrepared(){
        this.show={all:false,pending:false,accepted:false,rejected:false,prepared:true,delivered:false,picked:false}
        if(this.type.all){
            this._orderService.getOrders('PREPARED').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.type.takeaway){
            this._orderService.getOrders('PREPARED','TAKEAWAY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.type.delivery){
            this._orderService.getOrders('PREPARED','DELIVERY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
    }
    
    showPicked(){
        this.show={all:false,pending:false,accepted:false,rejected:false,prepared:false,delivered:false,picked:true}
        if(this.type.all){
            this._orderService.getOrders('PICKED').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.type.takeaway){
            this._orderService.getOrders('PICKED','TAKEAWAY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.type.delivery){
            this._orderService.getOrders('PICKED','DELIVERY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
    }
    
    showTakeaway(){
        this.type={
            all:false,
            takeaway:true,
            delivery:false
        }
        if(this.show.all){
            this._orderService.getOrders(null,'TAKEAWAY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.prepared){
            this._orderService.getOrders('PREPARED','TAKEAWAY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.pending){
            this._orderService.getOrders('ORDERED','TAKEAWAY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.rejected){
            this._orderService.getOrders('REJECTED','TAKEAWAY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.accepted){
            this._orderService.getOrders('ACCEPTED','TAKEAWAY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.delivered){
            this._orderService.getOrders('DELIVERED','TAKEAWAY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.show.picked){
            this._orderService.getOrders('PICKED','TAKEAWAY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }


    }

    showDelivery(){
        this.type={
            all:false,
            takeaway:false,
            delivery:true
        }
        if(this.show.all){
            this._orderService.getOrders(null,'DELIVERY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.prepared){
            this._orderService.getOrders('PREPARED','DELIVERY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.pending){
            this._orderService.getOrders('ORDERED','DELIVERY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.rejected){
            this._orderService.getOrders('REJECTED','DELIVERY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.accepted){
            this._orderService.getOrders('ACCEPTED','DELIVERY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.delivered){
            this._orderService.getOrders('DELIVERED','DELIVERY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }

        if(this.show.picked){
            this._orderService.getOrders('PICKED','DELIVERY').subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }


    }

    allTypes(){
        this.type={
            all:true,
            takeaway:false,
            delivery:false
        }
        if(this.show.all){
            this._orderService.getOrders(null,null).subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.prepared){
            this._orderService.getOrders('PREPARED',null).subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.pending){
            this._orderService.getOrders('ORDERED',null).subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.rejected){
            this._orderService.getOrders('REJECTED',null).subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.accepted){
            this._orderService.getOrders('ACCEPTED',null).subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }
        if(this.show.delivered){
            this._orderService.getOrders('DELIVERED',null).subscribe(
                res=>  {
                    this.orders=res
                     // Mark for check
                     this._changeDetectorRef.markForCheck();
                }
               
            )
        }


    }
    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create task
     *
     * @param type
     */



    /**
     * Task dropped
     *
     * @param event
     */
    dropped(event: CdkDragDrop<Task[]>): void
    {
        // Move the item in the array
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

        // Save the new order
    

        // Mark for check
        this._changeDetectorRef.markForCheck();
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
