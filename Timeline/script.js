document.addEventListener('DOMContentLoaded', (event) => {
    const timelineContainer = document.getElementById('timelineContainer');
    console.log(event)


    const image1 = document.querySelector(".ER-front-image");
    console.log(image1)
    
    function handleScroll(event) {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAA")
       
        timelineContainer.scrollLeft += event.deltaY;

        const position = image1.getClientRects()[0];
        if(position.left <= window.innerWidth) {
            const percentage = (position.left / window.innerWidth) * 100;
            console.log(percentage);
            const adjustedPercentage = percentage / 100;
            console.log(adjustedPercentage);
            image1.style.translate = `${adjustedPercentage}% 0%`;
            console.log(image1.style.translate);
        }
    }
    
    window.addEventListener('wheel', handleScroll);
});
