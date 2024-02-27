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
                quantity,
                price: productPrice
            };

            if (productName) {
                requestData.productName = productName;
            }

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
