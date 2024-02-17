import {Component, ElementRef, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {LoaderComponent} from './loader.component';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'app',
	template: '<app-loader (reached)="onReached()"></app-loader>',
	styles: `
		:host {
			padding-top: 2000px;
		}
	`,
	standalone: true,
	imports: [LoaderComponent],
})
class AppComponent {
	@ViewChild(LoaderComponent, {static: true, read: ElementRef}) loader!: ElementRef;
	onReached(): void {}
}

describe('Loader Component', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({imports: [AppComponent]}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeDefined();
	});

	it("by default onReached shouldn't be called", () => {
		const onReachedSpy = spyOn(component, 'onReached').and.callThrough();
		expect(onReachedSpy).toHaveBeenCalledTimes(0);
	});

	/**
	 * IntersectionObserver API nor Scroll is not available in this
	 * testing environment. I will install Cypress later for it.
	 */
});
