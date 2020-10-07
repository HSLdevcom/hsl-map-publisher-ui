Cypress.Commands.add('hslLogin', () => {
  const AUTH_URI = 'https://hslid-uat.cinfra.fi/openid/token';
  const AUTH_SCOPE = 'email https://oneportal.trivore.com/scope/groups.readonly';

  const HSL_TESTING_HSLID_USERNAME = process.env.HSL_TESTING_HSLID_USERNAME || '';
  const HSL_TESTING_HSLID_PASSWORD = process.env.HSL_TESTING_HSLID_PASSWORD || '';

  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID || '';
  const { CLIENT_SECRET } = require('../../constants');

  const authHeader = `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`;

  const options = {
    method: 'POST',
    url: AUTH_URI,
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: true, // we are submitting a regular form body
    body: {
      scope: AUTH_SCOPE,
      grant_type: 'password',
      username: HSL_TESTING_HSLID_USERNAME,
      password: HSL_TESTING_HSLID_PASSWORD,
    },
  };

  cy.request(options).then(response => {
    const { access_token } = response.body;

    expect(response.status).to.eq(200);
    expect(access_token).to.be.ok;
    // testing = QueryParams.testing
    cy.visit(`/afterLogin?code=${access_token}&testing=true`);
  });
});