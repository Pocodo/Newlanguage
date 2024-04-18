import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-index-product',
  templateUrl: './index-product.component.html',
  styleUrls: ['./index-product.component.scss']
})
export class IndexProductComponent implements OnInit {
  products: any[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (response:any)=>{
        this.products = response;
        console.log(this.products)
      },
      (error: any)=>{
        console.error('Error fetching products:', error);
      }
    )

  }
  navigateToProductDetails(productId: string) {
    console.log(productId);
    this.router.navigate(['/cafe/product-details', productId]);
  }
}
