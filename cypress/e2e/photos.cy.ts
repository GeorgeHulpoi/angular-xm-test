describe('Photos View', () => {
	it('should load', () => {
		cy.intercept('GET', 'https://picsum.photos/v2/list?*page=1*', {
			fixture: 'photos/page1.json',
		});

		cy.visit(Cypress.config().baseUrl + '/');
		cy.get('app-card').should('have.length', 6);
	});

	it('should load more on scrolling down', () => {
		cy.intercept('GET', 'https://picsum.photos/v2/list?*page=1*', {
			headers: {
				link: '<https://picsum.photos/v2/list?page=2&limit=12>; rel="next"',
			},
			fixture: 'photos/page1.json',
		});

		cy.intercept('GET', 'https://picsum.photos/v2/list?*page=2*', {
			headers: {
				link: '<https://picsum.photos/v2/list?page=1&limit=12>; rel="prev"',
			},
			fixture: 'photos/page2.json',
		});

		cy.visit(Cypress.config().baseUrl + '/');
		cy.scrollTo('bottom');
		cy.get('app-card').should('have.length', 12);
		cy.get('app-loader').should('not.exist');
	});

	it('should add to favorites', () => {
		cy.intercept('GET', 'https://picsum.photos/v2/list?*page=1*', {
			fixture: 'photos/page1.json',
		});

		cy.visit(Cypress.config().baseUrl + '/');

		const card = cy.get('app-card').first();
		card.click();
		card.children('img')
			.first()
			.invoke('attr', 'src')
			.then((src) => {
				cy.visit(Cypress.config().baseUrl + '/favorites');

				cy.get('app-card').first().children('img').first().invoke('attr', 'src').should('eq', src);
			});
	});
});
