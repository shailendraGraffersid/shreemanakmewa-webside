import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const state = {
  checkoutItems: JSON.parse(localStorage['checkoutItems'] || '[]')
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public productVariantsSubject: BehaviorSubject<any>;
  public productVariantsCountSubject: BehaviorSubject<any>;
  public productVariants: Observable<any>;

  constructor(private router: Router, private http: HttpClient) { 
    this.productVariantsSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('cart')));
    this.productVariantsCountSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('cart')));
    this.productVariants = this.productVariantsSubject.asObservable();
  }

  // Create Useer with its order
  public createUserAndOrder(data){
    return this.http.post(environment.baseURL + '/addToCart', data);
  }

  // Add Delivery Charges
  public addDeliveryCharges(data){
    return this.http.post(environment.baseURL + '/addToCart/addDeliveryCharges', data);
  }

  // Get Checkout Items
  public get checkoutItems(): Observable<any> {
    const itemsStream = new Observable(observer => {
      observer.next(state.checkoutItems);
      observer.complete();
    });
    return <Observable<any>>itemsStream;
  }

  // Create order
  public createOrder(product: any, details: any, orderId: any, amount: any) {
    var item = {
        shippingDetails: details,
        product: product,
        orderId: orderId,
        totalAmount: amount
    };
    state.checkoutItems = item;
    localStorage.setItem("checkoutItems", JSON.stringify(item));
    localStorage.removeItem("cartItems");
    this.router.navigate(['/shop/checkout/success', orderId]);
  }
  
  // Fetch Payment
  public fetchPayment(data){
    return this.http.post(environment.baseURL + '/inventory/fetchPayment', data);
  }

  // order confirm COD
  public confirmCOD(data){
    return this.http.post(environment.baseURL + '/payment/confirmCOD', data);
  }
}
