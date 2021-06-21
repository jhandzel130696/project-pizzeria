import { templates} from '../settings.js';
class homePage{
  constructor(widgetContainerHomePage){
    const thisHome=this;
    
    thisHome.render(widgetContainerHomePage);

  }

  render(widgetContainerHomePage){
      const thisHome=this;
      const generatedHTML=templates.homePage();
      thisHome.dom={};
      thisHome.dom.wrapper=widgetContainerHomePage;
      thisHome.dom.wrapper.innerHTML=generatedHTML;


  }

}







export default homePage;