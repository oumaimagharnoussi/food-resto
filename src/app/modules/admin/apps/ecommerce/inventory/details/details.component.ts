import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { InventoryListComponent } from '../list/inventory.component';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  server=environment.S3_url;
  SERVER_URL = environment.API+"media_objects";
  uploadForm: FormGroup;  
  filepath=""
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  productId: any;
  product={
    name:"",
    description:"",
    stock:-1,
    seuil:-1,
    unitPrice:-1,
    image:null,
    restaurant:"",
    menus:null
    }
  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient,private _productListComponent: InventoryListComponent, private _activatedRoute: ActivatedRoute,
    private _productService:ProductService,private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router
    ) { 
      
    }

    getId(ch){
      let index=0;
      for(let i=0; i< ch.length;i++){
        if(ch[i]=='/'){
          index=i
        }
        

      }
      return ch.substring(index+1,ch.length)
    }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });

    

    
    this._productListComponent.matDrawer.open();
    this._productService.getProduct(this.getId(window.location.pathname)).subscribe(
      res=>{
        this.product=res
          // Mark for check
          this._changeDetectorRef.markForCheck();
          if(this.product.image){
            this.filepath=this.product.image.filePath
          }

      }
    )

    
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('profile').setValue(file);
      this.onSubmit()
    }
  }

  onSubmit() {

    const formData = new FormData();
    formData.append('file', this.uploadForm.get('profile').value);

    this.httpClient.post<any>(this.SERVER_URL, formData).subscribe(
      (res) =>{
        this.product.image='api/media_objects/'+res.id;
        this.filepath=res.filePath
         // Mark for check
         this._changeDetectorRef.markForCheck();
      } ,
      (err) => console.log(err)
    );
  }

  updateProduct(){
    delete this.product.menus
    delete this.product.restaurant
    this._productService.updateProduct(this.product,this.getId(window.location.pathname)).subscribe(
      res=>{
        console.log(res)
        this._productListComponent.getProducts()
         this._productListComponent.matDrawer.close();
         this._router.navigate(['../'], {relativeTo: this._activatedRoute});
      }
    )
  }

  deleteProduct(){
    this._productService.deleteProduct(this.getId(window.location.pathname)).subscribe(
      res=>{
        console.log(res)
        this._productListComponent.getProducts()
         this._productListComponent.matDrawer.close();
         this._router.navigate(['../'], {relativeTo: this._activatedRoute});
      }
    )
  }
      /**
     * Close the drawer
     */
       closeDrawer(): Promise<MatDrawerToggleResult>
       {
           return this._productListComponent.matDrawer.close();
       }

           /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        // Listen for matDrawer opened change
        this._productListComponent.matDrawer.openedChange
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter(opened => opened)
            )
            .subscribe(() => {

              
            });
    }

}
