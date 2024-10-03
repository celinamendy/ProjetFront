import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjouterTrajetComponent } from './ajouter.component';

// import { AjouterComponent } from './ajouter.component';

describe('AjouterComponent', () => {
  let component: AjouterTrajetComponent;
  let fixture: ComponentFixture<AjouterTrajetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterTrajetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterTrajetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
