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

        const app = ko.dataFor(document.getElementById('globalBody'));
        self.store = app.store;

        self.baseUrl = app.catalogServiceBaseUrl() + "products";

        const ProductModel = ojmodel.Model.extend({
            idAttribute: 'id'
        });

        const ProductCollection = ojmodel.Collection.extend({
            model: ProductModel,
            fetchSize: 10,

            parse: function(response) {
                return response.items;
            }
        });

        const collection = new ProductCollection();

        collection.customPagingOptions = function(response) {
            return {
                totalResults: response.totalResults,
                limit: response.limit
            };
        };

        collection.customURL = function(operation, collection, options) {
            const page = options.startIndex > 0
                ? (options.startIndex / options.fetchSize)
                : 0;

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
    }

    return DashboardViewModel;
});
