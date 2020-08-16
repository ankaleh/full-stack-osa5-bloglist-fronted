

beforeEach(function() {
  cy.request('POST', 'http://localhost:3001/api/testing/reset')
  const user = {
    kayttajatunnus: 'aku',
    nimi: 'Aku Ankka',
    salasanaHash: 'aksu'
  }
  cy.request('POST', 'http://localhost:3001/api/users', user)

  cy.visit('http://localhost:3000')

})

describe('Blog app', function() {
  it('login form is shown', function() {
    cy.contains('Kirjautumislomake').click()
    cy.contains('Kirjaudu sisään alla olevalla lomakkeella')
  })
})

describe('Login',function() {
  it('succeeds with correct credentials', function() {
    cy.contains('Kirjautumislomake').click()
    cy.contains('Kirjaudu sisään alla olevalla lomakkeella')
    cy.get('input:first').type('aku')
    cy.get('input:last').type('aksu')
    cy.get('#kirjaudu').click()

    cy.contains('Aku Ankka kirjautuneena palveluun.')
  })

  it('fails with wrong credentials', function() {
    cy.contains('Kirjautumislomake').click()
    cy.contains('Kirjaudu sisään alla olevalla lomakkeella')
    cy.get('input:first').type('akuankka')
    cy.get('input:last').type('aksu')
    cy.get('#kirjaudu').click()

    cy.get('.error').contains('Kirjautuminen ei onnistunut. Tarkista käyttäjätunnus ja salasana.')
    cy.get('html').should('not.contain', 'Aku Ankka kirjautuneena palveluun.')

  })
})

describe('When logged in', function() {
  beforeEach(function() {
    cy.contains('Kirjautumislomake').click()
    cy.contains('Kirjaudu sisään alla olevalla lomakkeella')
    cy.get('input:first').type('aku')
    cy.get('input:last').type('aksu')
    cy.get('#kirjaudu').click()
  })

  it('A blog can be created', function() {
    cy.contains('Lomake, jolla voit tallentaa uuden blogin').click()
    const blog = {
      title: 'Mummon muisteloja',
      author: 'Mummo Ankka',
      url: 'muisteloja.al'
    }
    cy.get('#title').type(blog.title)
    cy.get('#author').type(blog.author)
    cy.get('#uri').type(blog.url)

    cy.get('#tallenna').click()

    cy.contains(`${blog.author}: ${blog.title}`)

  })
})

describe.only('blogs', function() {
  it('blogs are odered right', function() {

    cy.contains('Kirjautumislomake').click()
    cy.contains('Kirjaudu sisään alla olevalla lomakkeella')
    cy.get('input:first').type('aku')
    cy.get('input:last').type('aksu')
    cy.get('#kirjaudu').click()

    cy.contains('Lomake, jolla voit tallentaa uuden blogin').click()
    const blog1 = {
      title: 'Mummon muisteloja',
      author: 'Mummo Ankka',
      url: 'muisteloja.al'
    }
    cy.get('#title').type(blog1.title)
    cy.get('#author').type(blog1.author)
    cy.get('#uri').type(blog1.url)

    cy.get('#tallenna').click()

    cy.get('.message').contains(`Uusi blogi lisättiin: ${blog1.author}, ${blog1.title}.`)
    cy.contains('Mummo Ankka: Mummon muisteloja')

    const blog2 = {
      title: 'Raha ropisee',
      author: 'Roope Ankka',
      url: 'roopeankka.al'
    }
    cy.contains('Lomake, jolla voit tallentaa uuden blogin').click()
    cy.get('#title').type(blog2.title)
    cy.get('#author').type(blog2.author)
    cy.get('#uri').type(blog2.url)
    cy.get('#tallenna').click()

    cy.contains(`${blog1.author}: ${blog1.title}`)
    cy.contains(`${blog2.author}: ${blog2.title}`)

    //avataan Roopen blogin tiedot:
    cy.get('button').then(buttons => {
      cy.wrap(buttons[5]).click()
    })

    //painetaan Roopen blogin Tykkää-nappia:
    cy.get('button').then(buttons => {
      cy.wrap(buttons[6]).click()
    })

    cy.get('#authorAndTitle').then(t => {
      cy.wrap(t[0]).contains('Roope Ankka: Raha ropisee')
      cy.wrap(t[1]).contains('Mummo Ankka: Mummon muisteloja')
    })
  })
})

describe('yksittäisen blogin käsittely', function() {
  beforeEach(function() {
    cy.contains('Kirjautumislomake').click()
    cy.contains('Kirjaudu sisään alla olevalla lomakkeella')
    cy.get('input:first').type('aku')
    cy.get('input:last').type('aksu')
    cy.get('#kirjaudu').click()

    cy.contains('Lomake, jolla voit tallentaa uuden blogin').click()
    const blog = {
      title: 'Mummon muisteloja',
      author: 'Mummo Ankka',
      url: 'muisteloja.al'
    }
    cy.get('#title').type(blog.title)
    cy.get('#author').type(blog.author)
    cy.get('#uri').type(blog.url)

    cy.get('#tallenna').click()

    cy.contains('Mummo Ankka: Mummon muisteloja')

  })

  it('a blog can be liked', function() {

    cy.contains('Näytä blogin tiedot').click()

    cy.contains('Tykkää').click()
    cy.get('#tykkayksia')
      .should('contain', 'tykkäyksiä: 1')
  })

  it('a blog can be deleted', function() {
    cy.contains('Näytä blogin tiedot').click()
    cy.contains('Poista blogi').click()

    cy.get('html').should('not.contain', 'Mummo Ankka: Mummon muisteloja')

  })

})