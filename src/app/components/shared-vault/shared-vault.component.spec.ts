import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedVaultComponent } from './shared-vault.component';

describe('SharedVaultComponent', () => {
  let component: SharedVaultComponent;
  let fixture: ComponentFixture<SharedVaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedVaultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
