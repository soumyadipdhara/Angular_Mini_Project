import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecipeComponentComponent } from './add-recipe-component.component';

describe('AddRecipeComponentComponent', () => {
  let component: AddRecipeComponentComponent;
  let fixture: ComponentFixture<AddRecipeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRecipeComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddRecipeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
