import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

@Component({
  selector: 'app-login-indicator',
  templateUrl: './login-indicator.component.html',
  styleUrls: ['./login-indicator.component.css']
})
export class LoginIndicatorComponent implements OnInit {
  static globalAuthentication: boolean = false;
  static globalEmail: string;
  isAuthenticated: boolean = false;
  userFullName: string;
  userEmail: string;

  storage: Storage = sessionStorage;

  constructor(private oktaAuthService: OktaAuthService) { }

  ngOnInit(): void {

    // Subscribe to authentication state changes
    this.oktaAuthService.$authenticationState.subscribe(
      (result) => {
        this.isAuthenticated = result;
        LoginIndicatorComponent.globalAuthentication = result;
        this.getUserDetails();
      }
    );

  }

  getUserDetails() {
    if (this.isAuthenticated) {

      // Fetch the logged in user details (user's claims)
      //
      // user full name is exposed as a property name
      this.oktaAuthService.getUser().then(
        (res) => {
          this.userFullName = res.name;
          this.userEmail = res.email;
          LoginIndicatorComponent.globalEmail = res.email;
          // retrieve the user's email from authentication response
          const theEmail = res.email;
          console.log(res);
          // now store the email in browser storage
          this.storage.setItem('userEmail', JSON.stringify(theEmail));
        }
      );
    }
  }

  logout() {
    // Terminates the session with Okta and removes current tokens.
    this.oktaAuthService.signOut();
  }
}
