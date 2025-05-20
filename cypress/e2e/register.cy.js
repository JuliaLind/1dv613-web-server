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


  it('Req 1.1.1 A user who is over 18 years old can register', function () {
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

  it('Req 1.1.2 A user who is under 18 years old cannot register', function () {
    cy.intercept('POST', `**/user*`).as('registerUser')

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

  describe ('Req 1.1.3 - A user cannot create a second account with same email', function () {
    let credentials

    beforeEach(() => {
      cy.fixture('user.json').then((user) => {
        credentials = {
          email: user.email,
          password: user.password,
          birthDate: user.birthDate
        }
      })
    })

    it('', function () {
      cy.intercept('POST', `**/user*`).as('registerUser')
      cy.visit('/')
      cy.contains('a', /Register/i)
      .click()

      const { email, password, birthDate } = credentials

      cy.get('#birthDate').type(birthDate)
      cy.get('#email').type(email)
      cy.get('input[type="password"]').eq(0).type(password)
      cy.get('input[type="password"]').eq(1).type(password)

      cy.get('form').submit()
      cy.url().should('include', '/register')
      cy.wait('@registerUser').then((interception) => {
        assert.equal(interception.response.statusCode, 409)
      })
    })
  })

  describe('Req 1.1.4 - A user cannot submit form if any of the fields are empty', function () {
    const inputData = [
      {
        email: '',
        password: password,
        repeatPassword: password,
        birthDate: birthDate18,
        descr: 'email is empty'
      },
      {
        email: email,
        password: '',
        repeatPassword: password,
        birthDate: birthDate18,
        descr: 'password is empty'
      },
      {
        email: email,
        password: password,
        repeatPassword: '',
        birthDate: birthDate18,
        descr: 'repeatPassword is empty'
      },
      {
        email: email,
        password: password,
        repeatPassword: password,
        birthDate: '',
        descr: 'birthDate is empty'
      }
    ]
    inputData.forEach((data) => {
      it(data.descr, function () {
        cy.intercept('POST', `**/user*`).as('registerUser')
        cy.visit('/')
        cy.contains('a', /Register/i)
          .click()

        data.birthDate ?? cy.get('#birthDate').type(data.birthDate)
        data.email ?? cy.get('#email').type(data.email)
        data.password ?? cy.get('input[type="password"]').eq(0).type(data.password)
        data.repeatPassword ?? cy.get('input[type="password"]').eq(1).type(data.repeatPassword)

        cy.get('form').submit()
        cy.url().should('include', '/register')
        cy.get('.p-toast-summary')
          .should('contain', 'Registration failed')
          .closest('.p-toast-message')
          .should('have.class', 'p-toast-message-error')
        cy.get('@registerUser.all').should('have.length', 0)
      })
    })
  })
})
