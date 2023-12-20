import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftCardComponent } from './shift-card.component';

describe('ShiftCardComponent', () => {
  let component: ShiftCardComponent;
  let fixture: ComponentFixture<ShiftCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShiftCardComponent],
    });
    fixture = TestBed.createComponent(ShiftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
