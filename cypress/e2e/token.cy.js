import { jwtDecode } from "jwt-decode"

describe('Req 1.4 Token management', function () {
  let credentials
  let accessToken
  let refreshToken
  before(function () {
    cy.fixture('user.json')
      .then((user) => {
        credentials = {
          email: user.email,
          password: user.password
        }

        cy.login(credentials)
          .then((tokens) => {
            accessToken = tokens.accessToken
            refreshToken = tokens.refreshToken
          })
      })
  })

  after(() => {
    cy.clearLocalStorage()
  })

  it('Req 1.4.1 - access token should be valid for 2 hours', function () {
    cy.visit('/')
    const decoded = jwtDecode(accessToken)
    const exp = decoded.exp
    const iat = decoded.iat
    expect(exp - iat).to.equal(60 * 60 * 2)
  })

  it('Req 1.4.2 - refresh token should be valid for 2 days', function () {
    cy.visit('/')
    const decoded = jwtDecode(refreshToken)
    const exp = decoded.exp
    const iat = decoded.iat
    expect(exp - iat).to.equal(60 * 60 * 24 * 2)
  })
})