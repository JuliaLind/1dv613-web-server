describe('Vist home page', () => {
  it('redirects unauthenticated users from / to /login', () => {
    cy.visit('/')
    cy.url().should('include', '/login')
    cy.get('h1').should('contain', 'Log in')
  })
})