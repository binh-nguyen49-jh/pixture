const observerOptions = {
  rootMargin: '0px',
  threshold: 1
}

const isInScrollProgress = (element, amount) => {
  return element.scrollLeft + amount > 0 
  && element.scrollLeft + amount < element.scrollWidth - element.getBoundingClientRect().width;
}

function ViewPortTracker(element) {
  this.isInViewport = false;
  this.element = element;
  const observer = new IntersectionObserver((entry) => {
  this.isInViewport = entry[0].isIntersecting;
  }, observerOptions);
  observer.observe(element);
}

document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel__container");
  const main = document.querySelector("main");
  
  
  
  const trackedCarousels = [];
  carousels.forEach(carousel => {
    const trackedCarousel = new ViewPortTracker(carousel);
    trackedCarousels.push(trackedCarousel);
    carousel.addEventListener("wheel", (event) => {
      if (isInScrollProgress(carousel)){
        event.preventDefault();
        carousel.scrollLeft += 10 * event.deltaY;
      }
    })
  })

  main.addEventListener("wheel", (event) => {
  for(let carousel of trackedCarousels) {
    if (carousel.isInViewport && isInScrollProgress(carousel.element, event.deltaY)){
    event.preventDefault();
    carousel.element.scrollLeft += 10 * event.deltaY;
    }
  }})
})