import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticlePointComponent } from './particle-point.component';

describe('ParticlePointComponent', () => {
  let component: ParticlePointComponent;
  let fixture: ComponentFixture<ParticlePointComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParticlePointComponent]
    });
    fixture = TestBed.createComponent(ParticlePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
