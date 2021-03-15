import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Purchase} from '../classes/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private purchaseUrl = 'https://gateway-horae.herokuapp.com/api/checkout/purchase';

  constructor(private httpClient: HttpClient) {
  }

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }



}

