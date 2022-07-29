Cypress.Commands.add('createRecommendation', (recommendation) => {
  cy.visit('http://localhost:3000/');

  cy.get('input[placeholder="Name"]').type(recommendation.name);
  cy.get('input[placeholder="https://youtu.be/..."]').type(recommendation.youtubeLink);

  cy.intercept('POST', 'http://localhost:5000/recommendations').as('createRecommendation');
  cy.get('button').click();
  cy.wait('@createRecommendation');
});

Cypress.Commands.add('resetDatabase', () => {
  cy.request('POST', 'http://localhost:5000/tests/reset', {});
});

Cypress.Commands.add('seedDatabase', () => {
  cy.request('POST', 'http://localhost:5000/tests/seed', {});
});
