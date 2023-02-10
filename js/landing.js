/*
    Javascript for the top section on the site.  Handles fading in and out the 
    images which can be selected, and the mouse move effects.
*/

const el = document.querySelector('.landing'); 
const backgroundEl = document.querySelector('.background'); 

const ALLOW_JAVASCRIPT = true;
if (ALLOW_JAVASCRIPT) {

    // Get window width
    const screenWidth = window.innerWidth;
    
    // Enable javascript effects only if window is wider than tablet breakpoint in CSS
    if (screenWidth > 900) {

        // EFFECT 1:  FUNKY BACKGROUND MOVE EFFECT
        const DAMPER = 150;  
        
        // Animate the background image and decorative dashed lines
        el.addEventListener('mousemove', (function(e) {    
            
            // Check if user has scrolled past the hero image.  If so,
            // don't do anything.
            const isVisible = (window.scrollY > 400) ? false : true;            
            if (!isVisible) return; 
                       

            var amountMovedX = (e.pageX * 1 / DAMPER);  
            var amountMovedY = (e.pageY * 1 / DAMPER);
            
            // Adjust the background position of the image.  This needs to match the 
            // default positions in CSS (50% 50%) or it will jump initially.
            let x = amountMovedX;        
            let y = amountMovedY;                      
            backgroundEl.style.backgroundPosition = `calc(50% - ${x}px) calc(50% - ${y}px)`;

            // Rotate the logo
            const logo = document.querySelector('.logo');
            if (logo) {                
                logo.style.transform = `rotate(${amountMovedX}deg)`;
            }

            // Update the pseudo selector animation
            let gradientUpEl = document.querySelector('.gradient-up');    
            gradientUpEl.style.backgroundPosition = 'right ' + amountMovedX * 75 + 'px';
            
            let gradientDownEl = document.querySelector('.gradient-down');
            gradientDownEl.style.backgroundPosition = 'right ' + amountMovedY * 75 + 'px';
        }));    
    }
}
    

// EFFECT 2:  Image Carousel
const backgrounds = ['hero-huckleberry-lookout.webp', 'hero-great-northern.webp', 'hero-whitefish.webp', 'hero-lake-mcdonald.webp'];
const carouselEls = document.querySelectorAll('.nav-carousel .image-list > div');

carouselEls.forEach((item) => {        
    item.addEventListener('click', () => {

        // Remove prior clicked style.
        carouselEls.forEach((item) => { 
            item.classList.remove('clicked');
        });
        item.classList.add('clicked');

        let index = item.dataset.index;        
        if (index) {      
            backgroundEl.classList.remove('fade-in');
            backgroundEl.classList.add('fade-out');
            window.setTimeout(() => {
                
                // HACK FOR GITHUB PAGES
                if (location.protocol !== "https:") {
                    backgroundEl.style.background = "linear-gradient(to top, rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('../img/hero/" + backgrounds[index] + "')";
                }
                else {
                    backgroundEl.style.background = "linear-gradient(to top, rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('~/../img/hero/" + backgrounds[index] + "')";
                }                
                backgroundEl.style.backgroundSize = "cover";            
                backgroundEl.style.backgroundRepeat = "no-repeat";
                backgroundEl.style.backgroundPosition = `50% 50%`;
                
                backgroundEl.classList.remove('fade-out');
                backgroundEl.classList.add('fade-in');
            }, 600);                                 
        }
        else {
            console.error("No index found on this link");
        }
    })
});


// EFFECT 3:  JS PARAlLAX
window.addEventListener('scroll', () => {
    const target = document.querySelectorAll('.scroll');
    
    var index = 0; length = target.length;
    for (0; index < target.length; index++) {
        let current = target[index];
        var pos = window.pageYOffset * current.dataset.rate;       
        
        const initialTransform = (current.dataset.transform != undefined) ? current.dataset.transform + " " : "";
        const move = initialTransform + 'translate3d(0px, '+pos+'px, 0px)';              
        
        current.style.transform = move;
    }
});

