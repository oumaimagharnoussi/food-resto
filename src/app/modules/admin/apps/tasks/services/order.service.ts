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

  getOrders(): Observable<any> {
    return this._http.get(environment.API+'orders'+'?restaurant.restaurantOwner.id='+this.userId).pipe(
      map(this.extractData));
  }
}
