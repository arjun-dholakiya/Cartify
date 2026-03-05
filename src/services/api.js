import products from '../data/products.json';

export async function fetchProducts() {
  // Return a shallow copy to avoid accidental mutations of the source array
  return [...products];
}

export async function fetchProduct(id) {
  const numId = Number(id);
  const product = products.find((p) => p.id === numId);
  if (!product) throw new Error('Product not found.');
  return product;
}

export async function fetchCategories() {
  const categories = Array.from(new Set(products.map((p) => p.category)));
  return categories;
}

export async function fetchProductsByCategory(category) {
  if (!category || category === 'all') return fetchProducts();
  const filtered = products.filter((p) => p.category === category);
  return filtered;
}
