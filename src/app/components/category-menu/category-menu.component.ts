import { Component, OnInit } from '@angular/core';
import {CatalogueService} from '../../services/catalogue.service';
import {ProductCategory} from '../../classes/product-category';

@Component({
  selector: 'app-category-menu',
  templateUrl: './category-menu.component.html',
  styleUrls: ['./category-menu.component.css']
})
export class CategoryMenuComponent implements OnInit {

  catalogueCategories: ProductCategory[] = [];

  constructor(private catalogueService: CatalogueService) { }

  ngOnInit(): void {
    this.listProductCategories();
  }

  listProductCategories() {

    this.catalogueService.getProductCategories().subscribe(
      data => {
        this.catalogueCategories = data;
      }
    );
  }

}
