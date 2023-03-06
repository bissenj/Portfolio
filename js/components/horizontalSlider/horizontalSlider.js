/*
  HORIZONAL SLIDER

  AUTHOR:  mountainsandcode

  REQUIRED PARAMETERS:  
    - componentEl [dom element]:  parent element for the slider
    - data [array of objects]: array containing params for each slide (each array item becomes a slide in 'renderFunction' below)
    - renderFunction [func]: function which generates the slide html.  This is the magic that makes 
                      each instance of a horizontal slider look unique.  Use 'renderFunction' 
                      along with 'createClickHandlers' to make each slide interactive.

  OPTIONAL PARAMETERS:
    - threshold [int] = 100:  how many pixels must a slide be moved before it counts as an index update.
    - wrap [true/false] = false:  allow infinite sliding or stop at left/right boundaries?
    - index [int] = 0:  set the selected index at init time.
    - slideSizeNarrow [0-1] = 1:  Slide width on a narrow aspect ratio.  [1 = 100% of parent width]
    - slideSizeWide [0-1] = 1:  slide width on a wide aspect ratio. .  [1 = 100% of parent width]
    - createClickHandlers [func]= null:  function to call after rendering a slide which sets up custom event listeners for the slide.
    - unSelectHandlers [func] = null:  function to call when a slide is about to lose its place as the selected slide.
    - forwardBack [true/false] = false:  display 'forward', 'back' controls over the slider.

  PUBLIC/EXTERNAL METHODS:            [These are used to communicate with external components]
    - getIndex: returns currently selected index
    - setIndex: sets index (Used when slider is sharing the index with another component, 
                and that component changed the index)

  EVENTS
    - onSlide(event) -> Triggered when new slide is selected but before animation starts.
            - index:   Which slide is currently selected.
            - target:  DOM element for the slide which is currently selected.              
    - onSlideComplete(event) -> Triggered when new slide is selected and animation completes.
            - index:   Which slide is currently selected.
            - target:  DOM element for the slide which is currently selected.  
            - NOTES:   This is a TBD item.                    

  USE CASES:
    - Horizontal Photo gallery
    - Work History Slides with Timeline that listens for events and updates.

  EDGE CASES:
    - Needs to be able to handle resize events without losing position (ex.  switching from landscape to portrait)

  TODO:
    - Instead of 9000 parameters, pass in an object instead, like if this was a React component.

*/


class HorizontalSlider {
  componentEl = undefined;
  data = undefined;
  slideRenderFunction = undefined;
  slideCreateEventHandlers = undefined;
  slideUnSelectHandler = undefined;
  selectedIndex = 0;
  nextSelectedIndex = 0;
  posInitial = 0;
  posFinal = 0;
  posX1 = 0;
  posX2 = 0;
  offsetLeft = 0;
  viewport = undefined;
  slidegroup = undefined;
  slidePadding = 0;
  slideWidth = 0;     
  totalWidth = 0;       // deprecated
  slideSize = 1;
  slideSizeNarrow = 1;
  slideSizeWide = 1;
  maxLeft = 0;
  minLeft = 0;
  threshold = 100;
  allowMove = true;
  allowWrap = false;
  componentWidth = 0;   // for detecting resize events
  componentHeight = 0;  // for detecting resize events
  hasForwardBackControls = false;

  constructor(componentEl, data, renderFunction, threshold = 100, wrap = false, index = 0, 
              slideSizeNarrow = 1, slideSizeWide = 1, createClickHandlers = null, unSelectHandlers = null, forwardBack = false) {
    
    // Store parameters
    this.componentEl = componentEl;
    this.data = data;
    this.slideRenderFunction = renderFunction;  
    this.slideCreateEventHandlers = createClickHandlers; 
    this.slideUnSelectHandler = unSelectHandlers;
    this.threshold = threshold;
    this.allowWrap = wrap;
    this.selectedIndex = index;
    this.slideSize = slideSizeNarrow;
    this.slideSizeNarrow = slideSizeNarrow;
    this.slideSizeWide = slideSizeWide;
    this.hasForwardBackControls = forwardBack;

    // Initialize
    this.init();     
  }  


