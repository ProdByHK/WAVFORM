/* =============================================
   WAV.FORM — PRODUCT DETAIL PAGE JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Get slug from URL ──────────────────
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');

    if (!slug) {
        window.location.href = 'index.html#products';
        return;
    }

    const product = getProductBySlug(slug);
    if (!product) {
        window.location.href = 'index.html#products';
        return;
    }

    // ─── Populate page ──────────────────────
    document.title = `WAV.FORM — ${product.name}`;
    document.getElementById('breadcrumbName').textContent = product.name;
    document.getElementById('pdpMainImg').src = product.image;
    document.getElementById('pdpMainImg').alt = product.name;
    document.getElementById('pdpName').textContent = product.name;
    document.getElementById('pdpPrice').textContent = '$' + product.price;
    document.getElementById('pdpDesc').textContent = product.description;

    // Tag
    const tagEl = document.getElementById('pdpTag');
    if (product.tag) {
        tagEl.textContent = product.tag;
        tagEl.style.display = 'block';
    }

    // Sizes
    const sizesContainer = document.getElementById('pdpSizes');
    let selectedSize = null;
    product.sizes.forEach((size, i) => {
        const btn = document.createElement('button');
        btn.className = 'pdp-size-btn';
        btn.textContent = size;
        if (i === 0) {
            btn.classList.add('active');
            selectedSize = size;
        }
        btn.addEventListener('click', () => {
            sizesContainer.querySelectorAll('.pdp-size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = size;
        });
        sizesContainer.appendChild(btn);
    });

    // Details grid
    const detailsGrid = document.getElementById('pdpDetails');
    if (product.details) {
        Object.entries(product.details).forEach(([key, value]) => {
            const row = document.createElement('div');
            row.className = 'detail-row';
            row.innerHTML = `
                <span class="detail-label">${key.toUpperCase()}</span>
                <span class="detail-value">${value}</span>
            `;
            detailsGrid.appendChild(row);
        });
    }

    // ─── Accordion ──────────────────────────
    document.querySelectorAll('.pdp-accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const target = document.getElementById(header.dataset.target);
            const icon = header.querySelector('.accordion-icon');
            const isActive = header.classList.contains('active');

            header.classList.toggle('active');
            target.classList.toggle('active');
            icon.textContent = isActive ? '+' : '−';
        });
    });

    // ─── Add to Cart ────────────────────────
    const cart = JSON.parse(localStorage.getItem('wavform_cart') || '[]');

    document.getElementById('pdpAddBtn').addEventListener('click', () => {
        const btn = document.getElementById('pdpAddBtn');
        const existing = cart.find(item => item.name === product.name && item.size === selectedSize);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({
                name: product.name,
                price: product.price,
                img: product.image,
                size: selectedSize,
                qty: 1
            });
        }
        localStorage.setItem('wavform_cart', JSON.stringify(cart));
        updateCartUI();
        openCart();

        // Button feedback
        btn.innerHTML = '<span>ADDED ✓</span>';
        btn.style.background = '#1a1a1a';
        btn.style.borderColor = '#4caf50';
        btn.style.color = '#4caf50';
        setTimeout(() => {
            btn.innerHTML = '<span>ADD TO BAG</span>';
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 1200);
    });

    // ─── Related Products ───────────────────
    const allProducts = getProducts();
    const related = allProducts.filter(p => p.slug !== slug).slice(0, 4);
    const relatedGrid = document.getElementById('relatedGrid');

    related.forEach(p => {
        const card = document.createElement('a');
        card.className = 'pdp-related-card';
        card.href = `product.html?slug=${p.slug}`;
        card.innerHTML = `
            <div class="pdp-related-img-wrap">
                <img src="${p.image}" alt="${p.name}" class="pdp-related-img" loading="lazy">
                ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
            </div>
            <div class="pdp-related-info">
                <h3 class="pdp-related-name">${p.name}</h3>
                <span class="pdp-related-price">$${p.price}</span>
            </div>
        `;
        relatedGrid.appendChild(card);
    });

    // ─── Cart System (shared) ───────────────
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

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

        cartCount.textContent = totalItems;
        cartCount.classList.toggle('show', totalItems > 0);

        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartFooter.style.display = 'none';
            cartItems.querySelectorAll('.cart-item').forEach(item => item.remove());
        } else {
            cartEmpty.style.display = 'none';
            cartFooter.style.display = 'block';
            cartTotal.textContent = '$' + totalPrice;

            cartItems.querySelectorAll('.cart-item').forEach(item => item.remove());

            cart.forEach((item, index) => {
                const el = document.createElement('div');
                el.className = 'cart-item';
                el.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}${item.size ? ` — ${item.size}` : ''}</div>
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

            cartItems.querySelectorAll('.qty-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    cart[index].qty += btn.dataset.action === 'plus' ? 1 : -1;
                    if (cart[index].qty <= 0) cart.splice(index, 1);
                    localStorage.setItem('wavform_cart', JSON.stringify(cart));
                    updateCartUI();
                });
            });

            cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    cart.splice(parseInt(btn.dataset.index), 1);
                    localStorage.setItem('wavform_cart', JSON.stringify(cart));
                    updateCartUI();
                });
            });
        }
    }

    // ─── Checkout Flow (Maps, Logistics, Payment) ─
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutClose = document.getElementById('checkoutClose');
    
    // Steps
    const step1 = document.getElementById('chkStep1');
    const step2 = document.getElementById('chkStep2');
    const step3 = document.getElementById('chkStep3');
    const step4 = document.getElementById('chkStep4');

    if (checkoutBtn && checkoutModal) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                closeCart();
                checkoutOverlay.classList.add('active');
                checkoutModal.classList.add('active');
                
                step1.classList.add('active');
                step2.classList.remove('active');
                step3.classList.remove('active');
                step4.classList.remove('active');
            }
        });

        const closeCheckout = () => {
            checkoutOverlay.classList.remove('active');
            checkoutModal.classList.remove('active');
        };

        checkoutClose.addEventListener('click', closeCheckout);
        checkoutOverlay.addEventListener('click', closeCheckout);

        document.getElementById('chkBtnNext1').addEventListener('click', () => {
            const addr = document.getElementById('chkAddress').value;
            if(!addr) return alert('ENTER DROP ZONE ADDRESS');
            step1.classList.remove('active');
            step2.classList.add('active');
        });

        document.getElementById('chkBtnNext2').addEventListener('click', () => {
            step2.classList.remove('active');
            step3.classList.add('active');
        });

        document.getElementById('chkBtnBack1').addEventListener('click', () => {
            step2.classList.remove('active');
            step1.classList.add('active');
        });

        document.getElementById('chkBtnBack2').addEventListener('click', () => {
            step3.classList.remove('active');
            step2.classList.add('active');
        });

        const payTabs = document.querySelectorAll('.chk-pay-tab');
        const payContents = document.querySelectorAll('.chk-pay-content');

        payTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                payTabs.forEach(t => t.classList.remove('active'));
                payContents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById('pay-' + tab.dataset.pay).classList.add('active');
            });
        });

        document.getElementById('chkBtnFinal').addEventListener('click', () => {
            const btn = document.getElementById('chkBtnFinal');
            btn.textContent = 'VERIFYING...';
            setTimeout(() => {
                step3.classList.remove('active');
                step4.classList.add('active');
                
                cart.length = 0;
                localStorage.setItem('wavform_cart', JSON.stringify(cart));
                updateCartUI();
            }, 1500);
        });

        document.getElementById('chkBtnDone').addEventListener('click', closeCheckout);
    }

    // Init cart UI
    updateCartUI();

    // ─── Custom Cursor ──────────────────────
    const cursor = document.getElementById('cursor');
    const cursorTrail = document.getElementById('cursorTrail');
    let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

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

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // ─── Mobile Menu ────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (cartDrawer.classList.contains('active')) closeCart();
            if (mobileMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
});
