import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockheadViewComponent } from './blockhead-view.component';

describe('BlockheadViewComponent', () => {
  let component: BlockheadViewComponent;
  let fixture: ComponentFixture<BlockheadViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockheadViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockheadViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
