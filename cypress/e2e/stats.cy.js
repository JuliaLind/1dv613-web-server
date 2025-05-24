import { format, subDays } from 'date-fns'

describe('Req 1.12 - statistics and visualization', () => {
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')


  const meals = {
    snack1: {
      date: yesterday,
      type: 'snack1',
      foodItems: [
        {
          ean: '7310050005355', // Ice Caramel Salted
          unit: 'g',
          weight: 100
        }
      ]
    },
    lunch: {
      date: yesterday,
      type: 'lunch',
      foodItems: [
        {
          ean: '7313940011566', // Kyckling Bröstfilé Fryst
          unit: 'g',
          weight: 150
        },
        {
          ean: '7311041012376', // Sparris i Bitar
          unit: 'g',
          weight: 150
        },
        {
          ean: '7310240073812', // Pommes Chateau Frysta
          unit: 'g',
          weight: 100
        }
      ]
    },
    dinner: {
      date: yesterday,
      type: 'dinner',
      foodItems: [
        {
          ean: '7310240071870', // Mexicana X-tra Allt Pizza Fryst
          unit: 'g',
          weight: 150
        }
      ]
    },
    snack3: {
      type: 'snack3',
      date: yesterday,
      foodItems: [
        {
          ean: '7350000550559', // Svartvinbär Fruktdryck
          unit: 'g',
          weight: 100
        },
        {
          ean: '7622202029998', // Choco Brownie Kaka
          unit: 'g',
          weight: 50
        }
      ]
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
        cy.login(credentials).then((tokens) => {
          token = tokens.accessToken

          cy.addMeal(meals.snack1, token)
          cy.addMeal(meals.lunch, token)
          cy.addMeal(meals.dinner, token)
          cy.addMeal(meals.snack3, token)
        })
      })
  })

  afterEach(() => {
    cy.deleteMeals(token)
    cy.clearLocalStorage()
  })

  it('Req 1.12.1 - should display intake of the different nutrients in the selected day', () => {
    cy.visit('/')
    cy.get('.p-toast-close-button')
      .click() // close the toast message so it
    // does not cover other elements

    cy.get('#prev')
      .click() // go to yesterday

    cy.contains('button', 'Stats').click()

    cy.get('th')
      .should('have.length', 2)
    cy.get('th:nth-of-type(1)')
      .should('contain', 'Nutrient')
    cy.get('th:nth-of-type(2)')
      .should('contain', 'Value (g)')

    cy.contains('td', 'protein')
      .next() // get the td to the right
      .should('have.text', '61')

    cy.contains('td', 'fat')
      .next()
      .should('have.text', '42')

    cy.contains('td', 'saturated fat')
      .next()
      .should('have.text', '19')

    cy.contains('td', 'carbohydrates')
      .next()
      .should('have.text', '103')

    cy.contains('td', 'sugars')
      .next()
      .should('have.text', '43')

    cy.contains('td', 'fiber')
      .next()
      .should('have.text', '5')

    cy.contains('td', 'salt')
      .next()
      .should('have.text', '4')
  })
})