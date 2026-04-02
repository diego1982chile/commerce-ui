define([], function () {

    function ProductsDataProvider(apiBaseUrl, pageSize) {
        this.pageSize = pageSize;
        this.page = 0;
        this.apiBaseUrl = apiBaseUrl;
    }

    // Indica que soporta iteración por offset
    ProductsDataProvider.prototype.getCapability = function(name) {
        if (name === 'fetchByOffset') return { implementation: 'iteration' };
        return null;
    };

    // fetchFirst devuelve un AsyncIterable que obtiene los datos página por página
    ProductsDataProvider.prototype.fetchFirst = function() {
        const self = this;
        return {
            [Symbol.asyncIterator]: async function* () {
                while (true) {
                    const url = `${self.apiBaseUrl}?page=${self.page}&size=${self.pageSize}`;
                    const res = await fetch(url);
                    const products = await res.json();

                    if (!products || products.length === 0) break;

                    self.page++;

                    for (let p of products) {
                        yield { data: p, metadata: { key: p.id } };
                    }
                }
            }
        };
    };

    return ProductsDataProvider;
});