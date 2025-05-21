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
})