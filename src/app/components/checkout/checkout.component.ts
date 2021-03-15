import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


import {CustomValidator} from 'src/app/validators/custom-validator';
import {CartService} from '../../services/cart.service';
import {CheckoutService} from '../../services/checkout.service';
import {Router} from '@angular/router';
import {Country} from '../../classes/country';
import {Region} from '../../classes/region';
import {FormService} from '../../services/form.service';
import {Order} from '../../classes/order';
import {OrderItem} from '../../classes/order-item';
import {Purchase} from '../../classes/purchase';
import {OktaAuthService} from '@okta/okta-angular';
import {LoginIndicatorComponent} from '../login-indicator/login-indicator.component';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice = 0;
  totalQuantity = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countriesList: Country[] = [];
  shippingAddressRegions: Region[] = [];
  billingAddressRegions: Region[] = [];
  storage: Storage = sessionStorage;
  isAuthenticated: boolean = false;
  successPayment: boolean = false;
  confirmMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private oktaAuthService: OktaAuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpace]),
        email: new FormControl('',
          [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,8}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpace]),
        country: new FormControl('', [Validators.required]),
        region: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpace]),
        country: new FormControl('', [Validators.required]),
        region: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2),
          CustomValidator.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // populate years and months
    const currentMonth: number = new Date().getMonth() + 1;
    this.formService.getCreditCardMonths(currentMonth).subscribe(data => {
      console.log(data);
      this.creditCardMonths = data;
    });

    this.formService.getCreditCardYears().subscribe(data => {
      console.log(data);
      this.creditCardYears = data;
    });

    //  populate countries
    this.formService.getCountries().subscribe(data => {
      this.countriesList = data;
      console.log('data is ' + this.countriesList[0].name);
    });

    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
      }
    );

    if (this.isAuthenticated){
      this.checkoutFormGroup.controls['customer'].setValue({
        email: LoginIndicatorComponent.globalEmail,
      });
    }
  }



  copyShippingAddressToBillingAddress(event): void {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue((this.checkoutFormGroup.controls.shippingAddress.value));
      this.billingAddressRegions = this.shippingAddressRegions;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressRegions = [];
    }
  }

  handleMonthsAndYears(): void {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.formService.getCreditCardMonths(startMonth).subscribe(data => {
      this.creditCardMonths = data;
    });
  }

  getRegions(formGroupName: string): void {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);
    this.formService.getRegions(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressRegions = data;
        } else {
          this.billingAddressRegions = data;
        }
        formGroup.get('region').setValue(data[0]);
      }
    );
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();
  }

  onSubmit(): void {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    const order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    const cartItems = this.cartService.cartItems;

    const orderItems: OrderItem[] = [];
    for (let i = 0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    const purchase = new Purchase();

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    const shippingRegion: Region = JSON.parse(JSON.stringify(purchase.shippingAddress.region));
    purchase.shippingAddress.country = shippingCountry.name;
    purchase.shippingAddress.region = shippingRegion.name;

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    const billingRegion: Region = JSON.parse(JSON.stringify(purchase.billingAddress.region));
    purchase.billingAddress.country = billingCountry.name;
    purchase.billingAddress.region = billingRegion.name;

    purchase.order = order;
    purchase.orderItems = orderItems;


    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          this.confirmMessage = `Your order has been received.\n Order tracking number: ${response.orderTrackingNumber}`;
          this.resetCart();
          this.storage.setItem('cartItems', null);
          this.successPayment = true;
        },
        error: error => {
          alert(`Error processing your purchase: ${error.message}`);
        }
      }
    );
    this.storage.setItem('cartItems', null);
  }

  // customer
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

// shippingAddress
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get shippingAddressRegion() {
    return this.checkoutFormGroup.get('shippingAddress.region');
  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }

// billingAddress
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get billingAddressRegion() {
    return this.checkoutFormGroup.get('billingAddress.region');
  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }

  // creditCard

  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }

  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }

  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }

  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }


}
