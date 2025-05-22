// import { format, subYears } from 'date-fns'

// describe('Req 1.10 - delete account', function () {
//   let token
//   const age = 18
//   const birthDate = format(subYears(new Date(), age), 'yyyy-MM-dd')

//   const credentials = {
//     email: 'other-user@email.com',
//     password: 'otheruser',
//     birthDate
//   }

//   const today = format(new Date(), 'yyyy-MM-dd')
//   const breakfast = {
//     date: today,
//     type: 'breakfast',
//     foodItems: [
//       {
//         ean: '7310865018465', // Jordgubb Smultron Original Yoghurt 2%
//         unit: 'g',
//         weight: 100
//       }
//     ]
//   }

//   beforeEach(() => {
//     cy.createUser(credentials)
//       .then(() => {
//         return cy.login({
//           email: credentials.email,
//           password: credentials.password
//         })
//       })
//       .then((tokens) => {
//         token = tokens.accessToken
//       })
//       .then((token) => {
//         cy.addMeal(breakfast, token)

//         cy.fixture('profile.json')
//           .then((profile) => {
//             return cy.addProfileData({
//               ...profile,
//               age,
//               effectiveDate: format(new Date(), 'yyyy-MM-dd'),
//             }, token)
//           })
//       })
//   })

//   afterEach(() => {
//     cy.deleteUserData(credentials)
//     cy.deleteUser(credentials)

//     cy.clearLocalStorage()
//   })

//   it('Req 1.10.1 - Logged in user who filles out correct email and password should be able to delete account', () => {
//     cy.intercept('DELETE', `${Cypress.env('VITE_DATA_URL')}/user`).as('deleteUserData')
//     cy.intercept('DELETE', `${Cypress.env('VITE_AUTH_URL')}/user`).as('deleteAccount')
//     cy.intercept('DELETE', `${Cypress.env('VITE_DATA_URL')}/meals`).as('deleteMeals')

//     cy.visit('/')

//     cy.get('.p-toast-close-button')
//       .click() // close the toast message so it does not cover other elements

//     cy.get('.pi-user').click()
//     cy.get('#delete-form #email').type(credentials.email)
//     cy.get('#delete-form #password').type(credentials.password)
//     cy.get('#delete-form .p-button-danger').click()
//     cy.get('.p-toast-message-content').should('contain', 'Account deleted')
//     cy.get('.p-toast-message-content').should('have.class', 'p-toast-message-success')
//     cy.get('.pi-user').should('not.exist')
//     cy.url().should('not.include', '/')
//     cy.url().should('include', '/login')

//     cy.wait('@deleteAccount').then((interception) => {
//       expect(interception.response.statusCode).to.equal(204)
//     })

//     cy.wait('@deleteUserData').then((interception) => {
//       expect(interception.response.statusCode).to.equal(204)
//     })

//     cy.wait('@deleteMeals').then((interception) => {
//       expect(interception.response.statusCode).to.equal(204)
//     })

//     cy.intercept('POST', `**/login`).as('loginUser')

//     cy.get('#email').type(credentials.email)
//     cy.get('input[type="password"]').eq(0).type(credentials.password)

//     cy.get('form').submit()
//     cy.url().should('include', '/')
//     cy.wait('@loginUser').then((interception) => {
//       assert.equal(interception.response.statusCode, 404)
//     })
//     cy.contains('.p-toast-summary', 'Welcome')
//       .should('be.visible')
//   })
// })