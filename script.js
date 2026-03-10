/* =============================================
   WAV.FORM — INTERACTIVITY & ANIMATIONS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Loading Screen ──────────────────────
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');
    let progress = 0;
    
    const loadInterval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'auto';
                initRevealAnimations();
            }, 400);
        }
        loaderBar.style.width = progress + '%';
    }, 200);

    // ─── Custom Cursor ──────────────────────
    const cursor = document.getElementById('cursor');
    const cursorTrail = document.getElementById('cursorTrail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX - 6 + 'px';
        cursor.style.top = mouseY - 6 + 'px';
    });

    function animateTrail() {
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;
        cursorTrail.style.left = trailX - 3 + 'px';
        cursorTrail.style.top = trailY - 3 + 'px';
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .product-card, .lookbook-item');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // ─── Navigation Scroll ──────────────────
    const nav = document.getElementById('nav');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScrollY = scrollY;
    });

    // ─── Smooth Scroll for Anchor Links ─────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });

    // ─── Mobile Menu ────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // ─── Reveal on Scroll ───────────────────
    function initRevealAnimations() {
        const reveals = document.querySelectorAll('.reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay * 1000);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    }

    // ─── Parallax on Lookbook ───────────────
    const lookbookImages = document.querySelectorAll('.lookbook-img');
    
    window.addEventListener('scroll', () => {
        lookbookImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            const scrollPercent = (rect.top + rect.height) / (window.innerHeight + rect.height);
            const translateY = (scrollPercent - 0.5) * 30;
            img.style.transform = `scale(1.05) translateY(${translateY}px)`;
        });
    });

    // ─── Counter Animation ──────────────────
    const statNums = document.querySelectorAll('.stat-num');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateCounter(el, 0, target, 1500);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNums.forEach(el => counterObserver.observe(el));

    function animateCounter(el, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * eased);
            el.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    // ─── Shopping Cart ──────────────────────
    const cart = [];
    const cartBtn = document.getElementById('cartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');

    function openCart() {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const name = card.dataset.name;
            const price = parseInt(card.dataset.price);
            const img = card.dataset.img;
            
            addToCart(name, price, img);
            
            // Button feedback animation
            btn.textContent = 'ADDED ✓';
            btn.style.background = '#1a1a1a';
            btn.style.color = '#4caf50';
            setTimeout(() => {
                btn.textContent = 'ADD TO BAG';
                btn.style.background = '';
                btn.style.color = '';
            }, 1200);
        });
    });

    function addToCart(name, price, img) {
        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ name, price, img, qty: 1 });
        }
        updateCartUI();
        openCart();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartUI();
    }

    function updateQty(index, delta) {
        cart[index].qty += delta;
        if (cart[index].qty <= 0) {
            removeFromCart(index);
        } else {
            updateCartUI();
        }
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

        // Update count badge
        cartCount.textContent = totalItems;
        if (totalItems > 0) {
            cartCount.classList.add('show');
        } else {
            cartCount.classList.remove('show');
        }

        // Render items
        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartFooter.style.display = 'none';
            // Remove cart items but keep empty message
            const items = cartItems.querySelectorAll('.cart-item');
            items.forEach(item => item.remove());
        } else {
            cartEmpty.style.display = 'none';
            cartFooter.style.display = 'block';
            cartTotal.textContent = '$' + totalPrice;

            // Clear existing items
            const oldItems = cartItems.querySelectorAll('.cart-item');
            oldItems.forEach(item => item.remove());

            // Render new items
            cart.forEach((item, index) => {
                const el = document.createElement('div');
                el.className = 'cart-item';
                el.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price}</div>
                        <div class="cart-item-qty">
                            <button class="qty-btn" data-index="${index}" data-action="minus">−</button>
                            <span class="qty-num">${item.qty}</span>
                            <button class="qty-btn" data-index="${index}" data-action="plus">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" data-index="${index}">REMOVE</button>
                `;
                cartItems.appendChild(el);
            });

            // Bind quantity buttons
            cartItems.querySelectorAll('.qty-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    const action = btn.dataset.action;
                    updateQty(index, action === 'plus' ? 1 : -1);
                });
            });

            // Bind remove buttons
            cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    removeFromCart(index);
                });
            });
        }
    }

    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (cart.length > 0) {
            // Flash animation
            const btn = document.getElementById('checkoutBtn');
            btn.textContent = 'PROCESSING...';
            setTimeout(() => {
                btn.textContent = 'ORDER CONFIRMED ✓';
                btn.style.background = '#1a1a1a';
                btn.style.color = '#4caf50';
                setTimeout(() => {
                    cart.length = 0;
                    updateCartUI();
                    closeCart();
                    btn.textContent = 'CHECKOUT';
                    btn.style.background = '';
                    btn.style.color = '';
                }, 1500);
            }, 1000);
        }
    });

    // ─── Audio / Mood Toggle ────────────────
    const moodBtn = document.getElementById('moodBtn');
    const bgAudio = document.getElementById('bgAudio');
    let audioContext;
    let oscillator;
    let gainNode;
    let isPlaying = false;
    let beatInterval;

    moodBtn.addEventListener('click', () => {
        if (!isPlaying) {
            startAmbientBeat();
            moodBtn.classList.add('active');
            isPlaying = true;
        } else {
            stopAmbientBeat();
            moodBtn.classList.remove('active');
            isPlaying = false;
        }
    });

    function startAmbientBeat() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0.15;

        // Create a deep sub-bass drone
        const drone = audioContext.createOscillator();
        drone.type = 'sine';
        drone.frequency.value = 42.5; // ~85 BPM feel
        const droneGain = audioContext.createGain();
        droneGain.gain.value = 0.08;
        drone.connect(droneGain);
        droneGain.connect(audioContext.destination);
        drone.start();

        // Create rhythmic kick pattern at 85 BPM
        const bpm = 85;
        const interval = (60 / bpm) * 1000;
        
        function playKick() {
            const osc = audioContext.createOscillator();
            const kickGain = audioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, audioContext.currentTime + 0.15);
            kickGain.gain.setValueAtTime(0.3, audioContext.currentTime);
            kickGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
            osc.connect(kickGain);
            kickGain.connect(audioContext.destination);
            osc.start();
            osc.stop(audioContext.currentTime + 0.3);
        }

        function playHihat() {
            const bufferSize = audioContext.sampleRate * 0.05;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
            }
            const noise = audioContext.createBufferSource();
            noise.buffer = buffer;
            const hihatGain = audioContext.createGain();
            hihatGain.gain.value = 0.06;
            
            const hihatFilter = audioContext.createBiquadFilter();
            hihatFilter.type = 'highpass';
            hihatFilter.frequency.value = 7000;
            
            noise.connect(hihatFilter);
            hihatFilter.connect(hihatGain);
            hihatGain.connect(audioContext.destination);
            noise.start();
        }

        let beatCount = 0;
        function doBeat() {
            playKick();
            // Hi-hat on every beat
            setTimeout(() => playHihat(), interval * 0.25);
            setTimeout(() => playHihat(), interval * 0.5);
            setTimeout(() => playHihat(), interval * 0.75);

            // Sub-bass variation every 4 beats
            if (beatCount % 4 === 0) {
                const sub = audioContext.createOscillator();
                const subGain = audioContext.createGain();
                sub.type = 'triangle';
                sub.frequency.value = 36;
                subGain.gain.setValueAtTime(0.12, audioContext.currentTime);
                subGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.6);
                sub.connect(subGain);
                subGain.connect(audioContext.destination);
                sub.start();
                sub.stop(audioContext.currentTime + 0.6);
            }
            beatCount++;
        }

        doBeat();
        beatInterval = setInterval(doBeat, interval);

        // Store references to stop later
        window._audioDrone = drone;
        window._audioDroneGain = droneGain;
    }

    function stopAmbientBeat() {
        if (beatInterval) clearInterval(beatInterval);
        if (window._audioDrone) {
            window._audioDrone.stop();
        }
        if (audioContext) {
            audioContext.close();
        }
    }

    // ─── Product Card Tilt Effect ───────────
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            card.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${y * -5}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        });
    });

    // ─── Hero Parallax Effect ───────────────
    const heroBgImg = document.querySelector('.hero-bg-img');
    
    window.addEventListener('scroll', () => {
        if (heroBgImg) {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            if (scrollY < heroHeight) {
                heroBgImg.style.transform = `scale(1.1) translateY(${scrollY * 0.3}px)`;
            }
        }
    });

    // ─── Keyboard shortcuts ─────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (cartDrawer.classList.contains('active')) closeCart();
            if (mobileMenu.classList.contains('active')) toggleMobileMenu();
        }
    });

});
