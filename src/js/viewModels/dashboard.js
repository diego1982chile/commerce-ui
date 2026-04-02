define([
    "knockout",
    "ojs/ojmodel",
    "ojs/ojcollectiondataprovider",
    "ojs/ojknockout",
    "ojs/ojlistview",
    "ojs/ojactioncard"
], function(ko, ojmodel, CollectionDataProvider) {

    function DashboardViewModel() {
        var self = this;

        self.baseUrl = ko.dataFor(document.getElementById('globalBody')).catalogServiceBaseUrl() + "products";

        // ---------- Model ----------
        const StudentModel = ojmodel.Model.extend({
            idAttribute: 'id'
        });

        // ---------- Collection ----------
        const StudentCollection = ojmodel.Collection.extend({
            model: StudentModel,
            fetchSize: 10,

            // 🔹 1. parse (response → items)
            parse: function(response) {
                return response.items;
            }
        });

        const collection = new StudentCollection();

        // 🔹 2. customPagingOptions (CRÍTICO)
        collection.customPagingOptions = function(response) {
            return {
                totalResults: response.totalResults,
                limit: response.limit
            };
        };

        // 🔹 3. customURL (paging real)
        collection.customURL = function(operation, collection, options) {

            const page = options.startIndex > 0
                ? (options.startIndex / options.fetchSize)
                : 0;

            console.log("startIndex:", options.startIndex,
                "fetchSize:", options.fetchSize,
                "page:", Math.floor(options.startIndex / options.fetchSize));

            return {
                url: self.baseUrl,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    page: page,
                    fetchSize: options.fetchSize
                })
            };
        };

        // ---------- DataProvider ----------
        self.dataProvider = new CollectionDataProvider(collection, {
            idAttribute: 'sku'
        });

        self.formatCLP = function (value) {
            if (!value) return '';
            return new Intl.NumberFormat('es-CL', {
                style: 'currency',
                currency: 'CLP',
                minimumFractionDigits: 0
            }).format(value);
        };

        self.removeFromCart = function (product) {
            let index = self.cart().findIndex(p => p.id === product.id);

            if (index > -1) {
                self.cart.splice(index, 1);
            }
        };

    }

    return DashboardViewModel;
});