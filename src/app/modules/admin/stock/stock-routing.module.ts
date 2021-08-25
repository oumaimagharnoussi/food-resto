import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryBrandsResolver, InventoryCategoriesResolver, InventoryProductsResolver, InventoryTagsResolver, InventoryVendorsResolver } from './inventory.resolvers';
import { MenuListComponent } from './menu/menu-list/menu-list.component';
import { ProductListComponent } from './product/product-list/product-list.component';

export const routes: Routes = [
  {
    path:'menus',
    component: MenuListComponent
  },
  {
    path:'products',
    component: ProductListComponent,
    resolve  : {
      brands    : InventoryBrandsResolver,
      categories: InventoryCategoriesResolver,
      products  : InventoryProductsResolver,
      tags      : InventoryTagsResolver,
      vendors   : InventoryVendorsResolver
  }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
