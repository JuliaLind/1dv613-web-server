import { format } from 'date-fns'

describe('Req 1.9 - edit food item in a meal', function () {
  const today = format(new Date(), 'yyyy-MM-dd')
  const breakfast = {
    date: today,
    type: 'breakfast',
    foodItems: [
      {
        ean: '7310865018465', // Jordgubb Smultron Original Yoghurt 2%
        unit: 'g',
        weight: 100
      },
    ]
  }

  const lunch = {
    date: today,
    type: 'lunch',
    foodItems: [
      {
        ean: '7311043006526', // Pan Pizza Vesuvio Fryst
        unit: 'g',
        weight: 200
      },
    ]
  }
  let token
  let mealId

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

        cy.addMeal(lunch, token)
          .then((id) => {
            mealId = id
          })
        cy.addMeal(breakfast, token)
      })
  })

  afterEach(() => {
    cy.deleteMeals(token)
    cy.clearLocalStorage()
  })


  it('Req 1.9.1 - User should be able to edit an item in a meal', () => {
    cy.intercept('PATCH', `**/meals/${mealId}/upd`).as('updFoodItem')


    cy.visit('/')
    cy.get('.p-toast-close-button')
      .click() // close the toast message so it does not cover other elements

    cy.get('#lunch .meal-item:first-of-type() .food-kcal')
      .should('contain.text', '434 kcal / 200 g')
    cy.get('#lunch .meal-item:first-of-type() .action-btn')
      .click()

    cy.get('.edit-fooditem-btn')
      .click()
    cy.get('#lunch .food-detail input#weight').clear()
    cy.get('#lunch .food-detail input#weight')
      .type(900)
    cy.get('#lunch .food-detail .save-btn')
      .click()


    cy.wait('@updFoodItem').then((interception) => {
      expect(interception.request.body.weight).to.equal(900)

      expect(interception.response.statusCode).to.equal(204)
    })

    cy.get('#lunch .meal-item:first-of-type() .food-kcal')
      .should('contain.text', '1953 kcal / 900 g')

  })


})