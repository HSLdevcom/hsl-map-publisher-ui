describe('Input form', () => {
  it('focuses input on load', () => {
    cy.visit('http://localhost:3000');

    cy.get('[data-cy=Sommittelu]').click();
    cy.get('[data-cy=Tulosteet]').click();
    cy.get('[data-cy=Generointi]').click();

    cy.get('[data-cy=Aikataulu]').click();
    cy.get('[data-cy=Pysäkkijuliste]').click();
    cy.get('[data-cy=Ajolistat]').click();
    cy.get('[data-cy=Pysäkit]').click();
    cy.get('[data-cy=Kesä]').click();
    cy.get('[data-cy=Talvi]').click();

    cy.get('[data-cy=filterInput]').type('1010109,1010128,1020100');
    cy.get('[data-cy=1010109]').click();
    cy.get('[data-cy=1020100]').click();
  });
});
