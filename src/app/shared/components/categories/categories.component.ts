import { Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  public products: any;
  public collapse: boolean = true;
  category: any;

  constructor(public productService: ProductService, public categoryService: CategoryService) { 
    // this.productService.getProducts.subscribe(product => this.products = product);
    this.categoryService.getCategoryData.subscribe(response => {
      this.products = response['data'].rows;
    })
  }

  ngOnInit(): void {
  }

  get filterbyCategory() {
    const category = [...new Set(this.products.map(product => {
    
      // product.name
    }))]
  return category;
  }

}
