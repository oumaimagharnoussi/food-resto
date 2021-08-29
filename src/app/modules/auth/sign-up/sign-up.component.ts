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

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
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

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _specialityService: SpecialityService,
        private _cuurencyService: DeviseService,
       
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
                company   : [''],
                restauName  :  ['', Validators.required],
                description  :  ['', Validators.required],
                street  :  ['', Validators.required],
                number  :  ['', Validators.required],
                city  :  ['', Validators.required],
                state  :  ['', Validators.required],
                postCode  :  ['', Validators.required],
                agreements: ['', Validators.requiredTrue]
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
   
        const restaurantOwnerInfo = new RestaurantOwner();
       
        restaurantOwnerInfo.password = this.signUpForm.value.password;
        restaurantOwnerInfo.email = this.signUpForm.value.email;
        restaurantOwnerInfo.firstName = this.signUpForm.value.fname;
        restaurantOwnerInfo.lastName = this.signUpForm.value.lname;
        restaurantOwnerInfo.telephone = this.signUpForm.value.tel;
        // Hide the alert
        this.showAlert = false;

        const restaurantInfo= new Restaurant();
        restaurantInfo.administrativeAreaLevel1=this.signUpForm.value.state;
        restaurantInfo.country="RDC";
        restaurantInfo.description=this.signUpForm.value.description;
        restaurantInfo.locality=this.signUpForm.value.city;
        restaurantInfo.name=this.signUpForm.value.restauName;
        restaurantInfo.postalCode=this.signUpForm.value.postCode;
        restaurantInfo.route=this.signUpForm.value.street;
       // restaurantInfo.logo=this.restaurant.logo;
        restaurantInfo.streetNumber=Number(this.signUpForm.value.number);

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
