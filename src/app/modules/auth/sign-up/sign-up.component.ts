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
import { MatCheckboxChange } from '@angular/material/checkbox';


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
    signUpForm1: FormGroup;
    signUpForm2: FormGroup;
    signUpForm3: FormGroup;
    showAlert: boolean = false;
    currencies: Object;
    devise:any=null
    speciality:any=null
    town:any=null
    commune:any=null

    public appearance = Appearance;
    public zoom: number;
    public latitude: number;
    public longitude: number;
    public selectedAddress: PlaceResult;
    address: Address;
    selectedCountry="TN";
    public checkMaps=true;
    CongoTows = [
      {value: 'Kinshasa', viewValue: 'Kinshasa'},
      {value: 'Lubumbashi', viewValue: 'Lubumbashi'},
      {value: 'Goma', viewValue: 'Goma'},
      {value: 'Kananga', viewValue: 'Kananga'},
      {value: 'Kisangani', viewValue: 'Kisangani'},
    ];
    TunisiaTows = [
      {value: 'Tunis', viewValue: 'Tunis'},
      {value: 'Sousse', viewValue: 'Sousse'},
      {value: 'Sfax', viewValue: 'Sfax'},
      {value: 'Nabeul', viewValue: 'Nabeul'},
      {value: 'Djerba', viewValue: 'Djerba'},
    ];
    FrenchTows = [
      {value: 'Paris', viewValue: 'Paris'},
      {value: 'Lyon', viewValue: 'Lyon'},
      {value: 'Toulouse', viewValue: 'Toulouse'},
      {value: 'Grenoble', viewValue: 'Grenoble'},
      {value: 'Lille', viewValue: 'Lille'},
    ];
    
    CongoCommunes = [
      {value: 'Kinshasa', viewValue: 'Kinshasa'},
      {value: 'Bandalungwa', viewValue: 'Bandalungwa'},
      {value: 'Barumbu', viewValue: 'Barumbu'},
      {value: 'Gombe', viewValue: 'Gombe'},
      {value: 'Ville-province', viewValue: 'Ville-province'},
    ];
    TunisiaCommunes = [
      {value: 'Tunis', viewValue: 'Tunis'},
      {value: 'Sousse', viewValue: 'Sousse'},
      {value: 'Sfax', viewValue: 'Sfax'},
      {value: 'Nabeul', viewValue: 'Nabeul'},
      {value: 'Médenine', viewValue: 'Médenine'},
    ];
    FrenchCommunes = [
      {value: 'Paris', viewValue: 'Paris'},
      {value: 'Lyon', viewValue: 'Lyon'},
      {value: 'Bobigny', viewValue: 'Bobigny'},
      {value: 'Saint-Denis', viewValue: 'Saint-Denis'},
      {value: 'Nanterre', viewValue: 'Nanterre'},
      {value: 'Nanterre', viewValue: 'Nanterre'},
    ];

    towns;
    communes;

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
        this.towns=this.TunisiaTows;
        this.communes=this.TunisiaCommunes;
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
        // Create the 3 form group 
        this.signUpForm1 = this._formBuilder.group({
                fname      : ['', Validators.required],
                lname      : ['', Validators.required],
                tel      : ['', Validators.required,Validators.pattern(/^[0-9]{10,15}$/)],
                email     : ['', [Validators.required, Validators.email]],
                password  : ['', Validators.required],
            
            }
        );

        this.signUpForm2 = this._formBuilder.group({
         
          restauName  :  ['', Validators.required],
          description  :  ['', Validators.required],
      
          restaurantTel:  ['', Validators.required],

         
          
      }
  );
  this.signUpForm3 = this._formBuilder.group({

    street : ['', Validators.required],
    streetNb  : ['', Validators.required],
    zipcode : ['', Validators.required],
    
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
       
        restaurantOwnerInfo.password = this.signUpForm1.value.password;
        restaurantOwnerInfo.email = this.signUpForm1.value.email;
        restaurantOwnerInfo.firstName = this.signUpForm1.value.fname;
        restaurantOwnerInfo.lastName = this.signUpForm1.value.lname;
        restaurantOwnerInfo.telephone = this.signUpForm1.value.tel;
        // Hide the alert
        this.showAlert = false;

        const restaurantInfo= new Restaurant();
        restaurantInfo.businessAddress=new Address();
        restaurantInfo.description=this.signUpForm2.value.description;
        restaurantInfo.name=this.signUpForm2.value.restauName;
        restaurantInfo.restaurantTel=this.signUpForm2.value.restaurantTel;

       
        if(this.checkMaps){
        restaurantInfo.businessAddress.locality=this.address.locality;
        restaurantInfo.businessAddress.administrativeAreaLevel1=this.address.administrativeAreaLevel1
        restaurantInfo.businessAddress.country=this.address.country;
        restaurantInfo.businessAddress.postalCode=this.address.postalCode;
        restaurantInfo.businessAddress.route=this.address.route;
        restaurantInfo.businessAddress.latitude=this.address.latitude;
        restaurantInfo.businessAddress.longitude=this.address.longitude;
        restaurantInfo.businessAddress.streetNumber=this.address.streetNumber;
        }else{
              
        restaurantInfo.businessAddress.locality=this.town;
        restaurantInfo.businessAddress.administrativeAreaLevel1=this.commune
        restaurantInfo.businessAddress.country=this.selectedCountry;
        restaurantInfo.businessAddress.postalCode=this.signUpForm3.value.zipcode;
        restaurantInfo.businessAddress.route=this.signUpForm3.value.street;
        restaurantInfo.businessAddress.latitude=this.latitude;
        restaurantInfo.businessAddress.longitude=this.longitude;
        restaurantInfo.businessAddress.streetNumber=this.signUpForm3.value.streetNb;
        }
       
        restaurantInfo.currency='api/currencies/'+this.devise
        restaurantInfo.speciality='api/specialities/'+this.speciality
       // restaurantInfo.logo=this.restaurant.logo;
       
       
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
        this.checkMaps = true;
     
      }
      updateCheckMaps(ck: MatCheckboxChange){
        this.checkMaps = !ck.checked;
      }
      show(){
          console.log(this.selectedCountry)
          switch(this.selectedCountry){
            case 'TN': { 
              this.towns=this.FrenchTows;
              this.communes=this.FrenchCommunes;
              break; 
           } 
           case "RCD": { 
              this.towns=this.CongoTows;
              this.communes=this.CongoCommunes;
              break; 
           } 
           case 'FR': { 
              this.towns=this.FrenchTows;
              this.communes=this.FrenchCommunes;
            break; 
         } 
           default: { 
            this.towns=this.FrenchTows;
            this.communes=this.FrenchCommunes;
              break; 
           } 
          }
          
       }
}
