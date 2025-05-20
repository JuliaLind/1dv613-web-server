import { subYears } from 'date-fns'

describe('Req 1.1 - registration', function () {
  const email = 'testuser@example.com'
  const password = 'password123'
  const birthDate18 = subYears(new Date(), 18).toISOString().split('T')[0]


  it('A user who is over 18 years old can register', function () {
    cy.visit('/')
    cy.contains('a', /Register/i) // because cannot go to register page directly in the deployed environment
    .click()

    cy.get('#birthDate').type(birthDate18)
    cy.get('#email').type(email)
    cy.get('input[type="password"]').eq(0).type(password)
    cy.get('input[type="password"]').eq(1).type(password)

    cy.get('form').submit()
    cy.url().should('include', '/login')


    // clean up
    cy.clearLocalStorage()
    cy.deleteUser({
      email,
      password
    })

  })
})
