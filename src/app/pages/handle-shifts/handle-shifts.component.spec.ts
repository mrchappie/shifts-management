import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleShiftsComponent } from './handle-shifts.component';

describe('HandleShiftsComponent', () => {
  let component: HandleShiftsComponent;
  let fixture: ComponentFixture<HandleShiftsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HandleShiftsComponent]
    });
    fixture = TestBed.createComponent(HandleShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
