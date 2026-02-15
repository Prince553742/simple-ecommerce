document.addEventListener('DOMContentLoaded', () => {
    const side2 = document.getElementById('cart-items-container');
    const selectAllCheckbox = document.getElementById('selectAll');
    const selectAllText = document.getElementById('item-count-text');
    const subtotalDisplay = document.getElementById('summary-subtotal');
    const shippingDisplay = document.getElementById('summary-shipping');
    const totalDisplay = document.getElementById('summary-total');
    const checkoutBtn = document.querySelector('.checkout-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateSummary() {
        const checkboxes = document.querySelectorAll('.item-checkbox');
        let subtotal = 0;
        let selectedCount = 0;

        checkboxes.forEach((cb, index) => {
            if (cb.checked) {
                subtotal += cart[index].price * cart[index].quantity;
                selectedCount++;
            }
        });

        const shippingFee = selectedCount > 0 ? 100 : 0;
        const total = subtotal + shippingFee;

        if(subtotalDisplay) subtotalDisplay.textContent = `₱${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        if(shippingDisplay) shippingDisplay.textContent = `₱${shippingFee.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        if(totalDisplay) totalDisplay.textContent = `₱${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        if(selectAllText) selectAllText.textContent = `SELECT ALL (${cart.length} ITEM(S))`;
        if(checkoutBtn) checkoutBtn.textContent = `PROCEED TO CHECKOUT (${selectedCount})`;
    }

    if (cart.length === 0) {
        side2.innerHTML = "<div class='side1' style='background: none; justify-content: center;'><p>YOUR CART IS EMPTY</p></div>";
        updateSummary();
        return;
    }

    side2.innerHTML = "";

    cart.forEach((item, index) => {
        const fixedImagePath = item.image.replace('../../', '../');
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item-row'; 
        itemDiv.innerHTML = `
            <div class="item-info-section">
                <input type="checkbox" class="item-checkbox" data-index="${index}">
                <img src="${fixedImagePath}" class="cart-product-img">
                <div class="text-details">
                    <p class="product-title">${item.name} ${item.storage} powered by A13 Bionic chip</p>
                    <p class="product-color-text">${item.color}</p>
                </div>
            </div>
            <div class="item-control-section">
                <h2 class="price-text">₱${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
                <div class="qty-selector">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
        `;
        side2.appendChild(itemDiv);
    });

    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    itemCheckboxes.forEach(cb => cb.addEventListener('change', updateSummary));

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', () => {
            itemCheckboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
            updateSummary();
        });
    }

    // --- RECEIPT MODAL LOGIC ---
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('.item-checkbox');
            let selectedItems = [];
            let subtotal = 0;

            checkboxes.forEach((cb, index) => {
                if (cb.checked) {
                    selectedItems.push(cart[index]);
                    subtotal += cart[index].price * cart[index].quantity;
                }
            });

            if (selectedItems.length === 0) {
                alert("Please select at least one item to checkout!");
                return;
            }

            const shipping = 100;
            const total = subtotal + shipping;

            // Fill Modal Data
            document.getElementById('receipt-date').textContent = new Date().toLocaleString();
            
            const listContainer = document.getElementById('receipt-items-list');
            listContainer.innerHTML = selectedItems.map(item => `
                <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 5px;">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>₱${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            `).join('');

            document.getElementById('r-subtotal').textContent = `₱${subtotal.toLocaleString()}`;
            document.getElementById('r-shipping').textContent = `₱${shipping.toLocaleString()}`;
            document.getElementById('r-total').textContent = `₱${total.toLocaleString()}`;

            // Show Modal
            document.getElementById('receiptModal').style.display = "block";
        });
    }

    // Clear Button Logic
    const clearBtn = document.querySelector('.side1 button');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if(confirm("Are you sure you want to clear your cart?")) {
                localStorage.removeItem('cart');
                location.reload();
            }
        });
    }
});

// --- GLOBAL FUNCTIONS ---
window.changeQty = function(index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) {
        if(confirm("Remove this item from your cart?")) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = 1;
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload(); 
};

window.closeModal = function() {
    document.getElementById('receiptModal').style.display = "none";
};

// Close modal if clicking outside the white box
window.onclick = function(event) {
    const modal = document.getElementById('receiptModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
};