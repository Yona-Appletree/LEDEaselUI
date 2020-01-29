import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LdAnimationPreviewComponent } from './ld-animation-preview.component';

describe('LdAnimationPreviewComponent', () => {
  let component: LdAnimationPreviewComponent;
  let fixture: ComponentFixture<LdAnimationPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LdAnimationPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LdAnimationPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
