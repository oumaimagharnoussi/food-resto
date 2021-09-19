import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'booking',
    templateUrl    : './booking.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
