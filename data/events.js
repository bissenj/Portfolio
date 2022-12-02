

// Data
const events = [    
    {
        yearStart: 1998, 
        yearEnd:2003, 
        name: 'University of Wisconsin - Platteville', 
        tools: 'JAVA, C#, Testing internship', 
        image: 'uwp.webp',
        summary: 'Bachelors in Computer Science, Emphasis on Software Engineering.  Interned at Avista, Inc.',
        story: 'I graduated with a degree in Computer Science and a focus on Software Engineering.  I guess I felt the need to prove myself at that age so I took the hardest engineering software, math and science classes I could.  College taught me how to work in groups and that sometimes you need to step up and lead the group in order to get things done.  At one point I also had three W2 jobs and a paying gig job as the drummer in a cover band.  At the time I was uncomfortable with the idea of being in debt out of college.  If I could go back in time and redo the whole experience, I would make myself slow down and relax a bit.  On the upside I came away with my future wife, 8 close friends I still hang out with, several job offers, and learned to snowboard. <p>While in college I interned at Avista, an avaiation software testing and development company. </p>',
        link: 'uwp'
    },
    {
        yearStart: 2000, 
        yearEnd:2006, 
        name: 'Wisconsin Air National Guard', 
        tools: 'HTML, CSS, Javascript', 
        image: 'ang.jpg',
        summary: 'Very structured and professional environment.',
        story: 'I worked on maintaining and upgrading base computers, training peers, and redesigning the department website.  This was my first step into front end design.  Overall, the National Guard was a good learning and growing opportunity to get out of the comfort zone that I grew up in and to be part of a very professional and organized environment.',
        link: 'ang'
    },
    {
        yearStart: 2004, 
        yearEnd:2014, 
        name: "Northwestern Mutual", 
        tools: "Java, C#, Message Queues, Middleware", 
        image: 'nwm.jpg',
        summary: 'Large IT Department (~2000).  Heavy on process.  Low tolerance for failure.  Very professional environment.', 
        story: 'I spent my first decade out of college at Northwestern Mutual in a number of individual contributor and leadership roles.  During this time I gained rigorous testing experience, worked with teams on large and small project development, learned an outstanding methodology for understanding and preventing system failures, and had the importance of system tracing and logs ingrained in my head.  Exposure to how a large scale IT department operated would help me in later years of my career. ',
        link: 'nwm'
    }, 
    {
        yearStart: 2014, 
        yearEnd:2021, 
        name: "NAH", 
        tools: "Web design, marketing, planning, leading", 
        image: 'nah.jpg',
        summary2: "Co-owned Animal Hospital.  My wife (Veterinarian) ran the front end.  I took care of the behind the scenes aspects of the business.", 
        summary: "We bought a ‘fixer upper’ of an animal hospital and turned it from a business that was slowly dying, to a thriving and growing business, which we eventually sold.", 
        story:  "<p> I handled the behind the scenes aspects of the business and property.  From the company culture, to marketing, branding and advertising, to analyzing the workload and planning for staffing, designing and maintaining IT infrastructure, paying bills, purchasing new equipment, all the way down to fixing the plumbing. </p> <p>  I also designed and implemented all our internal and external marketing and branding materials, strategy and social media outlets.  During our time of ownership I designed,  hand coded and maintained our responsive website.  Clients frequently commented how they liked it and I believe it improved our image and credibility.  To grow our business I handled our facebook and google reviews to make sure: A) we were getting them, B) to respond appropriately to feedback, and C) to praise and reward our team for doing awesome work (4.8 rating after hundreds of reviews when we sold the business). </p><p>During this time period I also designed and coded a few responsive websites for local non-profits and eventually, when things were going smoothly, I was able to step away during the day and go back to my full time IT career.  <!-- This was a much needed change as being a business owner, especially in a field I knew little about, was way outside my comfort zone.  We were very successful but there was a cost to our sanity. --> </p>  ", 
        link: 'nah'
    }, 
    {
        yearStart: 2018, 
        yearEnd:2021, 
        name: "M.J. Electric", 
        image: "mje.jpg",
        tools:"Javascript, ASP.Net, C#, React, Adobe XD",         
        summary: "Small IT Department (~10).  Opportunity to mature the dev evironment.  Very friendly work environment.",
        story: "<p>I worked on the Web Development team developing in-house apps in Asp.Net and Javascript.  Typically I worked on front end development, improving UI/UX, building web prototypes to hand off to other developers, building mockups in Adobe XD to help communication between project stake holders, mentoring less experienced team members, and working with the team to mature the development environment through enhancing our process and tools, .</p><div class='aside'><p><div class='heading'>Brief side note:  A wild ride</div>Our dev team 'competed' within the company against 3rd party products.  If we could build something cheaper and better, the rest of the company would use our product, but if not, then the 3rd party product would be brought in-house.  One successful example was our 'Time tracking application' for the field work force where we quickly developed a prototype which was chosen by company leadership over commercial products.  Our production product turned out to be well received by our end users as it saved them time and made their jobs easier.  Some of my contributions on that project (3 person dev team) were the UI/UX design, handling user rollout, training and feedback, and presenting the end product to company leadership [...and full stack development, testing, deployments, handling issues, light project management,  coordinating with our 3rd developer who worked nights, etc...]</p></div> <p>I enjoyed a lot of my time here.  I re-learned I really enjoy coding and the software development process and found my niche in Front End work.  I added value by taking my experience in a larger IT department and adding some maturity to our small dev team.  This maturity helped improve our ability to deliver to and support our end users.  Examples of this are helping design and implement our release process [agile development, git branching strategy, version numbering, backout plans, etc] which added predictability and stability to our software releases.  I also envisioned and helped create a reuseable logging framework for not only tracking issues but also tracking app useage (so we knew in real time if anyone was in the system) and KPI data (so we knew if people were actually using our systems and getting the value the systems were designed for).  A prime example of the benefit of our logging system was being able to notice system issues and proactively calling our end users to help them rather than waiting until they called the issue into our help desk.  We didn’t do this all the time, but for mission critical tasks, especially during app rollouts, it improved our relationship with our end users and improved system adoption.</p>",
        link: 'mje'
    }, 
    {
        yearStart: 2021, 
        yearEnd:2023, 
        name: "Self Employed",
        image: "mac.jpg", 
        tools: "React, Remix, Figma", 
        summary: "Mini-retirement to catch up on life, kids and work skills.",
        story: "In 2021, we sold our business and our family packed up and moved to Montana.  It was a well planned but not straight forward journey.  On our kids first day of school in Montana, we were living out of our camper in an RV park (memories!).  Our house was delayed, so for a number of months we were renting a small townhome and trying to unpack as few boxes as possible.  Most of our house stuff was sold to cut down on moving expenses since we couldn’t find a moving company who would move us 1600 miles from ‘small town in the middle of nowhere’ to another ‘small town in the middle of nowhere’.  Eventually our house was ready and we moved in fully in early 2022.  <p> This move had been our goal since 2012.  We worked HARD and saved for years and finally achieved our goal.  It has been awesome.  No regrets.<p><p>***</p><p>Many people switch careers at some point in their life, sometimes going as far as heading back to college.  Some people are lucky enough to take a sabbatical or two in their work life.  I chose to use this time to refine and expand my skills by setting aside 20 hours a week to work on the IT knowledge I didn’t have time for when working full time.   For example: </p><ul><li>I spent some time learning native Android programming in Kotlin.  While in my career days I could create a web app that looked and functioned like an App, I felt the browser was too limiting. </li><li>I brushed up on my .Net  as it has changed considerably since college and I wanted to see that evolution and what is possible now.</li><li>I dove deeper into React, experimenting with Next JS and eventually building full stack projects with Remix.  Once I was comfortable where I was at with React, I moved to React Native and have been really happy with the developer experience React and React Native provide.  </li></ul><p>Currently I am open for part time employment.  I’m looking to fill about 1000 hours / year as a part time employee or as a contractor.   If you want to discuss more, please reach out.</p><p>Thanks for reading,</p><p>John</p>",
        link: 'self'
    }, 
]
