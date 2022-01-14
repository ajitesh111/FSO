/* eslint-disable */

//requires the frontend and backend to be working

//arrow functions are NOT used in cypress as tests reuires 'this'
describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')

        const user = {
            username: 'testUser',
            name: 'tester',
            password: 'salahur'
        }

        cy.request('POST', 'http://localhost:3003/api/users/', user)

        cy.visit('http://localhost:3000')
    })

    it('login form is shown', function() {
        cy.get('form').contains('login')
    })

    describe('Login', function() {
        it('succeeds with correct credentials', function() {
            cy.get('#username').type('testUser')
            cy.get('#password').type('salahur')
            cy.get('#loginButton').click()

            cy.contains('Welcome tester')
        })

        it('fails with wrong credentials', function() {
            cy.get('#username').type('testUser')
            cy.get('#password').type('wrogn')
            cy.get('#loginButton').click()

            cy.get('.error').contains('Wrong credentials')
            cy.get('.error').should('have.css', 'background-color', 'rgb(255, 0, 0)')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {
            //defined in './suppor/commands'
            cy.login({ username: 'testUser', password: 'salahur' })
        })

        it('A blog can be created', function() {
            cy.contains('a new bloglist entry')

            cy.get('#title').type('A test blog')
            cy.get('#author').type('tester')
            cy.get('#url').type('http://test/add/blog/')

            cy.get('#save').click()
            cy.contains('A test blog')
        })

        describe('A blog exists', function() {
            beforeEach(function() {
                cy.createBlog({     //'./support/commands'
                    title: 'A test blog',
                    author: 'tester',
                    url: 'http://test/add/blog/'
                })
            })
            
            it('Blog can be liked', function() {
                cy.contains('A test blog').parent().find('#view').click()

                cy.contains('A test blog').parent().find('#like').click()
                cy.contains('1')
            })

            it('Owner can delete blog', function() {
                cy.contains('A test blog').parent().find('#view').click()

                cy.contains('A test blog').parent().find('#remove').click()

                cy.get('html').should('not.contain', 'A test blog')
            })
        })

        describe('multiple blogs have been created', function() {
            beforeEach(function() {
                cy.createBlog({title: 'A test blog', author: 'tester', url: 'http://ff'})
                cy.createBlog({title: 'A blog', author: 'yoloer', url: 'http://ff/sake'})
                cy.createBlog({title: 'wtf?', author: 'Ape', url: 'ape/link'})
            })

            it.only('blogs are sorted', function() {
                cy.contains('A test blog').parent().find('#view').click()
                cy.contains('A blog').parent().find('#view').click()
                cy.contains('wtf?').parent().find('#view').click()

                cy.contains('A test blog').parent().find('#like').as('like1')
                cy.contains('A blog').parent().find('#like').as('like2')
                cy.contains('wtf?').parent().find('#like').as('like3')

                cy.get('@like1').click()
                cy.wait(200)
                cy.get('@like2').click()
                cy.wait(200)
                cy.get('@like1').click()
                cy.wait(200)
                cy.get('@like3').click()
                cy.wait(200)
                cy.get('@like2').click()
                cy.wait(200)
                cy.get('@like1').click()
                cy.wait(200)

                cy.get('.blog').then(blogs => {
                    cy.wrap(blogs[0]).contains('3')
                    cy.wrap(blogs[1]).contains('2')
                    cy.wrap(blogs[2]).contains('1')
                })
            })
        })
    })
})