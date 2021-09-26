import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  userId:any;

  private extractData(res: Response) {
    let body = res;
    return body || {
     };
  }
  
  constructor(private _http: HttpClient, private _authService: AuthService) {
    this.userId=this._authService.accessUser
   }

  getOrders(status=null,type=null): Observable<any> {
    if(status!=null && type==null){
      return this._http.get(environment.API+'orders'+'?restaurant.restaurantOwner.id='+this.userId+'&status='+status+"&paymentDetails.status=PAID").pipe(
        map(this.extractData));
    }
    if(status==null && type==null){
      return this._http.get(environment.API+'orders'+'?restaurant.restaurantOwner.id='+this.userId+"&paymentDetails.status=PAID").pipe(
        map(this.extractData));
    }
    if(status!=null && type!=null){
      return this._http.get(environment.API+'orders'+'?restaurant.restaurantOwner.id='+this.userId+'&status='+status+'&orderType='+type+"&paymentDetails.status=PAID").pipe(
        map(this.extractData));
    }

    if(status==null && type!=null){
      return this._http.get(environment.API+'orders'+'?restaurant.restaurantOwner.id='+this.userId+'&orderType='+type+"&paymentDetails.status=PAID").pipe(
        map(this.extractData));
    }

   
  }

  getOrder(id): Observable<any> {
    return this._http.get(environment.API+'orders/'+id).pipe(
    map(this.extractData));
  }

  updateOrder(id,value): Observable<any> {
    return this._http.put(environment.API+'orders/'+id, value);
  }


}
