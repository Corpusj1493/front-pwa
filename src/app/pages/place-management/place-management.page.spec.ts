import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaceManagementPage } from './place-management.page';

describe('PlaceManagementPage', () => {
  let component: PlaceManagementPage;
  let fixture: ComponentFixture<PlaceManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
