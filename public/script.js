new Vue({
    el: '#app',
    data() {
        return {
            total: 0,
            // Product list
            products: [],
            cart: [],
            search: '',
            lastSearch: '',
            loading: false
        }
    },
    methods: {
        // Add items to cart
        addToCart(product) {
            this.total += product.price;
            var found = false;
            for (var i = 0; i < this.cart.length; i++) {
                // check to see if item is in the cart if so just increase quantity 
                if (this.cart[i].id === product.id) {
                    this.cart[i].qty++;
                    found = true
                }
            }
            // if the item is not in the cart create the item 
            if (!found) {
                this.cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    qty: 1
                })
            }
        },
        inc(item) {
            item.qty++;
            this.total += item.price
        },
        dec(item) {
            item.qty--;
            this.total -= item.price
            if (item.qty <= 0) {
                var i = this.cart.indexOf(item)
                this.cart.splice(i, 1)
            }
        },
        onSubmit() {
            this.products = []
            this.loading = true
            var path = '/search?q='.concat(this.search)
            this.$http.get(path)
                .then((response) => {
                    this.products = response.body
                    this.lastSearch = this.search
                    this.loading = false
                })
        }
    },
    filters: {
        currency: function (price) {
            return "R".concat(price.toFixed(2))
        }
    }
});