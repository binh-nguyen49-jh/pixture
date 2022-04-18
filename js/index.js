function DraggableSlide(htmlElement) {
  this.isDragging = false;
  this.startX = 0;
  this.outerElement = htmlElement;
  this.innerElement = htmlElement.querySelector('ul');
  this.outerElement.addEventListener('mousedown', (event) => this.onDragStart(event));
  this.outerElement.addEventListener('mouseup', (event) => this.onDragEnd(event));
  this.outerElement.addEventListener('mousemove', (event) => this.onDrag(event));

  this.outerElement.addEventListener('touchstart', (event) => this.onDragStart(event));
  this.outerElement.addEventListener('touchend', (event) => this.onDragEnd(event));
  this.outerElement.addEventListener('touchmove', (event) => this.onDrag(event));
  window.addEventListener('mouseup', (event) => {
    this.isDragging = false;
  });

  this.onDrag = function (event) {
    event.preventDefault();
    if (this.isDragging) {
      // scroll element by the amount of the mouse movement
      this.outerElement.style.cursor = 'grabbing';
      this.innerElement.style.left = `${event.offsetX - this.startX}px`;
      this.forceInBoundary();
    }
  };

  this.onDragStart = function (event) {
    event.preventDefault();
    this.isDragging = true;
    this.startX = event.offsetX - this.innerElement.offsetLeft;
    this.innerElement.style.transition = "none";
  }

  this.onDragEnd = function (event) {
    event.preventDefault();
    this.outerElement.style.cursor = 'grab';
    this.innerElement.style.transition = "0.25s";
  }

  this.forceInBoundary = () => {
    const outer = this.outerElement.getBoundingClientRect();
    const inner = this.innerElement.getBoundingClientRect();

    if (parseInt(this.innerElement.style.left) > 0) {
      this.innerElement.style.left = '0px';
    } else if (inner.right < outer.right) {
      this.innerElement.style.left = `${- (inner.width - outer.width)}px`;
    } 
  }

  this.move = (amount) => {
    const lastPosition = this.innerElement.style.left? parseInt(this.innerElement.style.left): 0;
    this.innerElement.style.transition = 'transition:all 0.5s linear;';
    this.innerElement.style.left = `${lastPosition - amount}px`;
    // this.innerElement.style.transition = 'none';
    this.flexibleInBoundary();
  }

  this.flexibleInBoundary = () => {
    const outer = this.outerElement.getBoundingClientRect();
    const inner = this.innerElement.getBoundingClientRect();
    if (inner.right < outer.right) {
      this.innerElement.style.left = `0px`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel");
  carousels.forEach(carousel => {
    const card = carousel.querySelector(".card");
    
    const navigateIcon = carousel.querySelector(".carousel__icon");
    const carouselContainer = carousel.querySelector(".carousel__container");
    const draggableCarousel = new DraggableSlide(carouselContainer);
    
    const cardResizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        carousel.style.height =  `${entry.target.getBoundingClientRect().height}px`;
        carouselContainer.style.height = `${entry.target.getBoundingClientRect().height}px`;
      }
    });
    cardResizeObserver.observe(card);

    window.addEventListener("resize", () => {
      draggableCarousel.innerElement.style.left = '0px';
    })

    navigateIcon.addEventListener("click", (event) => {
      event.preventDefault();
      draggableCarousel.move(300);
    });
  })
})

