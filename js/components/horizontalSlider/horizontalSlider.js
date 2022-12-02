/*
  UNIVERSAL SLIDER

  OPTIONS  
    - wrap [true/false]:  
            - true:  when reaching last slide, next slide is 
                      first slide, and vice versa.
            - false: when reaching last slide, stop (no further right).  
                     On first slide, don't allow going back (left).        
    - slides [dom elements]: array of html contents of slides
    - threshold [int]:  how many pixels of movement before advancing to next slide.
    - startingSlide [int]:  which slide to start on
    - click callback:  transition to another page when slide is clicked


  PUBLIC METHODS:
    - updateSelected(direction, triggerEvents): -1 or 1 to advance the current slide Left or Right.
            - direction:  integer used to modify the currently selected slide.  Can be greater than 1.
            - triggerEvents:  true/false indicating whether or not this should kick off onSlide event.

  EVENTS
    - onSlide(event) -> Triggered when new slide is selected but before animation starts.
            - index:   Which slide is currently selected.
            - target:  DOM element for the slide which is currently selected.            
    - onSlideComplete(event) -> Triggered when new slide is selected and animation completes.
            - index:   Which slide is currently selected.
            - target:  DOM element for the slide which is currently selected.            

  USE CASES:
    - Horizontal Photo gallery
    - Work History Slides with Timeline that listens for events and updates.

  REQUIREMENTS:
    - Needs to be able to handle resize events without losing position (ex.  switching from landscape to portrait)

*/


class HorizontalSlider {
  componentEl = undefined;
  data = undefined;
  slideRenderFunction = undefined;
  slideCreateEventHandlers = undefined;
  selectedIndex = 0;
  posInitial = 0;
  posFinal = 0;
  posX1 = 0;
  posX2 = 0;
  offsetLeft = 0;
  viewport = undefined;
  slidegroup = undefined;
  slideWidth = 0;
  totalWidth = 0;
  threshold = 100;
  allowMove = true;
  allowWrap = false;
  componentWidth = 0;   // for detecting resize events
  componentHeight = 0;  // for detecting resize events

