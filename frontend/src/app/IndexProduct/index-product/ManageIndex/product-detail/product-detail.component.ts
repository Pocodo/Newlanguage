import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  productId: string='';
  product: any;
  error: string='';

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  ngOnInit(): void {
    let productId: string | null = this.route.snapshot.paramMap.get('id');
    if (productId !== null) {
    this.getProductDetails();
  }else{
    console.log("Product id is null");
  }
  }
  getProductDetails() {
    this.productService.getProduct(this.productId).subscribe(
      (data) => {
        console.log(data);
        this.product = data;
      },
      (error) => {
        this.error = 'Failed to fetch product details.';
      }
    );
  }
}
