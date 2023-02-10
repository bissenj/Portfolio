/*
    Helper class for using intersection observer.

    Use it like this:
        // Intersection Observer for slide-ins (ie text that fades in)
        addObserver({
            selectors: '.slide-in',
            fireOnce: true,             
            whenIntersecting: (entry) => { entry.target.classList.add('visible'); },
        });  

    Params:        
        data {
            .selectors[string]:  query selection
            .whenIntersecting(entry) [func]:  function to call when item is intersecting
            .whenNotIntersecting(entry [func]):  function to call when item is not intersecting
            .fireOnce [true/false]: should observer stop after first isIntersecting?
            .rootMargin: override the default intersection observer rootMargin.
            .threshold: override the default intersection observer threshold.
        }
*/
function addObserver(data) {
    const selectors = data.selectors ?? '';    // '.scroll-target, .slide-left, .slide-right'
    const stopObservingOnIntersection = data.fireOnce ?? false;
    const rootMargin = data.rootMargin ?? '0%';
    const threshold = data.threshold ?? 0.0;

    // ---------------------------------------------------------
    // Intersection Observer  
    // ---------------------------------------------------------

    // get all the elements we need to watch
    const targets = document.querySelectorAll(selectors);
    if (targets.length > 0) {        
        // what to do with entries that are on screen
        function handleIntersection(entries) {

            entries.map((entry) => {
                if (entry.isIntersecting) {                                        

                    // Call function to do something
                    if (data.whenIntersecting) {
                        data.whenIntersecting(entry);
                    }

                    // Should this code only work once?
                    if (stopObservingOnIntersection) {                        
                        observer.unobserve(entry.target);  
                    }                    
                }
                else {
                    if (data.whenNotIntersecting) {
                        data.whenNotIntersecting(entry);
                    }
                }
            });
        }
        // fire up the observer
        const observer = new IntersectionObserver(handleIntersection, { rootMargin: rootMargin, threshold: threshold });
        targets.forEach((el) => {
            observer.observe(el);
        })
    }
}

