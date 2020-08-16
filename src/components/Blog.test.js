import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'
//import Togglable from './Togglable'
import SaveForm from './SaveForm'

describe('blogin renderöinti', () => {
  let user
  let blog

  beforeEach(() => {
    user = {
      kayttajatunnus: 'hessu',
      nimi: 'Hessu Hopo',
      salasanaHash: 'hessuhoo'
    }

    blog = {
      user: user,
      author: 'Aku Ankka',
      likes: 0,
      title: 'Akulla on asiaa',
      url: 'akuankka.al',
    }

  })

  test('blogin näyttävä komponentti näyttää oletusarvoisesti vain titlen ja authorin', () => {
    const component = render(
      <Blog blog={blog} user={user}/>
    )
    const authorAndTitle = component.container.querySelector('#authorAndTitle')
    expect(authorAndTitle).toHaveTextContent('Aku Ankka')
    expect(authorAndTitle).toHaveTextContent('Akulla on asiaa')
    expect(authorAndTitle).toBeVisible()

    const button = component.container.querySelector('#nayta')
    expect(button).toBeVisible()
    //console.log(button)
    //component.debug()

    const url = component.container.querySelector('#url')
    expect(url).not.toBeVisible()
    const tykkayksia = component.container.querySelector('#tykkayksia')
    expect(tykkayksia).not.toBeVisible()

    const poistaNappi = component.container.querySelector('#poistaBlogiNappi')
    expect(poistaNappi).not.toBeVisible()
    const suljeNappi = component.container.querySelector('#suljeNappi')
    expect(suljeNappi).not.toBeVisible()

  })

  test('blogin näyttävä komponentti näyttää myös url:n ja tykkäysten määrän, kun Näytä-nappia on painettu', () => {
    const component = render(
      <Blog blog={blog} user={user}/>
    )
    const naytaNappi = component.container.querySelector('#nayta')
    //console.log(prettyDOM(naytaNappi))

    fireEvent.click(naytaNappi)

    const div = component.container.querySelector('#showWhenVisible')
    expect(div).toBeVisible()
  })

  test('kun Tykkää-nappia painetaan kahdesti, komponentin propsina saamaa tapahtumankäsittelijäfunktiota kutsutaan kaksi kertaa', () => {
    const mockHandler = jest.fn()

    const component = render(
      <Blog blog={blog} user={user} updateBlog={mockHandler}/>
    )

    const tykkaaNappi = component.container.querySelector('#tykkaa')
    //console.log(prettyDOM(tykkaaNappi))
    fireEvent.click(tykkaaNappi)
    fireEvent.click(tykkaaNappi)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

describe('SaveForm', () => {
  test(' lomake kutsuu propseina saamaansa takaisinkutsufunktiota oikeilla tiedoilla siinä vaiheessa kun blogi luodaan', () => {

    const mockHandler = jest.fn()

    const component = render(

      <SaveForm addBlog={mockHandler} />

    )
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const uri = component.container.querySelector('#uri')
    const lomake = component.container.querySelector('#lomake')

    fireEvent.change(title, {
      target: { value: 'Mummon muisteloja' }
    })

    fireEvent.change(author, {
      target: { value: 'Mummo Ankka' }
    })

    fireEvent.change(uri, {
      target: { value: 'muisteloja.al' }
    })

    fireEvent.submit(lomake)
    const ensArgumentti = mockHandler.mock.calls[0][0]
    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(ensArgumentti).toEqual({ 'author': 'Mummo Ankka', 'title': 'Mummon muisteloja', 'url': 'muisteloja.al' })
    expect(mockHandler.mock.calls[0][1]).toBe('Mummo Ankka')
    expect(mockHandler.mock.calls[0][2]).toBe('Mummon muisteloja')
  })
})