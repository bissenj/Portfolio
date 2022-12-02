/* 
    Handles all the routing for the site

    Logic:
        Reduce the opacity of the body so page transitions nicely.
        Update the window location which loads new page.
        Reset the opacity on the body of the new page so screen can 
        fade in.

    Global styles required:  
        1.  body.fade-out (portfolio-main.css)       

    Important:
        resetBody() needs to be on every page or if revisiting a page it
        may still have the body faded out and nothing will show up.
*/

function navigateToPage(source, dest) {
    console.log('navigateToPage(): ', source, dest);

    // Fade out screen
    document.querySelector('body').classList.add('fade');
    
    // HACK FOR GITHUB PAGES
    // Fix the URL when deployed on GitHubPages by adding in the repo name.
    let destination = '';
    if (location.protocol == "https:") {
        destination = '/Microanimations'
    }       

    // update window location
    setTimeout(() =>{         
        window.location = `${destination}/${dest}`;
    },500);    
}

// This needs to be on every page.
function resetBody() {
    console.log("Reset Body");
    document.querySelector('body').classList.remove('fade');
}
