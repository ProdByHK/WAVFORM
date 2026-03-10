/* =============================================
   WAV.FORM — PRODUCT DATA STORE
   Centralized data layer using localStorage
   ============================================= */

const DEFAULT_PRODUCTS = [
    {
        slug: 'phantom-tactical-jacket',
        name: 'PHANTOM TACTICAL JACKET',
        price: 320,
        image: 'images/product_jacket.png',
        tag: 'NEW',
        description: 'Engineered for the night. The Phantom Tactical Jacket is a multi-pocket, heavy-duty shell built from waterproof ripstop nylon with sealed seams. Inspired by military-spec field jackets, reimagined for the urban underground. Features 8 utility pockets, adjustable buckle straps, and a concealed hood system.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        details: {
            material: '100% Waterproof Ripstop Nylon, DWR Coating',
            fit: 'Oversized tactical fit — size down for slim',
            care: 'Machine wash cold. Do not bleach. Hang dry.',
            weight: '1.2 kg'
        }
    },
    {
        slug: 'signal-cargo-pants',
        name: 'SIGNAL CARGO PANTS',
        price: 245,
        image: 'images/product_pants.png',
        tag: '',
        description: 'Low-frequency utility. The Signal Cargo Pants feature 6 tactical pockets with buckle closures, reinforced knees, and adjustable ankle cuffs. Built from heavyweight cotton-nylon blend with 4-way stretch for unrestricted movement. Elastic waistband with webbing belt included.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        details: {
            material: '65% Cotton, 35% Nylon with 4-way stretch',
            fit: 'Relaxed tapered — true to size',
            care: 'Machine wash cold. Tumble dry low.',
            weight: '0.8 kg'
        }
    },
    {
        slug: 'molle-tactical-vest',
        name: 'MOLLE TACTICAL VEST',
        price: 280,
        image: 'images/product_vest.png',
        tag: 'CORE',
        description: 'The backbone of any WAV.FORM fit. The MOLLE Tactical Vest features full MOLLE webbing across the front and back for modular attachment points. Front zip closure, 4 magazine-style pockets, and padded shoulder straps. Layer it over hoodies, tees, or jackets for instant edge.',
        sizes: ['S', 'M', 'L', 'XL'],
        details: {
            material: '1000D Cordura Nylon',
            fit: 'Adjustable — fits most body types',
            care: 'Spot clean only. Air dry.',
            weight: '0.9 kg'
        }
    },
    {
        slug: 'stealth-tech-hoodie',
        name: 'STEALTH TECH HOODIE',
        price: 195,
        image: 'images/product_hoodie.png',
        tag: '',
        description: 'Silent. Invisible. The Stealth Tech Hoodie is a high-neck, full-zip technical hoodie with zippered hand pockets and a hidden media pocket. Constructed from bonded fleece with a water-resistant outer shell. The extended collar can be worn up for face coverage or folded down for a clean silhouette.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        details: {
            material: 'Bonded fleece with WR shell, YKK zippers',
            fit: 'Regular fit — true to size',
            care: 'Machine wash cold. Do not iron.',
            weight: '0.65 kg'
        }
    },
    {
        slug: 'ground-zero-boots',
        name: 'GROUND ZERO BOOTS',
        price: 385,
        image: 'images/product_boots.png',
        tag: 'LIMITED',
        description: 'Built for concrete. The Ground Zero Boots feature thick Vibram rubber soles, full-grain leather uppers with ballistic nylon panels, and dual buckle strap closures. Waterproof membrane keeps you dry. Steel shank for stability. These are the boots that hit as hard as the beat.',
        sizes: ['40', '41', '42', '43', '44', '45'],
        details: {
            material: 'Full-grain leather, Ballistic nylon, Vibram sole',
            fit: 'True to size — half size up for thick socks',
            care: 'Wipe clean with damp cloth. Apply leather conditioner.',
            weight: '1.5 kg (pair)'
        }
    },
    {
        slug: 'freq-sling-bag',
        name: 'FREQ SLING BAG',
        price: 145,
        image: 'images/product_vest.png',
        tag: '',
        description: 'Keep your essentials locked. The Freq Sling Bag is a compact crossbody with 3 zippered compartments, quick-release buckle, and adjustable strap. Made from water-resistant 500D nylon with reflective accent stitching. Fits phones, wallets, keys, and small EDC items.',
        sizes: ['ONE SIZE'],
        details: {
            material: '500D Water-Resistant Nylon, Reflective stitching',
            fit: 'One size — adjustable strap (60-120cm)',
            care: 'Wipe clean. Air dry.',
            weight: '0.3 kg'
        }
    }
];

// ─── Storage Key ──────────────────────
const STORAGE_KEY = 'wavform_products';

// ─── Initialize ───────────────────────
function initProducts() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    }
}

// ─── Get All Products ─────────────────
function getProducts() {
    initProducts();
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

// ─── Get Product by Slug ──────────────
function getProductBySlug(slug) {
    const products = getProducts();
    return products.find(p => p.slug === slug) || null;
}

// ─── Generate Slug from Name ──────────
function generateSlug(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// ─── Add Product ──────────────────────
function addProduct(product) {
    const products = getProducts();
    product.slug = product.slug || generateSlug(product.name);
    // Check for duplicate slug
    const existing = products.find(p => p.slug === product.slug);
    if (existing) {
        product.slug = product.slug + '-' + Date.now();
    }
    products.push(product);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return product;
}

// ─── Update Product ───────────────────
function updateProduct(slug, updates) {
    const products = getProducts();
    const index = products.findIndex(p => p.slug === slug);
    if (index === -1) return null;
    // If name changed, regenerate slug
    if (updates.name && updates.name !== products[index].name) {
        updates.slug = generateSlug(updates.name);
    }
    products[index] = { ...products[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return products[index];
}

// ─── Delete Product ───────────────────
function deleteProduct(slug) {
    const products = getProducts();
    const filtered = products.filter(p => p.slug !== slug);
    if (filtered.length === products.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}

// ─── Reset to defaults (admin utility) ─
function resetProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
}
