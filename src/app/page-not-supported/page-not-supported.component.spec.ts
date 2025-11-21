import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotSupportedComponent } from './page-not-supported.component';

describe('PageNotSupportedComponent', () => {
  let component: PageNotSupportedComponent;
  let fixture: ComponentFixture<PageNotSupportedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotSupportedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageNotSupportedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
