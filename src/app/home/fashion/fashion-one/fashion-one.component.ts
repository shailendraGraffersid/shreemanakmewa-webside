import { Component, OnInit } from '@angular/core';
import { ProductSlider } from '../../../shared/data/slider';
import { Product } from '../../../shared/classes/product';
import { ProductService } from '../../../shared/services/product.service';
import { CategoryService } from '../../../shared/services/category.service';
import { ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fashion-one',
  templateUrl: './fashion-one.component.html',
  styleUrls: ['./fashion-one.component.scss']
})
export class FashionOneComponent implements OnInit {

  // public products: Product[] = [];
  public products= [];
  public productCollections: any[] = [];
  public categoryUrl = environment.categoryURL;
  grid: string;
  layoutView: string;
  sortBy: string;
  
  constructor(public productService: ProductService, public categoryService: CategoryService, private route: ActivatedRoute, private router: Router, private viewScroller: ViewportScroller) {
    this.sortBy =  'ascending';
    this.productService.getProducts.subscribe(response => {
    });
  }
  

  public ProductSliderConfig : any = ProductSlider;

  public sliders = [{
    image: 'assets/images/slider/home1.jpg'
  }, {
    image: 'assets/images/slider/home2.jpg'
  }]


  ngOnInit(): void {

    // Fetching the categories 
    this.categoryService.getCategoryData.subscribe(response => {
      // this.products = this.productService.sortProducts(response['data'].rows, this.sortBy);
      this.products = response['data'].rows;
    })
  }

    // Change Layout View
    updateLayoutView(value: string) {
      this.layoutView = value;
      if(value == 'list-view')
        this.grid = 'col-lg-6';
      else
        this.grid = 'col-xl-3 col-md-6';
    }

  // SortBy Filter
  sortByFilter(value) {
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: { sortBy: value ? value : null},
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Change Grid Layout
  updateGridLayout(value: string) {
    this.grid = value;
  }

  // Product Tab collection
  getCollectionProducts(collection) {
    return this.products.filter((item) => {
      if (item.collection.find(i => i === collection)) {
        return item
      }
    })
  }
  
}
