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
        destination = '/Portfolio'
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


// FULL SCREEN NAVIGATION MODAL


const navModalData = [
    {
      name: 'Home',
      icon: 'home.svg',
      links: [
        {
          name: 'Home',
          label: '',
          url: '/'
        },
        {
          name: 'About',
          label: '',
          url: '/index.html#about'
        },
        {
          name: 'Projects',
          label: '',
          url: '/index.html#projects'
        },
        {
          name: 'Career',
          label: '',
          url: '/index.html#career'
        },
        {
          name: 'Contact',
          label: '',
          url: '/index.html#contact'
        },
      ]
    },
    {
      name: 'Projects',
      icon: 'map.svg',
      links: [
        {
          name: 'Nightlight',
          label: 'Project 1:',
          url: '/projects/nightlight'
        },
        {
          name: 'Field Time Entry',
          label: 'Project 2:',
          url: '/projects/fte'
        },
        {
          name: 'NAH Website',
          label: 'Project 3:',
          url: '/projects/nah'
        }, 
      ]
    },
    {
      name: 'Career',
      icon: 'briefcase.svg',
      links: [
        {
          name: 'NWM',
          label: 'Career 1:',
          url: '/career/nwm'
        },
        {
          name: 'NAH',
          label: 'Career 2:',
          url: '/career/nah'
        },
        {
          name: 'MJE',
          label: 'Career 3:',
          url: '/career/mje'
        }, 
        {
          name: 'SELF',
          label: 'Career 4:',
          url: '/career/self'
        }, 
      ]
    },
  ];


  function renderMenuPage(data) {
    console.log('renderMenuPage: ', data);

    // dom elements
    let sideBarHtml = `<div class='side-bar'>`; //document.querySelector('.side-bar');
    let itemColumnHtml = `<div class='menu-items-column'>`; //document.querySelector('.menu-items-column');

    iconsHtml = '';
    data.map((item) => {
      // Add the icons
      iconsHtml += `<div class='row'><img src='~/../img/icons/${item.icon}' alt='${item.name}'/><div>${item.name}</div></div>`;

      // Loop through the links
      itemsHtml = `<div class='row'>`;
      item.links.map((link) => {
        const label = link.label ?? '';
        const text = link.name ?? '';
        const url = link.url ?? '';

        const labelHtml = `<div class='label'>${label}</div>`;
        const nameHtml = `<div class='name'>${text}</div>`;
        
        itemsHtml += `<a href='${url}'>
                        <div class='text-container'>
                          ${labelHtml}
                          ${nameHtml}
                        </div>                          
                      </a>
                      <div class='line'></div>`;
        
      });
      itemsHtml += '</div>';
      itemColumnHtml += itemsHtml;      
    });

    itemColumnHtml += `</div>`;
    sideBarHtml += iconsHtml + `</div>`;  
    
    
    let html = `<section class='menu'>                
                  <div class='title'>Mountains and Code - Site Map</div>
                  <div class='close-nav'>X</div>
                  <div class='menu-container'>
                    ${sideBarHtml}
                    ${itemColumnHtml}
                  </div>
                </section>`;

    document.querySelector('.nav-modal').innerHTML = html;

    document.querySelector('.close-nav').addEventListener('click', showMenu);
  }

  function showMenu() {
    if (document.querySelector('.menu-container')) {
      document.querySelector('.nav-modal').innerHTML = '';
      document.querySelector('.nav-menu').style.opacity = 1;
    }
    else {
      renderMenuPage(navModalData);
      document.querySelector('.nav-menu').style.opacity = 0;
    }
  }


