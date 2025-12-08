import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFormModalPage } from './user-form-modal.page';

describe('UserFormModalPage', () => {
  let component: UserFormModalPage;
  let fixture: ComponentFixture<UserFormModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
