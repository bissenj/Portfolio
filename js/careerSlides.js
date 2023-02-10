/*

    This script holds the custom logic for the career slider on the portfolio.  This uses
    the horizontalSlider component and feeds it a function for rendering the slides,  
    a function for creating event handlers, and a callback when the current slide is about to change.

*/


// SLIDE SHOW - RENDERING FUNCTION
// Creates the html for a slide.  The only real option here is 
// whether or not a slide links to a detail page (via item.link).  
function renderSlide(item) {
    let summaryText = '';
    if (item.link) {
        summaryText = `${item.summary} <a href="${item.link}"><span class='accent'>More<span></a>`;            
    }
    else {
        summaryText = `${item.summary}`;
    }

    let backgroundDetails = '';
    if (item.backgroundTextDetails) {
        backgroundDetails = `
                    <div class='hero-text-details-container'>
                        <p>${item.backgroundTextDetails}</p>
                    </div>
                    `;
    }

    let html = 
    `
        <div class='card hide-content'>
            <div class='image-container'>        
                <div class='hero-image-container'>
                    <img src='~/../img/${item.backgroundImage}' alt='${item.backgroundAlt}'/>
                    <div class='hero-text-container'>
                        <a href='${item.backgroundLink}' target='new'>${item.backgroundText}</a>
                    </div>
                    ${backgroundDetails}
                </div>
                <div class='avatar-image-container'>
                    <img src='~/../img/${item.brandImage}' alt='${item.brandAlt}'/>
                </div>
                <div class='location-image-container'>
                    <img src='~/../img/collage/location.png' alt='Location Icon'/>
                </div>
            </div>
            <div class='details'>
                <div class='header'><h1>${item.company}</h1></div>        
                <div class='body'><p>${summaryText}</p></div>        
                <div class='footer'>
                    <div class='years'><span>${item.yearStart}</span><span>-${item.yearEnd}</span></div>
                    <div class='job-title'>${item.title}</div>
                </div>
            </div>                    
        </div>            
    `;        
    return html;
}



// SLIDE SHOW - EVENT HANDLER FUNCTION
// Dynamically generates the event handlers for the slides.
// 1.  Click on 'more' link navigates to career page
// 2.  Click on 'location' icon toggles hero image panel to expand/contract.
//     A.  on card mouse-out contract the hero image panel.
//     B.  on scroll, contract the hero image panel.
function generateSlideEventHandlers() {
    const locationIcons = document.querySelectorAll('.card .location-image-container');
    locationIcons.forEach((el) => {
        el.addEventListener('pointerdown', (e) => {                
            toggleLocationInformation(el);
        })
    });

    const links = document.querySelectorAll('.card .details p a');
    links.forEach((el) => {
        el.addEventListener('click', (e) => {            
            const el = (e.target.href) ? e.target : e.target.parentNode;

            const href = el.href;            
            if (href) {
                e.preventDefault();                    
                routeToUrl(href);      // routing.js - handles a link click.
                return false;
            }                
        })
    });
}
    
// SLIDE SHOW 
// Shows/Hides the expanded location (top section) of the slide.
function toggleLocationInformation(el) {
    const parent = el.parentNode;

    if (parent.classList.contains('active')) {
        parent.classList.remove('active');
    }
    else {
        parent.classList.add('active');
    }
}

// SLIDE SHOW - CURRENT SLIDE IS ABOUT TO CHANGE
function resetSlide(el) {
    const target = el.querySelector('.image-container');
    if (target) {

        if (target.classList.contains('active')) {
            target.classList.remove('active');
        }
    }        
}




