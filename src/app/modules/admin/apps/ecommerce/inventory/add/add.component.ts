import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { InventoryListComponent } from '../list/inventory.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  SERVER_URL = "https://food.dev.confledis.fr/api/media_objects";
  uploadForm: FormGroup;  
  filepath=""
  p={
    name:"",
    description:"",
    stock:-1,
    seuil:-1,
    unitPrice:-1,
    image:null,
    restaurant:""
    }

  constructor(private _changeDetectorRef: ChangeDetectorRef,private formBuilder: FormBuilder, private httpClient: HttpClient,private _productService: ProductService,private _productListComponent: InventoryListComponent
    ) {
    
   }

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
    
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
        this.p.image='api/media_objects/'+res.id;
        this.filepath=res.filePath
         // Mark for check
         this._changeDetectorRef.markForCheck();
      } ,
      (err) => console.log(err)
    );
  }

  addProduct(){
    this._productService.getRestaurant().subscribe(
     async  restaurant=>{
        let id=restaurant[0].id
        this.p.restaurant='api/restaurants/'+id
        this._productService.addProduct(this.p).subscribe(
          res=>{
            console.log(res);
            this._productListComponent.getProducts()
            this._productListComponent.showAddForm()
          }
        )
      }
    )
  }

}
