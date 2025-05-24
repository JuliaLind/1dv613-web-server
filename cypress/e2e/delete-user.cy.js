import { format, subYears } from 'date-fns'

describe('Req 1.10 - delete account', function () {
  let token
  const age = 18
  const birthDate = format(subYears(new Date(), age), 'yyyy-MM-dd')

  const credentials = {
    email: 'other-user@email.com',
    password: 'otheruser',
    birthDate
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const breakfast = {
    date: today,
    type: 'breakfast',
    foodItems: [
      {
        ean: '7310865018465', // Jordgubb Smultron Original Yoghurt 2%
        unit: 'g',
        weight: 100
      }
    ]
  }

  beforeEach(() => {
    cy.createUser(credentials)
      .then(() => {
        return cy.login({
          email: credentials.email,
          password: credentials.password
        })
      })
      .then((tokens) => {
        token = tokens.accessToken
        return token
      })
      .then((token) => {
        cy.addMeal(breakfast, token)

        cy.fixture('profile.json')
          .then((profile) => {
            return cy.addProfileData({
              ...profile,
              age,
              effectiveDate: format(new Date(), 'yyyy-MM-dd'),
            }, token)
          })
      })
  })

  afterEach(() => {
    cy.deleteFromDataServer(token)
    cy.deleteUser(credentials)

    cy.log('user deleted')

    cy.clearLocalStorage()
  })

  it('Req 1.10.1  + 1.10.3 - Logged in user who filles out correct email and password should be able to delete account. User data should be deleted from from auth-server and data-server', () => {
    cy.intercept('POST', `${Cypress.env('VITE_AUTH_URL')}/login`).as('loginUser')
    cy.intercept('DELETE', `${Cypress.env('VITE_DATA_URL')}/user`).as('deleteUserData')
    cy.intercept('DELETE', `${Cypress.env('VITE_AUTH_URL')}/user`).as('deleteAccount')
    cy.intercept('DELETE', `${Cypress.env('VITE_DATA_URL')}/meals`).as('deleteMeals')

    cy.visit('/')

    cy.get('.p-toast-close-button')
      .click() // close the toast message so it does not cover other elements

    cy.get('.pi-user').click()
    cy.get('#delete-form #email').type(credentials.email)
    cy.get('#delete-form #password').type(credentials.password)
    cy.get('#delete-form .p-button-danger').click()
    cy.get('.p-confirmpopup-accept-button').click()
    cy.get('.p-toast-summary').should('contain', 'Account deleted')
    cy.get('.p-toast-message').should('have.class', 'p-toast-message-success')
    cy.get('.pi-user').should('not.exist')
    cy.url().should('include', '/login')

    cy.visit('/')
    cy.url().should('include', '/login')

    // User should have been successfully authenticated
    cy.wait('@loginUser').then((interception) => {
      expect(interception.response.statusCode).to.equal(201)
    })

    // User data has been successfully deleted from data-server
    cy.wait('@deleteUserData').then((interception) => {
      expect(interception.response.statusCode).to.equal(204)
    })

    // User's meals have been successfully deleted from data-server
    cy.wait('@deleteMeals').then((interception) => {
      expect(interception.response.statusCode).to.equal(204)
    })

    // User's account has been successfully deleted
    cy.wait('@deleteAccount').then((interception) => {
      expect(interception.response.statusCode).to.equal(204)
    })


    // Should not be able to login again after account has been deleted
    cy.intercept('POST', `**/login`).as('loginUser')

    cy.get('#email').type(credentials.email)
    cy.get('input[type="password"]').eq(0).type(credentials.password)

    cy.get('form').submit()
    cy.url().should('include', '/login')
    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.be.null
      expect(win.localStorage.getItem('refreshToken')).to.be.null
    })

    // user has been deleted from auth-server
    cy.wait('@loginUser').then((interception) => {
      assert.equal(interception.response.statusCode, 401)
    })
    cy.contains('.p-toast-summary', 'Login failed')
      .should('be.visible')

    cy.request({
      method: 'GET',
      url: `${Cypress.env('VITE_DATA_URL')}/meals/${today}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(404)
    })

    cy.request({
      method: 'GET',
      url: `${Cypress.env('VITE_DATA_URL')}/user`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(404)
    })
  })

  it('User account should not be deleted if credentials are correct but user rejects the confirmation dialog', () => {
    cy.intercept('POST', `${Cypress.env('VITE_AUTH_URL')}/login`).as('loginUser')
    cy.intercept('DELETE', `${Cypress.env('VITE_DATA_URL')}/meals`).as('deleteMeals')
    cy.intercept('DELETE', `${Cypress.env('VITE_DATA_URL')}/user`).as('deleteUserData')
    cy.intercept('DELETE', `${Cypress.env('VITE_AUTH_URL')}/user`).as('deleteAccount')

    cy.visit('/')

    cy.get('.p-toast-close-button')
      .click() // close the toast message so it does not cover other elements

    cy.get('.pi-user').click()
    cy.get('#delete-form #email').type(credentials.email)
    cy.get('#delete-form #password').type(credentials.password)
    cy.get('#delete-form .p-button-danger').click()
    cy.get('.p-confirmpopup-reject-button').click()

    // No requests to backend should have been made
    cy.get('@loginUser.all').should('have.length', 0)
    cy.get('@deleteMeals.all').should('have.length', 0)
    cy.get('@deleteUserData.all').should('have.length', 0)
    cy.get('@deleteAccount.all').should('have.length', 0)


    // User remains logged in
    cy.get('.pi-user').should('exist')
    cy.url().should('not.include', '/login')
    cy.get('.p-toast-summary').should('contain', 'Cancelled')
    cy.get('.p-toast-message').should('have.class', 'p-toast-message-info')
    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.exist
      expect(win.localStorage.getItem('refreshToken')).to.exist
    })
  })

  const wrongCredentials = [
    {
      email: 'wrong@email.com',
      password: credentials.password,
      reason: 'wrong email'
    },
    {
      email: credentials.email,
      password: 'wrongpassword',
      reason: 'wrong password'
    }
  ]

  wrongCredentials.forEach(({
    email,
    password,
    reason
  }) => {
    it('Requirement 1.10.2 - User account should not be deleted if credentials are incorrect - ' + reason, () => {
      cy.intercept('POST', `${Cypress.env('VITE_AUTH_URL')}/login`).as('loginUser')
      cy.intercept('DELETE', `${Cypress.env('VITE_DATA_URL')}/meals`).as('deleteMeals')
      cy.intercept('DELETE', `${Cypress.env('VITE_DATA_URL')}/user`).as('deleteUserData')
      cy.intercept('DELETE', `${Cypress.env('VITE_AUTH_URL')}/user`).as('deleteAccount')

      cy.visit('/')

      cy.get('.p-toast-close-button')
        .click() // close the toast message so it does not cover other elements

      cy.get('.pi-user').click()
      cy.get('#delete-form #email').type(email)
      cy.get('#delete-form #password').type(password) // incorrect password
      cy.get('#delete-form .p-button-danger').click()
      cy.get('.p-confirmpopup-accept-button').click()

      // Only the login request should have been made
      cy.wait('@loginUser').then((interception) => {
        expect(interception.response.statusCode).to.equal(401)
      })

      cy.get('@deleteMeals.all').should('have.length', 0)
      cy.get('@deleteUserData.all').should('have.length', 0)
      cy.get('@deleteAccount.all').should('have.length', 0)


      // User remains logged in
      cy.get('.pi-user').should('exist')
      cy.url().should('not.include', '/login')
      cy.get('.p-toast-summary').should('contain', 'Deletion failed')
      cy.get('.p-toast-message').should('have.class', 'p-toast-message-error')
      cy.window().then((win) => {
        expect(win.localStorage.getItem('accessToken')).to.exist
        expect(win.localStorage.getItem('refreshToken')).to.exist
      })
    })
  })
})