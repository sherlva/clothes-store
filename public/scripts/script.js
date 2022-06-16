window.addEventListener('load', function (e) {
    function toCurrency(price) {
        return new Intl.NumberFormat('en-EN', {
            style: 'currency',
            currency: 'usd'
        }).format(price)
    }

    const priceUs = document.querySelectorAll('.price_us');

    if (priceUs) {
        priceUs.forEach(card => {
            card.innerHTML = toCurrency(card.innerHTML)
        })
    }
});