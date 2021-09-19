import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import RestaurantOwner from 'app/shared/Models/RestaurantOwner';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  id: string;

  constructor(private _httpClient: HttpClient) {
    this.id=localStorage.getItem('accessUser')
   }

   getProfileInfo():Observable<RestaurantOwner>{
    return this._httpClient.get<RestaurantOwner>(environment.API+'restaurant_owners/'+this.id)
   }

   getRestaurantInfo():Observable<any>{
    return this._httpClient.get(environment.API+'restaurants?restaurantOwner.id='+this.id)
   }

}
