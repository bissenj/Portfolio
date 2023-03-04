/*
SPLIT MODAL
  
AUTHOR:  mountainsandcode

SUMMARY
  - Creates modal by animating in sections of the modal (rather than as one element).  

REQUIRED PARAMETERS  
  - data [array of objects]: array containing params for each section (each array item becomes a section in 'renderFunction' below)
  - renderFunction [func]: function which generates the section html.  This is the magic that makes 
                      each instance of a splitModal look unique.  
OPTIONS      
  - transition-in: Animation sequence to use 
        'left-to-right', 
        'right-to-left', 
        'zipper'
  - transition-out: Animation sequence to use 
        'left-to-right', 
        'right-to-left', 
        'zipper'
*/


class SplitModal {
    componentEl = undefined;
    data = undefined;
    sectionRenderFunction = undefined;
    transition = undefined;

    constructor(data, renderFunction, transition = '') {

        // Store parameters        
        this.data = data;
        this.sectionRenderFunction = renderFunction;  
        this.transition = transition;

        // Initialize
        this.init();     
    }  


    init() {

        // create the parent component.
        const parentEl = document.querySelector('#splitModalContainer') 
        if (parentEl) {
            this.componentEl = parentEl;
        }
        else {
            //let html = `<div id='#splitModalContainer'></div>`;
            let parentNode = document.createElement('div');
            parentNode.setAttribute('id', 'splitModalContainer');
            this.componentEl = document.querySelector('body').appendChild(parentNode);
        }

        
        // Do some validation to make sure we have all the pieces we need.
        if (!this.componentEl) {
            console.error('hey - this component has no parent DOM element to attach to!');
            return;
        }
        if (!this.data) {
            console.error('hey - this component has no data.  There is nothing to build!');
            return;
        }
        if (!this.sectionRenderFunction) {
            console.error('hey - this component has no build instructions.  Send in a section render function!');
            return;
        }
        // Should be good now...

        // Create dom elements for each section
        this.renderSections(this.componentEl, this.data, this.sectionRenderFunction);           
        
        
    }

    // Creates the necessary DOM elements for the modal sections    
    renderSections(componentEl, data, renderFunction) {   
        if (componentEl) {
            
            /// KEYBOARD STUFF
            //

            const ESCAPE_ARROW_DOWN = '27';            

            // Check for TabIndex. Set it if necessary so keyboard events work.        
            if (componentEl.tabIndex < 0) {
                componentEl.tabIndex = 0;
            }            

            // Add support for escape key to close the modal
            componentEl.onkeydown = (e) => {
                e = e || window.event;
                if (e.keyCode == ESCAPE_ARROW_DOWN) this.transitionOut();
            }

            
            /// BUILD EACH SECTION
            //
                        
            let html = "<div class='section-group'>";        
           
            // Render each section
            data.map((item, index) => {
                html += "<div class='section-item slide-in-ltr'>";
                html += renderFunction(item, index);                
                html += "</div>";            
                return html;        
            });

            html += "</div>";            

            componentEl.innerHTML = html;            
        }
        else {
            console.error("No component element found.");
        }  
    }
        

    transitionOut() {
        console.log('Transition Out!');

        const parentEl = document.querySelector('#splitModalContainer') 
        if (parentEl) {
            console.log('Removing Node');            
            parentEl.parentNode.removeChild(parentEl);
        }
    }


}