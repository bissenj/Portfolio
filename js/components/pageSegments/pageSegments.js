
const IMAGE_PATH = '~/../../../img/projects';


function renderFactory(data, index = 0) {
    // console.log('RenderFactory(): ', data);

    const type = data.type;
    let result = '';

    switch(type) {
        case 0: 
            result = renderFullWidthImageWithTextOverlay(data);
            break;
        case 1:
            result = renderTextBlockCentered(data);
            break;
        case 2: 
            result = renderImageCollageTwoOne(data);
            break;
        case 3: 
            result = renderFullWidthImage(data);
            break;
        case 4: 
            result = renderTextBlockTwoColumn(data);
            break;
        case 5: 
            result = renderTextBlocksWithHeading(data);
            break;
        case 6: 
            result = renderMixedBlock(data);
            break;
        case 7: 
            result = renderAnimatedImageReveal(data);
            break;
        case 11: 
            result = renderStickySection(data);
            break;
        case 20:
            result = renderQuestionAnswer(data, index);
            break;
        default:
            console.log("renderFactory: unidentified type -> ", index);
            result = renderOops();
    }
    return result;
}


function createNode(html) {
    const node = document.createElement('div');
    node.innerHTML = html;
    return node;
}

function createImage(data) {  
    //console.log('createImage: ', data);  
    let classes = data.class ?? '';
    let image = data.image ?? '';
    let alt = data.alt ?? '';

    let html = '';
    
    if (image !== '') {    
        let classesHtml = ` class='${classes} scroll-target'`;       
        // let classesHtml = ` class='${classes}'`;       

        html += `<div ${classesHtml}><img src='${IMAGE_PATH}/${image}' alt='${alt}'></img></div>`;    
        // html += `<img src='${IMAGE_PATH}/${image}'></img>`;    
    }
     
    return html;
}

function createText(data) { 
    if (data.text.includes('<ul>'))  {
        console.log('createText - input: ', data);  
    }
    let classes = data.classes ?? '';
    let text = data.text ?? '';

    let html = '';
    
    if (text !== '') {            

        let classesHtml = '';
        if (classes != '') {
            classesHtml = ` class='${classes}'`;
        }        
        html += `<p ${classesHtml}>${text}</p>`;            
    }     

    if (data.text.includes('<ul>'))  {
        console.log('createText - output: ', html);  
    }
    return html;
}

function renderOops() {
    return createNode('<div class="grid-center" style="color:red; padding:20px; border: 1px solid red;margin:20px;">oops</div>');
}


function renderFullWidthImage(data) {
    const image1 = data.image1 ?? '';   
    const image1Alt = data.image1Alt ?? ''; 
    const optionalClasses = data.classes ?? '';
    const imageClasses = data.imageClasses ?? '';

    // Logic
    let imageContainer = createImage({image: image1, class: imageClasses, alt: image1Alt});

    let html = `
        <!-- Full width Image -->
        <div class='segment ${optionalClasses}'>
            <div class='image-full-width'>
                ${imageContainer}                                    
            </div>
        </div>
    `;
    return createNode(html);
}

function renderFullWidthImageWithTextOverlay(data) {
    const image1 = data.image1 ?? '';
    const image1Alt = data.image1Alt ?? ''; 
    const text1 = data.text1 ?? '';
    const text2 = data.text2 ?? '';
    const optionalClasses = data.classes ?? '';

    // Logic
    let imageContainer = '';
    if (image1 != '') {
        imageContainer = `<img class='scroll-target' src='${IMAGE_PATH}/${image1}' alt='${image1Alt}'></img>`;                        
    }
    //let imageContainer = createImage({image: image1});

    let text1Container = '';
    if (text1 != '') {
        text1Container = `<div class='text-container grid-center'>
            <h1 class='text-overlay bottom-right slide-right'>${text1}</h1>               
        </div>`;
    }

    let text2Container = '';
    if (text2 != '') {
        text2Container = `<div class='top-right slide-left'>${text2}</div>`;
    }

    //console.log("imageContainer: ", imageContainer);
    
    // let html = `
    //     <!-- Full width Image with Text Overlay -->
    //     <div class='segment ${optionalClasses}'>
    //         <div class='image-full-width grid-center'>
    //             <h1 class='text-overlay'>${text1}<h1/>
    //         </div>
    //     </div>
    // `;

    let html = `
        <!-- Full width Image with Text Overlay -->
        <div class='segment ${optionalClasses}'>
            <div class='image-full-width'>
                ${imageContainer}                        
                ${text1Container}
                ${text2Container}
            </div>
        </div>
    `;

    return createNode(html);
}

