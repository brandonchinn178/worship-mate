import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderUI } from '~jest-utils'

import { SearchBar } from './SearchBar'

it('allows typing and submission', async () => {
  const onSubmit = jest.fn()
  renderUI(<SearchBar onSubmit={onSubmit} />)

  const input = screen.getByRole('textbox')
  userEvent.type(input, 'hello!')

  const button = screen.getByRole('button')
  userEvent.click(button)

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled()
  })
  expect(onSubmit.mock.calls[0][0]).toBe('hello!')
})

it('allows submission via Enter', async () => {
  const onSubmit = jest.fn()
  renderUI(<SearchBar onSubmit={onSubmit} />)

  const input = screen.getByRole('textbox')
  userEvent.type(input, 'hello!{enter}')

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled()
  })
})

it('sets initial input', async () => {
  const onSubmit = jest.fn()
  renderUI(<SearchBar initial="initial" onSubmit={onSubmit} />)

  const button = screen.getByRole('button')
  userEvent.click(button)

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled()
  })
  expect(onSubmit.mock.calls[0][0]).toBe('initial')
})
