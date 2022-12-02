const el = document.querySelector('.landing'); 
const backgroundEl = document.querySelector('.background'); 

const ALLOW_JAVASCRIPT = true;
if (ALLOW_JAVASCRIPT) {

    // Get window width
    const screenWidth = window.innerWidth;
    console.log("Screen Width: ", screenWidth);

    // Enable javascript effects only if window is wider than tablet breakpoint in CSS
    if (screenWidth > 767) {

        // EFFECT 1:  FUNKY BACKGROUND MOVE EFFECT
        const DAMPER = 150;  
        
        let startX = -1;
        let startY = -1;

        // Animate the background image and decorative dashed lines
        el.addEventListener('mousemove', (function(e) {        
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
        
        // save resources by stopping animation when section no longer has focus
        // el.addEventListener('mouseleave', (function(e) {        
        //     let gradientUpEl = document.querySelector('.gradient-up');    
        //     let gradientDownEl = document.querySelector('.gradient-down');
        //     gradientUpEl.classList.remove('animate');
        //     gradientDownEl.classList.remove('animate');
        // }));
    }
}
    

// EFFECT 2:  Image Carousel
const backgrounds = ['hero-huckleberry-lookout.webp', 'hero-great-northern.webp', 'hero-whitefish.webp', 'hero-lake-mcdonald.webp', 'hero-mt-aeneas.webp'];
const carouselEls = document.querySelectorAll('.nav-carousel li');
//console.log("Carousel Els: ", carouselEls);
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

                // TODO - FIX THIS!
                // HACK FOR GITHUB PAGES
                if (location.protocol !== "https:") {
                    backgroundEl.style.background = "url('../img/hero/" + backgrounds[index] + "')";
                }
                else {
                    backgroundEl.style.background = "url('~/../img/hero/" + backgrounds[index] + "')";
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


// let scale = 1;

// EFFECT 3:  PARALAXX
window.addEventListener('scroll', () => {
    const target = document.querySelectorAll('.scroll');
    
    // // Save off the initial transform  -> WHY?????
    // target.forEach((scrollEl) => {
    //     const initialTransform = scrollEl.style.transform;
    //     // Save it into the dataset
    //     scrollEl.dataset.initialTransform = initialTransform;
    // });

    var index = 0; length = target.length;
    for (0; index < target.length; index++) {
        let current = target[index];
        var pos = window.pageYOffset * current.dataset.rate;       
        
        const initialTransform = (current.dataset.transform != undefined) ? current.dataset.transform + " " : "";
        const move = initialTransform + 'translate3d(0px, '+pos+'px, 0px)';              
        
        current.style.transform = move;
    }
});

