const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCheckOut = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn")
const cartAddress = document.getElementById("address");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];



cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex"
    console.log("abrir modal");
})

cartModal.addEventListener("click", function (event) {

    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }

})

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
    console.log("fechar modal");
})

menu.addEventListener("click", function (event) {
    // console.log(event.target)
    let parentButton = event.target.closest(".add-to-cart-btn")
    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)

    }

})

//function add on cart

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {

        existingItem.quantity += 1
    }
    else {
        cart.push({
            name,
            price,
            quantity: 1,

        })
    }
    updateCartModal();

}



function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let qtdCarrinho = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$: ${item.price.toFixed(2)} </p>
                </div>
                 <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
            </div>
        `
        total += item.price * item.quantity;
        qtdCarrinho += item.quantity;



        cartItemsContainer.appendChild(cartItemElement)
    })

    cartCount.textContent = qtdCarrinho;

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });


};

//function removeItemCart
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name = name)

    if (index !== -1) {
        const item = cart[index];
        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;

        }
        else {
            cart.splice(index, 1)
            updateCartModal();
        }

    }

}

//function remove item 
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        console.log(name);
        removeItemCart(name);
    }

})

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

cartCheckOut.addEventListener("click",function(){
    const isOpen = checkRestaurantOpen();

    if(!isOpen){
        Toastify({
            text: "Ops! Restaurante esta fechado",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();
          return;
    }


    if(addressInput.value ==="" ){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
    }

    const cartItems = cart.map((item)=>{
        return(
            `${item.name} Quantidade: ($${item.quantity} Preço:R$${item.price})`
        )

    }).join("")

    console.log(cartItems);


    const message = encodeURIComponent(cartItems)
    const phone = "13991646054"

    window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`,"_blank")

})


//verificar data
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();

    return hora >= 18 && hora < 22
}


const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}