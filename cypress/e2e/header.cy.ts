describe('Header', () => {
	it('should go to Favorites view', () => {
		cy.clock();
		cy.intercept('GET', 'https://picsum.photos/*', {
			statusCode: 200,
			body: [],
		});

		cy.visit('http://localhost:4200');

		cy.tick(1000);

		let btn = cy.get('app-header button').contains('Favorites').parent('button');
		btn.click();

		btn.should('have.class', 'mat-primary');
		cy.url().should('eq', Cypress.config().baseUrl + '/favorites');
	});

	it('should go to Photos view', () => {
		cy.clock();
		cy.intercept('GET', 'https://picsum.photos/*', {
			statusCode: 200,
			body: [],
		});

		cy.visit('http://localhost:4200/favorites');

		cy.tick(1000);

		let btn = cy.get('app-header button').contains('Photos').parent('button');
		btn.click();

		btn.should('have.class', 'mat-primary');
		cy.url().should('eq', Cypress.config().baseUrl + '/');
	});
});
