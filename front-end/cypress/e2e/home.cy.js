/// <reference types="cypress" />

describe('Home', () => {
  const recommendation = {
    name: 'Twenty One Pilots - Chlorine',
    youtubeLink: 'https://www.youtube.com/watch?v=UOQlKBlobRY&feature=emb_title',
  };

  it('should create a recommendation successfully', () => {
    cy.createRecommendation(recommendation);

    cy.reload();

    cy.contains(recommendation.name).should('be.visible');

    cy.end();
  });

  it('should return an alert when creating a recommendation that already exists', () => {
    cy.createRecommendation(recommendation);

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Error creating recommendation!');
    });

    cy.end();
  });

  it('should increment score when upvote button is clicked', () => {
    cy.visit('http://localhost:3000/');

    cy.get('#GoArrowUpBtn').click({ multiple: true });

    cy.end();
  });

  it('should decrement score when downvote button is clicked', () => {
    cy.visit('http://localhost:3000/');

    cy.get('#GoArrowDownBtn').click({ multiple: true });

    cy.end();
  });

  it('should remove a recommendation when score is less than -5', () => {
    cy.visit('http://localhost:3000/');

    for (let i = 0; i <= 5; i++) {
      cy.get('#GoArrowDownBtn').click({ multiple: true });
    }

    cy.end();
  });

  after(() => {
    cy.resetDatabase();
  });
});
