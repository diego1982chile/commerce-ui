define([
    'knockout',
    'ojs/ojresponsiveutils',
    'ojs/ojresponsiveknockoututils',
    'ojs/ojarraydataprovider',
    'ojs/ojdrawerpopup',
    'ojs/ojbutton',
    'ojs/ojlistview',
    'ojs/ojlistitemlayout',
    'ojs/ojavatar',
], function(ko, responsiveUtils, responsiveKnockoutUtils, ArrayDataProvider) {

    function CartViewModel(params) {
        var self = this;

        self.store = params.store;

        self.isSmall = responsiveKnockoutUtils.createMediaQueryObservable(
            responsiveUtils.getFrameworkQuery(responsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY));
        self.isMediumOrUp = responsiveKnockoutUtils.createMediaQueryObservable(
            responsiveUtils.getFrameworkQuery(responsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP));


        // ✔ importante: usar observable correctamente
        self.cartDataProvider = new ArrayDataProvider(self.store.cartItems, {
            keyAttributes: 'sku'
        });

        // ✔ add
        self.addToCart = function(product) {
            self.store.addToCart(product);
        };

        // ✔ remove CORREGIDO
        self.removeFromCart = function(item) {
            self.store.removeFromCart(item);
        };

        // ✔ close drawer (solo una vez)
        self.endToggle = function() {
            self.store.cartDrawerOpen(false);
        };

        self.formatCLP = function (value) {
            if (!value) return '';
            return new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
                minimumFractionDigits: 0
            }).format(value);
        };
    }

    return CartViewModel;
});