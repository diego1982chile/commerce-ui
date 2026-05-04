/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojcontext', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter',
        'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider',
        'ojs/ojoffcanvas', 'ojs/ojmodule-element', 'ojs/ojknockout', 'ojs/ojmessages'],
  function(ko, Context, moduleUtils, KnockoutTemplateUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter, ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider, OffcanvasUtils) {

     function ControllerViewModel() {

      this.KnockoutTemplateUtils = KnockoutTemplateUtils;

      // Handle announcements sent when pages change, for Accessibility.
      this.manner = ko.observable('polite');
      this.message = ko.observable();
      announcementHandler = (event) => {
          this.message(event.detail.message);
          this.manner(event.detail.manner);
      };

      document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);


      // Media queries for repsonsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      let navData = [
        { path: '', redirect: 'dashboard' },
        { path: 'dashboard', detail: { label: 'Dashboard', iconClass: 'oj-ux-ico-bar-chart' } },
        { path: 'incidents', detail: { label: 'Incidents', iconClass: 'oj-ux-ico-fire' } },
        { path: 'customers', detail: { label: 'Customers', iconClass: 'oj-ux-ico-contact-group' } },
        { path: 'about', detail: { label: 'About', iconClass: 'oj-ux-ico-information-s' } }
      ];

     this.catalogServiceBaseUrl = ko.observable("http://localhost:9092/catalog-service/api/");

     this.messages = ko.observableArray();

     this.messagesDataprovider = new ArrayDataProvider(this.messages);

     this.store = {
         cartItems: ko.observableArray([]),
         cartDrawerOpen: ko.observable(false)
     };

     this.store.addToCart = (product) => {
         const existing = this.store.cartItems().find(p => p.sku === product.sku);

         if (existing) {
             existing.qty = (existing.qty || 1) + 1;
             this.store.cartItems.splice(this.store.cartItems.indexOf(existing), 1, existing);
         } else {
             this.store.cartItems.push({ ...product, qty: 1 });
         }
         this.messages([{severity: 'info', summary: 'Info', detail: "Product '" + product.name + "' has been added to the cart", autoTimeout: 5000}]);
     };

     this.store.removeFromCart = (product) => {
         const item = this.store.cartItems().find(p => p.sku === product.sku);
         if (!item) return;

         item.qty--;

         if (item.qty <= 0) {
             this.store.cartItems.remove(item);
         } else {
             this.store.cartItems.splice(
                 this.store.cartItems.indexOf(item),
                 1,
                 item
             );
         }
         this.messages([{severity: 'info', summary: 'Info', detail: "Product '" + product.name + "' has been removed from the cart", autoTimeout: 5000}]);
     };

     this.store.cartTotal = ko.computed(() => {
         return this.store.cartItems().reduce((sum, item) => {
             const qty = item.qty || 1;
             const price = item.prices?.[0]?.total || 0;
             return sum + (price * qty);
         }, 0);
     });

     this.openCartDrawer = () => this.store.cartDrawerOpen(true);
     this.closeCartDrawer = () => this.store.cartDrawerOpen(false);

      // Router setup
      let router = new CoreRouter(navData, {
        urlAdapter: new UrlParamAdapter()
      });
      router.sync();

      this.moduleAdapter = new ModuleRouterAdapter(router);

      this.selection = new KnockoutRouterAdapter(router);

      // Setup the navDataProvider with the routes, excluding the first redirected
      // route.
      this.navDataProvider = new ArrayDataProvider(navData.slice(1), {keyAttributes: "path"});

      // Drawer
      // Close offcanvas on medium and larger screens
      this.mdScreen.subscribe(() => {OffcanvasUtils.close(this.drawerParams);});
      this.drawerParams = {
        displayMode: 'push',
        selector: '#navDrawer',
        content: '#pageContent'
      };
      // Called by navigation drawer toggle button and after selection of nav drawer item
      this.toggleDrawer = () => {
        this.navDrawerOn = true;
        return OffcanvasUtils.toggle(this.drawerParams);
      }

      // Header
      // Application Name used in Branding Area
      this.appName = ko.observable("App Name");
      // User Info used in Global Navigation area
      this.userLogin = ko.observable("john.hancock@oracle.com");

      // Footer
      this.footerLinks = [
        {name: 'About Oracle', linkId: 'aboutOracle', linkTarget:'http://www.oracle.com/us/corporate/index.html#menu-about'},
        { name: "Contact Us", id: "contactUs", linkTarget: "http://www.oracle.com/us/corporate/contact/index.html" },
        { name: "Legal Notices", id: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html" },
        { name: "Terms Of Use", id: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html" },
        { name: "Your Privacy Rights", id: "yourPrivacyRights", linkTarget: "http://www.oracle.com/us/legal/privacy/index.html" },
      ];
     }
     // release the application bootstrap busy state
     Context.getPageContext().getBusyContext().applicationBootstrapComplete();


     return new ControllerViewModel();
  }
);
