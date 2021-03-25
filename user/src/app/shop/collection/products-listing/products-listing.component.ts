import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from "../../../shared/services/product.service";
import { Product } from '../../../shared/classes/product';
import { CategoryService } from 'src/app/shared/services/category.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products-listing',
  templateUrl: './products-listing.component.html',
  styleUrls: ['./products-listing.component.scss']
})
export class ProductsListingComponent implements OnInit {
  public categoryUrl = environment.categoryURL;
  public grid: string = 'col-xl-3 col-md-6';
  public layoutView: string = 'grid-view';
  public products : any;
  public pageNo: number = 1;
  public paginate: any = {}; // Pagination use only
  public sortBy: string; // Sorting Order
  public categoryId: Number;
  public categories: any;
  public productUrl = environment.productURL;

  constructor(private route: ActivatedRoute, private router: Router, public categoryService: CategoryService, private viewScroller: ViewportScroller, public productService: ProductService) {   

      // Get Params
      this.route.params.subscribe((params: Params) => this.categoryId = +params['id']);
      // Get Query params..
      this.route.queryParams.subscribe(params => {
        this.sortBy = params.sortBy ? params.sortBy : 'a-z';
        this.pageNo = params.page ? params.page : this.pageNo;

        // Get Filtered Products..
        this.productService.getProducts.subscribe(response => {         
          // Sorting Filter
          // this.products = this.productService.sortProducts(response, this.sortBy);
          // Paginate Products
          // this.products = this.products.slice(this.paginate.startIndex, this.paginate.endIndex + 1); // get current page of items
        })
        this.router.routeReuseStrategy.shouldReuseRoute = () => { return false; }
      })
  }

  ngOnInit(): void {
    // Fetch category Details
    this.categoryService.getCategoryById(this.categoryId).subscribe(response => {
      this.categories = response;
      this.categoryUrl = this.categoryUrl + response['image'];
    })

    // Fetch Products by Category ID
    this.productService.getProductsByCategoryId(this.categoryId).subscribe(response => {
          this.products = this.productService.sortProducts(response['data'], this.sortBy);
          this.paginate = this.productService.getPager(this.products.length, +this.pageNo);     // get paginate object from service
      // this.products = response['data'];
      
      // this.productUrl = this.productUrl + this.products['image'];
    })
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

  // product Pagination
  setPage(page: number) {
    this.router.navigate([], { 
      relativeTo: this.route,
      queryParams: { page: page },
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

  // Change Layout View
  updateLayoutView(value: string) {
    this.layoutView = value;
    if(value == 'list-view')
      this.grid = 'col-lg-12';
    else
      this.grid = 'col-xl-3 col-md-6';
  }

}
