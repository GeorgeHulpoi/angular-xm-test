describe('Favorites View', () => {
	it('click should redirect to /photos/:id', () => {
		cy.intercept('GET', 'https://picsum.photos/v2/list?*page=1*', {
			fixture: 'photos/page1.json',
		});

		cy.visit(Cypress.config().baseUrl + '/');
		cy.get('app-card').first().click();

        cy.visit(Cypress.config().baseUrl + '/favorites');
        cy.get('app-card').first().click();
        cy.url().should('eq', Cypress.config().baseUrl + '/photos/0');
	});

    it('favorites should persist', () => {
		cy.intercept('GET', 'https://picsum.photos/v2/list?*page=1*', {
			fixture: 'photos/page1.json',
		});

		cy.visit(Cypress.config().baseUrl + '/');
		cy.get('app-card').first().click();

        cy.visit(Cypress.config().baseUrl + '/favorites');
        cy.get('app-card').first().should('exist');

        cy.reload();
        cy.get('app-card').first().should('exist');
	});
});
