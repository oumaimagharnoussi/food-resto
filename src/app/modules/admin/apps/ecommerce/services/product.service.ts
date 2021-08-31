import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  userId:any;

  private extractData(res: Response) {
    let body = res;
    return body || {
     };
  }
  
  constructor(private _http: HttpClient, private _authService: AuthService) {
    this.userId=this._authService.accessUser
   }

  getProducts(): Observable<any> {
    return this._http.get(environment.API+'products'+'?restaurant.restaurantOwner.id='+this.userId).pipe(
      map(this.extractData));
  }

  getProduct(id): Observable<any> {
    return this._http.get(environment.API+'products/'+id).pipe(
      map(this.extractData));
  }

  deleteProduct(id): Observable<any> {
    return this._http.delete(environment.API+'products/'+id)
  }

  addProduct(product): Observable<any>{
    
    return this._http.post(environment.API+'products',product)
  }

  updateProduct(product,id): Observable<any>{
    
    return this._http.put(environment.API+'products/'+id,product)
  }

  getRestaurant(): Observable<any>{
    return this._http.get(environment.API+'restaurants?restaurantOwner.id='+this.userId).pipe(
      map(this.extractData));
  }
}
