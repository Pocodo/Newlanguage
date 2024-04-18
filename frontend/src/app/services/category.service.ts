import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  url = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}

  add(data: any) {
    console.log(data)
    return this.httpClient.post(this.url + '/category/add/', data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }
  update(data: any) {
    console.log(data);
    return this.httpClient.patch(`${this.url}/category/update/${data.id}`, data, {
      headers: new HttpHeaders().set('Content-type', 'application/json'),
    });
  }


  getCategory() {
    return this.httpClient.get(this.url + '/category/get/');
  }
}
