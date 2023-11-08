import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolicyLoginPage } from './policy-login.page';

describe('PolicyLoginPage', () => {
  let component: PolicyLoginPage;
  let fixture: ComponentFixture<PolicyLoginPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PolicyLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
