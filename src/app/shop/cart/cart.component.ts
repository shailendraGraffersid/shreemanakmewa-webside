import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductService } from "../../shared/services/product.service";
import { CounterComponent } from '../counter.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public products: any = JSON.parse(localStorage.getItem("cart")) || [];
  @ViewChild(CounterComponent) counter: CounterComponent;
  counterState = ". Order before we run out of stock.";
  modal: any;
  closeResult: string;
  phoneErrorMsg: boolean;
  phone: any;
  public paymentTypeForm:  FormGroup;
  goToCheckout: boolean = true;

  constructor(private fb: FormBuilder, public productService: ProductService, private modalService: NgbModal, public router: Router, public orderService: OrderService) {
    this.paymentTypeForm = this.fb.group({
      payment_option_id: ['', Validators.required]
    })
  }

  ngAfterViewInit() {
    if(this.counter){
      this.counter.startAt = 1800;
      this.counter.counterState.subscribe(msg => {
        if (msg === "COMPLETE") {
          this.counterState = ". Order before we run out of stock.";
          this.router.navigate(['/home/categories']);
        }
      });
      this.counter.start();}
  }

  ngOnInit(): void {
    this.inStock();
    this.checkInStock();
  }

  inStock(){
    // check in stock or not
    let data = { productVariant: JSON.parse(localStorage.getItem('cart'))}
    this.productService.refreshCart(data).subscribe((response) => {
      if(response){
      this.products = response['data'] || [];
      this.orderService.productVariantsSubject.next(this.products);
      this.orderService.productVariantsCountSubject.next(this.products);
      localStorage.setItem('cart', JSON.stringify(this.products));
      }
    })
  }

  public get getTotal() {
    return this.productService.cartTotalAmount(this.products);
    
  }

  checkInStock(){
    this.orderService.productVariantsCountSubject.subscribe(success =>{
      for(let i = 0; i < success.length; i++){
        if(success[i].inStock){
          this.goToCheckout = true;
          return;
        }else if(!success[i].inStock){
          this.goToCheckout = false;
        }
      }
    })
  }

  // Increament
  increment(product) {
    // this.productService.updateCartQuantity(product, qty);
        if(this.products.length > 0){
          this.products.map((cartItem) => {
            if(cartItem.productVariantId == product.productVariantId){
              cartItem.quantity = cartItem.quantity + 1;
              cartItem.price = cartItem.price * cartItem.quantity;
              localStorage.removeItem("cart");
            }
         })
        } 
        this.orderService.productVariantsCountSubject.next(this.products);
        localStorage.setItem("cart", JSON.stringify(this.products));
        this.inStock();
        this.checkInStock();
  }

  // Decrement
  decrement(product) {
    // this.productService.updateCartQuantity(product, qty);
    if(this.products.length > 0){
      this.products.map((cartItem, index) => {
        if(cartItem.productVariantId == product.productVariantId)
        if(cartItem.quantity > 1){
          cartItem.quantity = cartItem.quantity - 1;
          cartItem.price = cartItem.price * cartItem.quantity;
          localStorage.removeItem("cart");
        }else{
          this.products.splice(index, 1);
        }
     })
    } 
    this.orderService.productVariantsCountSubject.next(this.products);
    localStorage.setItem("cart", JSON.stringify(this.products));
    this.inStock();
    this.checkInStock();
  }

  public removeItem(product) {
    this.products = this.productService.removeCartItem(product);
  }

}
