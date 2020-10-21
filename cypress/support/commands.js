Cypress.Commands.add('hslLogin', () => {
  const AUTH_URI = 'https://hslid-uat.cinfra.fi/openid/token';
  const AUTH_SCOPE = 'email https://oneportal.trivore.com/scope/groups.readonly';

  const CLIENT_ID = Cypress.env('CYPRESS_HSLID_CLIENT_ID');
  const CLIENT_SECRET = Cypress.env('CYPRESS_HSLID_CLIENT_SECRET');
  const HSLID_USERNAME = Cypress.env('CYPRESS_TESTING_HSLID_USERNAME');
  const HSLID_PASSWORD = Cypress.env('CYPRESS_TESTING_HSLID_PASSWORD');

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
      username: HSLID_USERNAME,
      password: HSLID_PASSWORD,
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
