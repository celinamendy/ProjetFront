import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriqueReservationComponent } from './historique.component';


describe(' HistoriqueReservationComponent', () => {
  let component:  HistoriqueReservationComponent;
  let fixture: ComponentFixture< HistoriqueReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HistoriqueReservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent( HistoriqueReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
