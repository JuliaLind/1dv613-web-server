import { subDays, format } from 'date-fns'
describe('Req 1.6 - meals', function () {
  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')

  const meals = {
    yesterday: {
      breakfast: {
        date: yesterday,
        type: 'breakfast',
        foodItems: [
          {
            ean: '7310865018465', // Jordgubb Smultron Original Yoghurt 2%
            unit: 'g',
            weight: 300
          }
        ]
      },
      lunch: {
        date: yesterday,
        type: 'lunch',
        foodItems: [
          {
            ean: '5000112637939', // Coca-cola Zero Läsk Burk
            unit: 'g',
            weight: 300
          },
          {
            ean: '7290115203868', // Sojanuggets Fryst
            unit: 'g',
            weight: 300
          },
          {
            ean: '1220000450066', // Bbq Sås Honey Chipotle
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
            ean: '7311043006526', // Pan Pizza Vesuvio Fryst
            unit: 'g',
            weight: 500
          },
          {
            ean: '7310401053615', // Peoples Bulldog 3,5% Öl, Burk
            unit: 'g',
            weight: 300
          },
          {
            ean: '7310401053615', // Peoples Bulldog 3,5% Öl, Burk
            unit: 'g',
            weight: 300
          }
        ]
      }
    },
    today: {
      snack1: {
        date: today,
        type: 'snack1',
        foodItems: [
          {
            ean: '7310050005355', // Ice Caramel Salted
            unit: 'g',
            weight: 300
          }
        ]
      },
      lunch: {
        date: today,
        type: 'lunch',
        foodItems: [
          {
            ean: '7313940011566', // Kyckling Bröstfilé Fryst
            unit: 'g',
            weight: 200
          },
          {
            ean: '7311041012376', // Sparris i Bitar
            unit: 'g',
            weight: 150
          },
          {
            ean: '7310240073812', // Pommes Chateau Frysta
            unit: 'g',
            weight: 300
          }
        ]
      },
      dinner: {
        date: today,
        type: 'dinner',
        foodItems: [
          {
            ean: '7310240071870', // Mexicana X-tra Allt Pizza Fryst
            unit: 'g',
            weight: 400
          }
        ]
      },
      snack3: {
        type: 'snack3',
        date: today,
        foodItems: [{
          ean: '7350000550559', // Svartvinbär Fruktdryck
          unit: 'g',
          weight: 250
        },
        {
          ean: '7622202029998', // Choco Brownie Kaka
          unit: 'g',
          weight: 100
        }
        ]
      }
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

          cy.addMeal(meals.yesterday.breakfast, token)
          cy.addMeal(meals.yesterday.lunch, token)
          cy.addMeal(meals.yesterday.dinner, token)
          cy.addMeal(meals.today.snack1, token)
          cy.addMeal(meals.today.lunch, token)
          cy.addMeal(meals.today.dinner, token)
          cy.addMeal(meals.today.snack3, token)
        })
      })
  })

  afterEach(() => {
    cy.deleteMeals(token)
    cy.clearLocalStorage()
  })

  it('Req 1.6.1 - should show meals for today and yesterday', () => {

    /* TODAY */
    cy.visit('/')
    cy.get('.p-toast-close-button')
      .click() // close the toast message so it
    // does not cover other elements
    cy.get('#date').should('have.text', today)
    cy.contains('#snack1', /Ice Caramel Salted/i)
      .should('be.visible')

    cy.contains('#lunch', /Kyckling Bröstfilé Fryst/i)
      .scrollIntoView()
      .should('be.visible')

    cy.contains('#lunch', /Sparris i Bitar/i)
      .scrollIntoView()
      .should('be.visible')

    cy.contains('#lunch', /Pommes Chateau Frysta/i)
      .scrollIntoView()
      .should('be.visible')

    cy.contains('#dinner', /Mexicana X-tra Allt Pizza Fryst/i)
      .scrollIntoView()
      .should('be.visible')

    cy.contains('#snack3', /Svartvinbär Fruktdryck/i)
      .scrollIntoView()
      .should('be.visible')

    cy.contains('#snack3', /Choco Brownie Kaka/i)
      .scrollIntoView()
      .should('be.visible')

    cy.contains('#breakfast', /Jordgubb Smultron Original Yoghurt 2%/i)
      .should('not.exist') // yesterdays food

    /* YESTERDAY */
    cy.get('#prev')
      .scrollIntoView()
      .click()
    cy.get('#date').should('have.text', yesterday)

    cy.contains('#breakfast', /Jordgubb Smultron Original Yoghurt 2%/i)
      .scrollIntoView()
      .should('be.visible')

    cy.contains('#lunch', /Coca-cola Zero Läsk Burk/i)
      .scrollIntoView()
      .should('be.visible')

    cy.contains('#lunch', /Sojanuggets Fryst/i)
      .scrollIntoView()
      .should('be.visible')

    cy.contains('#lunch', /Bbq Sås Honey Chipotle/i)
      .scrollIntoView()
      .should('be.visible')

    cy.contains('#dinner', /Pan Pizza Vesuvio Fryst/i)
      .scrollIntoView()
      .should('be.visible')

    cy.get('#dinner .descr')
      .filter((_, el) => /Peoples Bulldog 3,5% Öl, Burk/i.test(el.textContent))
      .should('have.length', 2) // check that both beers are displayed
      .each(($el) => {
        cy.wrap($el).scrollIntoView().should('be.visible')
      })


    cy.contains('#snack1', /Ice Caramel Salted/i)
      .should('not.exist') // todays food

  })

  it('Req 1.6.2 - Log should display breakfast, snack, lunch, snack, dinner, snack', () => {
    cy.visit('/')

    cy.get('#meal-list .meal').eq(0)
      .find('h2')
      .invoke('text')
      .should('match', /breakfast/i)

    cy.get('#meal-list .meal').eq(1)
      .find('h2')
      .invoke('text')
      .should('match', /snack/i)

    cy.get('#meal-list .meal').eq(2)
      .find('h2')
      .invoke('text')
      .should('match', /lunch/i)

    cy.get('#meal-list .meal').eq(3)
      .find('h2')
      .invoke('text')
      .should('match', /snack/i)

    cy.get('#meal-list .meal').eq(4)
      .find('h2')
      .invoke('text')
      .should('match', /dinner/i)

    cy.get('#meal-list .meal').eq(5)
      .find('h2')
      .invoke('text')
      .should('match', /snack/i)
  })

})