function renderTextBlockCentered(data) {    
    const text1 = data.text1;
    const optionalClasses = data.classes || '';

    let html = `
        <!-- Centered Text Block -->
        <div class='segment p80 ${optionalClasses}'>
            <div class='text-block-half grid-center'>
                <p>${text1}</p>            
            </div>
        </div>
    `;
    return createNode(html);
}

function renderImageCollageTwoOne(data) {
    const image1 = data.image1;    
    const image2 = data.image1;    
    const image3 = data.image1;    
    const optionalClasses = data.classes || '';

    let html = `
        <!-- 2-1 Image collage -->
        <div class='segment ${optionalClasses}'>
            <div class='image-grid-2-1'>
                <div class='grid-left'>            
                    <div class='one'>One</div>
                    <div class='two'>Two</div>
                </div>            
                <div class='three'>Three</div>            
            </div>
        </div>
    `;
    return createNode(html);
}

function renderTextBlockTwoColumn(data) {
    const text1 = data.text1;
    const text2 = data.text2;
    const optionalClasses = data.classes || '';

    let html = `
        <!-- 2 text columns -->
        <div class='segment p80 ${optionalClasses}'>
            <div class='text-block-2'>
                <div class='text-block-half grid-center'>
                    <p>${text1}</p>            
                </div>
                <div class='text-block-half grid-center'>
                <p>${text2}</p>            
                </div>
            </div>        
        </div>
    `;
    return createNode(html);
}

function renderTextBlocksWithHeading(data) {
    const heading = data.heading || '';

    //const text1 = data.text1;
    const optionalClasses = data.classes || '';

    let headingHtml = '';
    if (heading != '') {
        headingHtml = `<h4>${heading}</h4>`;
    }

    let paragraphHtml = '';
    data.text.map((item) => {
        let classes = item.classes ?? ''; 

        if (item.text) {
            paragraphHtml += `<p class='${classes}'>${item.text}</p>`;
        }

        // Need to get grid out of place-content center before using this.
        // if (item.image) {
        //     paragraphHtml += createImage({image: item.image, class: classes});
        // }

        //let imageContainer = createImage({image: item.image});
        // let image = item.image ?? '';
        // if (image != '') {
        //     //imageContainer = `<img src='${IMAGE_PATH}/${image}'></img>`;                        
        //     imageContainer = createImage({image});
        // }
        
        //paragraphHtml += imageContainer;

    });

    let html = `
        <!-- Centered Text Block -->
        <div class='segment p80 ${optionalClasses}'>
            <div class='text-block-half grid-center'>
                ${headingHtml}
                ${paragraphHtml}
            </div>
        </div>
    `;
    return createNode(html);
}


function renderMixedBlock(data) {    
    const optionalClasses = data.classes || '';

    const heading = data.heading || '';    
    let headingHtml = '';
    if (heading != '') {
        headingHtml = `<h4>${heading}</h4>`;
    }
    

    let elementsHtml = '';
    data.content.map((item) => {        
        let classes = item.classes ?? '';        
        
        // Mixed block content needs to go in their own div
        elementsHtml += `<div class=${classes}>`;
        
        // Add a paragraph
        let text = item.text ?? '';  
        //console.log("Text: ", text);      
        if (text != '') {        
            elementsHtml += `<p>${text}</p>`;
        }

        // Add an image        
        let image = item.image ?? '';
        if (image != '') {
            elementsHtml += `<img src='${IMAGE_PATH}/${image}'></img>`;                        
        }        
        elementsHtml += `</div>`;
    });

    let html = `
        <!-- Centered Text Block -->
        <div class='segment p80 ${optionalClasses}'>
            <div class='image-full-width grid-center'> 
                ${headingHtml}               
                ${elementsHtml}
            </div>
        </div>
    `;
    return createNode(html);
}


