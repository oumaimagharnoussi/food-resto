import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { DOCUMENT } from '@angular/common';
import { ReservationService } from '../../services/reservation.service';
import { SseService } from 'app/shared/services/sse.service';





@Component({
    selector       : 'booking-list',
    templateUrl    : './booking.component.html',
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations
})
export class BookingListComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    status:String='All'
   
    drawerMode: 'side' | 'over';
    reservations:any=null

    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;

    searchInputControl: FormControl = new FormControl();

    selectedProductForm: FormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router, private _reservationService:ReservationService,
        private sse:SseService
    )
    {
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

   
    /**
     * On backdrop clicked
     */
     onBackdropClicked(): void
     {
         // Go back to the list
         this._router.navigate(['./'], {relativeTo: this._activatedRoute});
         this.matDrawer.close();
         // Mark for check
         this._changeDetectorRef.markForCheck();
     }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        
        this.sse.returnAsObservable().subscribe(data=>
            {
                this.getReservations()
      
              /*  this._snackBar.open("New update !", "ok", {
                  duration: 500,
                });
                */
              console.log(data);
            }
          );
        
          this.sse.GetExchangeData('reservations'); 
        // Subscribe to media query change
        this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {

                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


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
         this.sse.stopExchangeUpdates();
     }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    showConfirmedReservations(){
        this._reservationService.getReservations('CONFIRMED').subscribe(
            res=>{
                this.reservations=res;
                this.status='CONFIRMED'
                this._changeDetectorRef.markForCheck();
            }
        )
    }

    showCanceledReservations(){
        this._reservationService.getReservations('CANCELED').subscribe(
            res=>{
                this.reservations=res;
                this.status='CANCELED'
                this._changeDetectorRef.markForCheck();
            }
        )
        
    }

    showPendingReservations(){
        this._reservationService.getReservations('PENDING').subscribe(
            res=>{
                this.reservations=res;
                this.status='PENDING'
                this._changeDetectorRef.markForCheck();
            }
        )
        
    }

    getReservations(){
        this._reservationService.getReservations().subscribe(
            res=>{
                this.status='All'
                this.reservations=res
                 // Mark for check
         this._changeDetectorRef.markForCheck();
            }
        )
     }




  
}
