import { format } from 'date-fns'

describe('Req 1.8 - delete fooditem from meal', function () {
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
      {
        ean: '5000112637939', // Coca-cola Zero Läsk Burk
        unit: 'g',
        weight: 1000
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

        cy.addMeal(breakfast, token)
          .then((id) => {
            mealId = id
          })
      })
  })

  afterEach(() => {
    cy.deleteMeals(token)
    cy.clearLocalStorage()
  })


  it('Req 1.8.1 - User should be able to delete item from meal (delete 1 item out of 2)', () => {
    cy.intercept('PATCH', `**/meals/${mealId}/del/*`).as('deleteFoodItem')
    cy.intercept('DELETE', `**/meals/${mealId}`).as('deleteMeal')

    cy.visit('/')
    cy.get('.p-toast-close-button')
      .click() // close the toast message so it does not cover other elements

    cy.get('#breakfast .meal-item')
      .should('have.length', 2)


    cy.get('#breakfast .meal-item:first-of-type() .action-btn')
      .click()

    cy.get('.delete-fooditem-btn')
      .click()

    cy.wait('@deleteFoodItem').then((interception) => {
      assert.equal(interception.response.statusCode, 204)
    })
    cy.get('@deleteMeal.all').should('have.length', 0)
    cy.get('#breakfast .meal-item').should('have.length', 1)
  })

  it('Req 1.8.1 - User should be able to delete item from meal (delete 2 items out of 2)', () => {
    cy.intercept('PATCH', `**/meals/${mealId}/del/*`).as('deleteFoodItem')
    cy.intercept('DELETE', `**/meals/${mealId}`).as('deleteMeal')
    cy.visit('/')
    cy.get('.p-toast-close-button')
      .click() // close the toast message so it does not cover other elements

    cy.get('#breakfast .meal-item').should('have.length', 2)

    cy.get('#breakfast .meal-item:first-of-type() .action-btn')
      .click()

    cy.get('.delete-fooditem-btn')
      .click()

    cy.wait('@deleteFoodItem').then((interception) => {
      assert.equal(interception.response.statusCode, 204)
    })

    cy.get('#breakfast .meal-item').should('have.length', 1)

    cy.get('#breakfast .meal-item:first-of-type() .action-btn')
      .click() // because the second item is now the first one and only one

    cy.get('.delete-fooditem-btn')
      .click()


    cy.wait('@deleteMeal').then((interception) => {
      assert.equal(interception.response.statusCode, 204)
    })
    cy.get('#breakfast .meal-item').should('have.length', 0)
  })


  it('Req 1.8.2 - the kcal for the meal and for the day should change when items are deleted', () => {
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
    cy.addMeal(lunch, token)
    cy.visit('/')
    cy.get('.p-toast-close-button')
      .click() // close the toast message so it does not cover other elements

    cy.get('.kcal-number').should('contain.text', '515') // initial kcal for day

    cy.get('#breakfast .meal-kcal')
      .should('have.text', '81 kcal') // initial kcal for breakfast

    cy.get('#breakfast .meal-item')
      .should('have.length', 2)


    cy.get('#breakfast .meal-item:first-of-type() .action-btn')
      .click()

    cy.get('.delete-fooditem-btn')
      .click()

    // check that kcal got updated
    cy.get('#breakfast .meal-kcal')
      .should('have.text', '3 kcal')
    cy.get('.kcal-number').should('contain.text', '437')
  })
})