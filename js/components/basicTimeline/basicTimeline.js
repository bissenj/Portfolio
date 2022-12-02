/*
  BASIC TIMELINE

  SUMMARY
    - Creates a basic horizontal timeline component from an array of events with a start and end year.
    - On event date select, the timeline will highlight a line from the starting date to the 
      end date.
    - Each event on timeline can be clicked on or navigated to with keyboard    

  REQUIRED PARAMETERS
    - events: array of objects with a startYear and endYear.

  OPTIONS      
    - starindex [int]:  which event to start on
    - buttons [true/false]: display forward / backward buttons
    - wrap [true/false]:  At last event, should pressing forward button set index to first event & vice versa.

  PUBLIC METHODS:
    - updateIndex(int): sets selected index

  EVENTS
    - onIndexChanged(event) -> Triggered when index is changed.
            - index:   Which index is currently selected.            
    
  USE CASES:    
    - Work History Slides with Timeline that listens for events and updates.

  REQUIREMENTS:
    - Needs to be able to handle resize events without losing position (ex.  switching from landscape to portrait)
*/


class BasicTimeline {
    componentEl = undefined;
    timelineEl = undefined;
    state = {
        widthPerTick: 0,
        data: undefined,
        startYear: 0,
        endYear: 0,
        index: 0,    
        componentWidth: 0,   // for detecting resize events
        componentHeight: 0,  // for detecting resize events
    }
  
    constructor(componentEl, data, index = 0, wrap = false, startYear = 1995, endYear = 2025) {      
      // Store parameters
      this.componentEl = componentEl;
      this.state.data = data;
      this.state.index = index;
      this.state.wrap = wrap;
      this.state.startYear = startYear;
      this.state.endYear = endYear;

      this.init();
    }

    init() {

        // Clear out timeline before we rebuild it.
        this.componentEl.innerHTML = "";

        // Render timeline elements
        this.render(this.componentEl, this.state.data);

        this.setIndex(this.state.index, true);

        // Wire up the forward and back buttons
        this.addEventHandlers(this.componentEl);

        // Capture the height and width so we can react to resize events
        this.state.componentWidth = this.componentEl.offsetWidth
        this.state.componentHeight = this.componentEl.offsetHeight;

        console.log("Timeline initialized");
    } 

    // If the components size changes the slide withs will be incorrect.  Recalculate the widths.
    handleResize() {
        let needsToResize = false;

        if ((this.componentEl.offsetWidth != this.state.componentWidth) || (this.componentEl.offsetHeight != this.state.componentHeight)) { needsToResize = true;}

        if (needsToResize) {
            console.log("Timeline needs to resize.");
            console.log("Old W/H: ", this.state.componentWidth, this.state.componentHeight);
            console.log("New W/H: ", this.componentEl.offsetWidth, this.componentEl.offsetHeight);


            // destroy current component
            this.componentEl.innerHTML = "";

            // rebuild current component
            this.init();
        }
        else {
            console.log("Timeline - did not need to resize.");
        }
    }

    // Render timeline
    render(componentEl, data) {
        console.log("Rendering new timeline.");

        /// 1
        // Create buttons and timeline bar element
        this.renderTimelineBar(componentEl);

        /// 2
        // Create year ticks
        this.renderYearTicks(componentEl, data);        


        /// 3
        // Create event markers
        this.renderEventMarkers(componentEl, data);
        

        console.log("Finished rendering new timeline.");
    }

    renderTimelineBar(componentEl) {
        let html = `
            <!-- Header -->
            <div class='timeline-header'>
                <div class='heading'>
                    <span>work</span><span>Experience</span>
                </div>
            </div>

            <!-- Timeline Component -->
            <div class='timeline-container' tabIndex='0'>
                <button id="backBtn" role="button">  &#5130; </button>
                <div class="timeline"></div>
                <button id="forwardBtn" role="button"> &#5125; </button>
            </div>
            `;

        //let el = document.getElementById(targetId);
        //if (el) {
        componentEl.innerHTML = html;
        //}
        //else {
        //    console.error("No DOM element with id " + targetId + " found.");
        //}
    }

