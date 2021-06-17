import { templates, select, settings,classNames } from '../settings.js';
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
    thisBooking.tableInformation='';
    
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
      .then(function([bookings,eventsCurrent,eventsRepeat]){
        //console.log(booking);
        //console.log(eventsCurrent);
        //console.log(eventsRepeat);
        thisBooking.parseData(bookings,eventsCurrent,eventsRepeat);
      });
    
  }
  parseData(bookings,eventsCurrent,eventsRepeat){
    const thisBooking=this;
    
    thisBooking.booked={};

    for(let item of bookings){
      thisBooking.makeBooked(item.date,item.hour,item.duration,item.table);
    }
    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date,item.hour,item.duration,item.table);
    }
    const minDate = thisBooking.datePickerWidget.minDate;
    const maxDate = thisBooking.datePickerWidget.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate;loopDate=utils.addDays(loopDate,1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate),item.hour,item.duration,item.table);
        }
      }
    }
    //console.log('thisBooking.booked',thisBooking.booked);

    thisBooking.updateDOM();
  }
  makeBooked(date,hour,duration,table){
    const thisBooking=this;
    if(typeof thisBooking.booked[date]=='undefined'){
      thisBooking.booked[date]={};
    }

    const startHour = utils.hourToNumber(hour);



    for (let hourBlock=startHour;hourBlock<startHour + duration;hourBlock+=0.5){
      if(typeof thisBooking.booked[date][hourBlock]=='undefined'){
        thisBooking.booked[date][hourBlock]=[];
      }
  
      thisBooking.booked[date][hourBlock].push(table); 
    }
  }

  updateDOM(){
    const thisBooking=this;

    thisBooking.date = thisBooking.datePickerWidget.value;
    //console.log(thisBooking.hourPickerWidget.value);
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPickerWidget.value);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable == true;
    }
    
    const refresh = document.querySelector('.choosen-table');
    if (refresh){
      refresh.classList.remove('choosen-table');}
    for (let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }
      if(
        !allAvailable
          &&
          thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      }else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
    
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
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.choosenTable= thisBooking.dom.wrapper.querySelector(select.booking.choosenTable);
    thisBooking.dom.iterableObject=thisBooking.dom.wrapper.querySelectorAll(select.booking.tableClass);
    thisBooking.dom.btnOrder=thisBooking.dom.wrapper.querySelector(select.booking.btn);
    thisBooking.dom.phone=thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.dom.address=thisBooking.dom.wrapper.querySelector(select.booking.address);
    thisBooking.dom.checkBox=thisBooking.dom.wrapper.querySelector(select.booking.checkbox);
    thisBooking.dom.starters=[];
    //console.log('stolik',thisBooking.dom.checkBox);
    //console.log('peopleAmount',thisBooking.dom.peopleAmount);
  }

  initWidgets() {
    
    const thisBooking = this;
    thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
    
    
    thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);
    
    thisBooking.hourPickerWidget = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.datePickerWidget = new DatePicker(thisBooking.dom.datePicker);

    thisBooking.dom.wrapper.addEventListener('updated', function() {
      thisBooking.updateDOM();
    
     

     
    });

   



    
    thisBooking.dom.choosenTable.addEventListener('click',function(event){
      event.preventDefault();
      //thisBooking.initTables();
      const target = event.target;
      const atrybut = target.getAttribute('data-table');// dziala, ale chcialem uzyc offsetParent jak w poprzednim projekcie, tylko, ze tamta opcja zwracala null
      //console.log(atrybut);
      if(!target.classList.contains('booked')){
        if(target.classList.contains('object' && 'table')){
          if(!target.classList.contains('choosen-table')){
            for (let link of thisBooking.dom.iterableObject){
              link.classList.remove('choosen-table');
            }
            target.classList.add('choosen-table');
            thisBooking.tableInformation = atrybut;
            
          }else{
            target.classList.remove('choosen-table');
            thisBooking.tableInformation='';
          }}else{alert('To nie stolik');}} else{
        alert('Stolik zajety');
      }
      
      
      
     
    });
    thisBooking.dom.btnOrder.addEventListener('click',function(event){
      event.preventDefault();
      thisBooking.sendBooking();
    });

    thisBooking.dom.checkBox.addEventListener('click',function(event){
      const thisBooking=this;
      
      const target = event.target;

      
      if(!target.checked){
        thisBooking.bookingLoad.starters.push(target.value);
        console.log('dziala');
      }
      
    });
  }

  

  sendBooking(){
    const thisBooking=this;
    const url = settings.db.url + '/' + settings.db.booking;

    const bookingLoad = {
      date:thisBooking.datePickerWidget.value,
      hour:thisBooking.hourPickerWidget.value,
      table:parseInt(thisBooking.tableInformation),
      duration:thisBooking.hoursAmountWidget.value,
      ppl:thisBooking.peopleAmountWidget.value,
      starters:[],
      phone:thisBooking.dom.phone.value,
      address:thisBooking.dom.address.value,
    };
    
    console.log(bookingLoad);
  }


 
  



}





























export default Booking;