  init() {
    // Create all the slides
    this.renderSlides(this.componentEl, this.data, this.slideRenderFunction);   
    
    // Event handlers for the slides
    if (this.slideCreateEventHandlers) {
      this.slideCreateEventHandlers();
    }

    // Event Handlers
    this.viewport = this.componentEl.querySelector('.slide-viewer');        

    // - Mouse
    this.viewport.onmousedown = (e) => this.dragStart(e);       // Arrow function so 'this' is class, not event.

    // - Touch
    this.viewport.ontouchstart = (e) => this.dragStart(e);    

    // - Animation
    //this.viewport.ontransitionend = (e) => this.transitionEnd(e);

    
    /* ASPECT RATIO */    
    if (this.slideSize != 1) {
      // Determines how many slides are visible on the screen.  
      // 1.0 = Each slide is 100% view width, so 1 slide is visible. 
      // 0.8 = Each slide is 80% view width.  This shows just enough of the other slides to 
      //       let user know this is a horizontal slider. 
      // 0.5 = Each slide is 50% view width, so 3 slides are visible (one full slide centered and 
      //       two partial slides on the sides).  This works well when screen width is much larger than height.
      // General Idea:  If width is much larger than height, cards look weird and slideOffset 
      //                needs to decrease, and vice-versa.
      //                
      
      // get screen view width and height.
      var width = window.innerWidth
                      || document.documentElement.clientWidth
                      || document.body.clientWidth;

      var height = window.innerHeight
                      || document.documentElement.clientHeight
                      || document.body.clientHeight;

      const ratio = width / height;
      
      if (ratio > 0.9) {          
          this.slideSize = this.slideSizeWide; //0.50;
      }
      else {        
        this.slideSize = this.slideSizeNarrow; 
      }
    }
    /* END ASPECT RATIO */


    // This is what gets moved across the viewport.
    this.slidegroup = this.componentEl.querySelector('.slide-group'); 
    
    // Calculated and Adjust slider based on the slideSize.
    this.slidegroup.style.gridAutoColumns = (this.slideSize * 100) + "%";
    this.slideWidth = this.slidegroup.offsetWidth * this.slideSize;  
    this.slidePadding = this.slidegroup.offsetWidth * (1 - this.slideSize)/2;
    this.maxLeft = this.slideWidth * (this.data.length-1) - this.slidePadding;  
    this.minLeft = this.slidePadding;
    

    if (this.allowWrap) {
      let slides = this.slidegroup.children;
      let cloneFirstSlide = slides[0].cloneNode(true);
      let cloneLastSlide = slides[slides.length-1].cloneNode(true);

      cloneFirstSlide.style.backgroundColor = "orange";
      cloneLastSlide.style.backgroundColor = "red";

      // Insert cloned slides into slide group
      this.slidegroup.insertBefore(cloneLastSlide, slides[0]);
      this.slidegroup.appendChild(cloneFirstSlide);

      // Update selected index
      if (this.selectedIndex == 0) this.selectedIndex = 1;
      if (this.selectedIndex > slides.length-2) this.selectedIndex = slides.length -2;
    }
    
    // Set the current slide    
    this.slidegroup.style.left = -(this.selectedIndex * (this.slideWidth)) + this.slidePadding + "px";

    // Show content on first slide
    this.slidegroup.children[this.selectedIndex].classList.remove('hide-content');    
        
    // Capture the height and width so we can react to resize events
    this.componentWidth = this.componentEl.offsetWidth
    this.componentHeight = this.componentEl.offsetHeight;
  }


  // If the components size changes the slide withs will be incorrect.  Recalculate the widths.
  handleResize() {
    let needsToResize = false;

    if ((this.componentEl.offsetWidth != this.componentWidth) || (this.componentEl.offsetHeight != this.componentHeight)) { needsToResize = true;}

    if (needsToResize) {
      // destroy current component
      this.componentEl.innerHTML = "";

      // rebuild current component
      this.init();
    }
    else {
      //console.log("Slideshow - did not need to resize.");
    }
  }

  // Creates the necessary DOM elements for the slider:
  // slide-viewer:  narrow window which displays a slide.
  // slide-group:  all the slides laid out horizontally (wider than slide-viewer).
  renderSlides(componentEl, data, renderFunction) {   
    if (componentEl) {

        // Check for TabIndex. Set it if necessary so keyboard events work.        
        if (componentEl.tabIndex < 0) {
          componentEl.tabIndex = 0;
        }

        const LEFT_ARROW_DOWN = '37';
        const RIGHT_ARROW_DOWN = '39';

        // Add support for arrow keys to move through slider.
        componentEl.onkeydown = (e) => {
          e = e || window.event;

          if (e.keyCode == LEFT_ARROW_DOWN) this.moveSlides(-1);
          if (e.keyCode == RIGHT_ARROW_DOWN) this.moveSlides(1);
        }               
        
        // Grab Panels are used for mobile so users don't get stuck sliding the slides horizontally
        // when they are trying to scroll up or down.
        let html = "<div class='left-grab-panel'></div><div class='right-grab-panel'></div>";        

        html += "<div class='slide-viewer'>";
        if (this.hasForwardBackControls) {
          html += "<div class='control back' role='button'><div class='hide-but-read'>Back</div></div><div class='control forward' role='button'><div class='hide-but-read'>Forward</div></div>";
        }
        html += "<div class='slide-group'>";
        data.map((item, index) => {
          html += renderFunction(item, index);
          return html;        
        });
        html += "</div>";
        html += "</div>";

        componentEl.innerHTML = html;

        // Handle scenario where slider has forward/back controls
        if (this.hasForwardBackControls) {
          setTimeout(() => {
            const backControl = componentEl.querySelector('.back')
            if (backControl) {
              backControl.onclick = (e) => {
                this.moveSlides(-1);
                e.preventDefault();
              }       
            }

            const forwardControl = componentEl.querySelector('.forward')
            if (forwardControl) {                            
              forwardControl.onclick = (e) => {
                this.moveSlides(1);
                e.preventDefault();
              }              
            }
          }, 300);
        }
    }
    else {
        console.error("No component element found.");
    }  
  }