    // Render all the year ticks on the timeline
    renderYearTicks(componentEl, events) {
        const timelineEl = componentEl.querySelector('.timeline');

        // Calculate some stuff needed for rendering
        const numTicks = this.state.endYear - this.state.startYear;
        const timelineWidth = timelineEl.offsetWidth;

        const widthPerTick = timelineWidth / numTicks;
        timelineEl.dataset.widthPerTick = widthPerTick;  // Do we still need this?
        this.state.widthPerTick = widthPerTick;

        // Add year ticks to the timeline
        let s = this.state.startYear; let offsetX = -10;
        for(s; s <= this.state.endYear; s++) {  
            if (s == this.state.endYear) offsetX += 1;  // Correct cumulative rounding errors for the last marker
            this.renderYearTick(events, s, timelineEl, offsetX);
            offsetX += widthPerTick;
        }
    }

    // Render individual year ticks on timeline
    renderYearTick(events, year, timelineEl, offsetX) {
        // Check if there is an event marker for this year.  If so, don't do anything.            
        let markers = events.find(event => event.yearStart == year);
        
        if (markers !== undefined) return;
    
        let html = "";
        if (year % 5 === 0) {
            html = `<div class='year-marker' style='left:${offsetX}px'>                    
                            <div class='year-arm' style='height: ${25}px; top: -12px;'></div>                                            
                        </div>`;
        }
        else {
            html = `<div class='year-marker' style='left:${offsetX}px'>                    
                            <div class='year-arm'></div>                    
                        </div>`;
        }
    
        timelineEl.innerHTML += html;
    }

    renderEventMarkers(componentEl, events) {
        const timelineEl = componentEl.querySelector('.timeline');

        // Add each event as a marker on the timeline
        events.map((event, index) => {    
            const offsetX = (event.yearStart - this.state.startYear) * this.state.widthPerTick - 20;      // WHY 20?            
            this.renderEventMarker(index, event, timelineEl, offsetX, 0);
        });
    }

    renderEventMarker(index, event, timelineEl, offsetX, offsetWidth) {            

        let html = `<div id='Marker${event.yearStart}-${event.yearEnd}' data-year=${event.yearStart} data-index=${index} class='event-marker' style='left:${offsetX}px'>
                        <div class='event-circle'></div>
                        <div class='event-arm'></div>
                        <div class='event-text'>${event.yearStart}</div>
                        <div class='event-selected' style='width:${offsetWidth}'>
                    </div>`;
    
        timelineEl.innerHTML += html;
    }    

    updateSelectedEventConnector(event, reset = false) {
        let container = this.componentEl.querySelector(`#Marker${event.yearStart}-${event.yearEnd}`);
        let el = container.querySelector('.event-selected');
                
        // FUTURE IMPROVEMENT - don't like how timeline is hardcoded here.
        //let widthPerTick =  this.state.widthPerTick;  //this.componentEl.querySelector('.timeline').dataset.widthPerTick;
        let width = (event.yearEnd - event.yearStart) * this.state.widthPerTick;
        
        // Add a bit of a delay so the Timeline and Slide show move at the same time.
        let delay = (reset ? 0 : 250);

        window.setTimeout(() => {
            if (reset) {
                width = 0;
                el.classList.add('no-transition');
            }
            else {
                el.classList.remove('no-transition');    
            }        
            el.style.width = `${width}px`;      // Kicks off the animation when this is the selected event.
        }, delay)
    }

    // Set the event handlers for this component
    // Keyboard: left / right updates index
    // Mouse:  Click on buttons or click on Event Marker
    addEventHandlers(componentEl) {

        // Buttons
        const backButton = componentEl.querySelector('#backBtn');
        const forwardButton = componentEl.querySelector('#forwardBtn');
        backButton.onclick = () => {                        
            this.setIndex(this.state.index - 1);
        }
        forwardButton.onclick = () => {            
            this.setIndex(this.state.index + 1);          
        }

        
        // Keys
        // Add support for arrow keys to move through slider.
        componentEl.onkeydown = (e) => {
            e = e || window.event;  
            if (e.keyCode == '37') this.setIndex(this.state.index - 1);
            if (e.keyCode == '39') this.setIndex(this.state.index + 1);
          }


        // Mouse Click
        const markers = componentEl.querySelectorAll('.event-marker');        
        for(let i = 0; i < markers.length; i++) {        
            const index = markers[i].dataset.index;
            markers[i].addEventListener('click', () => {                
                this.setIndex(index);
            });
        };
    }

