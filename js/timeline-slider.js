import {events} from '../data/data.js';

import {getElementsOnScreen, slideShow_SnapScrollToNewSlide} from '../js/animation.js';

var TimelineSlider = {

    // local variables
    state: {
        targetId: undefined,
        timelineEl: '.timeline',
        scrollerEl: '.horizontal-scroller',
        events: [],
        selectedIndex: 0,
        mouseState: {
            parentElement: undefined,
            isDown:false, 
            startX:0, 
            scrollLeft:0,
            direction:0,
            walk:0,
            isAnimating: false
        }
    },

    eventHandlers: {
        handleMouseDown: function(e) {             
            // Hack for TOUCH events
            if (e.type == 'touchstart') {
                e.pageX = e.changedTouches[0].pageX;
            }

            //console.log('handleMouseDown(): ', e.target);  

            TimelineSlider.state.mouseState.isDown = true;
            TimelineSlider.state.mouseState.startX = e.pageX - TimelineSlider.state.mouseState.parentElement.offsetLeft;
            TimelineSlider.state.mouseState.scrollLeft = TimelineSlider.state.mouseState.parentElement.scrollLeft;
            TimelineSlider.state.mouseState.parentElement.classList.add('mouseDown');
        },
        handleMouseUp: function(e) { 
            console.log('handleMouseUp()');

            // Reset Stuff - 1
            TimelineSlider.state.mouseState.isDown = false;   
            TimelineSlider.state.mouseState.parentElement.classList.remove('mouseDown'); 

            // If mouse was clicked but we haven't recorded any direction, assume user is not trying to 
            // update the slideshow
            if (TimelineSlider.state.mouseState.direction == 0) {
                console.log("Bailing - no direction set.");
                return;
            }            

            // If the walk is < WALK_THRESHOLD, user isn't trying to update slideshow
            const WALK_THRESHOLD = 125;
            if (Math.abs(TimelineSlider.state.mouseState.walk) < WALK_THRESHOLD) {
                console.log("Bailing - Walk is < WALK_THRESHOLD");
                TimelineSlider.state.mouseState.walk = 0;
                TimelineSlider.controlFunctions.updateSlideShow(TimelineSlider.state.selectedIndex);
                return;
            }

            // Calculate which slide is most visible on the screen and scroll to it.
            let slidesInView = getElementsOnScreen('.event-details-element');
            console.log("slidesInView: ", slidesInView);

            // Choose the new slide and move to it.
            if (slidesInView.length > 0) { 
                
                console.log("Direction: ", TimelineSlider.state.mouseState.direction);
                
                let el = slidesInView[0];
                if (TimelineSlider.state.mouseState.direction < 0) {
                    el = slidesInView[slidesInView.length -1];  // Get the last element (which should be the right most one)
                }

                const index = parseInt(el.dataset.index);        
                TimelineSlider.controlFunctions.updateSlideShow(index);
            }

            // Reset stuff - 2    
            TimelineSlider.state.mouseState.direction = 0;            
        },     
        handleMouseMove: function(e) {  
            // if the mouse is not clicked, don't proceed.
            if (!TimelineSlider.state.mouseState.isDown) {
                //console.log("Bailing - Mouse button is not down");
                return;
            }

            // Hack for TOUCH events
            if (e.type == 'touchmove') {
                e.pageX = e.changedTouches[0].pageX;
            }
            
            // If there is an animation taking place, ignore this event. (or their will be JANK)
            if (TimelineSlider.state.mouseState.isAnimating) {
                console.log("Bailing - There is an animation currently taking place.");
                return;
            }

            // Calculate how much the mouse has moved and update the scroll position    
            const x = e.pageX - TimelineSlider.state.mouseState.parentElement.offsetLeft;    
            const walk = (x - TimelineSlider.state.mouseState.startX) * 1.0; 

            //console.log("walk: ", walk);
            
            const WALK_THRESHOLD = 0;  
            if (Math.abs(walk) > WALK_THRESHOLD)  {
                
                TimelineSlider.state.mouseState.parentElement.scrollLeft = TimelineSlider.state.mouseState.scrollLeft - walk;        
                TimelineSlider.state.mouseState.direction = (walk > 0) ? 1 : -1;   
                TimelineSlider.state.mouseState.walk = walk; 

                // Stop any further processing on this event so they don't interfere with
                // our animations.
                //e.preventDefault();
            }
            else {
                //mouseState.parentElement.scrollLeft = e.pageX;
            }



        },             
        handleTouchStart: function(e) { 
            TimelineSlider.eventHandlers.handleMouseDown(e);
        },             
        handleTouchEnd: function(e) { 
            
            // NOTES:
            //    On a touch device the 'touchend' event may occur before the touchmove events are done
            //    (ie the container is still scrolling).  To handle that, we're going to run a timeout and 
            //    compare the current scroll position against the last scroll position until they are the same
            //    which will tell us when the scroll is finished, then we call the normal funcion to 
            //    update the slideshow.

            let i = 0;  let end = 200;
            let finished = false;
            let lastScrollLeft = 0;
            let loop = window.setInterval(() => {

                let scrollerEl = document.querySelector('.horizontal-scroller');        
                //console.log("scroll left: ", scrollerEl.scrollLeft);
                if (lastScrollLeft == scrollerEl.scrollLeft) {
                    console.log("scrolling finished");
                    finished = true;
                }
                else {
                    lastScrollLeft = scrollerEl.scrollLeft;
                }

                i+=1;                       // update so we get out of the loop eventually.        
                if (i >= end || finished) {     
                    console.log("handleTouchEnd");
                    TimelineSlider.eventHandlers.handleMouseUp(e);

                    // Clean up 
                    clearInterval(loop);
                }    
            }, 50);
        },             
        handleTouchMove: function(e) { 
            TimelineSlider.eventHandlers.handleMouseMove(e);
        },             
    },
    
    renderFunctions: {
        // Generates the starting DOM elements for the timeline component
        renderTimeline: function(targetId) {
            let html = `
            <!-- Header -->
            <div class='timeline-header'>
                <div class='heading'>
                    <span>work</span><span>Experience</span>
                </div>
            </div>

            <!-- Timeline Component -->
            <div class='timeline-container'>
                <button id="backBtn">  &#5130; </button>
                <div id="timeline" class="timeline"></div>
                <button id="forwardBtn"> &#5125; </button>
            </div>

            <!-- Slideshow Component -->
            <div class='horizontal-scroller' tabIndex="0"></div>        
            `;

            let el = document.getElementById(targetId);
            if (el) {
                el.innerHTML = html;
            }
            else {
                console.error("No DOM element with id " + targetId + " found.");
            }
        },

        // Render individual year ticks on timeline
        renderYearTick: function(events, year, parentEl, offsetX) {
            // Check if there is an event marker for this year.  If so, don't do anything.    
            //let markers = document.querySelector(`.event-details-element[data-year="${selectedIndex}"]`);
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
        
            parentEl.innerHTML += html;
        },

        // Render the events on the timeline
        renderEventMarker: function(index, event, parentEl, offsetX, offsetWidth) {    

            // console.log(index, event, offsetX);

            let html = `<div id='${event.yearStart}-${event.yearEnd}Marker' data-year=${event.yearStart} data-index=${index} class='event-marker' style='left:${offsetX}px'>
                            <div class='event-circle'></div>
                            <div class='event-arm'></div>
                            <div class='event-text'>${event.yearStart}</div>
                            <div class='event-selected' style='width:${offsetWidth}'>
                        </div>`;
        
            parentEl.innerHTML += html;
        },

        // Render the event slides under the timeilne
        renderEventsHorizontal: function(events, parentEl) {

            parentEl.innerHTML = "";

            // loop through all the events
            events.map((event, index) => {
        
                // TESTING
                let wrapper = document.createElement("div");
                wrapper.classList.add('event-details-element-wrapper');
        
                // Create an element and attach event listeners, then template the rest of the element's contents.
                let container = document.createElement("div");
                container.classList.add('event-details-element');
                container.dataset.index = index;
        
                // Mouse Event Handlers
                container.addEventListener('mousedown', TimelineSlider.eventHandlers.handleMouseDown);
                container.addEventListener('mouseup', TimelineSlider.eventHandlers.handleMouseUp);
                container.addEventListener('mousemove', TimelineSlider.eventHandlers.handleMouseMove);
        
                // Touch Event Handlers
                container.addEventListener('touchstart', TimelineSlider.eventHandlers.handleTouchStart);
                container.addEventListener('touchend', TimelineSlider.eventHandlers.handleTouchEnd);
                container.addEventListener('touchcancel', (e) => {console.log("cancel")});
                container.addEventListener('touchmove', TimelineSlider.eventHandlers.handleTouchMove, {passive: true});
        
                container.addEventListener('mouseleave', (e) => { if (TimelineSlider.state.mouseState.isDown) TimelineSlider.eventHandlers.handleMouseUp(e);});
                
                let html = "";

                if (index == 0) {
                    html += `
                        <!-- Event Summary -->                                
                        <div class='event-summary'>
                            <div class='event-tools'>${event.tools}</div>
                        </div>
                        <!-- Event Header -->
                        <div class='event-header'>                        
                            <div>${event.yearStart} - ${event.yearEnd}</div>                            
                        </div>                        
                        <!-- Event Body -->
                        <div class='event-body'>                            
                            ${event.story}
                            <div><button class='next'>Next &#5125;</button></div>                            
                        </div>   
                        
                    `;                    
                }
                else {

                    html += `
                        <!-- Event Header -->
                        <div class='event-header'>                        
                            <div>${event.yearStart} - ${event.yearEnd}</div>
                            <div>${event.name}</div>                        
                        </div>

                        <!-- Event Summary -->                                
                            <div class='event-summary'>
                            <div class='left'>
                                <div class='event-tools'>${event.tools}</div>
                                `;
                    if (event.summary != "") {
                        html += `<div>At a glance:</div>
                                    <div>${event.summary}</div>
                            `;
                    }
                    html += `</div>`;

                    if (event.image != "") {
                        html += `
                        <div class='company-image'><img src='img/timeline/${event.image}'/></div>
                        `;
                    }
                    html += `</div>`;
                    // <div class='company-image'><img src='img/timeline/${event.image}'/></div>
                                    
                                
                    if (event.story.length > 1000) {            
                        html += `
                                    <!-- Event Body -->
                                    <div class='event-body small'>
                                        <div>What I accomplished and how I grew:</div>
                                        ${event.story}
                                        <div><button class='next'>Next &#5125;</button></div>
                                        <div><button class='more'>More</button></div>                    
                                    </div>                        
                                `;
                    }
                    else {
                        html += `
                                <!-- Event Body -->
                                <div class='event-body'>
                                    <div>What I accomplished and how I grew:</div>
                                    ${event.story}
                                    <div><button class='next'>Next &#5125;</button></div>                            
                                </div>                        
                            `;
                    }
                }
                container.innerHTML = html;
                        
                wrapper.appendChild(container);
                parentEl.appendChild(wrapper);
        
                let moreButton = container.querySelector('.more');
                if (moreButton) {
                    moreButton.addEventListener('click', (e) => {
                        let target = e.target.parentElement.parentElement;
                        console.log(target);
                    
                        if (target.classList.contains('small')) {
                            target.classList.remove('small');
                            e.target.innerText = 'Less...';                    
                        }
                        else {
                            target.classList.add('small');
                            e.target.innerText = 'More...';
                            //document.querySelector('.timeline-header').scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
                            document.querySelector('.timeline-header').scrollIntoView({behavior: "smooth"});
                        }               
                    });
                }    
            });   
        },
    },

    controlFunctions: {

        // Central location for updating the UI Timeline and Slideshow)
        updateSlideShow: function(index) {
            console.log("updateSlideShow() -", "New Index: ", index, "Old Index:", TimelineSlider.state.selectedIndex);

            // Ignore if there is already an animation taking place
            if (TimelineSlider.state.mouseState.isAnimating) { console.log("Nope.  Currently animating"); return; }


            if (Number.isInteger(index)) {
                TimelineSlider.controlFunctions.callback_updateAnimationState(true);        // Let the app know we are animating

                // Update the Timeline                
                TimelineSlider.controlFunctions.timeline_SetNewSelectedEvent(index);
                
                // find event details container related to the new index.
                let element = document.querySelector(`.event-details-element[data-index="${index}"]`);    

                // Moves slideshow to the new slide        
                slideShow_SnapScrollToNewSlide(element, TimelineSlider.controlFunctions.callback_updateAnimationState);    

                //console.log("Finished Animating");                
            }
            else {
                console.error("index parameter is invalid.");
            }
        },
        callback_updateAnimationState: function(state) {    
            TimelineSlider.state.mouseState.isAnimating = state;            
        },
        // Moves the selected event in the Timeline to a new event.
        timeline_SetNewSelectedEvent: function(index) {    
            // Update our global state.
            TimelineSlider.state.selectedIndex = index;

            // Get the start and end years.
            let year = TimelineSlider.state.events[index].yearStart;
            let yearEnd = TimelineSlider.state.events[index].yearEnd;

            // Fade back in any elements which were behind another element during the last Timeline render.
            //const markers = document.querySelectorAll('.fade-to-back');           
            const markers = document.querySelectorAll('.event-marker');           
            markers.forEach(marker => {        
                marker.classList.remove('fade-to-back');
                marker.classList.remove('selected');
            });


            // Loop through all the events to remove the previously active event and set the new event.
            TimelineSlider.state.events.map((event) => {        
                        
                // Determine if any events are in the middle of the selected timeline.
                // If any are in the middle, fade them into the background.
                if ((year != event.yearStart) && (year < event.yearStart) && (event.yearStart < yearEnd)) {
                    let markerEl = document.getElementById(`${event.yearStart}-${event.yearEnd}Marker`);            
                    markerEl.classList.add('fade-to-back');            
                } 

                // Set the selected event
                if (year == event.yearStart || yearEnd == event.yearStart) {
                    let markerEl = document.getElementById(`${event.yearStart}-${event.yearEnd}Marker`);            
                    markerEl.classList.add('selected');  
                }        
                
                // Handle the animation for the selected event on the timeline (ie )
                // False means the event is not the current event.  True means the event
                // is the current event and it's 'selected line' should be visible.
                let showSelectedLine = (event.yearStart !== year)|| (event.yearEnd !== yearEnd);  //console.log("Event: ", event.yearStart, event.yearEnd, showSelectedLine);                
                TimelineSlider.controlFunctions.updateSelectedEventConnector(event, showSelectedLine);                        
            });
        },
        // Updates the details slideshow
        updateSelectedEventConnector: function(event, reset = false) {        
            let container = document.getElementById(`${event.yearStart}-${event.yearEnd}Marker`);
            let el = container.querySelector('.event-selected');
                    
            // FUTURE IMPROVEMENT - don't like how timeline is hardcoded here.
            let widthPerTick = document.querySelector('.timeline').dataset.widthPerTick;
            let width = (event.yearEnd - event.yearStart) * widthPerTick;
            
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
    },

     // 
     init: function(targetId, events, startYear, endYear) {
        TimelineSlider.state.targetId = targetId;
        TimelineSlider.state.events = events;

        console.log("Events: ", this.state.events);

        // Generate the necessary DOM elements to dynamically
        // create the component.
        TimelineSlider.renderFunctions.renderTimeline(TimelineSlider.state.targetId);

        // Set the scroll element 
        TimelineSlider.state.mouseState.parentElement = document.querySelector(TimelineSlider.state.scrollerEl);

        let timelineEl = document.querySelector(TimelineSlider.state.timelineEl);
        
        // Clear the timeline (in case this is called for a refresh so we don't end up with a gazillion elements)
        timelineEl.innerHTML = "";
        
        // Calculate some stuff needed for rendering
        const numTicks = endYear - startYear;
        const timelineWidth = timelineEl.offsetWidth;
        

        const widthPerTick = timelineWidth / numTicks;
        timelineEl.dataset.widthPerTick = widthPerTick;     // Store this for later  <-- IMPROVE THIS

        // Add year ticks to the timeline
        let s = startYear; let offsetX = -10;
        for(s; s <= endYear; s++) {  
            if (s == endYear) offsetX += 1;  // Correct cumulative rounding errors for the last marker
            TimelineSlider.renderFunctions.renderYearTick(events, s, timelineEl, offsetX);
            offsetX += widthPerTick;
        }

        // Add each event as a marker on the timeline
        events.map((event, index) => {    
            const offsetX = (event.yearStart - startYear) * widthPerTick - 20;      // WHY 20?            
            TimelineSlider.renderFunctions.renderEventMarker(index, event, timelineEl, offsetX, 0);
        });

        // Add each event as a slide in the slideshow
        TimelineSlider.renderFunctions.renderEventsHorizontal(events, document.querySelector('.horizontal-scroller'));
        
        console.log(timelineEl);        
    }, 
}
TimelineSlider.init('timeline', events, 1995, 2025);