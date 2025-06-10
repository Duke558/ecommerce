// utils/cartUtils.js

// Get the cart from localStorage
export const getCart = () => {
  try {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn('Failed to access localStorage:', e);
    return [];
  }
};

// Add a product to the cart (each entry is treated as unique)
export const addToCart = (product) => {
  const cart = getCart();

  const newCartItem = {
    ...product,
    cartItemId: crypto.randomUUID(), // Unique per cart entry
    quantity: 1,
  };

  cart.push(newCartItem);
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Remove a product from the cart by cartItemId
export const removeFromCart = (cartItemId) => {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.cartItemId !== cartItemId);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
};

// Update the quantity of a cart item by cartItemId
export const updateQuantity = (cartItemId, quantity) => {
  const validQty = Math.max(1, parseInt(quantity) || 1);
  const cart = getCart();

  const updatedCart = cart.map((item) =>
    item.cartItemId === cartItemId ? { ...item, quantity: validQty } : item
  );

  localStorage.setItem('cart', JSON.stringify(updatedCart));
};

// Clear the cart entirely
export const clearCart = () => {
  localStorage.removeItem('cart');
};

// Calculate total cart value
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
