// Variables globales
let currentTaco = {
    tortilla: { name: "", price: 0, type: "" },
    protein: { name: "", price: 0, type: "" },
    salsas: [],
    toppings: [],
    getTotal: function() {
        let total = this.tortilla.price + this.protein.price;
        this.salsas.forEach(salsa => total += salsa.price);
        this.toppings.forEach(topping => total += topping.price);
        return total;
    }
};

let cart = [];

// Seleccionar ingrediente (para selección única)
function selectIngredient(category, name, price, type) {
    // Remover selección previa
    document.querySelectorAll(`.ingredient-btn`).forEach(btn => {
        if (btn.textContent.includes(name) || 
            (category === 'tortilla' && btn.textContent.includes(currentTaco.tortilla.name)) ||
            (category === 'protein' && btn.textContent.includes(currentTaco.protein.name))) {
            btn.classList.remove('selected');
        }
    });
    
    // Marcar nuevo botón como seleccionado
    event.target.classList.add('selected');
    
    // Actualizar el taco actual
    if (category === 'tortilla') {
        currentTaco.tortilla = { name, price, type };
    } else if (category === 'protein') {
        currentTaco.protein = { name, price, type };
    }
    
    updateCustomTacoPreview();
}

// Alternar ingrediente (para múltiples selecciones)
function toggleIngredient(category, name, price, type) {
    const button = event.target;
    button.classList.toggle('selected');
    
    const ingredient = { name, price, type };
    
    if (category === 'salsa') {
        const index = currentTaco.salsas.findIndex(s => s.name === name);
        if (index === -1) {
            currentTaco.salsas.push(ingredient);
        } else {
            currentTaco.salsas.splice(index, 1);
        }
    } else if (category === 'topping') {
        const index = currentTaco.toppings.findIndex(t => t.name === name);
        if (index === -1) {
            currentTaco.toppings.push(ingredient);
        } else {
            currentTaco.toppings.splice(index, 1);
        }
    }
    
    updateCustomTacoPreview();
}

// Actualizar la vista previa del taco personalizado
function updateCustomTacoPreview() {
    const list = document.getElementById('custom-taco-list');
    const priceElement = document.getElementById('custom-taco-price');
    const visualization = document.getElementById('taco-visualization');
    
    list.innerHTML = '';
    visualization.innerHTML = '';
    
    // Agregar tortilla como base
    if (currentTaco.tortilla.name) {
        const baseElement = document.createElement('div');
        baseElement.className = `taco-base ${currentTaco.tortilla.type}`;
        baseElement.id = 'taco-base';
        visualization.appendChild(baseElement);
        
        const li = document.createElement('li');
        li.innerHTML = `<span class="ingredient-name">Tortilla de ${currentTaco.tortilla.name}</span> <span class="ingredient-price">$${currentTaco.tortilla.price}</span>`;
        list.appendChild(li);
    }
    
    // Agregar proteína
    if (currentTaco.protein.name) {
        const proteinElement = document.createElement('div');
        proteinElement.className = `ingredient-visual ${currentTaco.protein.type}`;
        proteinElement.textContent = currentTaco.protein.name;
        visualization.appendChild(proteinElement);
        
        const li = document.createElement('li');
        li.innerHTML = `<span class="ingredient-name">${currentTaco.protein.name}</span> <span class="ingredient-price">$${currentTaco.protein.price}</span>`;
        list.appendChild(li);
    }
    
    // Agregar salsas
    currentTaco.salsas.forEach(salsa => {
        const salsaElement = document.createElement('div');
        salsaElement.className = `ingredient-visual ${salsa.type}`;
        salsaElement.textContent = salsa.name;
        visualization.appendChild(salsaElement);
        
        const li = document.createElement('li');
        li.innerHTML = `<span class="ingredient-name">Salsa ${salsa.name}</span> <span class="ingredient-price">$${salsa.price}</span>`;
        list.appendChild(li);
    });
    
    // Agregar toppings
    currentTaco.toppings.forEach(topping => {
        const toppingElement = document.createElement('div');
        toppingElement.className = `ingredient-visual ${topping.type}`;
        toppingElement.textContent = topping.name;
        visualization.appendChild(toppingElement);
        
        const li = document.createElement('li');
        li.innerHTML = `<span class="ingredient-name">${topping.name}</span> <span class="ingredient-price">$${topping.price}</span>`;
        list.appendChild(li);
    });
    
    if (list.children.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Selecciona ingredientes para armar tu taco';
        list.appendChild(li);
    }
    
    priceElement.textContent = `Total: $${currentTaco.getTotal().toFixed(2)} MXN`;
}

