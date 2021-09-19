import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  userId="";
  constructor(private _httpClient: HttpClient,private _authService: AuthService) { 
    this.userId=this._authService.accessUser
  }

  getReservations(status=null):Observable<any>{
    if(status){
      return this._httpClient.get(environment.API + 'reservations?status='+status+'&restaurant.restaurantOwner.id='+this.userId);
    }else{
      return this._httpClient.get(environment.API + 'reservations?restaurant.restaurantOwner.id='+this.userId);
    }
    
  }
  getReservation(id):Observable<any>{
    return this._httpClient.get(environment.API + 'reservations/'+id); 

  }
  updateReservation(id,value):Observable<any>{
    return this._httpClient.put(environment.API+'reservations/'+id,{
      status: value
    })
  }
}
