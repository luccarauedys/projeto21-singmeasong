/// <reference types="cypress" />

describe('Random', () => {
  before(() => {
    cy.seedDatabase();
  });

  it('should return a single recommendation', () => {
    cy.visit('http://localhost:3000/');

    cy.contains('Random').click();

    cy.url().should('equal', 'http://localhost:3000/random');

    cy.get('iframe').should('have.length', 1);

    cy.end();
  });

  after(() => {
    cy.resetDatabase();
  });
});
