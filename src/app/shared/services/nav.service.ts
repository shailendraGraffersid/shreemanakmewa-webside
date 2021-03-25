import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Menu
export interface Menu {
	path?: string;
	title?: string;
	type?: string;
	megaMenu?: boolean;
	image?: string;
	active?: boolean;
	badge?: boolean;
	badgeText?: string;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	constructor() { }

	public screenWidth: any;
	public leftMenuToggle: boolean = false;
	public mainMenuToggle: boolean = false;

	// Windows width
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{
			path: '/', title: 'home', type: 'link'
		},
		// {
		// 	path: '/', title: 'shop', type: 'link'
		// },
		{
			path: '/', title: 'diwali 2021', type: 'link'
		},
		{
			path: '/details/about-us', title: 'about us', type: 'link'
		},
		{
			path: '/details/stores', title: 'store locator', type: 'link'
		},
		// {
		// 	path: '/', title: 'bulk purchase', type: 'link'
		// },
		// {
		// 	title: 'Features', type: 'sub', megaMenu: true, badge: true, badgeText: 'new', active: false, children: [
			
		// 	]
		// }
	];

	LEFTMENUITEMS: Menu[] = [
				{ path: '/home/dry-fruits', title: 'dry fruits', type: 'link' },
				{ path: '/home/spices-and-herbs', title: 'spices and herbs', type: 'link' },
				{ path: '/home/manak-special', title: 'manak special', type: 'link' },
				{ path: '/home/seeds-berries-and-nuts', title: 'seeds, berries and nuts', type: 'link' },
				{ path: '/home/traditional-indian-products', title: 'traditional indian products', type: 'link' },
				{ path: '/home/for-moms-to-be', title: 'for moms to be', type: 'link' },
				{ path: '/home/flavoured-nuts', title: 'flavoured nuts', type: 'link' },
				{ path: '/home/dried-fruits', title: 'dried fruits', type: 'link' },
				{ path: '/home/syrups-and-oils', title: 'syrups and oils', type: 'link' },
				{ path: '/home/mouth-freshners', title: 'mouth freshners', type: 'link' },
				{ path: '/home/snacks', title: 'snacks', type: 'link' },
	];

	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
	leftMenuItems = new BehaviorSubject<Menu[]>(this.LEFTMENUITEMS);

}
