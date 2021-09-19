import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  userId:any;

  private extractData(res: Response) {
    let body = res;
    return body || {
     };
  }
  
  constructor(private _http: HttpClient, private _authService: AuthService) {
    this.userId=this._authService.accessUser
   }

   deleteMenu(id){
    return this._http.delete(environment.API+'menus/'+id)
   }
   addMenu(menu){
    return this._http.post(environment.API+'menus',menu)
   }

   updateMenu(menu,id){
    return this._http.put(environment.API+'menus/'+id,menu)
   }
  getMenus(): Observable<any> {
    return this._http.get(environment.API+'menus'+'?restaurant.restaurantOwner.id='+this.userId).pipe(
      map(this.extractData));
  }


  getRestaurant(): Observable<any>{
    return this._http.get(environment.API+'restaurants?restaurantOwner.id='+this.userId).pipe(
      map(this.extractData));
  }
}
