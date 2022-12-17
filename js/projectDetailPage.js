

/* 
    INITIALIZE PROJECT DETAIL PAGE    
*/
function GenerateProjectDetailPage(pageData, headerData, footerData, navigationData) {
       
    // LOAD THE PAGE AND SIDE MENU
    if (pageData) {
        // Page
        const page = document.querySelector('.detail-page');
        pageData.map((item) => {
            page.append(renderFactory(item));
        });          
    }
    else {
        console.error('GenerateProjectDetailPage(): page data missing.');
    }


     // LOAD THE HEADER
     if (headerData) {
        const header = document.querySelector('.header-content .stats');
        header.innerHTML = renderHeader(headerData);

        // Wire up the home link button
        const headerHome = document.querySelector('.header .home-link');
        headerHome.addEventListener('click', handleHomeClick);
     }
     else {
        console.error('GenerateProjectDetailPage(): header data missing.');
    }


    // lOAD THE FOOTER
    if (footerData) {
        const footer = document.querySelector('.projects-page .footer-nav');
        footer.innerHTML = renderDynamicFooter(footerData);
    }
    else {
        console.error('GenerateProjectDetailPage(): footer data missing.');
    }

    renderFooter();
    

    // lOAD THE NAVIGATION
    function handleHomeClick() {
        navigateToPage(navigationData.from, navigationData.to);        
    }


    // After page has time to load, fire up the intersection observers which
    // will animate the text when the page fades in.
    setTimeout(() => {        
        startProjectPageObservers();   
    }, 1500);
}


/* 
    RENDER SECTIONS OF PAGE FUNCTIONS
*/
function renderHeader(project) {
    let html = '';                
    html += `<span class='scroll-target'>${project.name}</span>`;
    html += '<span></span>';
    html += '<span></span>';
    html += `<span class='slide-left'>${project.tech}</span>`;        
    return html;
};



/* 
    INTERSECTION OBSERVER FUNCTIONS
*/

function startProjectPageObservers() {       
    // Intersection Observer for slide-ins
    addObserver({
        selectors: '.scroll-target, .slide-left, .slide-right',
        fireOnce: true,             
        whenIntersecting: (entry) => { entry.target.classList.add('visible'); },
    });   
        
    // Intersection Observer for header bar - show/hide the header when below hero image
    addObserver({
        selectors: '.header-image',             
        whenIntersecting: (entry) => { document.querySelector('.header-content').classList.remove('active');  },
        whenNotIntersecting: (entry) => { document.querySelector('.header-content').classList.add('active'); },
        rootMargin: '0%',
        threshold: 0.0
    });
}
