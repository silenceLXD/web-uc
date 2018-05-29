import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionDetailComponent } from './consumption-detail.component';

describe('ConsumptionDetailComponent', () => {
  let component: ConsumptionDetailComponent;
  let fixture: ComponentFixture<ConsumptionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumptionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumptionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
