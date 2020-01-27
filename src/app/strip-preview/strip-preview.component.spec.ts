import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripPreviewComponent } from './strip-preview.component';

describe('StripPreviewComponent', () => {
  let component: StripPreviewComponent;
  let fixture: ComponentFixture<StripPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
