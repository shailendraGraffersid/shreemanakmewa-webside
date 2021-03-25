import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // Initialize
  constructor(private http: HttpClient) { }

  // Category Array
  public get getCategoryData() {
    return this.http.get(environment.baseURL + '/category');
  }

  // Get Category By Id
  public getCategoryById(id) {
    return this.http.get(environment.baseURL + '/category/'+id);
  }

}
