import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import FormProfissional from '../components/profissionais/FormProfissional'
import * as api from '../services/api'

vi.mock('../services/api', () => ({
  profissionalService: {
    inserir: vi.fn(),
    alterar: vi.fn(),
  }
}))

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() }
}))

describe('FormProfissional', () => {
  const onSuccess = vi.fn()
  const onCancel = vi.fn()

  beforeEach(() => { vi.clearAllMocks() })

  it('renderiza campos obrigatórios', () => {
    render(<FormProfissional onSuccess={onSuccess} onCancel={onCancel} />)
    expect(screen.getByPlaceholderText(/Dr\. João Silva/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/31.*9999/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Rua A/i)).toBeInTheDocument()
  })

  it('exibe erros de validação ao submeter vazio', async () => {
    render(<FormProfissional onSuccess={onSuccess} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Cadastrar'))
    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
    })
  })

  it('chama inserir ao submeter formulário válido', async () => {
    api.profissionalService.inserir.mockResolvedValue({ id: 1, nome: 'Dr. João' })
    render(<FormProfissional onSuccess={onSuccess} onCancel={onCancel} />)

    fireEvent.change(screen.getByPlaceholderText(/Dr\. João Silva/i), { target: { value: 'Dr. João' } })
    fireEvent.change(screen.getByPlaceholderText(/31.*9999/i), { target: { value: '31999999999' } })
    fireEvent.change(screen.getByPlaceholderText(/Rua A/i), { target: { value: 'Rua B, 200' } })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'MEDICO' } })
    fireEvent.click(screen.getByText('Cadastrar'))

    await waitFor(() => {
      expect(api.profissionalService.inserir).toHaveBeenCalledWith(
        expect.objectContaining({ nome: 'Dr. João', categoria: 'MEDICO' })
      )
    })
  })

  it('chama onCancel ao clicar em Cancelar', () => {
    render(<FormProfissional onSuccess={onSuccess} onCancel={onCancel} />)
    fireEvent.click(screen.getByText('Cancelar'))
    expect(onCancel).toHaveBeenCalled()
  })
})