function renderAnimatedImageReveal(data) {
    const optionalClasses = data.classes || '';

    // Loop
    let elementsHtml = '';
    data.content.map((item) => {        
        let classes = item.classes ?? '';        
        
        // Add an image        
        let image = item.image ?? '';
        if (image != '') {
            elementsHtml += `<div class='${classes}'><img src='${IMAGE_PATH}/${image}'></img></div>`;                        
        }        
        
    });

    // Finish up
    let html = `
        <!-- Three Images with Animation Sequence -->
        <div class='segment ${optionalClasses}'>
            ${elementsHtml}
        </div>
    `;

    return createNode(html);
}

// -----------------------------------------------------------------
//              PROJECTS
// -----------------------------------------------------------------

// Sticky text with long image
function renderStickySection(data) {
    let classes = data.classes ?? '';
    let text = data.text ?? '';
    let textClasses = data.textClasses ?? '';

    let image = data.image ?? '';
    let imageClasses = data.imageClasses ?? '';
    let imageContainer = createImage({image: image, class: imageClasses});

    let html = `<div class='sticky-container ${classes}'>`;
    html += `<div class='sticky ${textClasses}'>${text}</div>`;
    html += `<div class='image-full-width'>${imageContainer}</div>`;
    html += `</div>`;
    return createNode(html);
}

// -----------------------------------------------------------------
//              CAREER
// -----------------------------------------------------------------


function renderQuestionAnswer(data, index) {
    const question = data.question ?? '';    
    const optionalClasses = data.classes ?? '';

    let questionHtml = '';
    if (question != '') {    
        if (data.summary.startsWith('-')) {
            questionHtml = `<a class='anchor' id='question${index}'></a><h6 class='question sub-item' data-index=${index}>${question}</h6>`;                
        }   
        else { 
            questionHtml = `<a class='anchor' id='question${index}'></a><h5 class='question' data-index=${index}>${question}</h5>`;                
        }
    }

    let paragraphHtml = '';
    data.answer.map((item) => {
        let classes = item.classes ?? '';         
        //paragraphHtml += `<p class='${classes}'>${item.text}</p>`;
        paragraphHtml += createText({text: item.text, classes: item.classes});
    });

    let html = `
        <!-- Question and Answer Block -->
        <div class='segment p40 ${optionalClasses}'>
            <div class='text-block-half' data-index=${index}>
                ${questionHtml}
                ${paragraphHtml}
            </div>
        </div>
    `;
    return createNode(html);
}



// -----------------------------------------------------------------
//              FOOTER
// -----------------------------------------------------------------

// Generic Footer with Navigation
/* 
    data: {
        classes: 'light-blue, topo-background',
        links: [
            link : {
                classes: '',
                label: 'Career History',
                text: 'Self Employed',
                url: 'career/self,
                icon : {
                    classes: '',
                    path: '',
                }
            }
        ]           
    }
 */
function renderDynamicFooter(data) {
    let classes = data.classes ?? '';

    let html = `<div class='dynamic-footer flex-row-between ${classes}'>`;
    
    let elementsHtml = '';
    data.links.map((item) => {        
        let itemClasses = item.classes ?? '';  
        let label = item.label ?? '';      
        let text = item.text ?? '';
        let url = item.url ?? '';        
        
        if (text) {
            elementsHtml += 
                `<div class='footer-nav-item ${itemClasses}'><a href='${url}'>
                    <div class='label'>${label}</div>
                    <div class='text'>${text}</div>`;
                
            // Add icon if there is one
            if (item.icon) {
                let iconClasses = item.icon.classes ?? '';
                let name = item.icon.name ?? '';
                if (name) {
                    elementsHtml += `<div class='icon ${iconClasses}'><img src='~/../../../img/icons/${name}' /></div>`;
                }
            }
            elementsHtml += `</a></div>`;
        }        
    });

    html += elementsHtml;
    html += '</div>';

    return html;
}