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
      // cy.wrap(user).as('user')
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
})