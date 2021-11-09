const uuidv4 = require('uuid/v4');

const API_URL = Cypress.config().apiUrl;
const TEST_PREFIX = 'CY-TEST';

describe('General tests', () => {
  before(() => {
    cy.hslLogin();
    cy.wait(3000);
    cy.request('GET', `${API_URL}/builds`)
      .its('body')
      .then(buildArr => {
        const testBuilds = buildArr.filter(build => build.title.includes('CY-TEST'));
        if (testBuilds.length > 0) {
          console.log('Removing test builds. This indicates that some tests are probably failing.');
        }
        testBuilds.forEach(testBuild => {
          cy.request('DELETE', `${API_URL}/builds/${testBuild.id}`);
          console.log(`Deleting ${testBuild.id}.`);
        });
      });
  });

  beforeEach(() => {
    cy.visit('/');
    cy.hslLogin();
    cy.wait(3000);
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
      .type('1010107,1010108,1010109')
      .should('have.value', '1010107,1010108,1010109');

    cy.get('[data-cy=1010107]').click();
    cy.get('[data-cy=1010108]').click();
    cy.get('[data-cy=1010109]').click();
  });

  it('Create template and remove it', () => {
    cy.get('[data-cy=template]').click();
    cy.get('[data-cy=new-template]').click();
    cy.get('[data-cy=prompt-ok]').should('have.disabled');

    const uuid = `${TEST_PREFIX}-${uuidv4()}`;

    cy.get('[data-cy=prompt-textfield]')
      .click()
      .type(uuid);

    cy.get('[data-cy=prompt-textfield]').should('have.value', uuid);
    cy.get('[data-cy=prompt-ok]').should('have.enabled');

    cy.server();
    cy.route('POST', `${API_URL}/templates`).as('postTemplate');
    cy.route('DELETE', `${API_URL}/templates`).as('deleteTemplate');

    cy.get('[data-cy=prompt-ok]').click();

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
    const uuid = `${TEST_PREFIX}-${uuidv4()}`;

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
    const buildTitle = `${TEST_PREFIX}-${uuidv4()}`;
    const templateId = `${TEST_PREFIX}-${uuidv4()}`;

    cy.server();
    cy.route('POST', `${API_URL}/builds`).as('postBuild');
    cy.route('POST', `${API_URL}/templates`).as('postTemplate');
    cy.route('POST', `${API_URL}/posters`).as('postPoster');

    cy.get('[data-cy=create-build]').click();
    cy.get('[data-cy=prompt-textfield]').type(buildTitle);
    cy.get('[data-cy=prompt-ok]').click();

    cy.wait('@postBuild');

    cy.get('[data-cy=template]').click();
    cy.get('[data-cy=new-template]').click();
    cy.get('[data-cy=prompt-textfield]')
      .click()
      .type(templateId, { animationDistanceThreshold: 50 });
    cy.get('[data-cy=prompt-ok]').click();
    cy.wait('@postTemplate');

    cy.get('[data-cy=generate]').click();

    cy.get('[data-cy=filterInput]').type('1020131');
    cy.get('[data-cy=1020131]').click();
    cy.get('[data-cy=select-template]').click();
    cy.get(`[data-cy=${templateId}]`).click();
    cy.get('[data-cy=build-select]').click();
    cy.get(`[data-cy=${buildTitle}-select]`).click();
    cy.get('[data-cy=generate-button]').click();

    cy.wait('@postPoster');

    cy.get('[data-cy=list]').click();

    cy.wait(120000);

    cy.get(`[data-cy=${buildTitle}-show]`).click();
    cy.get(`[data-cy=${buildTitle}-buildDetails]`).contains('Rendered successfully');
    cy.get(`[data-cy=build-details-close-button]`).click();

    cy.get(`[data-cy=${buildTitle}-remove]`).click();
    cy.get('[data-cy=confirm-ok]').click();

    cy.get('[data-cy=template]').click();
    cy.get('[data-cy=remove-template]').click();
    cy.get('[data-cy=confirm-ok]').click();
  });
});
