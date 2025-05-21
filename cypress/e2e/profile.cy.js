import { differenceInYears, addDays, subDays, format  } from 'date-fns'

describe('Req 1.5 - personal plan', function () {
  let credentials
  let token
  let age

  before(function () {
    cy.fixture('user.json').then((user) => {
      credentials = {
        email: user.email,
        password: user.password
      }

      age = differenceInYears(new Date(), new Date(user.birthDate))
    })
  })
  beforeEach(() => {
    cy.login(credentials).then((tokens) => {
      token = tokens.accessToken
    })

  })

  afterEach(() => {
    cy.deleteProfileData(token)
    cy.clearLocalStorage()
  })

  /**
   * Calculates the date that is the given number of days from today. Used to dynamically calculate target date in the tests.
   *
   * @param {number} days - the number of days
   * @returns {string} the date in 'yyyy-MM-dd' format
   */
  function calcDate(days) {
    const date = addDays(new Date(), days)
    return format(date, 'yyyy-MM-dd')
  }

  it('Req 1.5.1 - Fill out user data and get suggested kcal/day and estimated goal date', function () {
    cy.intercept('POST', `**/user*`).as('addProfileData')
    cy.visit('/')
    cy.get('.pi-user')
      .closest('.overlay-container')
      .find('.p-badge-warn')
      .should('be.visible')

    // page 1
    cy.get('.pi-user').click()
    cy.get('#profile').should('exist')

    cy.get('input[type="radio"][name="gender"]').check('m')

    cy.get('#height').type('175')
    cy.get('#current-weight').type('78.8')

    cy.get('#target-weight').type('73')
    cy.get('[data-id="next-step-1"]').click()


    // page 2
    cy.get('input[type="radio"][name="activityLevel"]').check('moderate')
    cy.get('input[type="radio"][name="weeklyChange"]').check('0.5')
    cy.get('[data-id="next-step-2"]').click()


    // kcal/day
    cy.get('.kcal').should('contain', '2103')

    // target date
    cy.get('.target-date').should('contain', calcDate(81))
    cy.contains('Save').click()

    // profile should close automatically
    cy.get('#profile').should('not.exist')
    cy.contains('.p-toast-summary', 'Profile updated')
      .should('be.visible')
      .closest('.p-toast-message')
      .should('have.class', 'p-toast-message-success')

      // badge showing that user has not filled out their data should be removed
    cy.get('.pi-user')
      .closest('.overlay-container')
      .find('.p-badge-warn')
      .should('not.exist')

      // should have been successfully added to the server database
    cy.wait('@addProfileData').then((interception) => {
      assert.equal(interception.response.statusCode, 201)
    })
  })

  describe('User has already filled out their data', function () {
    beforeEach(() => {
      cy.fixture('profile.json').then((profile) => {
        profile.age = age
        profile.effectiveDate = new Date().toISOString()
        cy.addProfileData(profile, token)
      })
    })

    afterEach(() => {
      cy.deleteProfileData(token)
    })

    it('Req 1.5.2 - Update current user data and get updated kcal/day and target date', function () {
      cy.intercept('PUT', `**/user*`).as('updProfileData')
      cy.visit('/')
      cy.get('.pi-user')
        .closest('.overlay-container')
        .find('.p-badge-warn')
        .should('not.exist')

      cy.get('.pi-user').click()

      // check initial data
      cy.get('[data-id="next-step-1"]').click()
      cy.get('[data-id="next-step-2"]').click()
      cy.get('.kcal').should('contain', '2164')
      cy.get('.target-date').should('contain', calcDate(336))

      // go back to page 1
      cy.get('[data-id="prev-step-3"]').click()
      cy.get('[data-id="prev-step-2"]').click()

      // page 1
      cy.get('#current-weight')
      .find('input')
      .clear()

      cy.get('#current-weight').type('78.8')
      cy.get('[data-id="next-step-1"]').click()


      // page 2
      cy.get('input[type="radio"][name="activityLevel"]').check('moderate')
      cy.get('input[type="radio"][name="weeklyChange"]').check('0.5')
      cy.get('[data-id="next-step-2"]').click()

      // page 3
      cy.get('.kcal').should('contain', '2103')
      cy.get('.target-date').should('contain', calcDate(81))
      cy.contains('Save').click()

      cy.contains('.p-toast-summary', 'Profile updated')
        .should('be.visible')
        .closest('.p-toast-message')
        .should('have.class', 'p-toast-message-success')

      cy.wait('@updProfileData').then((interception) => {
        assert.equal(interception.response.statusCode, 204)
      })
    })

    it('Req 1.5.3 - Should not be able to update if a field is missing', function () {
      cy.intercept('PUT', `**/user*`).as('updProfileData')
      cy.intercept('POST', `**/user*`).as('addProfileData')
      cy.visit('/')


      cy.get('.pi-user').click()


      // page 1
      cy.get('#height')
      .find('input')
      .clear()

      cy.get('#current-weight')
      .find('input')
      .clear()

      cy.get('#current-weight').type('78.8')
      cy.get('[data-id="next-step-1"]').click()
      cy.get('[data-id="next-step-2"]').click()

      cy.contains('Save').click()

      cy.contains('.p-toast-summary', 'All fields are mandatory')
        .should('be.visible')
        .closest('.p-toast-message')
        .should('have.class', 'p-toast-message-error')

      // should not send bad request to server
      cy.get('@updProfileData.all').should('have.length', 0)
      cy.get('@addProfileData.all').should('have.length', 0)
    })
  })

  it('Req 1.5.4 - User has no previous data, toast with message should be displayed, and a badge on the profile icon', function () {
    cy.visit('/')

    cy.contains('.p-toast-summary', 'Complete your profile')
    .should('be.visible')
    .closest('.p-toast-message')
    .should('have.class', 'p-toast-message-info')

    cy.get('.pi-user')
      .closest('.overlay-container')
    .find('.p-badge-warn')
    .should('be.visible')
  })

  describe('Req 1.5.5 - User should get reminded daily to update their data', function () {
    beforeEach(() => {
      cy.fixture('profile.json').then((profile) => {
        profile.age = age
        profile.effectiveDate = subDays(new Date(), 1).toISOString() // yesterdays date
        cy.addProfileData(profile, token)
      })
    })

    afterEach(() => {
      cy.deleteProfileData(token)
    })

    it('', function () {
      cy.visit('/')
      cy.get('.pi-user')
        .closest('.overlay-container')
        .find('.p-badge-warn')
        .should('be.visible')
      cy.contains('.p-toast-summary', 'Update your weight')
        .should('be.visible')
        .closest('.p-toast-message')
        .should('have.class', 'p-toast-message-info')
    })
  })

  // 1.5.6 - is tested in the data-server repo

  describe('Req 1.5.7 - User should get suggestion on nutrients in g per day', function () {
    beforeEach(() => {
      cy.fixture('profile.json').then((profile) => {
        profile.age = age
        profile.effectiveDate = format(new Date(), 'yyyy-MM-dd')
        cy.addProfileData(profile, token)
      })
    })

    afterEach(() => {
      cy.deleteProfileData(token)
    })

    it('should show the correct values for a moderate activity level', function () {
      cy.visit('/')
      cy.contains('button', 'Stats')
        .click()

      cy.get('th:nth-of-type(2)').should('contain', 'Value (g)')
      cy.get('th:nth-of-type(3)').should('contain', 'Recommended (g)')
    })

  })

})