## API Specs

### POST /_v/feed/generate/:feedType 
Generate a feed request, this will imediately return a pending result to the user with an id of the feed, it will also trigger a background process of actually generating the feed. 

Feed Types:
1. RevealCategories - calls the category [API to get all the categories](https://developers.vtex.com/vtex-developer-docs/reference/catalog-api-category#catalog-api-get-category-tree) of the store and return it in [reveal's format for categories ](https://www.omniconvert.com/help/kba/how-to-import-your-data-in-reveal/)
2. RevealOrders - call vtex.report to get the orders from SOLR and map it in the desired format.
3. RevealCustomers - call vtex.report to get the orders from MasterData and map it in the desired format.
4. RevealProducts - call vtex.report to get the orders from copy of Products from MasterData and map it in the desired format.
5. RevealProductLimit - get 2500 max products with search-graphql and map them to the desired format
6. PerformantProduct - call vtex.report to get the orders from copy of Products from MasterData and map it in the desired format.
7. PerformantProductLimit - get 2500 max products with search-graphql and map them to the desired format 
8. ProfitShareProduct - call vtex.report to get the orders from copy of Products from MasterData and map it in the desired format.
9. ProfitShareProductLimit - get 2500 max products with search-graphql and map them to the desired format 
10. RetargetingProduct - call vtex.report to get the orders from copy of Products from MasterData and map it in the desired format.
11. RetargetingProductLimit - get 2500 max products with search-graphql and map them to the desired format 



Generating the feed could mean: 
1. Making a call to a core service called [vtex.reports](https://github.com/vtex/reports) which receives a mapping (definition of the output), a data entity from which to extract the data and a query. 
2. Making calls to catalog APIs to get product, skus or category information (with a limit of 2500 product maximum)

