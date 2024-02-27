document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const userId = button.getAttribute('data-userid');
            const productId = button.getAttribute('data-productid');
            const productName = button.getAttribute('data-productname');
            const productPrice = parseFloat(button.getAttribute('data-productprice'));
            const quantity = 1;

            try {
                const requestData = {
                    userId,
                    productId,
                    productName,
                    quantity,
                    price: productPrice
                };

                const response = await fetch('/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Ошибка:', error);
            }
        });
    });

    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const userId = button.getAttribute('data-userid');
            const productId = button.getAttribute('data-productid');
            try {
                const response = await fetch('/cart/remove', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId, productId })
                });
                const data = await response.json();
                console.log(data);

                console.log('Товар успешно удален из корзины');
            } catch (error) {
                console.error('Ошибка при удалении товара из корзины:', error);
            }
        });
    });

    document.querySelector('.view-cart-btn').addEventListener('click', async () => {
        try {
            const newWindow = window.open('/cart/view', '_blank');
            if (newWindow) {
                newWindow.focus();
            } else {
                console.error('Не удалось открыть новое окно.');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            window.location.href = '/checkout';
        });
    }
});
