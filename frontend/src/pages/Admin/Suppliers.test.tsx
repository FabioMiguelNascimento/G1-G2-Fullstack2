import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockToast, mockUseFetchSuppliers, mockUseSupplierMutations } from '../../__mocks__/suppliers';
import Suppliers from './Suppliers';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@/components/supplier-products-modal', () => ({
  __esModule: true,
  default: ({ open }: any) => 
    open ? <div data-testid="supplier-products-modal">Produtos do Fornecedor</div> : null,
}));

const mockSuppliers = [
  {
    id: '1',
    name: 'Fornecedor A',
    email: 'fornecedorA@example.com',
    phone: '123456789',
    address: 'Rua A, 123',
  },
  {
    id: '2',
    name: 'Fornecedor B',
    email: 'fornecedorB@example.com',
    phone: '987654321',
    address: 'Rua B, 456',
  },
];

const mockMutations = {
  create: { mutate: jest.fn() },
  update: { mutate: jest.fn() },
  remove: { mutate: jest.fn() },
};

describe('Suppliers', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseFetchSuppliers.mockReturnValue({
      suppliers: mockSuppliers,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    mockUseSupplierMutations.mockReturnValue(mockMutations);
  });

  it('deve renderizar a lista de fornecedores', () => {
    render(<Suppliers />);

    expect(screen.getByText('Fornecedor A')).toBeInTheDocument();
    expect(screen.getByText('Fornecedor B')).toBeInTheDocument();
    expect(screen.getByText('fornecedorA@example.com')).toBeInTheDocument();
  });

  it('deve exibir loading quando está carregando', () => {
    mockUseFetchSuppliers.mockReturnValue({
      suppliers: [],
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<Suppliers />);

    expect(screen.getByText('ID')).toBeInTheDocument();
  });

  it('deve exibir erro quando há erro', () => {
    mockUseFetchSuppliers.mockReturnValue({
      suppliers: [],
      loading: false,
      error: 'Erro ao carregar',
      refetch: jest.fn(),
    });

    render(<Suppliers />);

    expect(screen.getByText(/Error carregando os dados/i)).toBeInTheDocument();
  });

  it('deve filtrar fornecedores por busca', async () => {
    const user = userEvent.setup();
    render(<Suppliers />);

    const searchInput = screen.getByPlaceholderText('Procurar fornecedores');
    await user.type(searchInput, 'Fornecedor A');

    expect(screen.getByText('Fornecedor A')).toBeInTheDocument();
    expect(screen.queryByText('Fornecedor B')).not.toBeInTheDocument();
  });

  it('deve abrir modal de criação ao clicar em "Adicionar Fornecedor"', async () => {
    const user = userEvent.setup();
    render(<Suppliers />);

    const addButton = screen.getByRole('button', { name: 'Adicionar Fornecedor' });
    await user.click(addButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('deve abrir modal de edição ao clicar em uma linha', async () => {
    const user = userEvent.setup();
    render(<Suppliers />);

    const firstRow = screen.getByText('Fornecedor A').closest('tr');
    if (firstRow) {
      await user.click(firstRow);
    }

    expect(screen.getByText('Editar Fornecedor')).toBeInTheDocument();
  });

  it('deve deletar fornecedor ao confirmar', async () => {
    const user = userEvent.setup();
    const mockRefetch = jest.fn();

    mockUseFetchSuppliers.mockReturnValue({
      suppliers: mockSuppliers,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    render(<Suppliers />);

    const deleteButtons = screen.getAllByRole('button', { name: /deletar/i });
    await user.click(deleteButtons[0]);

    const confirmButtons = screen.getAllByText('Deletar');
    await user.click(confirmButtons[confirmButtons.length - 1]);

    expect(mockMutations.remove.mutate).toHaveBeenCalledWith('1');
    expect(mockToast).toHaveBeenCalledWith('Fornecedor deletado com sucesso!');
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('deve cancelar delete ao clicar em cancelar', async () => {
    const user = userEvent.setup();
    render(<Suppliers />);

    const deleteButtons = screen.getAllByRole('button', { name: /deletar/i });
    await user.click(deleteButtons[0]);

    const cancelButtons = screen.getAllByText('Cancelar');
    await user.click(cancelButtons[cancelButtons.length - 1]);

    expect(mockMutations.remove.mutate).not.toHaveBeenCalled();
    expect(screen.queryByText('Tem certeza que deseja deletar este fornecedor?')).not.toBeInTheDocument();
  });

  it('deve abrir modal de produtos ao clicar em visualizar produtos', async () => {
    const user = userEvent.setup();
    render(<Suppliers />);

    const viewButtons = screen.getAllByRole('button', { name: /visualizar produtos/i });
    await user.click(viewButtons[0]);

    expect(screen.getByTestId('supplier-products-modal')).toBeInTheDocument();
  });
});