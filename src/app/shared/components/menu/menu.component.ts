import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public menuItems: Menu[];
  category: any;
  pdfUrl = environment.pdfUrl;
  constructor(private router: Router, public navServices: NavService, public catService: CategoryService) {
    
		
    this.navServices.items.subscribe(async menuItems =>{
      // console.log(';menuItems::', menuItems[1].children);
      // // menuItems[1].children = await this.category;
      // this.catService.getCategoryData.subscribe(async response => {
      //   this.category = await response['data'].rows;
      //   console.log('category==', response['data'].rows);
      //   for(let i = 0; i<menuItems[1].children.length; i++){
      //     menuItems[1].children[i]['path'] =  response['data'].rows[i].id,
      //     menuItems[1].children[i]['title'] = response['data'].rows[i].name,
      //     menuItems[1].children[i]['type'] = 'link'
      //   }
        
      // });
      
       this.menuItems = await menuItems;
       });
    this.router.events.subscribe((event) => {
      this.navServices.mainMenuToggle = false;
    });
  }

  ngOnInit(): void {
  }

  mainMenuToggle(): void {
    this.navServices.mainMenuToggle = !this.navServices.mainMenuToggle;
  }

  // Click Toggle menu (Mobile)
  toggletNavActive(item) {
    item.active = !item.active;
  }

  // Open PDF
  openPdf(){
    let fileURL = 'assets/Manak-Mewa_Diwali_Gift_Catalogue_2020.pdf';
    window.open(fileURL, '_blank');
  }

}