  // Handle scenario where user starts dragging a slide
  dragStart(e) {
    if (this.allowMove) {

      this.posInitial = this.slidegroup.offsetLeft;
    
      if (e.type == 'touchstart') {
        this.posX1 = e.touches[0].clientX;

        // Create Touch Listeners
        this.viewport.ontouchend = (e) => this.dragEnd(e); 
        this.viewport.ontouchleave = (e) => this.dragEnd(e);
        this.viewport.ontouchmove = (e) => this.dragUpdate(e);
      }
      else {
        this.posX1 = e.clientX;

        // Create Mouse Listeners
        this.viewport.onmouseup = (e) => this.dragEnd(e);
        this.viewport.onmouseleave = (e) => this.dragEnd(e);
        this.viewport.onmousemove = (e) => this.dragUpdate(e);


        // Prevent Default when it's not a touch event

        // CAREFUL HERE
        // this will prevent any hrefs from working on mobile...
        // but commenting this out breaks dragging on desktop (when clicking on an image).
        e.preventDefault();        
        
        // TODO - Look into why prevent default is needed here but not on mobile.
        //        Maybe start here:  https://developer.chrome.com/blog/scrolling-intervention/
      }    
    }
  }


  // Handle scenario where user is finishing dragging.
  // If the slide has been dragged 'enough', move to a new slide, otherwise stay on the current slide, and 
  // clean up by clearing out the event listeners.
  dragEnd(e) {    
    this.posFinal = this.slidegroup.offsetLeft;
    const distance = this.posFinal - this.posInitial;

    // Determine how to update the slide based on the distance moved, and the move threshold.
    if (distance < -this.threshold) {      
      this.moveSlides(1, 'drag');
    }else if (distance > this.threshold) {      
      this.moveSlides(-1, 'drag');
    }
    else {   // didn't move enough so put current slide back to original position.      
      this.moveSlides(0, 'drag');
    }

    // Clear out event handlers.
    this.viewport.onmouseup = null;
    this.viewport.onmousemove = null;
    this.viewport.onmouseleave = null;

    this.viewport.ontouchend = null;        
    this.viewport.ontouchleave = null;
    this.viewport.ontouchmove = null;
  }


  // Handle slide being moved.  This gets fired a lot during the drag-start-end cycle and each dragUdpdate should be a 
  // small increment from the last one.
  dragUpdate(e) {
    if (e.type == 'touchmove') {
      this.posX2 = this.posX1 - e.touches[0].clientX;
      this.posX1 = e.touches[0].clientX;
    } else {
      this.posX2 = this.posX1 - e.clientX;
      this.posX1 = e.clientX;
    }    

    // How much did we move between now and the last update?
    // Should be small...1-2px...or the effect is going to be janky.
    let move = (this.slidegroup.offsetLeft - this.posX2);
    
    // Boundary checking (if no wrap option is selected)
    if (!this.allowWrap) {      
      if (move > this.minLeft) { move = this.minLeft; }     // Stop at left Edge
      if (move < -this.maxLeft) { move = -this.maxLeft; }   // Stop at Right Edge
    }

    // Move the slides
    this.slidegroup.style.left = move + "px";    
  }


