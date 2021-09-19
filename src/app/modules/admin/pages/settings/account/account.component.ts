import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Restaurant from 'app/shared/Models/Restaurant';
import RestaurantOwner from 'app/shared/Models/RestaurantOwner';
import { SettingService } from '../setting.service';

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit
{
    accountForm: FormGroup;
    owner: any={
        firstName:'eee',
    }
    resto: Restaurant;
    name: string="test";

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _settingService: SettingService,
        private _changeDetectorRef: ChangeDetectorRef
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


        // Create the form
        this.accountForm = this._formBuilder.group({
            firstName    : [''],
            lastName: [''],
            title   : [''],
            name : [''],
            description   : [''],
            speciality: [''],
            email   : ['example@mail.com', Validators.email],
            telephone   : ['+33'],
            country : ['usa'],
            language: ['english']
        });
        this._settingService.getProfileInfo().subscribe(
            res=>{
                this.owner=res
                console.log(this.owner)
                this._changeDetectorRef.markForCheck();
                this.accountForm.patchValue(res)
            }
        )

        this._settingService.getRestaurantInfo().subscribe(
            res=>{
                this.resto=res[0];
                console.log(this.resto)
                this._changeDetectorRef.markForCheck();
                this.accountForm.patchValue(res[0])
                this.accountForm.patchValue({
                    speciality:res[0].speciality.label
                })
            }
        )
        
    }
}
