import { format } from 'date-fns'
describe('Req 1.7 - add food item to a meal', function () {
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
        cy.login(credentials).then((tokens) => {
          token = tokens.accessToken

          cy.addMeal(breakfast, token)
        })
      })
  })

  afterEach(() => {
    cy.deleteMeals(token)
    cy.clearLocalStorage()
  })

  it('Req 1.7.1 - User should be able to add food item to own meal', () => {
    cy.intercept('PATCH', `**/meals*`).as('addFoodItem')

    cy.visit('/')
    cy.get('.p-toast-close-button')
      .click() // close the toast message so it does not cover other elements

    cy.get('.kcal-number').should('contain.text', '78')

    cy.get('#breakfast .meal-kcal')
      .should('have.text', '78 kcal')

    cy.get('#breakfast .add-food-btn')
      .click()

    cy.get('#product-7350029731557 button.p-accordionheader')
      .click()

    cy.get('#product-7350029731557 input#weight').clear()
    cy.get('#product-7350029731557 input#weight')
      .type(400)

    cy.get('#product-7350029731557 .save-btn')
      .click()

    cy.wait('@addFoodItem').its('response.statusCode').should('eq', 201)

    cy.contains('#breakfast', /14% Bröd, Dahls Bageri/i)
      .scrollIntoView()
      .should('be.visible')

      // check that the new item did not replace the old one
    cy.contains('#breakfast', /Jordgubb Smultron Original Yoghurt 2%/i)
      .scrollIntoView()
      .should('be.visible')

      // check that kcal got updated
    cy.get('#breakfast .meal-kcal')
      .should('have.text', '998 kcal')
    cy.get('.kcal-number').should('contain.text', '998')

  })
})