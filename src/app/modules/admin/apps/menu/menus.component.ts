import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'notes',
    templateUrl    : './menus.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenusComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
