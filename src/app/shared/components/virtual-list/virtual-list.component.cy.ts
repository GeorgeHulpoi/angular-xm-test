import {Component} from '@angular/core';

import {VirtualListComponent} from './virtual-list.component';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'app',
	template: `
		<app-virtual-list [items]="items">
			<ng-template let-item>
				<div class="cy-item">{{ item.id }}</div>
			</ng-template>
		</app-virtual-list>
	`,
	styles: ``,
	standalone: true,
	imports: [VirtualListComponent],
})
class AppComponent {
	items = [
		{
			id: 0,
			author: 'Alejandro Escamilla',
			width: 5000,
			height: 3333,
			url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
			download_url: 'https://picsum.photos/id/0/5000/3333',
		},
		{
			id: 1,
			author: 'Alejandro Escamilla',
			width: 5000,
			height: 3333,
			url: 'https://unsplash.com/photos/LNRyGwIJr5c',
			download_url: 'https://picsum.photos/id/1/5000/3333',
		},
		{
			id: 2,
			author: 'Alejandro Escamilla',
			width: 5000,
			height: 3333,
			url: 'https://unsplash.com/photos/N7XodRrbzS0',
			download_url: 'https://picsum.photos/id/2/5000/3333',
		},
		{
			id: 3,
			author: 'Alejandro Escamilla',
			width: 5000,
			height: 3333,
			url: 'https://unsplash.com/photos/Dl6jeyfihLk',
			download_url: 'https://picsum.photos/id/3/5000/3333',
		},
		{
			id: 4,
			author: 'Alejandro Escamilla',
			width: 5000,
			height: 3333,
			url: 'https://unsplash.com/photos/y83Je1OC6Wc',
			download_url: 'https://picsum.photos/id/4/5000/3333',
		},
	];
}

describe('Loader Component', () => {
	beforeEach(() => {
		cy.viewport(1024, 1024);

		cy.mount(AppComponent).then((wrapper) => {
			return cy.wrap(wrapper).as('angular');
		});
	});

	it('should render in correct structure', () => {
		cy.get('app-virtual-list .cy-item').should('have.length', 5);
		cy.get('app-virtual-list .row').should('have.length', 3);

		cy.get('app-virtual-list .cy-item').contains('0').should('exist');
		cy.get('app-virtual-list .cy-item').contains('1').should('exist');
		cy.get('app-virtual-list .cy-item').contains('2').should('exist');
		cy.get('app-virtual-list .cy-item').contains('3').should('exist');
		cy.get('app-virtual-list .cy-item').contains('4').should('exist');
	});
});
