// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import '@cypress/code-coverage/support'


before(function () {
  cy.fixture('user.json').then((user) => {
    cy.createUser(user)
  })
})

after(function () {
  cy.fixture('user.json').then((user) => {
    const data = {
      email: user.email,
      password: user.password
    }

    cy.deleteUserData(data)
    cy.deleteUser(data)
  })
})

