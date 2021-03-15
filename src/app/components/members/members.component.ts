import {Component, OnInit} from '@angular/core';
import {OktaAuthService} from '@okta/okta-angular';
import {HttpClient} from '@angular/common/http';
import {OrderService} from '../../services/order.service';
import {Order} from '../../classes/order';
import {LoginIndicatorComponent} from '../login-indicator/login-indicator.component';
import {OrderDto} from '../../classes/order-dto';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  orders: OrderDto[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderService: OrderService) {
  }

  ngOnInit(): void {
    // this.getOrderHistory();\
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    // read the user's email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));

    // retrieve data from the service
    this.orderService.getOrderHistory(theEmail).subscribe(
      data => {
        this.orders = data._embedded.orders;
      }
    );
  }

}