  constructor(componentEl, data, renderFunction, threshold = 100, wrap = false, index = 0, createClickHandlers) {
    
    // Store parameters
    this.componentEl = componentEl;
    this.data = data;
    this.slideRenderFunction = renderFunction;  
    this.slideCreateEventHandlers = createClickHandlers; 
    this.threshold = threshold;
    this.allowWrap = wrap;
    this.selectedIndex = index;

    // Initialize
    this.init();
 
    //console.log("Horizontal Slider Loaded. Selected Index: ", this.selectedIndex);
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
    this.viewport.ontransitionend = (e) => this.transitionEnd(e);



    // This is what gets moved across the viewport.
    this.slidegroup = this.componentEl.querySelector('.slide-group');   
    this.slideWidth = this.slidegroup.offsetWidth;  // only true if slide is 100% of viewport

    //this.slideWidth = this.slidegroup.offsetWidth / 2;  // NEED to modify this to slides visible.

    this.totalWidth = this.slidegroup.offsetWidth * (this.data.length-1);  

    //console.log('Total Width: ', this.totalWidth, 'Slide Width: ', this.slideWidth);

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
    //this.slidegroup.style.left = -(this.selectedIndex * this.slideWidth) + (this.slideWidth / 2) + "px";
    this.slidegroup.style.left = -(this.selectedIndex * this.slideWidth) + "px";

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
      //console.log("Slideshow needs to resize.");
      //console.log("Old W/H: ", this.componentWidth, this.componentHeight);
      //console.log("New W/H: ", this.componentEl.offsetWidth, this.componentEl.offsetHeight);
      
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

        // Add support for arrow keys to move through slider.
        componentEl.onkeydown = (e) => {
          e = e || window.event;

          if (e.keyCode == '37') this.moveSlides(-1);
          if (e.keyCode == '39') this.moveSlides(1);
        }               
        

        let html = "<div class='left-grab-panel'></div><div class='right-grab-panel'></div>";        

        html += "<div class='slide-viewer'>";
        html += "<div class='slide-group'>";
        data.map((item, index) => {
          html += renderFunction(item, index);
          return html;        
        });
        html += "</div>";
        html += "</div>";

        componentEl.innerHTML = html;
    }
    else {
        console.error("No component element found.");
    }  
  }

  // Drag Start
  dragStart(e) {
    //console.log("Drag start: ", e);
    e.preventDefault();

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
      }    
    }
  }

  // Drag End
  dragEnd(e) {    
    //console.log("Drag End");

    this.posFinal = this.slidegroup.offsetLeft;
    const distance = this.posFinal - this.posInitial;
    //console.log("Drag Distance: ", distance);


    // Determine how to update the slide based on the distance moved, and the move threshold.
    if (distance < -this.threshold) {      
      this.moveSlides(1, 'drag');
    }else if (distance > this.threshold) {      
      this.moveSlides(-1, 'drag');
    }
    else {      
      this.slidegroup.style.left = (this.posInitial) + "px";
    }

    // Clear out event handlers.
    this.viewport.onmouseup = null;
    this.viewport.onmousemove = null;
    this.viewport.onmouseleave = null;

    this.viewport.ontouchend = null;        
    this.viewport.ontouchleave = null;
    this.viewport.ontouchmove = null;
  }

  // Drag Update
  dragUpdate(e) {
    //console.log("Drag Update");

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
      if (move > 0) { move = 0; }   // Stop at left Edge
      if (move < -this.totalWidth) { move = -this.totalWidth; }   // Stop at Right Edge
    }

    // Move the slides
    this.slidegroup.style.left = move + "px";    
  }

  moveSlides(direction, action) {

    // Bail if we're not actually moving anywhere
    if (direction == 0) return;

    // Bail if we're hitting a boundary (this only applies to no-wrap sliders)
    if (!this.allowWrap) {      
      if ((this.selectedIndex + direction) > this.data.length-1 || 
          (this.selectedIndex + direction) < 0) {
        //console.log("Hit boundary.  Bailing.");
        return;
      }
    }
   
    // Only move if there are no other moves currently taking place
    if (this.allowMove) {

      // Add class with transition styles
      this.slidegroup.classList.add('animating');

      // Hide content as slide moves off screen
      this.slidegroup.children[this.selectedIndex].classList.add('hide-content');


      if (!action) {         
        this.posInitial = this.slidegroup.offsetLeft; 
        //console.log("No action.  Setting posInitial to: ", this.posInitial);
      }   // What does this do?

      // Direction is probably +1 or -1 so adjust the left and index accordingly.
      const move = (this.posInitial) - (direction * this.slideWidth);   
      this.slidegroup.style.left = move + "px";
      this.selectedIndex += direction;

      //console.log("New Move: ", move, this.selectedIndex);

   
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
      
      //console.log("Selected Index: ", this.selectedIndex, "New Index: ", newIndex);    
      
      this.dispatchOnSlide(newIndex);
      
      this.allowMove = false;
    }
  }


  // Called when the slide transition has finished.  This then takes care of wrapping the indexes
  // and sending out an animation complete event.
  transitionEnd(e) {    
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


    // This was a terrible idea.
    //this.dispatchOnSlideComplete(newIndex);    
  }


  destroy() {
    this.componentEl.style.opacity = 0;    
  }

  
  // -----------------------------------------------------------------
  // CUSTOM EVENTS
  // -----------------------------------------------------------------

  // Triggered when selected index is changed (but before animation starts)
  dispatchOnSlide(index) {
    //console.log("horizontalSlider -> onSlide: ", index);
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
    console.log("horizontalSlider -> onSlideComplete: ", index);

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
  // PUBLIC METHODS
  // -----------------------------------------------------------------
  getIndex() {
    return this.selectedIndex;
  }

  setIndex(index) { 
    
    //console.log("setSelectedIndex:", index);
    if (this.allowWrap) {
      index += 1;
      if (index > this.data.length) { 
        console.log("resetting index", this.data.length);
        index = 0;
      }
    }    

    let direction = index - this.selectedIndex;      
    //console.log("Index:", index, "direction: ", direction);
    

    // Make sure the index actually changed before doing anything.
    if(index == this.selectedIndex) { 
      //console.log("Bailing - Index did not change");
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


/* 

REFERENCES:

// Book -> Javascript & JQuery by Jon Duckett.
// Article -> https://medium.com/@claudiaconceic/infinite-plain-javascript-slider-click-and-touch-events-540c8bd174f2
// Demo -> https://codepen.io/cconceicao/pen/PBQawy
// Article -> https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events

*/

