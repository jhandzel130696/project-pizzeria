import {settings,select,classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import homePage from './components/homePage.js';
const app = {
  initHomePage:function(){
    const thisApp=this;
    const widgetContainerHomePage=document.querySelector(select.containerOf.home);

    thisApp.homePage=new homePage(widgetContainerHomePage);
  },

  initBooking: function(){
    const thisApp=this;
    const widgetContainer=document.querySelector(select.containerOf.booking);
    //console.log('widgetContainer',widgetContainer);
    thisApp.booking= new Booking(widgetContainer);
  },

    
  initPages: function (){
    const thisApp =this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;

    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    const idFromHash=window.location.hash.replace('#/','');
    //console.log('idHash',idFromHash);
    let pageMatchingHash=thisApp.pages[0].id;

    for (let page of thisApp.pages){
      if(page.id==idFromHash){
        pageMatchingHash=page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks){
      link.addEventListener('click',function(event){
        const clickedElement=this;
        event.preventDefault();

        /*get page id from href attribute*/
        const id =clickedElement.getAttribute('href').replace('#','');
        /*run thisApp.activatePage with taht id*/
        thisApp.activatePage(id);

        /*change URL hash*/
        window.location.hash='#/' + id;
      });
    }
  },
  activatePage: function(pageId){
    const thisApp=this;

    /*add class "active" to matching pages, remove from non-matching*/
    for(let page of thisApp.pages){
      /* if(page.id==pageId){
        page.classList.add(classNames.pages.active);
      }else {
        page.classList.remove(classNames.pages.active);
      }*/
      page.classList.toggle(classNames.pages.active,page.id==pageId);// jest to dok??adnie to samo co powyzsze zakomentowane linijki, warunek mozesz uzyc jako drugi argument 
    }
    /*add class "active" to matching link, remove from non-matching*/
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href')=='#' + pageId
      );
    }
  },
  initMenu: function(){
    const thisApp = this;
    //console.log('thisApp.data',thisApp.data);
    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  initData: function(){
    const thisApp=this;
    thisApp.data = {};
    const url = settings.db.url+'/'+ settings.db.products;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        //console.log('parsedResponse',parsedResponse);

        //save parsedResponse as thisApp.data.products
        thisApp.data.products = parsedResponse;
        //execute initMenu method
        thisApp.initMenu();
      });
    //console.log('thisApp.data',JSON.stringify(thisApp.data));
  },
  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    //console.log('settings:', settings);
    // console.log('templates:', templates);
    thisApp.initHomePage();
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking(); 
  },
  initCart(){
    const thisApp=this;
    const cartElem=document.querySelector(select.containerOf.cart);
    thisApp.cart= new Cart(cartElem);
    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart',function(event){app.cart.add(event.detail.product.prepareCartProduct());});
  },
};
  
app.init();

