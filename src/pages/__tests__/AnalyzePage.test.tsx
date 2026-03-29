import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AnalyzePage from '../AnalyzePage'

test('desabilita o botão quando textarea está vazia', async () => {
  render(<AnalyzePage />)
  const btn = screen.getByRole('button', { name: /analisar/i })
  expect(btn).toBeDisabled()

  const textarea = screen.getByLabelText(/texto do contrato/i)
  await userEvent.type(textarea, 'Contrato de teste')
  expect(btn).toBeEnabled()
})

