document.addEventListener('DOMContentLoaded', () => {

    // ===== Accordion =====
    document.querySelectorAll('[data-accordion]').forEach(item => {
        const header = item.querySelector('.service-item__header');
        header.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            // Close all in same group
            item.closest('.services__items').querySelectorAll('.service-item').forEach(el => {
                el.classList.remove('active');
            });
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });

    // ===== Results Slider =====
    const track = document.querySelector('.results__track');
    const slides = document.querySelectorAll('.results__slide');
    const prevBtn = document.querySelector('.results__arrow--prev');
    const nextBtn = document.querySelector('.results__arrow--next');
    const dotsContainer = document.querySelector('.results__dots');
    let currentSlide = 0;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('results__dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        currentSlide = index;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide >= slides.length) currentSlide = 0;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        document.querySelectorAll('.results__dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
        });
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Touch/swipe
    let touchStartX = 0;
    const slider = document.querySelector('.results__slider');

    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            goToSlide(currentSlide + (diff > 0 ? 1 : -1));
        }
    }, { passive: true });

    // ===== Lightbox =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox__img');
    const lightboxClose = lightbox.querySelector('.lightbox__close');
    const lightboxPrev = lightbox.querySelector('.lightbox__arrow--prev');
    const lightboxNext = lightbox.querySelector('.lightbox__arrow--next');
    let lightboxImages = [];
    let lightboxIndex = 0;

    function openLightbox(images, index) {
        lightboxImages = images;
        lightboxIndex = index;
        lightboxImg.src = lightboxImages[lightboxIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function lightboxGo(dir) {
        lightboxIndex += dir;
        if (lightboxIndex < 0) lightboxIndex = lightboxImages.length - 1;
        if (lightboxIndex >= lightboxImages.length) lightboxIndex = 0;
        lightboxImg.src = lightboxImages[lightboxIndex];
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => lightboxGo(-1));
    lightboxNext.addEventListener('click', () => lightboxGo(1));
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxGo(-1);
        if (e.key === 'ArrowRight') lightboxGo(1);
    });

    // Clickable galleries
    function setupLightboxGallery(selector) {
        const container = document.querySelector(selector);
        if (!container) return;
        const imgs = Array.from(container.querySelectorAll('img'));
        imgs.forEach((img, i) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                openLightbox(imgs.map(im => im.src), i);
            });
        });
    }

    setupLightboxGallery('.gallery__grid');
    setupLightboxGallery('.education__gallery');
    setupLightboxGallery('.results__track');

    // ===== Scroll Animations =====
    const fadeElements = document.querySelectorAll(
        '.section-title, .about__block, .about__quote-block, .advantage, ' +
        '.services__card, .results__slider, .education__item, .gallery__item, ' +
        '.appointment__info, .appointment__buttons'
    );

    fadeElements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    fadeElements.forEach(el => observer.observe(el));

    // ===== Smooth scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
