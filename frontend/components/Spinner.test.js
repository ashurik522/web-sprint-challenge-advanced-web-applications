// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react'
import { render, screen } from '@testing-library/react'
import Spinner from './Spinner'
import LoginForm from './LoginForm'
import userEvent from '@testing-library/user-event'


test('renders without error', () =>{
  render(<Spinner on={false}/>) 
})

test('renders spinner while true, remove spinner while false', () =>{
  const { rerender } = render(<Spinner on={true}/>) 
  let spinnerMessage = screen.getByText(/please wait/i)
  expect(spinnerMessage).not.toBeNull()

  rerender(<Spinner on={false}/>)
  spinnerMessage = screen.queryByText(/please wait/i)
  expect(spinnerMessage).toBeNull()
})

