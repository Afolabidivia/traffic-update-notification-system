import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostItemPage } from './post-item.page';

describe('PostItemPage', () => {
  let component: PostItemPage;
  let fixture: ComponentFixture<PostItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostItemPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
