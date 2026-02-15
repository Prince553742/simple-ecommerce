document.addEventListener('DOMContentLoaded', () => {
    let quantity = 1;
    let selectedPrice = 12000;
    let selectedStorage = ""; 
    let selectedColor = "";
    let selectedImage = "../../pictures/ip11.png"; 

    const colorImages = {
        "Black": "../../pictures/ip11/ip11black.png",
        "Green": "../../pictures/ip11/ip11green.png",
        "Purple": "../../pictures/ip11/ip11purple.png",
        "Red": "../../pictures/ip11/ip11red.png",
        "White": "../../pictures/ip11/ip11white.png",
        "Yellow": "../../pictures/ip11/ip11yellow.png"
    };

    const qtyDisplay = document.getElementById('qtybtn');
    const plusBtn = document.getElementById('plusbtn');
    const minusBtn = document.getElementById('minusbtn');
    const totalDisplay = document.getElementById('total');
    const storageButtons = document.querySelectorAll('.child4 button');
    const colorButtons = document.querySelectorAll('.child55 div button');
    const addToCartBtn = document.querySelector('.addtocart');
    const buyNowBtn = document.querySelector('.buynow');

    function updateUI() {
        if (qtyDisplay) qtyDisplay.textContent = quantity;
        if (totalDisplay) {
            let subtotal = selectedPrice * quantity;
            totalDisplay.textContent = "₱" + subtotal.toLocaleString(undefined, {minimumFractionDigits: 2});
        }
    }

    colorButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            selectedColor = button.textContent.trim();
            if (colorImages[selectedColor]) {
                selectedImage = colorImages[selectedColor];
                const mainImg = document.querySelector('.child2 img');
                if (mainImg) mainImg.src = selectedImage;
            }
            colorButtons.forEach(btn => btn.style.border = "1px solid #ccc");
            button.style.border = "2px solid black";
        });
    });

    storageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            selectedStorage = button.textContent.toLowerCase().trim();
            if (selectedStorage === '128gb') selectedPrice = 12000;
            else if (selectedStorage === '256gb') selectedPrice = 12500;
            else if (selectedStorage === '512gb') selectedPrice = 13000;
            storageButtons.forEach(btn => btn.style.border = "1px solid #ccc");
            button.style.border = "2px solid black";
            updateUI();
        });
    });

    if (plusBtn) plusBtn.onclick = (e) => { e.preventDefault(); quantity++; updateUI(); };
    if (minusBtn) minusBtn.onclick = (e) => { 
        e.preventDefault(); 
        if (quantity > 1) { quantity--; updateUI(); }
    };

    function addToCart(redirect = false) {
        if (!selectedStorage || !selectedColor) {
            alert("Please select both Storage and Color options!");
            return;
        }

        const product = {
            id: `ip11-${selectedStorage}-${selectedColor}`,
            name: "iPhone 11",
            storage: selectedStorage,
            color: selectedColor,
            price: selectedPrice,
            quantity: quantity,
            image: selectedImage 
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        if (redirect) window.location.href = "../../cartpage/cart.html";
        else alert("Added to cart!");
    }

    if (addToCartBtn) addToCartBtn.addEventListener('click', () => addToCart(false));
    if (buyNowBtn) buyNowBtn.addEventListener('click', () => addToCart(true));
    updateUI();
});