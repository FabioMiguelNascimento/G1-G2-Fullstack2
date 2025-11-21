import { jest } from '@jest/globals';

export const mockUseFetchSuppliers = jest.fn();
export const mockUseSupplierMutations = jest.fn();

jest.mock('@/hooks/useFetchSuppliers', () => ({
  useFetchSuppliers: mockUseFetchSuppliers,
}));

jest.mock('@/hooks/useSupplierMutations', () => ({
  useSupplierMutations: mockUseSupplierMutations,
}));

export const mockToast = jest.fn();
jest.mock('sonner', () => ({
  toast: mockToast,
}));

jest.mock('react-router-dom', () => ({
  Link: ({ children, ...props }: any) => `<a ${Object.keys(props).map(key => `${key}="${props[key]}"`).join(' ')}>${children}</a>`,
}));