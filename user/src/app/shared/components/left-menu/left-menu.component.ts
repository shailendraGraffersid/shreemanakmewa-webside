import { Component, OnInit } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit {

  public menuItems: Menu[];
  category: any;

  constructor(private router: Router, public navServices: NavService,  public catService: CategoryService) {
    this.navServices.leftMenuItems.subscribe(menuItems => 
      {
        this.catService.getCategoryData.subscribe(async response => {
          if(response['data']){
            this.category = response['data'].rows;
            for(let i = 0; i<menuItems.length; i++){
              if(response['data'].rows[i]){
                menuItems[i]['path'] =  response['data'].rows[i].id,
                menuItems[i]['title'] = response['data'].rows[i].name,
                menuItems[i]['type'] = 'link'
              }
            }
          }
        });
        this.menuItems = menuItems });
    this.router.events.subscribe((event) => {
      this.navServices.mainMenuToggle = false;
    });
  }

  ngOnInit(): void {
  }

  leftMenuToggle(): void {
    this.navServices.leftMenuToggle = !this.navServices.leftMenuToggle;
  }

  // Click Toggle menu (Mobile)
  toggletNavActive(item) {
    item.active = !item.active;
  }

  onHover(menuItem) {
    if(window.innerWidth > 1200 && menuItem){
       document.getElementById('unset').classList.add('sidebar-unset')
    } else {
      document.getElementById('unset').classList.remove('sidebar-unset')
    }
  }

}
