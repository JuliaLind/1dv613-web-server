describe('Req 1.11 - Logout', function () {
  // let accessToken
  let refreshToken
  beforeEach(() => {
    cy.fixture('user.json').then((user) => {
      cy.login({
        email: user.email,
        password: user.password
      }).then((tokens) => {
        // accessToken = tokens.accessToken
        refreshToken = tokens.refreshToken
      })
    })
  })

  afterEach(() => {
    // no need to "logout" from backend,
    // all refreshtokens will be invalidated
    // when the user is deleted after all testsuites
    cy.clearLocalStorage()
  })

  it('Req 1.11.1 - should logout', function () {
    cy.visit('/')
    cy.get('#signout-btn').click()

    cy.url().should('include', '/login')
    cy.get('.p-toast-summary')
      .should('contain', 'Logged out successfully')
      .closest('.p-toast-message')
      .should('have.class', 'p-toast-message-success')
      .should('be.visible')
  })

  it('Req 1.11.2 - after logout tokens should be cleared from local storage, should not be able to access protected routes after logout.', function () {
    cy.visit('/')
    cy.get('#signout-btn').click()

    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.be.null
      expect(win.localStorage.getItem('refreshToken')).to.be.null
    })

    cy.visit('/')
    cy.url().should('include', '/login')
  })

  it('Req 1.11.3 - after logout the refreshtoken should get expired on auth server and not possible to reuse.', function () {
    cy.visit('/')
    cy.get('#signout-btn').click()




    cy.intercept('POST', `**/refresh*`).as('refreshTokens')

    const randomInvalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZWM5ZjhiYTJkMWQ0NWEzZjBiN2U5MSIsImFnZSI6MzYsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjM5MDIyfQ.GNZdy9FaBqEQw8stXwrRyJXFC0v4m86b3HhELRIdNQc'

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', randomInvalidToken)
        win.localStorage.setItem('refreshToken', refreshToken) // use the refreshToken we got before
      }
    })
    cy.url().should('include', '/login')

    cy.wait('@refreshTokens').then((interception) => {
      assert.equal(interception.response.statusCode, 401)
    })
  })
})