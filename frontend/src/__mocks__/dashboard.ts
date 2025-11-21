import { jest } from '@jest/globals';

export const mockGetDashboardStats = jest.fn();

jest.mock('@/services/dashboard.service', () => ({
  getDashboardStats: mockGetDashboardStats,
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children, ...props }: any) => `<a ${Object.keys(props).map(key => `${key}="${props[key]}"`).join(' ')}>${children}</a>`,
}));