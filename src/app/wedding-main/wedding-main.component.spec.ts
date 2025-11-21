import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeddingMainComponent } from './wedding-main.component';

describe('WeddingMainComponent', () => {
  let component: WeddingMainComponent;
  let fixture: ComponentFixture<WeddingMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeddingMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeddingMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
