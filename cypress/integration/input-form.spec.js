const uuidv4 = require('uuid/v4');

describe('Input form', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Tabs change pages', () => {
    cy.get('[data-cy=template]').click();
    cy.get('[data-cy=lists]').click();
    cy.get('[data-cy=generate]').click();
  });

  it('Radio buttons change values', () => {
    cy.get('[data-cy=Aikataulu]')
      .click()
      .should('have.value', 'Timetable');

    cy.get('[data-cy=Pysäkkijuliste]')
      .click()
      .should('have.value', 'StopPoster');

    cy.get('[data-cy=Ajolistat]')
      .click()
      .should('have.value', 'group');

    cy.get('[data-cy=Pysäkit]')
      .click()
      .should('have.value', 'stop');

    cy.get('[data-cy=Kesä]')
      .click()
      .should('have.value', 'true');

    cy.get('[data-cy=Talvi]')
      .click()
      .should('have.value', 'true');
  });

  it('Filter filters list and selecting values works', () => {
    cy.get('[data-cy=filterInput]')
      .type('1010109,1010128,1020100')
      .should('have.value', '1010109,1010128,1020100');

    cy.get('[data-cy=1010109]').click();
    cy.get('[data-cy=1020100]').click();
  });

  it('Create template and remove it', () => {
    cy.get('[data-cy=template]').click();
    cy.get('[data-cy=new-template]').click();
    cy.get('[data-cy=prompt-ok]').should('have.disabled');

    const uuid = uuidv4();

    cy.get('[data-cy=prompt-textfield]')
      .click()
      .type(uuid);

    cy.get('[data-cy=prompt-textfield]').should('have.value', uuid);
    cy.get('[data-cy=prompt-ok]').should('have.enabled');
    cy.get('[data-cy=prompt-ok]').click();
    cy.wait(3000);

    cy.get('[data-cy=select-template-with-controls]').click();
    cy.get([`data-cy=${uuid}`]).click();

    cy.get('[data-cy=remove-template]').click();
    cy.wait(2000);
    cy.get('[data-cy=confirm-ok]').click();
    cy.wait(2000);
  });
});
