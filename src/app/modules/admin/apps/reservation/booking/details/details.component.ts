import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ReservationService } from '../../services/reservation.service';

import { BookingListComponent } from '../list/booking.component';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  server=environment.BACKEND
  SERVER_URL = environment.API+"media_objects";
  uploadForm: FormGroup;  
  filepath="";
  reservation:any;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  productId: any;
  product={
    name:"",
    description:"",
    stock:-1,
    seuil:-1,
    unitPrice:-1,
    image:null,
    restaurant:"",
    menus:null
    }
  id: any;
  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient,private _bookingListComponent: BookingListComponent, private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router, private _reservationService :ReservationService
    ) { 
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

    getReservationDetails(){
      this._reservationService.getReservation(this.id).subscribe(
        res=>{
          this.reservation=res
          this._changeDetectorRef.markForCheck();
        }
      )
      
    }

    acceptReservation(){
      this._reservationService.updateReservation(this.id,'CONFIRMED').subscribe(
        res=>{
          this.getReservationDetails()
          this._bookingListComponent.getReservations()

        }
        
      )

    }

    rejectReservation(){
      this._reservationService.updateReservation(this.id,'CANCELED').subscribe(
        res=>{
          this.getReservationDetails()
          this._bookingListComponent.getReservations()}
      )
    }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });

    

    this.getReservationDetails()
    this._bookingListComponent.matDrawer.open();


    
  }


  onSubmit() {

    const formData = new FormData();
    formData.append('file', this.uploadForm.get('profile').value);

    this.httpClient.post<any>(this.SERVER_URL, formData).subscribe(
      (res) =>{
        this.product.image='api/media_objects/'+res.id;
        this.filepath=res.filePath
         // Mark for check
         this._changeDetectorRef.markForCheck();
      } ,
      (err) => console.log(err)
    );
  }


      /**
     * Close the drawer
     */
       closeDrawer(): Promise<MatDrawerToggleResult>
       {
           return this._bookingListComponent.matDrawer.close();
       }

           /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        // Listen for matDrawer opened change
        this._bookingListComponent.matDrawer.openedChange
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(opened => opened)
            )
            .subscribe(() => {

              
            });
    }

}
