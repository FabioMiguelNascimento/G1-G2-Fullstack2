import { createContext, useContext, useState, type ReactNode } from 'react';

interface CartContextType {
  trigger: number;
  refetchCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [trigger, setTrigger] = useState(0);

  const refetchCart = () => {
    setTrigger(prev => prev + 1);
  };

  return (
    <CartContext.Provider value={{ trigger, refetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext deve ser usando dentro de um CartProvider');
  }
  return context;
}