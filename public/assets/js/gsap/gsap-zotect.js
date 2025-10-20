(function ($) {
    "use strict";
  
    // 1) 先註冊插件
    gsap.registerPlugin(ScrollTrigger, SplitText);
  
    // 2) 當所有字型/圖片載入完，再 refresh 一次（避免高度變動）
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  
    // Text Invert With Scroll
    const split = new SplitText(".bw-split-text", { type: "lines" });
    split.lines.forEach((target) => {
      gsap.to(target, {
        backgroundPositionX: 0,
        ease: "none",
        // ★ 建議取消 scrub 或改成更小的值，並提早觸發
        // scrub: 1,
        scrollTrigger: {
          trigger: target,
          start: 'top 90%',
          end: "bottom 70%",
        }
      });
    });
  
    // Split Text Animation
    const st = $(".split-text");
    if (st.length > 0) {
      st.each(function (index, el) {
        el.split = new SplitText(el, {
          type: "lines,words,chars",
          linesClass: "split-line"
        });
        gsap.set(el, { perspective: 400 });
  
        // 初始狀態
        if ($(el).hasClass('right')) {
          gsap.set(el.split.chars, { opacity: 0, x: 50 });
        }
        if ($(el).hasClass('left')) {
          gsap.set(el.split.chars, { opacity: 0, x: -50 });
        }
        if ($(el).hasClass('up')) {
          gsap.set(el.split.chars, { opacity: 0, y: 80 });
        }
        if ($(el).hasClass('down')) {
          gsap.set(el.split.chars, { opacity: 0, y: -80 });
        }
  
        el.anim = gsap.to(el.split.chars, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",       // ★ 更早觸發
            // once: true,           // 若希望只播一次可開啟
          },
          x: 0,
          y: 0,
          rotateX: 0,
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.02,
        });
      });
  
      // ★ SplitText 切完後強制重算一次
      ScrollTrigger.refresh();
    }
  
    // Text Up Scroll
    if ($('.text-splite-up').length > 0) {
      let splitTitleLines = gsap.utils.toArray(".text-splite-up");
      splitTitleLines.forEach(splitTextLine => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: splitTextLine,
            start: 'top 90%',     // ★ 提早
            end: 'bottom 70%',
            scrub: false,         // ★ 進場感更俐落
            toggleActions: 'play none none reverse'
          }
        });
  
        const itemSplitted = new SplitText(splitTextLine, { type: "words, lines" });
        gsap.set(splitTextLine, { perspective: 400 });
        itemSplitted.split({ type: "lines" });
  
        tl.from(itemSplitted.lines, {
          duration: 0.9,
          opacity: 0,
          rotationX: -80,
          force3D: true,
          transformOrigin: "top center -50",
          stagger: 0.1
        });
      });
  
      ScrollTrigger.refresh();
    }
  
    // Hero Banner Content
    if ($('.tp-play-up, .tp-play-up-2').length > 0) {
      let splitTextLines = gsap.utils.toArray(".tp-play-up, .tp-play-up-2");
      splitTextLines.forEach(splitTextLine => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: splitTextLine,
            start: 'top 90%',
            end: 'bottom 60%',
            scrub: false,
            toggleActions: 'play none none none'
          }
        });
  
        const itemSplitted = new SplitText(splitTextLine, { type: "lines" });
        gsap.set(splitTextLine, { perspective: 400 });
        itemSplitted.split({ type: "lines" });
  
        tl.from(itemSplitted.lines, {
          duration: 0.9,
          opacity: 0,
          rotationX: -80,
          force3D: true,
          transformOrigin: "top center -50",
          stagger: 0.1
        });
      });
  
      ScrollTrigger.refresh();
    }
  
    // Hero Circle Btn
    if ($('.tp-btn-trigger').length > 0) {
      gsap.set(".tp-btn-bounce", { y: -150, opacity: 0 });
      gsap.utils.toArray(".tp-btn-bounce").forEach((btn) => {
        const $container = $(btn).closest('.tp-btn-trigger');
        gsap.to(btn, {
          scrollTrigger: {
            trigger: $container[0],
            start: "top 85%"
          },
          duration: 1.2,
          ease: "bounce.out",
          y: 0,
          opacity: 1,
        });
      });
    }
  
    // Draw Border（每條用自己的 trigger，移除 delay）
    document.querySelectorAll('.bw-draw-border').forEach((line) => {
      gsap.set(line, { width: 0 });
      gsap.to(line, {
        scrollTrigger: {
          trigger: line,          // ★ 用自己
          start: 'top 90%',
          end: 'bottom 80%',
          scrub: 1
        },
        width: "100%",
        duration: 2
      });
    });
  
    // Image reveal animation（保持不變，補 start/once 視需要）
    function revealAnimation(selector, axis, percent, scale) {
      gsap.utils.toArray(selector).forEach(function (revealItem) {
        var image = revealItem.querySelector("img");
        if (!image) return;
  
        var tl = gsap.timeline({
          scrollTrigger: {
            trigger: revealItem,
            start: 'top 90%',     // ★ 加早一點
            toggleActions: "play none none reverse",
            // once: true,
          },
        });
  
        tl.set(revealItem, { autoAlpha: 1 })
          .from(revealItem, {
            duration: 1.2,
            [axis + "Percent"]: -percent,
            ease: "power2.out",
          })
          .from(image, {
            duration: 1.2,
            [axis + "Percent"]: percent,
            scale: scale,
            delay: -1.2,
            ease: "power2.out",
          });
      });
    }
    revealAnimation(".reveal-right", "x", -100, 1.15);
    revealAnimation(".reveal-left", "x", 100, 1.15);
    revealAnimation(".reveal-bottom", "y", -100, 1.15);
  
    // Hover reveal（你的 setInterval 寫法會「立刻執行一次」而非每 50ms 執行）
    const hoverItem = document.querySelectorAll(".bw-hover-image");
    function moveImage(e, hoverItem, index) {
      const item = hoverItem.getBoundingClientRect();
      const x = e.clientX - item.x;
      const y = e.clientY - item.y;
      if (hoverItem.children[index]) {
        hoverItem.children[index].style.transform = `translate(${x}px, ${y}px)`;
      }
    }
    hoverItem.forEach((item) => {
      // 建議直接用 requestAnimationFrame/mousemove，而不是 setInterval
      item.addEventListener("mousemove", (e) => {
        moveImage(e, item, 1);
      });
    });
  
    // data-background
    $("[data-background]").each(function () {
      $(this).css("background-image", "url(" + $(this).attr("data-background") + ")");
    });
  
  })(jQuery);

  // 先註冊外掛
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // 專治 .split-text.left：提早觸發、只播一次
  function applySplitOnce(selector, fromState) {
    document.querySelectorAll(selector).forEach((el) => {
      // 先把文字切好
      const st = new SplitText(el, { type: "lines,words,chars" });
      gsap.set(el, { perspective: 400 });
      gsap.set(st.chars, fromState);

      gsap.to(st.chars, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.02,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 92%",      // 提早進場
          end: "bottom 70%",
          once: true,            // 只播一次，避免來回才看到
          // markers: true,      // 除錯時可打開
        },
      });
    });
  }

  // 等「圖片 & 字型」都就緒，再 refresh 一次，確保觸發點正確
  function hardRefresh() {
    ScrollTrigger.refresh();
  }

  // 1) DOM 先綁
  document.addEventListener("DOMContentLoaded", () => {
    applySplitOnce(".split-text.left", { opacity: 0, x: -40 });
  });

  // 2) 所有資源載完（包含圖片）
  window.addEventListener("load", hardRefresh);

  // 3) webfonts 戴入完也刷新（若瀏覽器支援）
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(hardRefresh);
  }

  // 4) 透過 imagesLoaded 再保險一次（你已經載入 imagesloaded.min.js）
  if (window.imagesLoaded) {
    imagesLoaded(document.body, hardRefresh);
  }

