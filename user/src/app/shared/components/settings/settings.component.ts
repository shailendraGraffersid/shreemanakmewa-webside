import { Component, OnInit, Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from "../../services/product.service";
import { Product } from "../../classes/product";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public products = [];
  public productUrl = environment.productURL;
  public count: any;
  public search: boolean = false;
  public phone: any = '';
  public show = false;
  public languages = [{ 
    name: 'English',
    code: 'en'
  }, {
    name: 'French',
    code: 'fr'
  }];

  public closeResult: string;
  modal: any;
  phoneErrorMsg: boolean = false;
  productResults: any = [];
  productResultsBoolean: boolean = false;
  public searchProductField: ''
  total: any = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, public orderService: OrderService,
    private translate: TranslateService, public router: Router, public productService: ProductService) {
    this.productService.cartItems.subscribe(response => this.products = response || []);
  }

  ngOnInit(): void {}

  // Search Products
  searchProduct(event){
    if(event.target.value.length > 1){
      this.productService.searchProduct(event.target.value).subscribe(response => {
        this.productResults = response['data'];
        this.productResultsBoolean = true;
      })
    }else{
      this.productResults = [];
      this.productResultsBoolean = false;
    }
  }


  searchToggle(){
    this.search = !this.search;
    this.productResults = [];
    this.searchProductField = ''
  }

  changeLanguage(code){
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(code)
    }
  }
  get displayCount(){
    return this.productService.productItems();
  }
  get displayTotalAmount(){
    return this.productService.displayTotalAmount() || 0;
  }
  get getTotal() {
    return this.productService.cartTotalAmount(this.products);
  }

  removeItem(product: any) {
    this.products = this.productService.removeCartItem(product);
  }

  changeCurrency(currency: any) {
    this.productService.Currency = currency
  }

}
