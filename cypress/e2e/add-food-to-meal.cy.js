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

  it('Req 1.7.1 - User should be able to add food item to own meal', () => {
    cy.intercept('PATCH', `**/meals/${mealId}/add`).as('addFoodItem')

    cy.visit('/')
    cy.get('.p-toast-close-button')
      .click() // close the toast message so it does not cover other elements

    cy.get('#breakfast .add-food-btn')
      .click()

    cy.get('#product-7350029731557 button.p-accordionheader')
      .click()
    cy.get('#product-7350029731557 input#weight').clear()
    cy.get('#product-7350029731557 input#weight')
      .type(400) // add 400g of bread

    cy.get('#product-7350029731557 .save-btn')
      .click()

    cy.wait('@addFoodItem').its('response.statusCode').should('eq', 201)

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('#breakfast', /14% Bröd, Dahls Bageri/i)
      .scrollIntoView()
      .should('be.visible') // check that new item has been added to the meal

    // check that the new item did not replace the old one
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('#breakfast', /Jordgubb Smultron Original Yoghurt 2%/i)
      .scrollIntoView()
      .should('be.visible')
  })

  it('Req 1.7.2 - user should be able to do a free-text search for food items and get items with partial match in name or brand', () => {
    cy.visit('/')
    cy.get('.p-toast-close-button')
      .click() // close the toast message so it does not cover other elements

    cy.get('#breakfast .add-food-btn')
      .click()
    cy.get('#search-input')
      .type('snacks')

    cy.contains('button', 'Load more')
      .click()
    cy.contains('button', 'Load more')
      .click()

    cy.get('#product-list .descr').each(($item) => {
      cy.wrap($item).invoke('text')
        .then((text) => {
          expect(text).to.match(/snacks/i)
        })
    })
  })

  it('Req 1.7.3 - User should be presented with 7 suggestions and can click on "load more" button to get another 7 suggestions', () => {

    cy.visit('/')
    cy.get('.p-toast-close-button')
      .click() // close the toast message so it does not cover other elements

    cy.get('#breakfast .add-food-btn')
      .click()

    cy.get('#product-list .descr')
      .should('have.length', 7)

    cy.contains('button', 'Load more')
      .click()
    cy.get('#product-list .descr')
      .should('have.length', 14)
    cy.contains('button', 'Load more')
      .click()
    cy.get('#product-list .descr')
      .should('have.length', 21)
  })

  it('Req 1.7.4 - the kcal for the meal and for the day should change when the enw food item is added', () => {
    cy.visit('/')
    cy.get('.p-toast-close-button')
      .click() // close the toast message so it does not cover other elements

    cy.get('.kcal-number').should('contain.text', '78') // initial kcal for day

    cy.get('#breakfast .meal-kcal')
      .should('have.text', '78 kcal') // initial kcal for breakfast

    cy.get('#breakfast .add-food-btn')
      .click()

    cy.get('#product-7350029731557 button.p-accordionheader')
      .click()
    cy.get('#product-7350029731557 input#weight').clear()
    cy.get('#product-7350029731557 input#weight')
      .type(400) // add 400g of bread

    cy.get('#product-7350029731557 .save-btn')
      .click()

    // check that kcal got updated
    cy.get('#breakfast .meal-kcal')
      .should('have.text', '998 kcal')
    cy.get('.kcal-number').should('contain.text', '998')
  })

  it('Req 1.7.5 - User should be able to add multiple instances of same item to a meal with same or different weight', () => {
    /**
     * Adds a bread item to the meal
     * with the given weight.
     *
     * @param {number} weight - weight of the bread item to add
     */
    function addBread(weight) {
      cy.get('#snack1 .add-food-btn')
        .click()

      cy.get('#product-7350029731557 button.p-accordionheader')
        .click()
      cy.get('#product-7350029731557 input#weight').clear()
      cy.get('#product-7350029731557 input#weight')
        .type(weight) // add X g of bread

      cy.get('#product-7350029731557 .save-btn')
        .click()

      cy.get('.p-drawer-close-button')
        .click() // close the drawer
    }

    cy.visit('/')
    cy.get('.p-toast-close-button')
      .click() // close the toast message so it does not cover other elements


    // add first food item
    addBread(400)

    // Check that the food item was added
    cy.get('#snack1 .meal-item:nth-of-type(1)')
      .contains('.descr', '14% Bröd, Dahls Bageri')
    cy.get('#snack1 .meal-item:nth-of-type(1)')
      .contains('.food-kcal', '920 kcal / 400 g')

    // check that kcal got updated
    cy.get('#snack1 .meal-kcal')
      .should('have.text', '920 kcal')
    cy.get('.kcal-number').should('contain.text', '998')



    // Add second food item of same type with same weight
    addBread(400)


    // Check that the second food item was added
    cy.get('#snack1 .meal-item:nth-of-type(2)')
      .contains('.descr', '14% Bröd, Dahls Bageri')
    cy.get('#snack1 .meal-item:nth-of-type(2)')
      .contains('.food-kcal', '920 kcal / 400 g')

    // Check that kcal got updated
    cy.get('#snack1 .meal-kcal')
      .should('have.text', '1840 kcal')
    cy.get('.kcal-number').should('contain.text', '1918')

    // Add third food item of same type with different weight
    addBread(137.5)


    // Check that the third food item was added
    cy.get('#snack1 .meal-item:nth-of-type(3)')
      .contains('.descr', '14% Bröd, Dahls Bageri')
    cy.get('#snack1 .meal-item:nth-of-type(3)')
      .contains('.food-kcal', '316 kcal / 137.5 g')

    // Check that kcal got updated
    cy.get('#snack1 .meal-kcal')
      .should('have.text', '2156 kcal')
    cy.get('.kcal-number').should('contain.text', '2234')

    // Check that the weight of the previously added
    // food items did not change
    cy.get('#snack1 .meal-item:nth-of-type(1)')
      .contains('.food-kcal', '920 kcal / 400 g')
    cy.get('#snack1 .meal-item:nth-of-type(2)')
      .contains('.food-kcal', '920 kcal / 400 g')

  })
})