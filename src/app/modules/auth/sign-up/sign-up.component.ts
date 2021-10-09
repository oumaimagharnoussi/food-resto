import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import Restaurant from 'app/shared/Models/Restaurant';
import RestaurantOwner from 'app/shared/Models/RestaurantOwner';
import { DeviseService } from 'app/shared/services/devise.service';
import { SpecialityService } from 'app/shared/services/speciality.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import Address from 'app/shared/Models/Address';


import {Location, Appearance, GermanAddress} from '@angular-material-extensions/google-maps-autocomplete';

import PlaceResult = google.maps.places.PlaceResult;

@Component({
    selector     : 'auth-sign-up',
    
    templateUrl  : './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    specialities:any
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;
    currencies: Object;
    devise:any=null
    speciality:any=null


    public appearance = Appearance;
    public zoom: number;
    public latitude: number;
    public longitude: number;
    public selectedAddress: PlaceResult;
    address: Address;
    selectedCountry="TN";

    

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _specialityService: SpecialityService,
        private _cuurencyService: DeviseService,
        private _snackBar: MatSnackBar
       
    )
    {
    }

    openSnackBar() {
        this._snackBar.open('Speciality or currency missing !', 'OK', {
            duration: 2500,
            horizontalPosition: 'start',
            verticalPosition: 'top',
            panelClass: ['mat-toolbar', 'mat-warn']
        });
      }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        
        this.zoom = 10;
        this.latitude = 52.520008;
        this.longitude = 13.404954;
    
        this.setCurrentPosition();

        // Get speciality list
        this._specialityService.getSpecialities().subscribe(
            (res)=>{
                this.specialities=res
            }
            
        );

        // Get currency list
        this._cuurencyService.getCurrencies().subscribe(
            (res)=>{
                this.currencies=res
            }
            
        );
        // Create the form
        this.signUpForm = this._formBuilder.group({
                fname      : ['', Validators.required],
                lname      : ['', Validators.required],
                name      : ['', Validators.required],
                tel      : ['', Validators.required],
                email     : ['', [Validators.required, Validators.email]],
                password  : ['', Validators.required],
            
                restauName  :  ['', Validators.required],
                description  :  ['', Validators.required],
           
            
                restaurantTel:  ['', Validators.required]
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * Sign up
     */
    signUp(): void
    {
        // Return if the form is invalid
    
   
        const restaurantOwnerInfo = new RestaurantOwner();
       
        restaurantOwnerInfo.password = this.signUpForm.value.password;
        restaurantOwnerInfo.email = this.signUpForm.value.email;
        restaurantOwnerInfo.firstName = this.signUpForm.value.fname;
        restaurantOwnerInfo.lastName = this.signUpForm.value.lname;
        restaurantOwnerInfo.telephone = this.signUpForm.value.tel;
        // Hide the alert
        this.showAlert = false;

        const restaurantInfo= new Restaurant();
        restaurantInfo.businessAddress=new Address();
        restaurantInfo.businessAddress.administrativeAreaLevel1=this.address.administrativeAreaLevel1
        restaurantInfo.businessAddress.country=this.address.country;
        restaurantInfo.description=this.signUpForm.value.description;
        restaurantInfo.businessAddress.locality=this.address.locality;
        restaurantInfo.name=this.signUpForm.value.restauName;
        restaurantInfo.businessAddress.postalCode=this.address.postalCode;
        restaurantInfo.businessAddress.route=this.address.route;
        restaurantInfo.businessAddress.latitude=this.address.latitude;
        restaurantInfo.businessAddress.longitude=this.address.longitude;
        restaurantInfo.currency='api/currencies/'+this.devise
        restaurantInfo.speciality='api/specialities/'+this.speciality
       // restaurantInfo.logo=this.restaurant.logo;
        restaurantInfo.businessAddress.streetNumber=this.address.streetNumber;
        restaurantInfo.restaurantTel=this.signUpForm.value.restaurantTel;

        // Sign up
        this._authService.signUp(restaurantOwnerInfo)
            .subscribe(
                (response) => {

                    restaurantInfo.restaurantOwner="api/restaurant_owners/"+response.id;
                    this._authService.add_restaurant(restaurantInfo).subscribe(
                      (f:any) =>{
                        
                        this._router.navigate(['/signin']);
                      }
                    )
                    // Navigate to the confirmation required page
                  //  this._router.navigateByUrl('/confirmation-required');
                }
            );
    }

    private setCurrentPosition() {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.zoom = 12;
          });
        }
      }
    
      onAutocompleteSelected(result: PlaceResult) {
        console.log('onAutocompleteSelected: ', result);
      }
    
      onLocationSelected(location: Location) {
        console.log('onLocationSelected: ', location);
        this.latitude = location.latitude;
        this.longitude = location.longitude;
      }
    
      onGermanAddressMapped($event: GermanAddress) {
        console.log('onGermanAddressMapped', $event);
        this.address=new Address()
        this.address.country=$event.country.long;
        this.address.longitude=$event.geoLocation.longitude
        this.address.latitude=$event.geoLocation.latitude
        this.address.locality=$event.locality.long
     //   this.address.postalCode=$event.postalCode.toString()
        this.address.route=$event.streetName
     
      }

      show(){
          console.log(this.selectedCountry)
          
       }
}
