document.addEventListener('DOMContentLoaded', () => {
    // Register the ScrollTrigger plugin with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Animate the main title and introduction
    gsap.from("#about-title", { opacity: 0, y: -20, duration: 1, delay: 0.2 });
    gsap.from("#about-intro", { opacity: 0, y: -20, duration: 1, delay: 0.4 });

    // Select all the timeline content cards
    const timelineContents = gsap.utils.toArray('.timeline-content');

    timelineContents.forEach(content => {
        gsap.to(content, {
            // Animation properties to achieve
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            // ScrollTrigger configuration
            scrollTrigger: {
                trigger: content, // The element that triggers the animation
                start: 'top 85%', // Start animation when the top of the element is 85% from the top of the viewport
                end: 'bottom 15%', // End (not really needed for this one-shot animation)
                toggleActions: 'play none none none', // Play the animation once when it enters the viewport
                // markers: true, // Uncomment for debugging to see trigger points
            }
        });
    });

    // Animate the timeline line and circles
    gsap.from(".timeline-container::before", {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 2,
        ease: 'power2.inOut',
        scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top 70%',
            end: 'bottom 100%',
            scrub: 1,
        }
    });

});
