import { subYears, addDays } from 'date-fns'

describe('Req 1.1 - registration', function () {
  const email = 'testuser@example.com'
  const password = 'password123'
  const birthDate18 = subYears(new Date(), 18).toISOString().split('T')[0]
  const birthDateUnder18 = addDays(new Date(birthDate18), 1).toISOString().split('T')[0]

  afterEach(() => {
    cy.deleteUser({
      email,
      password
    })
  })


  it('A user who is over 18 years old can register', function () {
    cy.intercept('POST', `**/user*`).as('registerUser')
    cy.visit('/')
    cy.contains('a', /Register/i) // because cannot go to register page directly in the deployed environment
    .click()

    cy.get('#birthDate').type(birthDate18)
    cy.get('#email').type(email)
    cy.get('input[type="password"]').eq(0).type(password)
    cy.get('input[type="password"]').eq(1).type(password)

    cy.get('form').submit()
    cy.url().should('include', '/login')
    cy.get('.p-toast-summary')
      .should('contain', 'Registration successful')
      .closest('.p-toast-message')
      .should('have.class', 'p-toast-message-success')
    cy.wait('@registerUser').then((interception) => {
        assert.equal(interception.response.statusCode, 201)
      })
  })

  it('A user who is under 18 years old cannot register', function () {
    cy.intercept('POST', `**/user*`).as('registerUser')

    cy.log('birthDateUnder18', birthDateUnder18)

    cy.visit('/')
    cy.contains('a', /Register/i)
    .click()

    cy.get('#birthDate').type(birthDateUnder18)
    cy.get('#email').type(email)
    cy.get('input[type="password"]').eq(0).type(password)
    cy.get('input[type="password"]').eq(1).type(password)

    cy.get('form').submit()
    cy.url().should('include', '/register')
    cy.get('@registerUser.all').should('have.length', 0)
  })
})
