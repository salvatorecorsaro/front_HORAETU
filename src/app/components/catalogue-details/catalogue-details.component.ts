import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CatalogueService} from '../../services/catalogue.service';
import {Product} from '../../classes/product';
import {CartItem} from '../../classes/cart-item';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-catalogue-details',
  templateUrl: './catalogue-details.component.html',
  styleUrls: ['./catalogue-details.component.css']
})
export class CatalogueDetailsComponent implements OnInit {

  productToShow: Product = new Product();

  constructor(private route: ActivatedRoute,
              private catalogueService: CatalogueService,
              private cartService: CartService
              ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  goBack() {
    window.history.back();
  }


  private handleProductDetails() {
    const productId: number = +this.route.snapshot.paramMap.get('id');
    this.catalogueService.getProduct(productId).subscribe(
      data => {
        this.productToShow = data;
      }
    );
  }

  addToCart() {
    const theCartItem = new CartItem(this.productToShow);
    this.cartService.addToCart(theCartItem);

  }
}
