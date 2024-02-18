describe('Single Photo View', () => {
	beforeEach(() => {
		cy.intercept('GET', 'https://picsum.photos/id/*/info', {
			fixture: 'photos/photo.json',
		});

		cy.intercept('GET', 'https://picsum.photos/v2/list?*page=1*', {
			fixture: 'photos/page1.json',
		});
	});

	it('should contain image', () => {
		cy.visit(Cypress.config().baseUrl + '/photos/0');
		cy.get('app-single-photo img').should('exist');
	});

	it('should not contain remove button', () => {
		cy.visit(Cypress.config().baseUrl + '/photos/0');
		cy.get('app-single-photo .remove').should('not.exist');
	});

	it('should contain remove button', () => {
		cy.visit(Cypress.config().baseUrl + '/');
		cy.get('app-card').first().click();

		cy.visit(Cypress.config().baseUrl + '/photos/0');
		cy.get('app-single-photo .remove').should('exist');
	});

	it('should remove from favorites', () => {
		cy.visit(Cypress.config().baseUrl + '/');
		cy.get('app-card').first().click();

		cy.visit(Cypress.config().baseUrl + '/photos/0');
		cy.get('app-single-photo .remove').children('button').first().click();

		cy.get('app-single-photo .remove').should('not.exist');

		cy.visit(Cypress.config().baseUrl + '/favorites');
		cy.get('app-card').should('have.length', 0);
	});
});
