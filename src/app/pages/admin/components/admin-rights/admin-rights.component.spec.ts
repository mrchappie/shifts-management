import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRightsComponent } from './admin-rights.component';

describe('AdminRightsComponent', () => {
  let component: AdminRightsComponent;
  let fixture: ComponentFixture<AdminRightsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRightsComponent]
    });
    fixture = TestBed.createComponent(AdminRightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
