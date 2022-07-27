/// <reference types="cypress" />

describe('', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('should create a recommendation successfully', () => {
    const recommendationData = { name: '', youtubeLink: '' };

    cy.get('').type(recommendationData.name);
    cy.get('').type(recommendationData.youtubeLink);

    // cy.intercept('POST', '/recommendations').as('createRecommendation');
    // cy.get('.submit').click();
    // cy.wait('@createRecommendation');
    // cy.contains('texto da musica recomendada aqui').should('be.visible');
  });
});
