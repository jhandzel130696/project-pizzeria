import { templates, select, settings } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import utils from '../utils.js';
class Booking {
  constructor(widgetContainerElement) {
    const thisBooking = this;
    thisBooking.render(widgetContainerElement);
    thisBooking.initWidgets();
    thisBooking.getData();

  }
  getData(){
    const thisBooking = this;
    const startDateParam=settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePickerWidget.minDate);
    const endDateParam=settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePickerWidget.maxDate);

    const params = {
      booking:[
        startDateParam,
        endDateParam,
      ],
      eventsCurrent:[
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,

      ],
      eventsRepeat:[
        settings.db.repeatParam,
        endDateParam,

      ],

    };

    //console.log('getData params',params);

    const urls= {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&'),
    };
    //console.log('getData urls',urls);
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
    
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([booking,eventsCurrent,eventsRepeat]){
        console.log(booking);
        console.log(eventsCurrent);
        console.log(eventsRepeat);
      });
    
  }

  render(widgetContainerElement) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = widgetContainerElement;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    thisBooking.dom.hourPicker=document.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.datePicker=document.querySelector(select.widgets.datePicker.wrapper);
    //console.log('peopleAmount',thisBooking.dom.peopleAmount);
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);


    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
    
    thisBooking.hourPickerWidget = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.datePickerWidget = new DatePicker(thisBooking.dom.datePicker);

    thisBooking.dom.wrapper.addEventListener('change', function() {

    });

    

  }



}





























export default Booking;