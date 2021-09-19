import { Route } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { DetailsComponent } from './booking/details/details.component';
import { BookingListComponent } from './booking/list/booking.component';



export const reservationRoutes: Route[] = [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'booking'
    },
    {
        path     : 'booking',
        component: BookingComponent,
        children : [
            {
                path     : '',
                component: BookingListComponent,
                children : [
                    {
                        path         : ':id',
                        component    : DetailsComponent,
                       
                    }
                ]
            }
        ]
        /*children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]*/
    }
];
