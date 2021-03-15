import { Component, OnInit } from '@angular/core';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-cart-indicator',
  templateUrl: './cart-indicator.component.html',
  styleUrls: ['./cart-indicator.component.css']
})
export class CartIndicatorComponent implements OnInit {
  totalPrice = 0.00;
  totalQuantity = 0;

  constructor(private cartService: CartService) {
  }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {

    // subscribe to the cart totalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // subscribe to the cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }
}

