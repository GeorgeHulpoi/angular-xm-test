import {Component, ElementRef, ViewChild} from '@angular/core';

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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let spy: any;

	beforeEach(() => {
		cy.mount(AppComponent).then((wrapper) => {
			spy = cy.spy(wrapper.component, 'onReached').as('onReached');
			return cy.wrap(wrapper).as('angular');
		});
	});

	it('should not call onReached', () => {
		spy.resetHistory();
		cy.scrollTo(0, 100);
		cy.get('@onReached').should('have.not.been.called');
	});

	it('should call onReached when is intersecting', () => {
		spy.resetHistory();

		cy.scrollTo(0, 2050);

		cy.get('@onReached').should('have.been.calledOnce');
	});
});
