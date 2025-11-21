import { act, render, screen, waitFor } from '@testing-library/react';
import { mockGetDashboardStats } from '../../__mocks__/dashboard';
import Dashboard from './Dashboard';

const mockStats = {
  totalSales: 150,
  bestSellingProduct: {
    id: '1',
    title: 'Produto Mais Vendido',
    price: 99.99,
    totalSold: 25,
  },
  lowStockProducts: [
    {
      id: '2',
      title: 'Produto com Estoque Baixo',
      stock: 5,
      price: 49.99,
    },
  ],
};

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve exibir loading inicialmente', () => {
    mockGetDashboardStats.mockReturnValue(new Promise(() => {}));

    render(<Dashboard />);

    expect(screen.getByText('Carregando dashboard...')).toBeInTheDocument();
  });

  it('deve exibir erro quando a API falha', async () => {
    (mockGetDashboardStats as any).mockRejectedValue(new Error('Erro na API'));

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar estatísticas do dashboard')).toBeInTheDocument();
    });
  });

  it('deve chamar getDashboardStats ao montar o componente', async () => {
    (mockGetDashboardStats as any).mockResolvedValue(mockStats);

    await act(async () => {
      render(<Dashboard />);
    });

    expect(mockGetDashboardStats).toHaveBeenCalledTimes(1);
  });
});