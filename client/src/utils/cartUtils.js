// Get cart from localStorage
export const getCart = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn("Failed to access localStorage:", e);
    return [];
  }
};

// Add product to the cart with unique cartItemId
export const addToCart = (product) => {
  const cart = getCart();

  const newCartItem = {
    ...product,
    cartItemId: generateUniqueCartItemId(product), // ✅ Always stable & unique
    quantity: 1,
  };

  cart.push(newCartItem);
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Remove item by unique cartItemId
export const removeFromCart = (cartItemId) => {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.cartItemId !== cartItemId);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

// Update quantity by cartItemId
export const updateQuantity = (cartItemId, quantity) => {
  const validQty = Math.max(1, parseInt(quantity) || 1);
  const cart = getCart();

  const updatedCart = cart.map((item) =>
    item.cartItemId === cartItemId ? { ...item, quantity: validQty } : item
  );

  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

// Calculate total
export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// Clear cart
export const clearCart = () => {
  localStorage.removeItem("cart");
};

// Generate a stable, unique cartItemId based on product details
const generateUniqueCartItemId = (product) => {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `${product.id || product.name}-${generateUUID()}`; // fallback
};

// Fallback UUID generator (when crypto is unavailable)
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
