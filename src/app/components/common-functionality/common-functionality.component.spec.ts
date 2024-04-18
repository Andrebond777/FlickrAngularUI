import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonFunctionalityComponent } from './common-functionality.component';

import { AppComponent } from '../../app.component';

describe('CommonFunctionalityComponent', () => {
  let component: CommonFunctionalityComponent;
  let fixture: ComponentFixture<CommonFunctionalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonFunctionalityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommonFunctionalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
