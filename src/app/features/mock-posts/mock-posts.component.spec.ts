import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockPostsComponent } from './mock-posts.component';

describe('MockPostsComponent', () => {
  let component: MockPostsComponent;
  let fixture: ComponentFixture<MockPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockPostsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MockPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
