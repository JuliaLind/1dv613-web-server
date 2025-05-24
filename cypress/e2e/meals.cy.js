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
            weight: 100
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
            weight: 250
          },
          {
            ean: '7290115203868', // Sojanuggets Fryst
            unit: 'g',
            weight: 100
          },
          {
            ean: '1220000450066', // Bbq Sås Honey Chipotle
            unit: 'g',
            weight: 50
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
            weight: 200
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
            weight: 100
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
        date: today,
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
        date: today,
        foodItems: [{
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


    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('#lunch', /Kyckling Bröstfilé Fryst/i)
      .scrollIntoView()
      .should('be.visible')

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('#lunch', /Sparris i Bitar/i)
      .scrollIntoView()
      .should('be.visible')

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('#lunch', /Pommes Chateau Frysta/i)
      .scrollIntoView()
      .should('be.visible')

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('#dinner', /Mexicana X-tra Allt Pizza Fryst/i)
      .scrollIntoView()
      .should('be.visible')

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('#snack3', /Svartvinbär Fruktdryck/i)
      .scrollIntoView()
      .should('be.visible')

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('#snack3', /Choco Brownie Kaka/i)
      .scrollIntoView()
      .should('be.visible')

    cy.contains('#breakfast', /Jordgubb Smultron Original Yoghurt 2%/i)
      .should('not.exist') // yesterdays food

    /* YESTERDAY */
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('#prev')
      .scrollIntoView()
      .click()

    cy.get('#date').should('have.text', yesterday)

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('#breakfast', /Jordgubb Smultron Original Yoghurt 2%/i)
      .scrollIntoView()
      .should('be.visible')

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('#lunch', /Coca-cola Zero Läsk Burk/i)
      .scrollIntoView()
      .should('be.visible')

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('#lunch', /Sojanuggets Fryst/i)
      .scrollIntoView()
      .should('be.visible')

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('#lunch', /Bbq Sås Honey Chipotle/i)
      .scrollIntoView()
      .should('be.visible')

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.contains('#dinner', /Pan Pizza Vesuvio Fryst/i)
      .scrollIntoView()
      .should('be.visible')


    cy.get('#dinner .descr')
      .filter((_, el) => /Peoples Bulldog 3,5% Öl, Burk/i.test(el.textContent))
      .should('have.length', 2) // check that both beers are displayed
      .each(($el) => {
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.wrap($el).scrollIntoView().should('be.visible')
      })


    cy.contains('#snack1', /Ice Caramel Salted/i)
      .should('not.exist') // todays food

  })

  it('Req 1.6.2 - Log should display breakfast, snack, lunch, snack, dinner, snack', () => {
    cy.visit('/')

    cy.get('.meal:first-of-type h2')
      .should('have.text', 'breakfast')

    cy.get('.meal:nth-of-type(2) h2')
      .should('have.text', 'snack')

    cy.get('.meal:nth-of-type(3) h2')
      .should('have.text', 'lunch')

    cy.get('.meal:nth-of-type(4) h2')
      .should('have.text', 'snack')

    cy.get('.meal:nth-of-type(5) h2')
      .should('have.text', 'dinner')

    cy.get('.meal:nth-of-type(6) h2')
      .should('have.text', 'snack')
  })

  it('Req 1.6.3 - should contain kcal for each meal and total kcal for the day', () => {
    cy.visit('/')

    cy.get('.p-toast-close-button')
      .click() // close the toast message so it
    // does not cover other elements

    cy.get('.kcal-number').should('contain.text', '1045')

    cy.get('#breakfast .meal-kcal')
      .should('have.text', '0 kcal')

    cy.get('#snack1 .meal-kcal')
      .should('have.text', '73 kcal')

    cy.get('#lunch .meal-kcal')
      .should('have.text', '302 kcal')

    cy.get('#snack2 .meal-kcal')
      .should('have.text', '0 kcal')

    cy.get('#dinner .meal-kcal')
      .should('have.text', '390 kcal')

    cy.get('#snack3 .meal-kcal')
      .should('have.text', '280 kcal')

    /* check the values are updated when changing date */
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('#prev')
      .scrollIntoView()
      .click()

    cy.get('.kcal-number').should('contain.text', '1067')
    cy.get('#breakfast .meal-kcal')
      .should('have.text', '78 kcal')

    cy.get('#snack1 .meal-kcal')
      .should('have.text', '0 kcal')
  })

  describe('Req 1.6.4 - users with completed profile should see daily kcal goal and suggested kcal for meals without food items', () => {
    beforeEach(() => {
      cy.fixture('profile.json').then((profile) => {
        profile.age = 18
        profile.effectiveDate = format(new Date(), 'yyyy-MM-dd')
        cy.addProfileData(profile, token)
      })
    })

    afterEach(() => {
      cy.deleteProfileData(token)
    })

    it('breakfast and snack2 should contain suggested kcal, the other 4 meals should not', () => {
      cy.visit('/')

      cy.get('.daily-budget')
        .should('contain', '2281')

      cy.contains('#breakfast p.suggested', 'Suggested')
        .should('exist')

      cy.get('#breakfast p.suggested')
        .should('contain', 'Suggested: 824 kcal')

      cy.contains('#snack1 p.suggested', 'Suggested')
        .should('not.exist')

      cy.contains('#lunch p.suggested', 'Suggested')
        .should('not.exist')

      cy.contains('#snack2 p.suggested', 'Suggested')
        .should('exist')

      cy.get('#snack2 p.suggested')
        .should('contain', 'Suggested: 412 kcal')

      cy.contains('#dinner p.suggested', 'Suggested')
        .should('not.exist')

      cy.contains('#snack3 p.suggested', 'Suggested')
        .should('not.exist')

    })
  })
})