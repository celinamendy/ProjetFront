import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriqueTrajetComponent } from './historique.component';

// import hist
describe('HistoriqueTrajetComponent', () => {
  let component: HistoriqueTrajetComponent;
  let fixture: ComponentFixture<HistoriqueTrajetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueTrajetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueTrajetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
