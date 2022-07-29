/// <reference types="cypress" />

describe('Top', () => {
  before(() => {
    cy.seedDatabase();
  });

  it('should show a list of recommendations order by score desc with a maximum of 10 recommendations', () => {
    cy.visit('http://localhost:3000/');

    cy.contains('Top').click();

    cy.url().should('equal', 'http://localhost:3000/top');

    cy.get('article:first-of-type').within(() => {
      cy.get('div:last-of-type').should('have.text', '150');
    });

    cy.get('article:last-of-type').within(() => {
      cy.get('div:last-of-type').should('have.text', '80');
    });

    cy.get('iframe').should('be.length.lte', 10);

    cy.end();
  });

  after(() => {
    cy.resetDatabase();
  });
});
