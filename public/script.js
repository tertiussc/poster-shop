// Global load number
var LOAD_NUM = 4;
var watcher;
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
            loading: false,
            search: 'dog',
            results: []
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
        // Increment Button
        inc(item) {
            item.qty++;
            this.total += item.price
        },
        // Decriment Button
        dec(item) {
            item.qty--;
            this.total -= item.price
            if (item.qty <= 0) {
                var i = this.cart.indexOf(item)
                this.cart.splice(i, 1)
            }
        },
        // Submit function on form
        onSubmit() {
            this.products = []
            this.loading = true
            var path = '/search?q='.concat(this.search)
            this.$http.get(path)
                .then((response) => {
                    this.results = response.body;
                    this.lastSearch = this.search;
                    this.appendResults();
                    this.loading = false
                })
        },
        appendResults() {
            if (this.products.length < this.results.length) {
                var toAppend = this.results.slice(
                    this.products.length,
                    LOAD_NUM + this.products.length
                );
                this.products = this.products.concat(toAppend)
            }
        }
    },
    // filter for totals and pricing
    filters: {
        currency: function (price) {
            return "R".concat(price.toFixed(2))
        }
    },
    // submit the search on statup
    created: function () {
        this.onSubmit();
    },

    // Scrollmonitor implement
    updated() {
        var sensor = document.querySelector('#product-list-bottom')
        watcher = scrollMonitor.create(sensor)
        watcher.enterViewport(this.appendResults)
    },
    beforeUpdate() {
        if (watcher) {
            watcher.destroy();
            watcher = null
        }
    }
});