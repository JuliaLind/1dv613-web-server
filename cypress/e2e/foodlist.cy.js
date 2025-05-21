describe('Req 1.4 - food data', function () {
  let credentials

  before(function () {
    cy.fixture('user.json')
      .then((user) => {
        credentials = {
          email: user.email,
          password: user.password
        }

        cy.login(credentials)
      })
  })

  after(() => {
    cy.clearLocalStorage()
  })

  it('Req 1.4.1 + 1.4.2 foodlist should contain fooditems. Food items should contain kcal and macros', function () {
    cy.visit('/')
    cy.get('#meal-list')
    .find('footer').eq(0)
    .find('button')
    .click()

    cy.get('button.p-accordionheader').eq(0)
    .click()

    cy.get('.food-detail').eq(0)
    .contains('td', 'kcal')
    .should('be.visible')

    cy.get('.food-detail').eq(0)
    .contains('td', 'fat')
    .should('be.visible')

    cy.get('.food-detail').eq(0)
    .contains('td', 'saturated fat')
    .should('be.visible')

    cy.get('.food-detail').eq(0)
    .contains('td', 'carbohydrate')
    .should('be.visible')

    cy.get('.food-detail').eq(0)
    .contains('td', 'sugars')
    .should('be.visible')

    cy.get('.food-detail').eq(0)
    .contains('td', 'protein')
    .should('be.visible')

    cy.get('.food-detail').eq(0)
    .contains('td', 'salt')
    .should('be.visible')

    cy.get('.food-detail').eq(0)
    .contains('td', 'fiber')
    .should('be.visible')
  })
})