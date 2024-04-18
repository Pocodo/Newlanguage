import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  add(data: any) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'image' && data[key] instanceof File) {
        formData.append(key, data[key], data['name'] + '.jpg');
      } else {
        formData.append(key, data[key]);
      }
    });
    return this.httpClient.post(this.url + '/product/add/', formData);
  }
  update(data: any) {
    return this.httpClient.patch(this.url + '/product/update/', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
  getProducts() {
    return this.httpClient.get(this.url + '/product/get/');
  }
  updateStatus(id: any, status: any) {
    return this.httpClient.patch(this.url + '/product/updateStatus/' + id, {
      status,
    });
  }

  delete(id: any) {
    return this.httpClient.delete(this.url + '/product/delete/' + id, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
  getProduct(id: any){
    return this.httpClient.get(this.url + '/product/get/' +id);
  }
  getProductsByCategory(id: any) {
    console.log(id);
    return this.httpClient.get(this.url + '/product/getByCategory/' + id);
  }
  getById(id: any) {
    console.log(id);
    return this.httpClient.get(this.url + '/product/getById/' + id);
  }
}