    // Destroy animation for the component.  To be used in case of switching to another
    // component in its place.
    async destroy() {
        const elementsDestroyed = await this.deconstructTimeline(this.componentEl);
        console.log("Finished.  Elements Destroyed: ", elementsDestroyed);

        this.componentEl.classList.add('faded');
    }
    async deconstructTimeline(componentEl) {
        const timeline = componentEl.querySelector('.timeline');
        //if (timeline) {
            // Get all the elements into an array.
            let elementList = [];  
             const DELAY_INCREMENT = 75;         

            // Remove all the year and event markers
            let elements = Array.from(timeline.children);            
            let delay = 0;            
            elements.forEach((el) => {
                elementList.push({el, delay, action: 'drop'});                
                delay += DELAY_INCREMENT;
            });

            // Remove the buttons and timeline
            const timelineContainer = componentEl.querySelector('.timeline-container');
            let mainElements = Array.from(timelineContainer.children);                        
            mainElements.forEach((el) => {
                elementList.push({el, delay, action: 'fade'});                
                delay += DELAY_INCREMENT;
            });


            // Do stuff
            const promises = elementList.map((item) => {
                return this.deconstructElement(item).then((notes) => {
                    //console.log(notes);
                    return { ...el, notes };
                });
            });
    
            const elementsDestroyed = await Promise.all(promises);
            return elementsDestroyed;
        //}
    };

    deconstructElement(item) {
        return new Promise((resolve) => {
            setTimeout(() => {
                item.el.classList.add('deconstruct');
                resolve(`element ${item.el} - ${item.delay}`);
            }, item.delay);
        });
    }    

    // -----------------------------------------------------------------
    // CUSTOM EVENTS
    // -----------------------------------------------------------------

    // Triggered when selected index is changed (but before animation starts)
    dispatchOnIndexChange(index) {
        //console.log("Basic Timeline -> onIndexChange: ", index);
        const event = new CustomEvent('onindexchange', {
        bubbles: true,
        detail: { 
            index: index,        
        }    
        });

        // send out the event
        this.componentEl.dispatchEvent(event);
    }

    // -----------------------------------------------------------------
    // PUBLIC METHODS
    // -----------------------------------------------------------------
    setIndex(index, forceUpdate = false) {

        // Do some bounding checks
        //
        let newIndex = index;
        let maxIndex = this.state.data.length - 1;         

        // Check left
        if (newIndex < 0) {
            if (this.state.wrap) {
                newIndex = maxIndex;                    
            }  
            else {
                newIndex = 0;
            }              
        } 

        // Check right
        if (newIndex > maxIndex) {
            if (this.state.wrap) {
                newIndex = 0
            }  
            else {
                newIndex = maxIndex;
            }              
        }    
        //
        

        if (!forceUpdate) {
            // Don't update if index didn't change
            if (newIndex == this.state.index) { 
                console.log("bailing - index did not change.");
                return;
            }
        }
        
        // At this point everything is good, make the state change.
        
        // Update our global state.
        this.state.index = newIndex;
        
        // Get the start and end years.
        let year = this.state.data[this.state.index].yearStart;
        let yearEnd = this.state.data[this.state.index].yearEnd;

        // Fade back in any elements which were behind another element during the last Timeline render.
        //const markers = document.querySelectorAll('.fade-to-back');           
        const markers = document.querySelectorAll('.event-marker');           
        markers.forEach(marker => {        
            marker.classList.remove('fade-to-back');
            marker.classList.remove('selected');
        });


        // Loop through all the events to remove the previously active event and set the new event.
        this.state.data.map((event) => {        
                    
            // Determine if any events are in the middle of the selected timeline.
            // If any are in the middle, fade them into the background.
            if ((year != event.yearStart) && (year < event.yearStart) && (event.yearStart < yearEnd)) {
                let markerEl = this.componentEl.querySelector(`#Marker${event.yearStart}-${event.yearEnd}`);            
                markerEl.classList.add('fade-to-back');            
            } 

            // Set the selected event
            if (year == event.yearStart || yearEnd == event.yearStart) {
                let markerEl = this.componentEl.querySelector(`#Marker${event.yearStart}-${event.yearEnd}`);            
                markerEl.classList.add('selected');  
            }        
            
            // Handle the animation for the selected event on the timeline (ie )
            // False means the event is not the current event.  True means the event
            // is the current event and it's 'selected line' should be visible.
            let showSelectedLine = (event.yearStart !== year)|| (event.yearEnd !== yearEnd);  //console.log("Event: ", event.yearStart, event.yearEnd, showSelectedLine);                
            this.updateSelectedEventConnector(event, showSelectedLine);            
        });

        // Send out event that index was changed.
        this.dispatchOnIndexChange(this.state.index);
    }
}