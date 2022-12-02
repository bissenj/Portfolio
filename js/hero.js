
import {imageCollage} from '../data/data.js';

// JS structure notes:  https://css-tricks.com/slider-with-sliding-backgrounds/

var ImageModal = {

    // Elements
    el: {
        //imageNode: 'div.image2', //document.querySelector('div.image1'),
        imageNodes: document.querySelectorAll('div.about-image'),
        animating: false,
    },

    // Event Handlers
    init: function() {
        //console.log(document.querySelector('div.image1'));
        //console.log(this.el.imageNodes);

        // click handlers
        ImageModal.el.imageNodes.forEach((node) => {
            node.addEventListener("click", function(event) {
                ImageModal.handleClick(event);
            });
        })        
    },    

     // Functions

     // Take clicked element and puts it in a lightbox.
     handleClick: function(event) {
        if (!ImageModal.el.animating) {
            console.log("Click!");
            

            // Get window.computedValues for height, width
            let w = window.getComputedStyle(event.target).getPropertyValue("width");        
            let h = window.getComputedStyle(event.target).getPropertyValue("height");   
            let bounding = event.target.getBoundingClientRect();     
                        
            // PARENT
            const parent = event.target.parentNode;     // ie div.row1 or div.row2
         
            // CALCULATE LEFT POSITION
            // -----------------------
            // To position the cloned element over it's original, need to add up the sibling elements widths
            // to the left of it:  
            //  ie.  Image1.left = 0.  Image2.left = (Image1.Width), Image3.left = (Image1.width + Image2.width)
            
            // Logic:  Figure out the index that this event element is at, and at the same time,
            //         add up the widths of the elements to the right of the element being iterated on.
            //        
            const widthAtPosition = [];      
            let cummulativeWidth = 0;
            let index = 0;
            for (const node of parent.children) {            
                
                widthAtPosition.push(cummulativeWidth);
                if (node == event.target) {                
                    break;  // If we found our node, we're done.
                }            
                widthAtPosition[index++] = cummulativeWidth; 
                cummulativeWidth += node.offsetWidth;   // Do this now so next loop it will have this elements width.
            }            
            const elementLeft = widthAtPosition[index];


            // CALCULATE RIGHT POSITION
            // ------------------------
            // The transformations occurred at 0,0 -> Top 0px, so we need to know which row this element
            // is on so later when we reposition the element we can adjust it to the correct 'Top' value.
            // ie.  Row 1 = Top 0px, Row 2 = (Row1.Height)
            
            // HACK FOR NOW
            let newTop = 0;
            if (parent.classList.contains('row2')) {                   
                newTop = event.target.parentNode.parentNode.children[0].offsetHeight; 
            }
            
            // 1.  Clone the element
            const newElement = event.target.cloneNode();
            newElement.tabIndex = 0;
            // newElement.style.maxHeight = 'default';
            newElement.style.overflow = 'hidden';
            newElement.style.position = 'absolute';
            newElement.style.zIndex = 200;
            newElement.style.width = w; //bounding.width;
            newElement.style.height = h; //bounding.height;
            newElement.style.top = "0px"; //bounding.y + "px"; //bounding.top;
            newElement.style.left = elementLeft + "px"; //bounding.x + "px"; //bounding.left;   

            // Save these off to be restored when element transitions out.
            const savedElementSettings = {
                width: w,
                height: h,
                top: 0,
                left: elementLeft
            };
            
            // Get the index so we know what caption to display.
            const dataIndex = event.target.dataset.index;
            const caption = imageCollage[dataIndex].caption;

            const textElement = document.createElement('div');
            textElement.classList.add('text-overlay');                
            textElement.innerHTML = `<p class='title'>${caption}</p>`;            
            newElement.appendChild(textElement);

            // Close Button
            const closeButton = document.createElement('button');
            closeButton.classList.add('close-button');
            closeButton.innerHTML = 'X';
            closeButton.addEventListener("click", function(event) {            
                ImageModal.transitionOut(newElement, savedElementSettings);
            });
            newElement.appendChild(closeButton);
            window.setTimeout(() => {
                closeButton.style.opacity = 1;
            }, 2000);
            
            // Add to parent container
            parent.appendChild(newElement);            

            /// MODALS
            this.showModals(() => {this.transitionOut(newElement, savedElementSettings)});
            
            const debug = false;
            if (!debug) {
                window.setTimeout(() => {

                    // Kick of the Transition-In animation
                    newElement.classList.add('transition-in');   
                      
                    window.setTimeout(() => {
                        let screenWidth = window.innerWidth;                        
                        let parentWidth = parent.clientWidth;

                        // Because the 'diagonal row' has a width larger than the screen size, we need to 
                        // calculate the screen width version of that and use it instead of a straight width percentage.            
                        // Screen Dimensions for Test:  918 x 1214
                        //
                        const divisor = screenWidth / parentWidth;
                        const newWidth = 80 * divisor;     // 80% * 0.57 = 45.6
                        const newElementWidth = 0.8 * parentWidth * divisor;   // 0.8 * 1607 * 0.57 = 732
                        const newElementHeight = 1.0 * (newElementWidth * divisor); 
                        // Left needs to be 127 but it gets computed at 92.  Because translation is happening
                        // at a 30' diagonal, enhance it a bit.
                        const newLeft = (screenWidth - newElementWidth) / 2 * 1.3;

                        // ROW2 Left:  119, needs to be 238
                        
                        newElement.style.width = newWidth + '%';            
                        newElement.style.left = newLeft + "px";
                        newElement.style.top = "-" + newTop + "px";            

                        newElement.style.maxHeight = newElementHeight  + 'px'; //'500px';
                        newElement.style.height = newElementHeight + 'px';// '400px'; //'100%';                        

                        // window.setTimeout(() => {

                        //     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        //     window.scrollTo({
                        //         top: scrollTop - newElementHeight,                                
                        //         behaviour: 'smooth'
                        //         }
                        //     );

                        //     // Breaks when element is horizontally off screen
                        //     //const options = {behavior: "smooth", block: "end" }
                        //     //newElement.scrollIntoView(options);
                        // }, 500);

                    }, 1200);   // This delay gives the rotation animatins time to finish before translating. Makes landing a bit smoother.             
                }, 100);
            }
        }
        else { console.log("Can't Transition In, currently animating")}
    },
    transitionOut: function(newElement, savedElementSettings) {
        if (!ImageModal.el.animating) {

            // Set flag so we don't animate until this is done.
            ImageModal.el.animating = true;

            console.log("Transition Out!", event.target);
                    
            // Fade the close button out
            // event.target.style.opacity = 0;
            newElement.querySelector('.close-button').style.opacity = 0;


            /// Option 1:  Reverse the transition in.  
            ///            Somewhat of a simple transition.        
            ///*
            // Move the element back and restore its height and width
            newElement.style.top = savedElementSettings.top + "px";
            newElement.style.left = savedElementSettings.left + "px"; 
            newElement.style.width = savedElementSettings.width; 
            newElement.style.height = savedElementSettings.height;        
                        
            // Move element back to its original position when cloned.
            window.setTimeout(() => { 
                // // Kick off the transition-out animations
                newElement.classList.add('transition-out');
                newElement.classList.remove('transition-in');
            }, 900);     // This delay gives the rotation animations time to finish before translating. Makes landing a bit smoother.             
            //*/


            /// Option 2:   Spin and zoom, then translate
            ///             Rollercoaster effect.
            /*
            // Kick off the transition-out animations
            newElement.classList.add('transition-out');
            newElement.classList.remove('transition-in');
            
            // Move element back to its original position when cloned.
            window.setTimeout(() => { 
                // Move the element back and restore its height and width
                newElement.style.top = savedElementSettings.top + "px";
                newElement.style.left = savedElementSettings.left + "px"; 
                newElement.style.width = savedElementSettings.width; 
                newElement.style.height = savedElementSettings.height;   
            }, 900);     // This delay gives the rotation animations time to finish before translating. Makes landing a bit smoother.             
            */


            // Fade out the element and modals
            window.setTimeout(() => {            
                newElement.style.opacity = 0;                  
                this.fadeModals();                
            }, 2500);

            // Remove the element and modals from the DOM
            window.setTimeout(() => {            
                this.hideModals();            
                newElement.remove();  
            }, 4000);
        }
        else console.log("Can't transitionOut(), currently animating");      
    },
    showModals: (callback) => {  
        if (!ImageModal.el.animating) {
            console.log("showModals()");

            ImageModal.el.animating = true;

            const pageModal = document.createElement('div');                
            pageModal.classList.add('modal');  
            document.querySelector('main').prepend(pageModal);
            window.setTimeout(() => {
                pageModal.classList.add('show', 'on-top');
            }, 100);  
            
            const transformedModal = document.createElement('div');                
            transformedModal.classList.add('modal-overlay'); 
            document.querySelector('.diagonal-rects').appendChild(transformedModal);
            window.setTimeout(() => {
                transformedModal.classList.add('show', 'on-top');
            }, 100);  

            // Add close handlers after everything has finished.
            window.setTimeout(() => {
                pageModal.addEventListener('click', callback);
                transformedModal.addEventListener('click', callback);
                ImageModal.el.animating = false;
            }, 3000);  
        }  
        else console.log("Can't showModals(), currently animating");      
    },
    fadeModals: () => {        
        //console.log("fadeModals()");
        
        const pageModal = document.querySelector('.modal');
        pageModal.classList.remove('show');        
                
        const transformedModal = document.querySelector('.modal-overlay');
        transformedModal.classList.remove('show');                   
    },
    hideModals: () => { 
        //console.log("hideModals()");

        const pageModal = document.querySelector('.modal');
        pageModal.remove();            
                
        const transformedModal = document.querySelector('.modal-overlay');
        transformedModal.remove();            
            
        ImageModal.el.animating = false;    
    },    
};

ImageModal.init();