import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginIndicatorComponent } from './login-indicator.component';

describe('LoginIndicatorComponent', () => {
  let component: LoginIndicatorComponent;
  let fixture: ComponentFixture<LoginIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginIndicatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