// Agregar taco personalizado al carrito
function addCustomTacoToCart() {
    if (!currentTaco.tortilla.name || !currentTaco.protein.name) {
        showNotification('Selecciona al menos una tortilla y una proteína');
        return;
    }
    
    const tacoName = `Taco Personalizado: ${currentTaco.protein.name} en tortilla de ${currentTaco.tortilla.name}`;
    const tacoPrice = currentTaco.getTotal();
    const tacoId = `custom-${Date.now()}`;
    
    // Verificar si ya existe un taco personalizado igual en el carrito
    const existingItemIndex = cart.findIndex(item => item.name === tacoName);
    
    if (existingItemIndex !== -1) {
        // Incrementar la cantidad si ya existe
        cart[existingItemIndex].quantity += 1;
        showNotification('¡Se aumentó la cantidad del taco personalizado!');
    } else {
        // Agregar nuevo item al carrito
        cart.push({ 
            id: tacoId, 
            name: tacoName, 
            price: tacoPrice, 
            quantity: 1 
        });
        showNotification('¡Taco personalizado agregado al carrito!');
    }
    
    updateCart();
    
    // Resetear el constructor
    resetTacoBuilder();
}

// Agregar al carrito (tacos predefinidos)
function addToCart(name, price, id) {
    // Verificar si ya existe este taco en el carrito
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    if (existingItemIndex !== -1) {
        // Incrementar la cantidad si ya existe
        cart[existingItemIndex].quantity += 1;
        showNotification('¡Se aumentó la cantidad del taco!');
    } else {
        // Agregar nuevo item al carrito
        cart.push({ 
            id: id, 
            name: name, 
            price: price, 
            quantity: 1 
        });
        showNotification('¡Taco agregado al carrito!');
    }
    
    updateCart();
}

// Aumentar cantidad de un item en el carrito
function increaseQuantity(index) {
    cart[index].quantity += 1;
    updateCart();
    showNotification('Cantidad aumentada');
}

// Disminuir cantidad de un item en el carrito
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        updateCart();
        showNotification('Cantidad disminuida');
    } else {
        // Si la cantidad es 1, eliminar el item
        removeFromCart(index);
    }
}

// Eliminar item del carrito
function removeFromCart(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    updateCart();
    showNotification(`${itemName} eliminado del carrito`);
}

// Vaciar todo el carrito
function clearCart() {
    if (cart.length === 0) {
        showNotification('El carrito ya está vacío');
        return;
    }
    
    cart = [];
    updateCart();
    showNotification('Carrito vaciado');
}

// Actualizar carrito
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartBadge = document.getElementById('cart-badge');
    
    cartItems.innerHTML = '';
    
    // Calcular el total de items (sumando cantidades)
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Tu carrito está vacío</div>';
        cartTotal.textContent = 'Total: $0.00 MXN';
        return;
    }
    
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-header">
                <div class="cart-item-info">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" onclick="decreaseQuantity(${index})">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase" onclick="increaseQuantity(${index})">+</button>
                </div>
                <div class="item-total">$${itemTotal.toFixed(2)}</div>
                <button class="remove-item" onclick="removeFromCart(${index})">Eliminar</button>
            </div>
        `;
        
        cartItems.appendChild(itemElement);
    });
    
    cartTotal.textContent = `Total: $${total.toFixed(2)} MXN`;
}

// Realizar pedido
function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }
    
    showNotification('¡Pedido realizado con éxito! Gracias por tu compra.');
    cart = [];
    updateCart();
}

// Mostrar notificación
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Resetear el constructor de tacos
function resetTacoBuilder() {
    currentTaco = {
        tortilla: { name: "", price: 0, type: "" },
        protein: { name: "", price: 0, type: "" },
        salsas: [],
        toppings: [],
        getTotal: function() {
            let total = this.tortilla.price + this.protein.price;
            this.salsas.forEach(salsa => total += salsa.price);
            this.toppings.forEach(topping => total += topping.price);
            return total;
        }
    };
    
    // Deseleccionar todos los botones
    document.querySelectorAll('.ingredient-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    updateCustomTacoPreview();
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    updateCustomTacoPreview();
    updateCart();
});