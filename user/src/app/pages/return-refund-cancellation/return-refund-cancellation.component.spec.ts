import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRefundCancellationComponent } from './return-refund-cancellation.component';

describe('ReturnRefundCancellationComponent', () => {
  let component: ReturnRefundCancellationComponent;
  let fixture: ComponentFixture<ReturnRefundCancellationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnRefundCancellationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnRefundCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
