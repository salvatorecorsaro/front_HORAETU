import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {CatalogueService} from '../../services/catalogue.service';
import {CustomValidator} from '../../validators/custom-validator';
import {ProductDto} from '../../classes/product-dto';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  newProductFormGroup: FormGroup;
  deleteProductFormGroup: FormGroup;
  adminAccount = false;
  storage: Storage = sessionStorage;
  labelDelete: FormControl;
  labelUpdate: FormControl;
  labelNewName: FormControl;
  form: FormGroup;
  formUpdate: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private catalogueService: CatalogueService
  ) {
  }

  ngOnInit(): void {
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));
    console.log(theEmail);
    if (theEmail === 'admin@horae.dev') {
      this.adminAccount = true;
    }

    this.newProductFormGroup = this.formBuilder.group({
      newProduct: this.formBuilder.group({
        name: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpace]),
        description: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpace]),
        sku: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpace]),
        imageUrl: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidator.notOnlyWhiteSpace]),
        category: [''],
        unitPrice: [''],

      })
    });

    this.labelDelete = new FormControl('');

    this.form = new FormGroup({
      code: this.labelDelete
    });

    this.labelUpdate = new FormControl('');
    this.labelNewName = new FormControl('');
    this.formUpdate = new FormGroup({
      code: this.labelUpdate,
      name: this.labelNewName
    });
  }

  onSubmit() {
    let newProduct = new ProductDto();
    newProduct = this.newProductFormGroup.controls['newProduct'].value;
    newProduct.active = true;
    newProduct.unitsInStock = 100;

    console.log(newProduct);

    this.catalogueService.postNewProduct(newProduct).subscribe(data => {
      if (data === true) {
        alert('added new product! = ' + newProduct);
      }
    });
  }

  onSubmitDelete(formDirective: FormGroupDirective): void {
    this.catalogueService.deleteProduct(this.labelDelete.value).subscribe(data => {
      if (data === true) {
        alert('Product deleted!');
      } else {
        alert('Product not found!');
      }
    });
    this.form.reset();
  }


  onSubmitUpdate(formDirective: FormGroupDirective): void {
    this.catalogueService.updateProduct(this.labelUpdate.value, this.labelNewName.value).subscribe(data => {
      if (data === true) {
        alert('Product updated!');
      } else {
        alert('Product not found!');
      }
    });
    this.form.reset();
  }
}
