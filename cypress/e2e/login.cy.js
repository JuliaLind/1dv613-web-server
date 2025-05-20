describe('Req 1.2 - Log in', function () {
  const credentials = {
    email: 'test@testsson.com',
    password: 'testtestsson',
    birthDate: "1990-01-01"
  }


  it('Req 1.2.1 - should log in with valid credentials', function () {
    cy.intercept('POST', `**/login`).as('loginUser')
    cy.visit('/login')

    cy.get('#email').type(credentials.email)
    cy.get('input[type="password"]').eq(0).type(credentials.password)

    cy.get('form').submit()
    cy.url().should('include', '/')
    cy.wait('@loginUser').then((interception) => {
      assert.equal(interception.response.statusCode, 201)
    })
    cy.contains('.p-toast-summary', 'Welcome')
      .should('be.visible')
  })

  describe('Req 1.2.2 - A user cannot submit form if any of the fields are empty', function () {
    const { email, password } = credentials
    const inputData = [
      {
        email: '',
        password,
        descr: 'email is empty'
      },
      {
        email,
        password: '',
        descr: 'password is empty'
      },
      {
        email: '',
        password: '',
        descr: 'both email and password are empty'
      }
    ]

    inputData.forEach((data) => {
      it(data.descr, function () {
        cy.intercept('POST', `**/login`).as('loginUser')
        cy.visit('/login')

        data.email ?? cy.get('#email').type(data.email)
        data.password ?? cy.get('input[type="password"]').eq(0).type(data.password)

        cy.get('form').submit()
        cy.url().should('include', '/login')
        cy.get('.p-toast-summary')
          .should('contain', 'Login failed')
          .closest('.p-toast-message')
          .should('have.class', 'p-toast-message-error')
        cy.get('@loginUser.all').should('have.length', 0)
      })
    })
  })

  it('Req 1.2.3 redirects unauthenticated users from / to /login', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear()
      }
    })

    cy.url().should('include', '/login')
    cy.get('h1').should('contain', 'Log in')
  })
})