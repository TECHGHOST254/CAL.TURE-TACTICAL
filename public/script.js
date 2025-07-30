document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('product-grid');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cartIcon = document.getElementById('cart-icon');
  const cartSidebar = document.getElementById('cart-sidebar');
  const closeCartBtn = document.getElementById('close-cart');
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const checkoutBtn = document.getElementById('checkout-btn');

  let products = [];
  let cart = [];

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    products = await res.json();
    renderProducts(products);
  };

  const renderProducts = (items) => {
    grid.innerHTML = '';
    items.forEach(product => {
      const div = document.createElement('div');
      div.className = 'product';
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>💵 KES ${product.price}</p>
        <button class="btn" onclick='showModal(${JSON.stringify(product)})'>View</button>
      `;
      grid.appendChild(div);
    });
  };

  const applyFilters = () => {
    const query = searchInput.value.toLowerCase();
    const category = document.querySelector('.filter-btn.active')?.dataset.category || 'All';
    const sort = sortSelect.value;

    let filtered = [...products];

    if (category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (query) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
    }

    if (sort === 'asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    renderProducts(filtered);
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  searchInput.addEventListener('input', applyFilters);
  sortSelect.addEventListener('change', applyFilters);

  cartIcon.addEventListener('click', () => {
    cartSidebar.classList.toggle('open');
  });

  closeCartBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
  });

  fetchProducts();

  window.showModal = (product) => {
    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-desc').textContent = product.description;

    const addToCartBtn = document.querySelector('.add-to-cart');
    addToCartBtn.onclick = () => {
      cart.push(product);
      updateCart();
      document.getElementById('product-modal').style.display = 'none';
    };

    document.getElementById('product-modal').style.display = 'flex';
  };

  document.querySelector('.close-btn').addEventListener('click', () => {
    document.getElementById('product-modal').style.display = 'none';
  });

  const updateCart = () => {
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `${item.name} - KES ${item.price} <span class="remove-item" data-index="${index}">❌</span>`;
      cartItems.appendChild(li);
    });

    cartCount.textContent = cart.length;

    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const i = e.target.getAttribute('data-index');
        cart.splice(i, 1);
        updateCart();
      });
    });
  };

  checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) {
      alert("🛒 Your cart is empty!");
      return;
    }

    const orderItems = cart.map(p => ({
      productId: p._id,
      name: p.name,
      price: p.price,
      quantity: 1
    }));

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: orderItems })
    });

    const result = await res.json();
    if (res.ok) {
      alert("✅ Order placed successfully!");
      cart = [];
      updateCart();
      cartSidebar.classList.remove('open');
    } else {
      alert("❌ Failed to place order: " + result.error);
    }
  });
});
