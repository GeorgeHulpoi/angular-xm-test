import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {CardComponent} from './card.component';

describe('Card Component', () => {
	let component: CardComponent;
	let fixture: ComponentFixture<CardComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({imports: [CardComponent]}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CardComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		fixture.componentRef.setInput('id', 1);
		fixture.detectChanges();
		expect(component).toBeDefined();
	});

	it('should render the image', () => {
		fixture.componentRef.setInput('id', 1);
		fixture.detectChanges();
		const element: HTMLElement = fixture.nativeElement;
		const img = element.querySelector('img');

		expect(img).toBeDefined();
		const src = img!.getAttribute('src');
		expect(src).toBeDefined();
		expect(src).toEqual('https://picsum.photos/id/1/600/600');
	});
});
