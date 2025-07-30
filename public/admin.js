document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.querySelector('#orders-table tbody');

  try {
    const res = await fetch('/api/orders');
    const orders = await res.json();

    orders.forEach(order => {
      const row = document.createElement('tr');

      const items = order.items.map(i => `${i.name} (x${i.quantity})`).join('<br>');
      const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      row.innerHTML = `
        <td>${order._id}</td>
        <td>${items}</td>
        <td>KES ${total}</td>
        <td>${new Date(order.createdAt).toLocaleString()}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
  }
});
