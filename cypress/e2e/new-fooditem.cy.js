describe('Req 1.7 - add food item to a meal', function () {
  const foodItem = {
    ean: '99999999999',
    name: 'Test Food Item',
    brand: 'Test Brand',
    kcal_100g: 600,
    macros_100g: {
      protein: 20,
      carbohydrates: 50,
      fat: 30
    }
  }
  let token

  beforeEach(() => {
    cy.fixture('user.json')
      .then((user) => {
        return {
          email: user.email,
          password: user.password
        }
      })
      .then((credentials) => {
        cy.login(credentials)
      }).then((tokens) => {
        token = tokens.accessToken
      })
  })

  afterEach(() => {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('VITE_DATA_URL')}/foods/ean/${foodItem.ean}`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      failOnStatusCode: false
    })
    cy.clearLocalStorage()
  })

  it('Req 1.4.6 - User should be able to create a missing food item', () => {
    /**
     * Finds html element by selector and
     * clears the field before enterring the value.
     *
     * @param {string} selector - CSS selector for the input field
     * @param {string} value - Value to enter into the input field
     */
    function enterValue(selector, value) {
      cy.get(selector).clear()
      cy.get(selector).type(value)
    }

    cy.intercept('POST', `**/foods`).as('createFoodItem')

    cy.visit('/')
    cy.get('.p-toast-close-button')
      .click() // close the toast message so it does not cover other elements

    cy.get('#breakfast .add-food-btn')
      .click()

    cy.get('#search-input').type('nfwwifjwifwfoiew')
    cy.contains('button', 'Create new product').click()

    enterValue('#ean-input', foodItem.ean)
    enterValue('#name-input', foodItem.name)
    enterValue('#brand-input', foodItem.brand)
    enterValue('#kcal-input', foodItem.kcal_100g)
    enterValue('#protein-input', foodItem.macros_100g.protein)
    enterValue('#carbohydrates-input', foodItem.macros_100g.carbohydrates)
    enterValue('#fat-input', foodItem.macros_100g.fat)

    cy.contains('button', 'Save').click()

    cy.wait('@createFoodItem').its('response.statusCode').should('eq', 201)
    cy.get('.p-toast-summary')
      .should('contain', 'Product created!')
    cy.get('.p-toast-message').should('have.class', 'p-toast-message-success')

    cy.get('#product-list')
    .contains(foodItem.name)
  })
})