const uuidv4 = require('uuid/v4');

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

describe('Input form', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Tabs change pages', () => {
    cy.get('[data-cy=template]').click();
    cy.get('[data-cy=list]').click();
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
      .should('have.value', 'false');
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

    cy.server();
    cy.route('POST', `${API_URL}/templates`).as('postTemplate');
    cy.route('DELETE', `${API_URL}/templates`).as('deleteTemplate');

    cy.get('[data-cy=prompt-ok]').click();

    cy.wait('@postTemplate');

    cy.get('[data-cy=select-template-with-controls]').click();
    cy.get(`[data-cy=${uuid}]`).should('exist');
    cy.get(`[data-cy=${uuid}]`).click();

    cy.get('[data-cy=remove-template]').click();
    cy.get('[data-cy=confirm-ok]').click();

    // Doesn't work since data-cy is set to template.label and not .id
    // Using wait(1000) as workaround.
    // cy.wait('@deleteTemplate');
    cy.wait(1000);

    cy.get('[data-cy=select-template-with-controls]').click();
    cy.get(`[data-cy=${uuid}]`).should('not.exist');
  });

  it('Test name validation for list', () => {
    cy.get('[data-cy=create-build]').click();
    cy.get('[data-cy=prompt-textfield]').type('/');
    cy.get('[data-cy=prompt-ok]').should('have.disabled');
  });

  it('Create and delete build', () => {
    const uuid = uuidv4();

    cy.server();
    cy.route('POST', `${API_URL}/builds`).as('postBuild');

    cy.get('[data-cy=create-build]').click();
    cy.get('[data-cy=prompt-textfield]').type(uuid);
    cy.get('[data-cy=prompt-textfield]').should('have.value', uuid);
    cy.get('[data-cy=prompt-ok]').should('have.enabled');
    cy.get('[data-cy=prompt-ok]').click();

    cy.wait('@postBuild');

    cy.get('[data-cy=list]').click();
    cy.get(`[data-cy=${uuid}]`).should('exist');

    cy.request('GET', `${API_URL}/builds`)
      .its('body')
      .then(buildArr => {
        const build = buildArr.find(build => build.title === uuid);
        cy.route('DELETE', `${API_URL}/builds/${build.id}`).as('deleteBuild');

        cy.get(`[data-cy=${uuid}-remove]`).click();
        cy.get('[data-cy=confirm-ok]').click();

        cy.wait('@deleteBuild');
        cy.get(`[data-cy=${uuid}]`).should('not.exist');
      });
  });

  it('Create build and start generating poster', () => {
    const buildTitle = uuidv4();
    const templateId = uuidv4();

    cy.server();
    cy.route('POST', `${API_URL}/builds`).as('postBuild');
    cy.route('POST', `${API_URL}/templates`).as('postTemplate');
    cy.route('POST', `${API_URL}/builds/posters`).as('postPoster');
    console.log(`${API_URL}/builds`);
    // Create build
    cy.get('[data-cy=create-build]').click();
    cy.get('[data-cy=prompt-textfield]').type(buildTitle);
    cy.get('[data-cy=prompt-ok]').click();

    cy.wait('@postBuild');

    // Create template
    cy.get('[data-cy=template]').click();
    cy.get('[data-cy=new-template]').click();
    cy.get('[data-cy=prompt-textfield]')
      .click()
      .type(templateId);
    cy.get('[data-cy=prompt-ok]').click();
    cy.wait('@postTemplate');
    cy.get('[data-cy=generate]').click();

    cy.get('[data-cy=filterInput]').type('1010128');
    cy.get('[data-cy=1010128]').click();
    cy.get('[data-cy=select-template]').click();
    cy.get(`[data-cy=${templateId}]`).click();
    cy.get('[data-cy=build-select]').click();
    cy.get(`[data-cy=${buildTitle}-select]`).click();
    cy.get('[data-cy=generate-button]').click();

    cy.get('[data-cy=list]').click();
    for (let i = 0; i < 10; i++) {
      const renderDone = cy
        .request('GET', `${API_URL}/builds`)
        .its('body')
        .then(buildArr => {
          const build = buildArr.find(build => build.title === buildTitle);
          console.log(build.failed);
          if (build.ready) {
            cy.get(`[data-cy=${buildTitle}-show]`).click();
            cy.get(`[data-cy=5a65a4c2-a7cf-4eef-a3e5-ba7d4fd734f4-buildDetails]`).contains(
              'Rendered successfully',
            );
            return true;
          } else if (build.failed) {
            cy.contains('Build returned failed status.').should('not.exist');
            return true;
          }
          return false;
        });
      cy.wait(30000);
      if (renderDone) break;
    }

    cy.get(`[data-cy=${buildTitle}-remove]`).click();
    cy.get('[data-cy=confirm-ok]').click();
  });
});
