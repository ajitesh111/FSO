/* eslint-disable */

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import NewBlog from './NewBlog'

test('creation of new blog list', () => {
    const mockCreateBlog = jest.fn()

    const component = render(
        <NewBlog createBlog={mockCreateBlog} />
    )

    const inputTitle = component.container.querySelector('#title')
    fireEvent.change(inputTitle, {
        target: { value:'testing new blog creation' }
    })

    const inputAuthor = component.container.querySelector('#author')
    fireEvent.change(inputAuthor, {
        target: { value:'NewTester' }
    })

    const inputUrl = component.container.querySelector('#url')
    fireEvent.change(inputUrl, {
        target: { value:'https.//new/create/' }
    })

    const form = component.container.querySelector('form')
    
    fireEvent.submit(form)
// console.log(mockCreateBlog.mock.calls)
    expect(mockCreateBlog.mock.calls.length).toBe(1)
    expect(mockCreateBlog.mock.calls[0][0].title).toBe('testing new blog creation')
})