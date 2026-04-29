import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { flyInOut, expand, fadeInUp, fadeInScale } from '../animations/app.animation';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  host: {
	  '[@flyInOut]': 'true',
	  'style': 'display: block;'
  },
  animations: [
	  flyInOut(),
	  expand(),
	  fadeInUp(),
	  fadeInScale()
  ]
})
export class MenuComponent implements OnInit {

  dishes: Dish[];
  filteredDishes: Dish[];
  categories: string[] = [];
  selectedCategory: string = '';
  errMess: string;
  gridCols: number = 2;
  gridRowHeight: string = '200px';

  constructor(private dishService: DishService,
			  @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
	  this.dishService.getDishes()
	  	.subscribe(dishes => {
		  this.dishes = dishes;
		  this.filteredDishes = dishes;
		  this.categories = [...new Set(dishes.map(d => d.category).filter(c => !!c))];
		},
		errmess => this.errMess = <any>errmess);
    this.onResize();
  }

  filterByCategory(category: string) {
    if (this.selectedCategory === category) {
      this.clearFilters();
    } else {
      this.selectedCategory = category;
      this.filteredDishes = this.dishes.filter(d => d.category === category);
    }
  }

  clearFilters() {
    this.selectedCategory = '';
    this.filteredDishes = this.dishes;
  }

  getFeaturedDishesCount(): number {
    return this.dishes ? this.dishes.filter(d => d.featured).length : 0;
  }

  getFavoriteDishesCount(): number {
    return this.dishes ? this.dishes.filter((d: any) => d.favorite).length : 0;
  }

  toggleFavorite(dish: any, event: Event) {
    event.stopPropagation();
    dish.favorite = !dish.favorite;
  }

  retryLoad() {
    this.errMess = null;
    this.dishes = null;
    this.filteredDishes = null;
    this.categories = [];
    this.selectedCategory = '';
    this.ngOnInit();
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth < 768) {
      this.gridCols = 1;
      this.gridRowHeight = '180px';
    } else {
      this.gridCols = 2;
      this.gridRowHeight = '200px';
    }
  }

}
