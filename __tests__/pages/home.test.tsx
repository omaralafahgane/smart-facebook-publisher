import { render, screen } from '@testing-library/react'
import HomePage from '@/app/page'

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(<HomePage />)
    const heading = screen.getByRole('heading', {
      name: /smart facebook publisher/i,
    })
    expect(heading).toBeInTheDocument()
  })

  it('displays navigation links', () => {
    render(<HomePage />)
    expect(screen.getByText(/دخول عبر Meta/i)).toBeInTheDocument()
  })
})
