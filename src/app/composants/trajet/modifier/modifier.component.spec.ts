import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { ModifierComponent } from '../../profile/conducteur/modifier/modifier.component';
import { ModificationTrajetComponent } from './modifier.component';

describe(' ModificationTrajetComponent', () => {
  let component:  ModificationTrajetComponent;
  let fixture: ComponentFixture< ModificationTrajetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ModificationTrajetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent( ModificationTrajetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
