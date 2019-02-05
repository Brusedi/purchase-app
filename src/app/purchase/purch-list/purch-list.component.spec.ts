import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchListComponent } from './purch-list.component';

describe('PurchListComponent', () => {
  let component: PurchListComponent;
  let fixture: ComponentFixture<PurchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
