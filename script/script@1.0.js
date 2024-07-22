let lenis;
let isMobileLandscape;
let isMobile;
if (Webflow.env("editor") === undefined) {
  lenis = new Lenis();

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}
lenis.stop();

function supportsTouch() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
function initLoader() {
  let loadText = document.querySelector(".load-text");
  let overlayCircles = document.querySelector(".overlay-circle");
  let paths = overlayCircles.querySelectorAll("path");
  let navInner = document.querySelector(".nav-inner");
  let heroLetters = document.querySelectorAll(".hero-col__title");
  let counter = { value: 0 };

  function updateLoaderText() {
    let progress = Math.round(counter.value);
    loadText.innerHTML = progress;
  }

  let tl = gsap.timeline({
    defaults: {
      ease: "expo.inOut",
      duration: 1.2,
    },
    onComplete: () => {
      lenis.start();
      initGeneralFunctions();
    },
  });

  tl.to(counter, {
    value: 100,
    onUpdate: updateLoaderText,
    duration: 2,
    ease: "power3.inOut",
  })
    .to(
      paths,
      {
        strokeDashoffset: 0,
        stagger: 0.1,
        duration: 2,
        ease: "power3.inOut",
      },
      "<",
    )
    .to(loadText, {
      opacity: 0,
      rotate: -180,
      scale: 0.8,
    })
    .from(
      ".o-center",
      {
        opacity: 0,
        rotate: 720,
      },
      "<",
    )
    .to(
      navInner,
      {
        y: 0,
      },
      "<",
    )
    .to(
      heroLetters,
      {
        y: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.inOut",
      },
      "<",
    );
}
function initNavLinks() {
  let links = document.querySelectorAll("a.text-link");

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const grandParent = link.parentElement.parentElement;
      const siblingLinks = grandParent.querySelectorAll("a");

      siblingLinks.forEach((otherLink) => {
        if (otherLink !== link) {
          otherLink.classList.add("faded");
        }
      });
    });

    link.addEventListener("mouseleave", () => {
      links.forEach((otherLink) => {
        otherLink.classList.remove("faded");
      });
    });
  });
}
function initHeroColumns() {
  gsap.utils.toArray(".hero-col").forEach((col, i) => {
    gsap.to(col, {
      yPercent: -101,
      ease: "linear",
      scrollTrigger: {
        trigger: ".hero",
        start: isMobile ? "top 85%" : "top bottom",
        end: "bottom center",
        scrub: 0 + i * 0.8,
      },
    });
  });

  gsap.to(".nav-bottom", {
    y: 0,
    scrollTrigger: {
      trigger: ".hero",
      start: isMobile ? "top 85%" : "top bottom",
      end: "+=100",
      scrub: true,
    },
  });
}
function initHeroFadeOut() {
  let overlayCircles = document.querySelector(".overlay-circle");
  let paths = overlayCircles.querySelectorAll("path");

  let tl = gsap.timeline({
    defaults: {
      ease: "linear",
    },
    scrollTrigger: {
      trigger: ".hero",
      start: "bottom bottom",
      end: "bottom center",
      scrub: true,
    },
  });
  tl.fromTo(
    ".bg-vid__wrap",
    { opacity: 1 },
    { opacity: 0.15, overwrite: true },
  );
  // .to(
  //   paths,
  //   {
  //     strokeDashoffset: gsap.utils.wrap([1050, -2220, 3400, -4600]),
  //   },
  //   "<",
  // )
  // .to(".o-center", { autoAlpha: 0 }, "<");
}
function initParallax() {
  gsap.utils.toArray("[data-parallax]").forEach((item, i) => {
    // let m = item.getAttribute("data-parallax");
    // let amount = 20 * m * -1;
    let img = item.querySelector("img");

    // gsap.to(item, {
    //   yPercent: amount,
    //   rotate: 0.01,
    //   ease: "linear",
    //   scrollTrigger: {
    //     trigger: item,
    //     start: "top bottom",
    //     end: "bottom top",
    //     scrub: 0.8,
    //   },
    // });

    gsap.to(img, {
      yPercent: -10,
      ease: "linear",
      scrollTrigger: {
        trigger: item,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
function splitLines() {
  const elements = document.querySelectorAll('[data-split="lines"]');
  elements.forEach((el) => {
    if (el.splitInstance) {
      el.splitInstance.revert();
    }

    el.splitInstance = new SplitText(el, {
      type: "lines",
      linesClass: "line",
    });

    el.splitInstance.lines.forEach((line) => {
      const wrapper = document.createElement("div");
      wrapper.style.overflow = "hidden";
      wrapper.classList.add("line-wrapper");
      line.parentNode.insertBefore(wrapper, line);
      wrapper.appendChild(line);
    });

    gsap.set(".line", { yPercent: 150, rotate: 8 });

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        gsap.fromTo(
          el.splitInstance.lines,
          { yPercent: 150, rotate: 8 },
          {
            yPercent: 0,
            rotate: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: "power4.out",
          },
        );
      },
    });
    ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      onLeaveBack: () => {
        gsap.to(el.splitInstance.lines, {
          yPercent: 150,
          rotate: 8,
          duration: 0.2,
        });
      },
    });
  });
}
function splitChars() {
  const elements = document.querySelectorAll('[data-split="chars"]');
  elements.forEach((el) => {
    if (el.splitInstance) {
      el.splitInstance.revert();
    }

    el.splitInstance = new SplitText(el, {
      type: "chars",
      charsClass: "char",
    });
  });
}
function initIntro() {
  gsap.delayedCall(0.5, () => {
    let intro = document.querySelector("[data-intro]");
    let headings = intro.querySelectorAll("h2");
    let lettersLeft = headings[0].querySelectorAll(".char");
    let lettersRight = headings[1].querySelectorAll(".char");
    let brackets = intro.querySelectorAll(".intro-bracket");
    let imgWrap = intro.querySelector(".intro-img");
    let img = imgWrap.querySelector("img");

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: intro,
        start: "top bottom",
        end: "center center",
        scrub: true,
      },
      defaults: {
        ease: "linear",
        duration: 1,
      },
    });

    tl.from(imgWrap, { clipPath: "inset(50%)" })
      .from(img, { scale: 1.3 }, 0)
      .fromTo(
        lettersLeft,
        { yPercent: 150 },
        {
          yPercent: 0,
          stagger: { each: 0.05, from: isMobile ? "center" : "end" },
          duration: 0.6,
          overwrite: true,
        },
        0.6,
      )
      .fromTo(
        lettersRight,
        { yPercent: 150 },
        {
          yPercent: 0,
          stagger: { each: 0.05, from: isMobile ? "center" : "start" },
          duration: 0.6,
          overwrite: true,
        },
        0.6,
      )
      .from(brackets, { xPercent: gsap.utils.wrap([2400, -2400]) }, 0.4);
  });
}
function initVinylSection() {
  let wrap = document.querySelector(".vinyl-inner");

  gsap.fromTo(
    ".bg-vid__wrap",
    {
      opacity: 0.15,
    },
    {
      opacity: 0,
      immediateRender: false,
      ease: "linear",
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom+=50",
        end: "top bottom",
        scrub: true,
      },
    },
  );
  gsap.fromTo(
    ".bg-vid__wrap",
    {
      opacity: 0,
    },
    {
      opacity: 0.15,
      immediateRender: false,
      ease: "linear",
      scrollTrigger: {
        trigger: wrap,
        start: "bottom 5%",
        end: "bottom top",
        scrub: true,
      },
    },
  );

  if (!isMobileLandscape) {
    let tl = gsap.timeline({
      defaults: {
        ease: "linear",
        duration: 1,
      },
      scrollTrigger: {
        trigger: ".vinyl-track",
        start: "top top",
        end: "bottom-=10% bottom",
        scrub: true,
      },
    });

    tl.to(".vinyl-heading", {
      yPercent: -120,
      rotate: -3,
      stagger: 0.05,
    }).fromTo(
      ".h-track",
      { yPercent: 160, rotate: 5 },
      { yPercent: 0, rotate: 0, stagger: 0.03 },
      "<+=0.6",
    );
  } else {
    gsap.fromTo(
      ".h-track",
      { yPercent: 160, rotate: 5 },
      {
        yPercent: 0,
        rotate: 0,
        stagger: 0.05,
        scrollTrigger: {
          trigger: ".v-tracklist",
          start: "top 75%",
          once: true,
        },
      },
    );
  }

  //
}
function initStickyVids() {
  let track = document.querySelector(".f-track");
  let items = gsap.utils.toArray(".f-item");
  let stickyItems = items.slice(1);
  let clip = track.querySelector(".f-item__inner.is--first");
  let firstImg = clip.querySelector("img");

  let introTl = gsap.timeline({
    defaults: {
      ease: "linear",
      duration: 1,
    },
    scrollTrigger: {
      trigger: items[0],
      start: "top top",
      endTrigger: items[1],
      end: "top bottom",
      scrub: true,
    },
  });

  introTl
    .to(clip, {
      clipPath: "inset(0vh 0vw)",
    })
    .from(
      firstImg,
      {
        scale: 1.1,
      },
      "<",
    );

  stickyItems.forEach((item, i) => {
    let prevItem = items[i];
    let prevInner = prevItem.querySelector(".f-item__inner");

    gsap.to(prevInner, {
      scale: 1.05,
      scrollTrigger: {
        trigger: item,
        start: "top bottom",
        end: "top top",
        scrub: true,
      },
    });
  });
}
function initMarqueeScroll() {
  const marqueeGroup = document.querySelector(".footer-marquee");

  const marqueeItemsWidth =
    marqueeGroup.querySelector(".marquee-inner").offsetWidth;
  let marqueeSpeed =
    marqueeGroup
      .querySelector("[data-marquee-speed]")
      .getAttribute("data-marquee-speed") *
    (marqueeItemsWidth / window.innerWidth);

  if (window.innerWidth <= 600) {
    marqueeSpeed = marqueeSpeed * 0.5;
  }

  let direction = 1;

  const marqueeLeft = roll(
      marqueeGroup.querySelector(
        "[data-marquee-direction='left'] .marquee-inner",
      ),
      { duration: marqueeSpeed },
    ),
    scroll = ScrollTrigger.create({
      trigger: document.querySelector("body"),
      onUpdate(self) {
        if (self.direction !== direction) {
          direction *= -1;
          gsap.to(marqueeLeft, {
            timeScale: direction,
            overwrite: true,
          });
        }
        if (self.direction === -1) {
          marqueeGroup
            .querySelector("[data-marquee-status]")
            .setAttribute("data-marquee-status", "normal");
        } else {
          marqueeGroup
            .querySelector("[data-marquee-status]")
            .setAttribute("data-marquee-status", "inverted");
        }
      },
    });

  marqueeGroup.addEventListener("mouseenter", () => {
    gsap.to(marqueeLeft, { timeScale: 0.25 });
  });

  marqueeGroup.addEventListener("mouseleave", () => {
    gsap.to(marqueeLeft, { timeScale: Math.abs(direction) });
  });

  function roll(targets, vars, reverse) {
    vars = vars || {};
    vars.ease || (vars.ease = "none");
    const tl = gsap.timeline({
        repeat: -1,
        onReverseComplete() {
          this.totalTime(this.rawTime() + this.duration() * 10);
        },
      }),
      elements = gsap.utils.toArray(targets),
      clones = elements.map((el) => {
        let clone = el.cloneNode(true);
        el.parentNode.appendChild(clone);
        return clone;
      }),
      positionClones = () =>
        elements.forEach((el, i) =>
          gsap.set(clones[i], {
            position: "absolute",
            overwrite: false,
            top: el.offsetTop,
            left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth),
          }),
        );
    positionClones();
    elements.forEach((el, i) =>
      tl.to([el, clones[i]], { xPercent: reverse ? 100 : -100, ...vars }, 0),
    );
    window.addEventListener("resize", () => {
      let time = tl.totalTime();
      tl.totalTime(0);
      positionClones();
      tl.totalTime(time);
    });
    initMarqueeIntro();
    return tl;
  }

  function initMarqueeIntro() {
    document.querySelectorAll(".h-marquee").forEach((el) => {
      const split = new SplitText(el, { type: "chars", charsClass: "char" });
    });
    gsap.fromTo(
      ".marquee .char",
      {
        yPercent: 120,
      },
      {
        yPercent: 0,
        stagger: 0.025,
        ease: "power4.out",
        duration: 0.8,
        scrollTrigger: {
          trigger: ".main-w",
          start: "bottom 80%",
        },
      },
    );
  }
}
function initDrawing() {
  if (supportsTouch()) {
    return;
  }
  let svgns = "http://www.w3.org/2000/svg";

  function createLine(root, x, y) {
    let line = document.createElementNS(svgns, "line");
    line.setAttribute("x1", x);
    line.setAttribute("y1", y);
    line.setAttribute("x2", x);
    line.setAttribute("y2", y);
    root.appendChild(line);
    return line;
  }

  function handleDrawing(element) {
    let svgRoot = document.createElementNS(svgns, "svg");
    svgRoot.classList.add("cursor-svg");
    element.appendChild(svgRoot);

    let currentLine = null;

    element.addEventListener("mouseenter", (event) => {
      currentLine = createLine(svgRoot, event.offsetX, event.offsetY);
    });

    element.addEventListener("mousemove", (event) => {
      if (currentLine) {
        currentLine.setAttribute("x2", event.offsetX);
        currentLine.setAttribute("y2", event.offsetY);
        currentLine = createLine(svgRoot, event.offsetX, event.offsetY);
      }
    });

    element.addEventListener("mouseleave", () => {
      if (currentLine) {
        gsap.to(svgRoot.querySelectorAll("line"), {
          strokeOpacity: 0,
          duration: 0.01,
          stagger: 0.01,
          ease: "none",
          onComplete: () => {
            svgRoot
              .querySelectorAll("line")
              .forEach((line) => svgRoot.removeChild(line));
          },
        });
        currentLine = null;
      }
    });
  }

  document.querySelectorAll("[data-draw]").forEach(handleDrawing);
}

function initGeneralFunctions() {
  initNavLinks();
  initHeroColumns();
  initHeroFadeOut();
  initIntro();
  initParallax();
  initVinylSection();
  splitLines();
  splitChars();
  initStickyVids();
  initMarqueeScroll();
  initDrawing();
}

window.addEventListener("resize", () => {
  splitLines();
  splitChars();
});

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  isMobileLandscape = window.innerWidth < 768;
  isMobile = window.innerWidth < 480;
});
