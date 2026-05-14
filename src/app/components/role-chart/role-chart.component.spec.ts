import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleChartComponent } from './role-chart.component';

describe('RoleChartComponent', () => {
  let component: RoleChartComponent;
  let fixture: ComponentFixture<RoleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