  // Move the slider to a new slide
  moveSlides(direction, action) {

    // Bail if we're hitting a boundary (this only applies to no-wrap sliders)
    if (!this.allowWrap) {      
      if ((this.selectedIndex + direction) > this.data.length-1 || 
          (this.selectedIndex + direction) < 0) {        
        return;
      }
    }
   
    // Only move if there are no other moves currently taking place
    if (this.allowMove) {

      // Add class with transition styles
      this.slidegroup.classList.add('animating');

      // Hide content as slide moves off screen
      if (direction != 0) {
        this.slidegroup.children[this.selectedIndex].classList.add('hide-content');

        // Custom callback to reset slide before it moves away from being selected.
        this.slideUnSelectHandler(this.slidegroup.children[this.selectedIndex]);
      }

      if (!action) {         
        this.posInitial = this.slidegroup.offsetLeft;         
      }   

      // Direction is probably +1 or -1 so adjust the left and index accordingly.
      const move = (this.posInitial) - (direction * this.slideWidth);   
      this.slidegroup.style.left = move + "px";
      this.selectedIndex += direction;

      
      // Make sure selected index being sent in event is correct.  Gets tricky with
      // wrapping logic.        
      let newIndex = this.selectedIndex;
      if (this.allowWrap) {
        if (newIndex > this.data.length) {
          // Edge Case:  Right side - wrap it back to first element in data array.
          newIndex = 0;
        }
        else if (newIndex < 1) {
        // Edge Case:  Left side - wrap it to last element in data array.
        newIndex = this.data.length - 1;        
        }
        else {
          // non-edge cases: since we have an extra node in front and end, subtract 1 to get it to 
          // match the data array.
          newIndex -= 1;
        }
      }      
            
      // Let the outside world know the selected index changed.
      this.dispatchOnSlide(newIndex);
      
      // Don't allow any other moves to take place until the move animation is finished.
      this.allowMove = false;

      // enable controls on the slideshow after the slide is done transitioning
      setTimeout(() => {
        this.transitionEnd();
      }, 1000);
    }
    else {      
      this.nextSelectedIndex = direction;
    }
  }


  // Called when the slide transition has finished.  This takes care of wrapping the indexes
  // and sending out an animation complete event.
  transitionEnd() {          
    this.slidegroup.classList.remove('animating');      

    // logic to handle wrapping the slides - Update the position and set new selected index
    let newIndex = this.selectedIndex;
    if (this.allowWrap) {
      const MIN_INDEX = 1;
      const MAX_INDEX = this.data.length;      
        
      // Edge case Left:  selected index is at first element of array.  Send it to last element.
      if (this.selectedIndex < MIN_INDEX) {                
        this.slidegroup.style.left = -(MAX_INDEX * this.slideWidth) + "px";
        newIndex = MAX_INDEX;        
      }

      // Edge case Right:  selected index is at last element in array.  Send it to first element.
      if (this.selectedIndex > MAX_INDEX) {        
        this.slidegroup.style.left = -(this.slideWidth) + "px";
        newIndex = 1;        
        
      }      
      
      this.selectedIndex = newIndex;

      newIndex -= 1;   // Adjust index for the event dispatch otherwise will be off by one.
    }

    this.allowMove = true;

    // Show content
    this.slidegroup.children[this.selectedIndex].classList.remove('hide-content');

    
    // 20230106 - Handle bug where selected index changes when slide is currently animated,
    //            which causes this component to be out of sync with other components sharing the 
    //            selected index.
    if (this.nextSelectedIndex !== 0) {
      this.moveSlides(this.nextSelectedIndex);
      this.nextSelectedIndex = 0;    // Reset
    }

  }


  // Hide the slider on screen.  Not currently used.
  destroy() {
    this.componentEl.style.opacity = 0;    
  }

  
  // -----------------------------------------------------------------
  // CUSTOM EVENTS
  // -----------------------------------------------------------------

  // Triggered when selected index is changed (but before animation starts)
  dispatchOnSlide(index) {    
    const event = new CustomEvent('onslide', {
      bubbles: true,
      detail: { 
        index: index,        
      }    
    });

    // Have the current slide trigger the event (so the target of the event is the current slide)
    this.slidegroup.children[index].dispatchEvent(event);
  }

  // Triggered when selected index is changed and animation is complete.
  dispatchOnSlideComplete(index) {
    const event = new CustomEvent('onslidecomplete', {
      bubbles: true,
      detail: { 
        index: index,
      }    
    });

    // Have the current slide trigger the event (so the target of the event is the current slide)
    this.slidegroup.children[index].dispatchEvent(event);
  }

  
  // -----------------------------------------------------------------
  // PUBLIC/EXTERNAL METHODS
  // -----------------------------------------------------------------
  getIndex() {
    return this.selectedIndex;
  }

  setIndex(index) { 
    if (this.allowWrap) {
      index += 1;
      if (index > this.data.length) { 
        console.log("resetting index", this.data.length);
        index = 0;
      }
    }    

    let direction = index - this.selectedIndex;      

    // Make sure the index actually changed before doing anything.
    if(index == this.selectedIndex) {       
      return;
    }

    this.moveSlides(direction);
    
    /*
    // Alternate approach
    // Only move if there are no other moves currently taking place
    if (this.allowMove) {

      if (this.allowWrap) {
        index += 1;
        if (index >= this.data.length) index = 0;
      }

      let direction = index - this.selectedIndex;      
      
      this.slidegroup.classList.add('animating');
      this.selectedIndex = index;
      this.slidegroup.style.left = -(this.selectedIndex * this.slideWidth) + "px";
      this.allowMove = false;
    }
    */
  }
}
