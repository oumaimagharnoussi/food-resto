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
                street  :  ['', Validators.required],
                number  :  ['', Validators.required],
                city  :  ['', Validators.required],
                state  :  ['', Validators.required],
                postCode  :  ['', Validators.required],
            
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
        restaurantInfo.businessAddress.administrativeAreaLevel1=this.signUpForm.value.state;
        restaurantInfo.businessAddress.country="RDC";
        restaurantInfo.description=this.signUpForm.value.description;
        restaurantInfo.businessAddress.locality=this.signUpForm.value.city;
        restaurantInfo.name=this.signUpForm.value.restauName;
        restaurantInfo.businessAddress.postalCode=this.signUpForm.value.postCode;
        restaurantInfo.businessAddress.route=this.signUpForm.value.street;
        restaurantInfo.currency='api/currencies/'+this.devise
        restaurantInfo.speciality='api/specialities/'+this.speciality
       // restaurantInfo.logo=this.restaurant.logo;
        restaurantInfo.businessAddress.streetNumber=Number(this.signUpForm.value.number);
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
}
