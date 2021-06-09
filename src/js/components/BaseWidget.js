class BaseWidget {
    constructor(wrapperElement, initialValue) {
        const thisBaseWidget = this;
        thisBaseWidget.dom = {};
        thisBaseWidget.dom.wrapper = wrapperElement;
        thisBaseWidget.value = initialValue;
    }
    setValue(value) {
        const thisWidget = this;
        const newValue = parseInt(value);

        //add validation


        if (thisWidget.value !== newValue && thisWidget.isValid(newValue)) {
            thisWidget.value = newValue;

            thisWidget.announce();

        }

        thisWidget.renderValue();

    }
    parsedValue(value) {
        return parseInt(value)
    };

    isValid(value) {
        return !isNaN(value);
    }
    renderValue() {
        const thisWidget = this;

        thisWidget.dom.wrapper.innerHTML = thisWidget.value;
    }
    announce() {
        const thisWidget = this;
        const event = new CustomEvent('updated', {
            bubbles: true
        });
        thisWidget.dom.wrapper.dispatchEvent(event);
    }
}
export default BaseWidget;