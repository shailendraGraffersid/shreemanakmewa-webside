import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { SizeModalComponent } from "../../../../shared/components/modal/size-modal/size-modal.component";
import { environment } from 'src/environments/environment';
import { OrderService } from 'src/app/shared/services/order.service';
// Requiring the lodash library   
import * as _ from "lodash";
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-left-sidebar',
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: ['./product-left-sidebar.component.scss']
})
export class ProductLeftSidebarComponent implements OnInit {

  public product: any;
  public counter: Object = {};
  public cart: any = JSON.parse(localStorage.getItem("cart")) || [];
  public activeSlide: any = 0;
  public selectedSize: any;
  public mobileSidebar: boolean = false;
  public closeResult: string;
  modal: any;
  public phone: any = '';
  phoneErrorMsg: boolean = false;

  @ViewChild("sizeChart") SizeChart: SizeModalComponent;
  
  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;
  public productId: number;
  productimage: string;
  productVariants: any;
  foundMatch: boolean = false;
  category: any;

  constructor(public toastr: ToastrService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal, public orderService: OrderService, public productService: ProductService, public categoryService: CategoryService) { 
      // Get Params
      this.route.params.subscribe((params: Params) => this.productId = +params['id']);
      // Get Products By Id
      this.productService.getProductById(this.productId).subscribe(response => {
        this.product = response;
        this.productimage = environment.productURL + this.product.image;
         // Get Category for breadcrumb
      this.categoryService.getCategoryById(this.product.categoryId).subscribe(res => {
        this.category = res;
      })
      })

      //Get product variants
      this.productService.getVariants(this.productId).subscribe(response => {
        this.productVariants = response;
        this.orderService.productVariantsCountSubject.subscribe(success =>{
          for(let i=0; i< this.productVariants.length; i++){
            if(success){
            for(let j=0; j< success.length; j++){ 
              if(this.productVariants[i].id == success[j].productVariantId){
                this.productVariants[i]['count'] = success[j].quantity || 0;
              }
            }
          }if(!this.productVariants[i].count) {this.productVariants[i]['count'] = 0}
          }
        })
      })
      this.router.routeReuseStrategy.shouldReuseRoute = () => { return false; }
    }

    ngOnInit(): void {
    }


  // Get Product Size
  Size(variants) {
    const uniqSize = []
    for (let i = 0; i < Object.keys(variants).length; i++) {
      if (uniqSize.indexOf(variants[i].size) === -1 && variants[i].size) {
        uniqSize.push(variants[i].size)
      }
    }
    return uniqSize
  }

  selectSize(size) {
    this.selectedSize = size;
  }
  
  // Increment
  increment(productDetails, variantDetails) {
    this.foundMatch = false;
      if(this.cart.length > 0){
        this.cart.map((cartItem) => {
          if(cartItem.productVariantId == variantDetails.id && cartItem.quantity == variantDetails.inventory_qty){
            this.toastr.warning('We have only ' +variantDetails.inventory_qty+' ' +cartItem.productVariant+ ' in stock');
            this.foundMatch = true;
          }
          else {
          if(cartItem.productVariantId == variantDetails.id ){
            cartItem.quantity = cartItem.quantity + 1;
            // localStorage.removeItem("cart");
            this.foundMatch = true;
          }}
       })
       if(!this.foundMatch){
          this.counter = {};
              this.counter['quantity'] = 1;
              this.counter['productVariant'] = productDetails.name + '-' + variantDetails.quantity;
              this.counter['productId'] = this.productId;
              this.counter['productVariantId'] = variantDetails.id;
              this.counter['productImage'] = environment.productURL + productDetails.image;
              this.counter['initialPrice'] = variantDetails.price;
            this.cart.push(this.counter);
       }
      } else {
        this.counter['quantity'] = 1;
      this.counter['productVariant'] = productDetails.name + '-' + variantDetails.quantity;
      this.counter['productId'] = this.productId;
      this.counter['productVariantId'] = variantDetails.id;
      this.counter['productImage'] = environment.productURL + productDetails.image;
      this.counter['initialPrice'] = variantDetails.price;
      this.cart.push(this.counter);
  }
  this.orderService.productVariantsCountSubject.next(this.cart);
  this.orderService.productVariantsSubject.next(JSON.parse(localStorage.getItem("cart")));
  // localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  // Decrement
  decrement(data, index) {
    this.foundMatch = false;
    if(this.cart.length > 0){
      this.cart.map((cartItem, index) => {
        if(cartItem.productVariantId == data)
        if(cartItem.quantity && cartItem.quantity > 1){
          cartItem.quantity = cartItem.quantity - 1;
          // localStorage.removeItem("cart");
        }else if(cartItem.quantity == 1){
          cartItem.quantity = cartItem.quantity - 1;
          if(this.productVariants[index])
          this.productVariants[index]['count'] = 0;
          this.orderService.productVariantsCountSubject.next(this.cart);
          this.cart.splice(index, 1);
        }
     })
    }else {
      this.productVariants[index]['count'] = 0;
      this.cart.splice(index, 1);
    }
    this.orderService.productVariantsCountSubject.next(this.cart);
    this.orderService.productVariantsSubject.next(JSON.parse(localStorage.getItem("cart")));
    // localStorage.setItem("cart", JSON.stringify(this.cart));
  }

  // Add to cart
  async addToCart() {
    if(Object.keys(this.cart).length === 0 || (this.counter['quantity'] == 0) || (Object.keys(this.counter).length === 0)){
      this.toastr.warning('Please select Quantity.');
    }else{
      this.toastr.success('Product has been added to cart');}
    this.orderService.productVariantsSubject.next(this.cart);
    this.orderService.productVariantsCountSubject.next(this.cart);
    localStorage.setItem("cart", JSON.stringify(this.cart));
}

  // Buy Now
  async buyNow(product: any) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart(product);
    if(status)
      this.router.navigate(['/shop/checkout']);
  }

  // Add to Wishlist
  addToWishlist(product: any) {
    this.productService.addToWishlist(product);
  }

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

  open(content, event) {
    this.modal = content;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    // this.orderService.productVariantsSubject.next(this.cart);
    // localStorage.setItem("cart", JSON.stringify(this.cart));
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // Submit Phone Number
  submitPhone(){
    this.phoneErrorMsg = false;
    if(this.phone.toString().length == 10){
      this.phoneErrorMsg = false;
      this.modalService.dismissAll(ModalDismissReasons.BACKDROP_CLICK);
      this.router.navigate(['/shop/cart']);
      
      // Creating user and its order wrt order items
      let data = {
        customermobile: this.phone,
        productVariant: JSON.parse(localStorage.getItem('cart'))
      }
      this.orderService.createUserAndOrder(data).subscribe(response => {
        localStorage.setItem('userId', response['user_id']);
      })
    }else{
      this.phoneErrorMsg = true;
    }
  }
}
