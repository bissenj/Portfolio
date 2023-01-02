

// Data
const events = [    
    {
        yearStart: 1998, 
        yearEnd:2003, 
        name: 'University of Wisconsin - Platteville', 
        tools: 'JAVA, C#, Testing internship', 
        image: 'uwp.webp',        
        link: 'uwp'
    },
    {
        yearStart: 2000, 
        yearEnd:2006, 
        name: 'Wisconsin Air National Guard', 
        tools: 'HTML, CSS, Javascript', 
        image: 'ang.jpg',        
        link: 'ang'
    },
    {
        yearStart: 2004, 
        yearEnd:2014, 
        name: "Northwestern Mutual", 
        tools: "Java, C#, Message Queues, Middleware", 
        image: 'nwm.jpg',        
        link: 'nwm'
    }, 
    {
        yearStart: 2014, 
        yearEnd:2021, 
        name: "NAH", 
        tools: "Web design, marketing, planning, leading", 
        image: 'nah.jpg',        
        link: 'nah'
    }, 
    {
        yearStart: 2018, 
        yearEnd:2021, 
        name: "M.J. Electric", 
        image: "mje.jpg",
        tools:"Javascript, ASP.Net, C#, React, Adobe XD",                 
        link: 'mje'
    }, 
    {
        yearStart: 2021, 
        yearEnd:2023, 
        name: "Self Employed",
        image: "mac.jpg", 
        tools: "React, Remix, Figma",         
        link: 'self'
    }, 
]



const cardData = [
    {
      id: 0, backgroundImage: 'collage/uwp-background.jpg', backgroundAlt: 'Picture of guys floating canoes down rapids',
      backgroundLink: 'https://www.northernontario.travel/paddling/quetico-canoe-routes', 
      backgroundText: 'Quetico Provincial Park',
      backgroundTextDetails: 'An early trip as my college buddies and I learned how to have fun and be comfortable in wild places.',
      brandImage: 'collage/uwp-brand.webp', brandAlt: 'Picture of University of Wisconsin-Platteville',
      company: 'UW-Platteville', 
      summary: 'Graduated with a degree in Computer Science and focus on Software Engineering. During college I interned at Avista, a local aviation software testing and development company.  On weekends I had a paying gig as drummer in a local cover band.',
      yearStart: '1998',
      yearEnd: '2003',
      title: 'Software Testing Intern'
    },
    {
      id: 1, backgroundImage: 'collage/ang-background.jpg', backgroundAlt: 'Picture of guys next to float plane',
      backgroundLink: 'https://paddling.com/learn/woodland-caribou-provincial-park', 
      backgroundText: 'Woodland Caribou Provincial Park',
      brandImage: 'collage/ang-brand.jpg', brandAlt: 'Picture of F-16 flying',
      backgroundTextDetails: 'Getting ready for adventure.  With our canoes strapped to float planes and waterproof bags of gear and food, we were dropped in the wilderness for a week of amazing fishing. ',
      company: 'Wisconsin Air National Guard', 
      summary: 'Halfway through college I joined the Wisconsin Air National Guard and worked as a computer technician.  Looking back this was one of the best decisions I made for my future. ',
      yearStart: '2000',
      yearEnd: '2006',
      title: 'Staff Sergeant'
    },
    { 
      id: 2, backgroundImage: 'collage/nwm-background.jpg', backgroundAlt: 'Picture of Milwaukee Art Museum',
      backgroundLink: 'https://mam.org/visit/', backgroundText: 'Milwaukee Art Museum', 
      backgroundTextDetails: 'One of the many jewels on the lake front of the Milwaukee Harbor.',
      brandImage: 'collage/nwm-brand.jpg', brandAlt: 'Picture of Northwestern Mutual Building',
      company: 'Northwestern Mutual', 
      summary: 'Fortune 500 company based out of Milwaukee, Wisconsin.  My first career job out of college and an amazing opportunity to work in well established organization.',
      link: 'career/nwm',
      yearStart: '2004',
      yearEnd: '2014',
      title: 'Application Engineer'
    },
    { 
      id: 3, backgroundImage: 'collage/nah-background.jpg', backgroundAlt: 'Picture while riding chairlist at Pine Mountain Ski hill',
      backgroundLink: 'https://www.pinemountainresort.com/ski/mountain-info/ski-jumps', backgroundText: 'Pine Mountain Ski Hill',
      backgroundTextDetails: 'Taking a break from work.  Lots of great memories teaching our kids how to ski and watching them compete on the local racing team.',
      brandImage: 'collage/nah-brand.jpg', brandAlt: 'Picture of business sign',
      company: 'Niagara Animal Hospital', 
      summary: 'We bought an animal hospital near the U.P. that was slowly dying and turned it into a thriving and growing business, which we eventually sold.  I handled marketing, IT, and the behind the scenes aspects of the business.',
      link: 'career/nah',
      yearStart: '2013',
      yearEnd: '2021',
      title: 'Business Owner'
    },
    { 
      id: 4, backgroundImage: 'collage/mje-background.jpg', backgroundAlt: 'Picture of two kayaks floating on a lake at sunset',
      backgroundLink: 'https://www.flyfisherman.com/editorial/saving-wisconsins-menominee-river/458972', backgroundText: 'Menominee River',
      backgroundTextDetails: 'Watching the sunset from our kayaks.  The U.P. is filled with great places to paddle.',
      brandImage: 'collage/mje-brand.jpg', brandAlt: 'Picture of MJE Headquarters',
      company: 'M.J. Electric', 
      summary: 'Large electrical contracting company headquartered in the U.P. with a small but accomplished IT department.  I put the polish on the Web Applications and added organization to our Web Team.',
      link: 'career/mje',
      yearStart: '2018',
      yearEnd: '2021',
      title: 'Senior Web Developer'
    },
    { 
      id: 5, backgroundImage: 'collage/self-background.jpg', backgroundAlt: 'Picture standing at the top of a mountain',
      backgroundLink: 'https://peakvisor.com/adm/montana.html', backgroundText: 'Montana',
      brandImage: 'collage/self-brand.jpg', brandAlt: 'Picture of MJE Headquarters',
      company: 'Mountains and Code', 
      summary: 'After selling our business we took time off to travel and visit national parks.  Then we left the Midwest and achieved our long term goal of moving to Montana.  During this time I did web work for a few small organizations and spent time improving my design and tech skills.',
      // link: 'career/self',
      yearStart: '2021',
      yearEnd: '2023',
      title: 'Full Stack Developer'
    }
];




