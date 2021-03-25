import { Renderer2, Inject, Component, OnInit } from '@angular/core';
// import { DOCUMENT } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from "../../shared/services/product.service";
import { OrderService } from "../../shared/services/order.service";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
// import {} from 'googlemaps';
declare var WhWidgetSendButton;
// declare var google: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public checkoutForm:  FormGroup;
  public products = JSON.parse(localStorage.getItem('cart'));
  public amount:  any;
  totalAmount: any;
  modal: any;
  closeResult: string;
  paymentTypeForm: FormGroup;
  paymentValue: any;
  showAddress: boolean = false;
  address: any = ''  ;
  addressCal : any = '';
  openModal: boolean = false;
  deliveryCharges: any;
  deliveryChargeValue: boolean = false;
  showLocalAddress: boolean = false;
  addressFields: boolean = false;
  constructor(private fb: FormBuilder, private renderer2: Renderer2, public productService: ProductService, private modalService: NgbModal,
    private orderService: OrderService, public toastr: ToastrService, public router: Router) { 
        
    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]+'), Validators.minLength(10)]],
      email: ['', [Validators.email]],
      house_no: [''],
      street: [''],
      town: [''],
      state: [''],
      postalcode: [''],
      delivery_option_id: ['', Validators.required],
      payment_option_id: ['', Validators.required]
    })
  }

  shipping(){
    if(this.getTotal < 699 && this.checkoutForm.value.delivery_option_id == 2){
      this.toastr.warning('Shipping only available for orders minimum ₹699');
      this.showAddress = false;
      this.showLocalAddress = false;
    }
    else if(this.checkoutForm.value.delivery_option_id == 2){
      this.showAddress = !this.showAddress;
      this.showLocalAddress = false;
    }else {
      this.showAddress = false;
      this.showLocalAddress = false;
    }
    if(this.checkoutForm.value.delivery_option_id == 1){
      this.showLocalAddress = true;
      this.showAddress = false;}
  }

  ngOnInit(): void {}

  confirmAddress() {
    if(this.checkoutForm.value.street && this.checkoutForm.value.town && this.checkoutForm.value.state){
    this.addressFields = false;
        this.addressCal = this.checkoutForm.value.street + ', ' + this.checkoutForm.value.town + ', ' + this.checkoutForm.value.state;}
    this.orderService.addDeliveryCharges({addressCal: this.addressCal}).subscribe(res => {
      if(res['status'] == true){
        if(res['charges'] > 100){
          this.toastr.warning("Sorry currently we are not delivering here.")
        }else{
          this.deliveryChargeValue= true;
          this.deliveryCharges = res['charges'];
        }
      }
    }, err => {
      console.log('errrororoor>>>', err);
      this.toastr.error(err.error.error)
    })
  }

  public get getTotal() {
    if(this.deliveryChargeValue && this.showAddress){
      return this.productService.cartTotalAmount(this.products) + this.deliveryCharges;
    }else{
      return this.productService.cartTotalAmount(this.products);
    }
  }

  async displayPayAmount(){
    if(this.checkoutForm.value.house_no) 
      this.address = this.checkoutForm.value.house_no + ', ' + this.checkoutForm.value.street + ', ' + this.checkoutForm.value.town + ', ' + this.checkoutForm.value.state + ', ' + this.checkoutForm.value.postalcode;
    let data = {
      customermobile: this.checkoutForm.value.phone,
      firstname: this.checkoutForm.value.firstname,
      lastname: this.checkoutForm.value.lastname,
      email: this.checkoutForm.value.email,
      address: this.address,
      deliveryCharge: this.deliveryCharges,
      payment_option_id: this.checkoutForm.value.payment_option_id,
      delivery_option_id: this.checkoutForm.value.delivery_option_id,
      productVariant: JSON.parse(localStorage.getItem('cart'))
    }
    
    this.orderService.createUserAndOrder(data).subscribe(async response => {
      localStorage.setItem('userId', response['user_id']);
      localStorage.setItem('orderId', response['order_id']);
      
    // fetch payment from backend
    let dataArray = [], newArr = [];
    dataArray = JSON.parse(localStorage.getItem('cart'));
    for(let i = 0; i< dataArray.length ; i++){
      if(dataArray[i].inStock)
        newArr.push(dataArray[i]);
    }
    await this.orderService.fetchPayment(newArr).subscribe((response) => {
          if(response){
            if(this.showAddress){
              this.totalAmount = response['result'] + this.deliveryCharges;
            }else{
              this.totalAmount = response['result'];
            }
          }
        }, (error) => {
          console.log('error::', error);
          
        })

      const res = await this.loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if(res['error'])
        this.toastr.error(res['error']);

      if(!res){
        console.log("Failed");
        return;
      }

      /**THE REQUIRED USER DETAILS */
      const userDetails = {
          user_id : JSON.parse(localStorage.getItem('userId')),
          order_id : JSON.parse(localStorage.getItem('orderId')),
          total_amount : this.totalAmount,
          userData: this.checkoutForm.value,
      }

  const data = await fetch(environment.baseURL + '/payment/razorpay', {method: 'POST',
  headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userDetails)
  }).then((t) => t.json()
  )
  
  // error case
  if(data.error)
    this.toastr.error(data.error)
  else{
    const options = {
    "key": "rzp_test_SHexZpJxOBaCNd", 
    "amount": data.amount.toString(), 
    "currency": data.currency,
    "name": "Manak Mewa",
    "description": "Manak Mewa Transactions",
    "image": "https://bpage.sgp1.digitaloceanspaces.com/61597305517.png",
    "order_id": data.id, 
    "handler": async (response) => {
        // alert('sdfg',response.razorpay_payment_id);
        // alert('ararara',response.razorpay_order_id);
        // alert(response.razorpay_signature)
        const signatureDetails = {
            'razorpay_order_id': data.id,
            'razorpay_payment_id': response.razorpay_payment_id,
            'mobile': data,
            user_id : JSON.parse(localStorage.getItem('userId')),
            order_id : JSON.parse(localStorage.getItem('orderId')),
          }
        const verified = await fetch(environment.baseURL + '/payment/verification', {method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': response.razorpay_signature
        },
        body: JSON.stringify(signatureDetails)
        }).then((t) => t.json())
        if(verified.status == 200){
          // this.toastr.success(verified.message);
          localStorage.removeItem('cart');
          this.router.navigate(['/home/categories']);
          this.openModal = true;
          // open modal
          this.modalService.open(this.modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
          this.orderService.productVariantsSubject.next(null);
          this.orderService.productVariantsCountSubject.next(JSON.parse(localStorage.getItem("cart")));  
        }
  },
  // "prefill": {
  //     "name": "Kavita Bhakuni",
  //     "email": "kavita.b@gmail.com",
  //     "contact": "9999999999"
  // }
  };
    var rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
    }
    },(error) => {
      this.toastr.error(error.error.error);
    })
  }	


  loadScript(src){
    return new Promise(resolve =>{

    const script = document.createElement('script');
    script.src = src  

    script.onload = () =>{
    resolve(true)
    }
    script.onerror = () =>{
    resolve(true)
    }
    document.body.appendChild(script);

    })
  }

  
  async open(content, event) {
    this.addressFields = true;
    if(!this.checkoutForm.value.delivery_option_id){
      this.toastr.warning('Please select Delivery Options');
    }else if(!this.checkoutForm.value.payment_option_id){
      this.toastr.warning('Please select Payment Options');
    }else if(this.checkoutForm.invalid ){
      // if(this.checkoutForm.value.delivery_option_id == 2)
      this.toastr.warning('Fill all the fields');
    }else {
    
    this.modal = content;
    if(this.checkoutForm.value.payment_option_id == '1'){
      await this.displayPayAmount();
    }else {
      await this.submitPayment();
    
    // if(content._declarationTContainer.localNames[0] == 'thankContent')
    //   this.submitPayment();
    if(!this.products.length){
      this.router.navigate(['/shop/cart']);
    }
  //   else{
  //     if(this.openModal)
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  // }
  }}
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
  submitPayment(){
      // this.modalService.dismissAll(ModalDismissReasons.BACKDROP_CLICK);
      // Creating user and its order wrt order items
      if(this.checkoutForm.value.house_no && this.checkoutForm.value.street && this.checkoutForm.value.town && this.checkoutForm.value.state && this.checkoutForm.value.postalcode) 
        this.address = this.checkoutForm.value.house_no + ', ' + this.checkoutForm.value.street + ', ' + this.checkoutForm.value.town + ', ' + this.checkoutForm.value.state + ', ' + this.checkoutForm.value.postalcode;
      let data = {
        customermobile: this.checkoutForm.value.phone,
        firstname: this.checkoutForm.value.firstname,
        lastname: this.checkoutForm.value.lastname,
        email: this.checkoutForm.value.email,
        address: this.address,
        payment_option_id: this.checkoutForm.value.payment_option_id,
        delivery_option_id: this.checkoutForm.value.delivery_option_id,
        deliveryCharge: this.deliveryCharges,
        productVariant: JSON.parse(localStorage.getItem('cart'))
      }
      this.orderService.createUserAndOrder(data).subscribe(response => {
        localStorage.setItem('userId', response['user_id']);
        localStorage.setItem('orderId', response['order_id']);
        
        // fetch payment from backend
        let dataArray = [], newArr = [];
        dataArray = JSON.parse(localStorage.getItem('cart'));
        for(let i = 0; i< dataArray.length ; i++){
          if(dataArray[i].inStock)
          newArr.push(dataArray[i]);
        }
        this.orderService.fetchPayment(newArr).subscribe((response) => {
          if(response){
            if(this.showAddress){
              this.totalAmount = response['result'] + this.deliveryCharges;
            }else{
              this.totalAmount = response['result'];
            }
            /**THE REQUIRED USER DETAILS */
            const userDetails = {
              user_id : JSON.parse(localStorage.getItem('userId')),
              order_id : JSON.parse(localStorage.getItem('orderId')),
              total_amount : this.totalAmount,
              // userData: this.checkoutForm.value
            }
            
            // order confirm for COD
            this.orderService.confirmCOD(userDetails).subscribe((res) => {
              if(res['error']){
                this.toastr.error(res['error']);
              }else{
                this.openModal = true;
                // open modal
                this.modalService.open(this.modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
                  this.closeResult = `Closed with: ${result}`;
                }, (reason) => {
                  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                });
                this.router.navigate(['/home/categories']);
                localStorage.removeItem('cart');
                localStorage.removeItem('userId');
                localStorage.removeItem('orderId');
                this.orderService.productVariantsSubject.next(null);   
                this.orderService.productVariantsCountSubject.next(null);  
                
                // <!-- GetButton.io widget -->
                //    const s = this.renderer2.createElement('script');
                //     s.type = 'text/javascript';
                // <script type="text/javascript">
                    // (function () {
                        // this.whatsapp();
                    // })();
                // </script>
                // <!-- /GetButton.io widget -->
              }
            })
          }
        }, (error) => {
          console.log('error::', error);
          
        });
      }, (error) => {
        this.toastr.error(error.error.error);
      })
  }
  // whatsapp(){
  //   var options = {
  //     greeting_message: "hello tehere",
  //     whatsapp: "+918218329828", // WhatsApp number
  //     call_to_action: "Message us", // Call to action
  //     position: "right", // Position may be 'right' or 'left'
  //     pre_filled_message: "hello there, thank you for ...", // WhatsApp pre-filled message
  //   };
  //   var proto = document.location.protocol, host = "getbutton.io", url = proto + "//static." + host;
  //   var s = document.createElement('script'); 
  //   s.type = 'text/javascript'; 
  //   s.async = true; 
  //   s.src = url + '/widget-send-button/js/init.js';
  //   s.onload = function () { 
  //     WhWidgetSendButton.init(host, proto, options); 
  //   };
  //   var x = document.getElementsByTagName('script')[0];
  //   x.parentNode.insertBefore(s, x);
  // }
}
