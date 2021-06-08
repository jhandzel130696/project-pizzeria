import {templates} from '../settings.js';

class Booking{
  constructor(widgetContainerElement){
    const thisBooking=this;
    thisBooking.render(widgetContainerElement);
    thisBooking.initWidgets();
  }

  render(widgetContainerElement){
    const thisBooking=this;
    const generatedHTML=templates.bookingWidget();
    thisBooking.dom={};
    thisBooking.dom.wrapper=widgetContainerElement;
    thisBooking.dom.wrapper.innerHTML=generatedHTML;

  }


}





























export default Booking;