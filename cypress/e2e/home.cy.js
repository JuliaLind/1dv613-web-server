describe('Vist home page unauthenticated', function () {
  it('redirects unauthenticated users from / to /login', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.clear()
      }
    })

    cy.url().should('include', '/login')
    cy.get('h1').should('contain', 'Log in')
  })
})

describe('Vist home page authenticated', function () {
  let credentials
  before(function () {
    cy.fixture('user.json').then((user) => {
      credentials = {
        email: user.email,
        password: user.password
      }
    })
  })
  beforeEach(() => {
    cy.login(credentials)
  })

  afterEach(() => {
    cy.clearLocalStorage()
  })



  it('should not redirect authenticated users to /login', function () {
    cy.visit('/')
    cy.url().should('not.include', '/login')
  })

  it('User has no previous data, toast with message should be displayed', function () {
    cy.visit('/')

    cy.contains('.p-toast-summary', 'Complete your profile')
    .should('be.visible')
    .closest('.p-toast-message')
    .should('have.class', 'p-toast-message-info')
  })
})