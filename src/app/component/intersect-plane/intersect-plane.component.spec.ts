import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntersectPlaneComponent } from './intersect-plane.component';

describe('IntersectPlaneComponent', () => {
  let component: IntersectPlaneComponent;
  let fixture: ComponentFixture<IntersectPlaneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntersectPlaneComponent]
    });
    fixture = TestBed.createComponent(IntersectPlaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
