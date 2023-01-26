

/* 
    INITIALIZE CAREER DETAIL PAGE    
*/
function GenerateCareerDetailPage(pageData, headerData, footerData, navigationData) {
       
    // LOAD THE PAGE AND SIDE MENU
    if (pageData) {
        // Page
        const page = document.querySelector('.detail-page');
        pageData.map((item, index) => {
            page.append(renderFactory(item, index));        // pageSegments.js
        });

        // Sidemenu
        const sideMenu = document.querySelector('.side-bar');
        if (sideMenu) {
            sideMenu.append(renderQuickLinks(sideMenu, pageData));
        }
    }
    else {
        console.error('GenerateCareerDetailPage(): page data missing.');
    }


     // LOAD THE HEADER
     if (headerData) {
        const header = document.querySelector('.header-content .stats');
        header.innerHTML = renderHeader(headerData[0]);

        // Wire up the home link button
        const headerHome = document.querySelector('.header .home-link');
        //headerHome.addEventListener('click', handleHomeClick);
        headerHome.addEventListener('click', handleLinkClick);
     }
     else {
        console.error('GenerateCareerDetailPage(): header data missing.');
    }


    // lOAD THE FOOTER
    if (footerData) {
        const footer = document.querySelector('.work-page .footer-nav');
        footer.innerHTML = renderDynamicFooter(footerData);

        // Wire up smooth transition to next page
        const footerLinks = document.querySelectorAll('.footer-nav-item a');
        footerLinks.forEach((item) => {
            item.addEventListener('click', handleLinkClick);
        });
    }
    else {
        console.error('GenerateCareerDetailPage(): footer data missing.');
    }

    renderFooter();
    

    // lOAD THE NAVIGATION
    function handleHomeClick() {
        navigateToPage(navigationData.from, navigationData.to);        
    }


    // After page has time to load, fire up the intersection observers
    setTimeout(() => {        
        startCareerPageObservers();   
    }, 200);
}


/* 
    RENDER SECTIONS OF PAGE FUNCTIONS
*/
function renderHeader(career) {
    let html = '<span></span>';
    html += `<span>${career.company}</span>`;
    html += `<span>${career.title}</span>`;
    html += `<span>${career.yearStart}-${career.yearEnd}</span>`;
    return html;
};

// Side Menu
function renderQuickLinks(el, data) {   
    let html = `<nav><ul>`;
    data.map((item, index) => {

        if (item.summary.startsWith('-')) {            
            html += `<li style='font-size: 0.7em;'><a href='#question${index}'>${item.summary}</a></li>`;
        }
        else {
            html += `<li><a href='#question${index}'>${item.summary}</a></li>`;
        }
    });
    html += '</ul></nav>';
    return createNode(html);        // pageSegments.js
}


/* 
    INTERSECTION OBSERVER FUNCTIONS
*/

function startCareerPageObservers() {       
    // Intersection Observer for slide ins
    addObserver({
        selectors: '.scroll-target, .slide-left, .slide-right',
        fireOnce: true,             
        whenIntersecting: (entry) => { entry.target.classList.add('visible'); },
    });       

    // Intersection Observer for side menu.        
    addObserver({
        selectors: '.question',            
        whenIntersecting: (entry) => { 
            const index = entry.target.dataset.index;
            const menuItems = document.querySelectorAll('.side-bar li');
            menuItems[index].classList.add('active');   
        },
        whenNotIntersecting: (entry) => { 
            const index = entry.target.dataset.index;
            const menuItems = document.querySelectorAll('.side-bar li');
            menuItems[index].classList.remove('active');   
        },
        rootMargin: '0px 0px -40% 0px',            
    });    
}
