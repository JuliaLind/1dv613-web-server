// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('createUser', ({ email, birthDate, password }) => {
  cy.request('POST', `${Cypress.env('VITE_AUTH_URL')}/user`, {
    email,
    birthDate,
    password
  })
})

Cypress.Commands.add('deleteUser', ({ email, password }) => {
  cy.request({
    method: 'DELETE',
    url: `${Cypress.env('VITE_AUTH_URL')}/user`,
    body: {
      email,
      password,
    },
    failOnStatusCode: false
  })
})

Cypress.Commands.add('deleteUserData', ({ email, password }) => {
  return cy.request('POST', `${Cypress.env('VITE_AUTH_URL')}/login`, {
    email,
    password
  }).then((response) => {
    const accessToken = response.body.accessToken

    cy.deleteFromDataServer(accessToken)
  })
})

Cypress.Commands.add('deleteFromDataServer', (accessToken) => {
  cy.deleteProfileData(accessToken)
  cy.deleteMeals(accessToken)
})

Cypress.Commands.add('addProfileData', (data, token) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('VITE_DATA_URL')}/user`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: data,
  })
})


Cypress.Commands.add('deleteProfileData', (accessToken) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('VITE_DATA_URL')}/user`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    failOnStatusCode: false
  })
})


Cypress.Commands.add('login', ({ email, password }) => {
  return cy.request('POST', `${Cypress.env('VITE_AUTH_URL')}/login`, {
    email,
    password
  }).then((response) => {
    const { refreshToken, accessToken } = response.body

    return cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', accessToken)
        win.localStorage.setItem('refeshToken', refreshToken)
      }
    }).then(() => {
      return { accessToken, refreshToken }
    })
  })
})

Cypress.Commands.add('addMeal', (meal, token) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('VITE_DATA_URL')}/meals`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: meal,
  }).then((response) => {
    return response.body.id
  })
})

Cypress.Commands.add('deleteMeals', (token) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('VITE_DATA_URL')}/meals`,
    headers: {
      Authorization: `Bearer ${token}`
    },
  })
})

