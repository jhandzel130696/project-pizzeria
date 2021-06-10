import { templates, select } from '../settings.js';
import AmountWidget from './AmountWidget.js';
class Booking {
  constructor(widgetContainerElement) {
    const thisBooking = this;
    thisBooking.render(widgetContainerElement);
    thisBooking.initWidgets();

  }

  render(widgetContainerElement) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = widgetContainerElement;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    //console.log('peopleAmount',thisBooking.dom.peopleAmount);
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);


    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.wrapper.addEventListener('change', function() {

    });

  }


}





























export default Booking;