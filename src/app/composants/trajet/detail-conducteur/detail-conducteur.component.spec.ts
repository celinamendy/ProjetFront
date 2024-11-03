import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailTrajetConducteurComponent } from './detail-conducteur.component';



describe('DetailTrajetConducteurComponent', () => {
  let component: DetailTrajetConducteurComponent;
  let fixture: ComponentFixture<DetailTrajetConducteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTrajetConducteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailTrajetConducteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
