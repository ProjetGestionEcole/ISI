import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtudiantDashboard } from './etudiant';

describe('Etudiant', () => {
  let component: EtudiantDashboard;
  let fixture: ComponentFixture<EtudiantDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtudiantDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtudiantDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
