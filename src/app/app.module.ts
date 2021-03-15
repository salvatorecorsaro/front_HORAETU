import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from '@angular/material/slider';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {Router, RouterModule, Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import { CatalogueListComponent } from './components/catalogue-list/catalogue-list.component';
import { CatalogueService } from './services/catalogue.service';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatSelectModule} from '@angular/material/select';
import { CategoryMenuComponent } from './components/category-menu/category-menu.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { CatalogueDetailsComponent } from './components/catalogue-details/catalogue-details.component';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { CartIndicatorComponent } from './components/cart-indicator/cart-indicator.component';
import {MatTableModule} from '@angular/material/table';
import {MatBadgeModule} from '@angular/material/badge';
import { CheckoutComponent } from './components/checkout/checkout.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LoginComponent } from './components/login/login.component';
import { LoginIndicatorComponent } from './components/login-indicator/login-indicator.component';

import {
  OKTA_CONFIG,
  OktaAuthModule,
  OktaCallbackComponent,
  OktaAuthGuard
} from '@okta/okta-angular';

import myAppConfig from './config/my-app-config';
import { AdminComponent } from './components/admin/admin.component';
import { MembersComponent } from './components/members/members.component';
import { SummerComponent } from './components/summer/summer.component';
import { SpringComponent } from './components/spring/spring.component';
import { FallComponent } from './components/fall/fall.component';
import { WinterComponent } from './components/winter/winter.component';
import { HeaderComponent } from './components/header/header.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';


const oktaConfig = Object.assign({
  onAuthRequired: (oktaAuth, injector) => {
    const router = injector.get(Router);

    // Redirect the user to your custom login page
    router.navigate(['/login']);
  }
}, myAppConfig.oidc);

const routes: Routes = [
  {path: 'chatbot', component: ChatbotComponent},
  {path: 'summer', component: SummerComponent},
  {path: 'spring', component: SpringComponent},
  {path: 'fall', component: FallComponent},
  {path: 'winter', component: WinterComponent},
  {path: 'members', component: MembersComponent, canActivate: [ OktaAuthGuard]},
  {path: 'admin', component: AdminComponent, canActivate: [ OktaAuthGuard]},
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path: 'checkout', component: CheckoutComponent },
  {path: 'cart', component: CartComponent},
  {path: 'products/:id', component: CatalogueDetailsComponent},
  {path: 'search/:keyword', component: CatalogueListComponent},
  {path: 'category/:id', component: CatalogueListComponent},
  {path: 'catalogue', component: CatalogueListComponent},
  {path: '', component: HomeComponent},
  {path: '**', redirectTo: '/catalogue', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    CatalogueListComponent,
    CategoryMenuComponent,
    SearchBarComponent,
    CatalogueDetailsComponent,
    HomeComponent,
    CartComponent,
    CartIndicatorComponent,
    CheckoutComponent,
    LoginComponent,
    LoginIndicatorComponent,
    AdminComponent,
    MembersComponent,
    SummerComponent,
    SpringComponent,
    FallComponent,
    WinterComponent,
    HeaderComponent,
    ChatbotComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    DragDropModule,
    ScrollingModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    NgbModule,
    MatSelectModule,
    MatTableModule,
    MatBadgeModule,
    MatFormFieldModule,
    OktaAuthModule,
    MatInputModule,
    MatExpansionModule,
    MatTabsModule

  ],
  providers: [CatalogueService, { provide: OKTA_CONFIG, useValue: oktaConfig }],
  bootstrap: [AppComponent]
})
export class AppModule { }
