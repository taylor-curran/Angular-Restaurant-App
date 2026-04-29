import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MenuComponent } from './menu.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { DISHES } from '../shared/dishes';
import { baseURL } from '../shared/baseurl';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
	
	const dishServiceStub = {
		getDishes: function():	Observable<Dish[]> {
			return of(DISHES);
		}
	};
    TestBed.configureTestingModule({
	  imports: [
		  BrowserAnimationsModule,	
		  FlexLayoutModule,
		  RouterTestingModule.withRoutes([{ path: 'menu', component: MenuComponent }]),
		  MatGridListModule,
		  MatProgressSpinnerModule,
		  MatCardModule,
		  MatButtonModule,
	  ],
      declarations: [ MenuComponent ],
	  schemas: [ NO_ERRORS_SCHEMA ],
	  providers: [
		  { provide: DishService, useValue: dishServiceStub },
		  { provide: 'BaseURL', useValue: baseURL }
	  ]
    })
    .compileComponents();
	  
	const dishService = TestBed.get(DishService);  
	
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
	
  it('dishes items should be 4', () => {
	expect(component.dishes.length).toBe(4);
	expect(component.dishes[1].name).toBe("Zucchipakoda");
	expect(component.dishes[3].featured).toBeFalsy();
  });
  
  it('should use dishes in the template', () => {
	fixture.detectChanges();
	  
	let de: DebugElement;
	let el: HTMLElement;
	  
	de = fixture.debugElement.query(By.css('h3.dish-name'));
	el = de.nativeElement;
	  
	expect(el.textContent).toContain(DISHES[0].name.toUpperCase());
  });
	
});
