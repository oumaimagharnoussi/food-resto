import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { assign } from 'lodash-es';
import * as moment from 'moment';

import { TasksListComponent } from 'app/modules/admin/apps/tasks/list/list.component';

import { OrderService } from '../services/order.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailComponent } from '../product-detail/product-detail.component';

@Component({
    selector       : 'tasks-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksDetailsComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('titleField') private _titleField: ElementRef;


    tagsEditMode: boolean = false;

    task: Task;
    taskForm: FormGroup;
    tasks: Task[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    productId: any;
    id: any;
    order: any;
    panelOpenState = false;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _renderer2: Renderer2,
        private _router: Router,
        private _tasksListComponent: TasksListComponent,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _orderSerice:OrderService,
        public dialog: MatDialog
    )
    {
        this.id=this.getId(window.location.pathname)
    }

    getId(ch){
        let index=0;
        for(let i=0; i< ch.length;i++){
          if(ch[i]=='/'){
            index=i
          }
          
  
        }
        return ch.substring(index+1,ch.length)
      }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._orderSerice.getOrder(this.id).subscribe(
            res=>{
                console.log(res)
                this.order=res
                  // Mark for check
                 this._changeDetectorRef.markForCheck();
            }
        )
        // Open the drawer
        this._tasksListComponent.matDrawer.open();


    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
       
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    acceptOrder() {     
        this._orderSerice.updateOrder(this.order.id, { status: 'ACCEPTED', datePriseEncharge: new Date()}).subscribe((data: any) => {
            this._tasksListComponent.getOrders()
            this._tasksListComponent.onBackdropClicked()
        })
      }
      rejectOrder() {
        this._orderSerice.updateOrder(this.order.id, { status: 'REJECTED' }).subscribe((data: any) => {
            this._tasksListComponent.getOrders()
            this._tasksListComponent.onBackdropClicked()
        })
      }

      prepareOrder() {
        this._orderSerice.updateOrder(this.order.id, { status: 'PREPARED' }).subscribe((data: any) => {
            this._tasksListComponent.getOrders()
            this._tasksListComponent.onBackdropClicked()
        })
      }

      openDialog(product) {
        this.dialog.open(ProductDetailComponent, {
          data: {
            product: product
          }
        });
      }

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._tasksListComponent.matDrawer.close();
    }

    /**
     * Toggle the completed status
     */
    toggleCompleted(): void
    {
        // Get the form control for 'completed'
        const completedFormControl = this.taskForm.get('completed');

        // Toggle the completed status
        completedFormControl.setValue(!completedFormControl.value);
    }



    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }

    







    /**
     * Set the task priority
     *
     * @param priority
     */
    setTaskPriority(priority): void
    {
        // Set the value
        this.taskForm.get('priority').setValue(priority);
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
