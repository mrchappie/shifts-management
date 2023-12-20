import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkplaceComponent } from './add-workplace.component';

describe('AddWorkplaceComponent', () => {
  let component: AddWorkplaceComponent;
  let fixture: ComponentFixture<AddWorkplaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddWorkplaceComponent]
    });
    fixture = TestBed.createComponent(AddWorkplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
