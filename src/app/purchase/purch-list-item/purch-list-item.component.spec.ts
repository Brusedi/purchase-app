import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchListItemComponent } from './purch-list-item.component';

describe('PurchListItemComponent', () => {
  let component: PurchListItemComponent;
  let fixture: ComponentFixture<PurchListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
