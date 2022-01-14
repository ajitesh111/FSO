/* eslint-disable */

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './BLog'

test('renders only title', () => {
    const blog = {
        title: 'test blog',
        author: 'tester',
        url: 'react/render/test',
    }
    
    //render(), renders the components in a format that is suitable for tests without rendering them to the DOM
    const component = render(
        <Blog blog={blog} />
        )
        
    //render() returns an HTML DOM
    expect(component.container).toHaveTextContent('test blog')
    expect(component.container).not.toHaveTextContent('tester')
    expect(component.container).not.toHaveTextContent('react/render/test')
})

test('renders everything when expanded', () => {
    const blog = {
        title: 'test blog',
        author: 'tester',
        url: 'react/render/test',
    }

    const component = render(
        <Blog blog={blog} />
    )

    //returns the first matching DOM element
    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent('test blog')
    expect(component.container).toHaveTextContent('tester')
    expect(component.container).toHaveTextContent('react/render/test')
})

test('like button is clicked twice', () => {
    const blog = {
        title: 'test blog',
        author: 'tester',
        url: 'react/render/test',
        user: '6afe23kj5h43kj5'
    }

    //adds '.mock' property which stores data about how the function has been called and what the function returned is kept
    const mockHandler = jest.fn()

    const component = render(
        <Blog blog={blog} incrementLike={mockHandler} />
    )

    const buttonView = component.getByText('view')
    fireEvent.click(buttonView)

    const buttonLike = component.getByText('like')
    fireEvent.click(buttonLike)
    fireEvent.click(buttonLike)

    expect(mockHandler.mock.calls).toHaveLength(2)
})