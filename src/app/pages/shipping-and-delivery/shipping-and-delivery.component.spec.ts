import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAndDeliveryComponent } from './shipping-and-delivery.component';

describe('ShippingAndDeliveryComponent', () => {
  let component: ShippingAndDeliveryComponent;
  let fixture: ComponentFixture<ShippingAndDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingAndDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingAndDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
