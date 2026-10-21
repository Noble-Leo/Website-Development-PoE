document.addEventListener('DOMContentLoaded', function () {

    // 1. Mobile Menu
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.querySelector('nav ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            navMenu.classList.toggle('open');
        });
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('open');
            });
        });
    }

    // 2. Scroll Animations
    var fadeElements = document.querySelectorAll('.section-header, .product-card, .feature-item, .gallery-item, .form-box, .cta-band');
    fadeElements.forEach(function (el) { el.classList.add('fade-up'); });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(function (el) { observer.observe(el); });

    // 3. Product Data & Dynamic Rendering
    var products = [
        { name: "Cupcakes", desc: "Vanilla, chocolate, red velvet, carrot, lemon, strawberry. Buttercream or cream cheese frosting.", price: 35, priceText: "R35 each | R180 for 6", img: "https://pd.w.org/2026/04/41069e2a83e4a1446.14195419.jpg", alt: "Freshly baked cupcakes" },
        { name: "Butter Croissants", desc: "Flaky, golden and baked fresh every morning. Made with real butter.", price: 22, priceText: "R22 each", img: "https://pd.w.org/2026/08/3826a7185f74eb3c6.67443379.jpg", alt: "Golden butter croissants" },
        { name: "Custom Celebration Cakes", desc: "Made to order. Choose sponge, filling, frosting and design. For birthdays, weddings and more.", price: 450, priceText: "From R450", img: "https://pd.w.org/2025/06/4466849b373771309.44989415.jpg", alt: "Custom decorated cake" },
        { name: "Cookies & Biscuits", desc: "Chocolate chip, oat and raisin, buttery shortbread, and seasonal specials.", price: 18, priceText: "R18 each", img: "https://pd.w.org/2026/06/1866a2145b80d5846.63608257.jpeg", alt: "Homemade cookies" },
        { name: "Fruit Tarts", desc: "Buttery pastry shell, smooth vanilla custard, and fresh seasonal fruit on top.", price: 45, priceText: "R45 each", img: "https://pd.w.org/2026/06/7186a28ed4e64f455.00712049.jpg", alt: "Fresh fruit tart" },
        { name: "Chocolate Ganache Cake", desc: "Rich dark chocolate sponge covered in silky dark chocolate ganache.", price: 65, priceText: "R65 per slice", img: "https://pd.w.org/2025/06/4466849b373771309.44989415.jpg", alt: "Chocolate ganache cake" }
    ];

    var container = document.getElementById('productContainer');

    function renderProducts(list) {
        if (!container) return;
        container.innerHTML = '';

        if (list.length === 0) {
            document.getElementById('noResults').style.display = 'block';
            return;
        }
        document.getElementById('noResults').style.display = 'none';

        list.forEach(function (p) {
            var card = document.createElement('div');
            card.className = 'product-card fade-up visible'; // Add visible so they don't stay hidden
            card.innerHTML =
                '<img src="' + p.img + '" alt="' + p.alt + '" loading="lazy">' +
                '<h3>' + p.name + '</h3>' +
                '<p>' + p.desc + '</p>' +
                '<span class="product-price">' + p.priceText + '</span>' +
                '<button class="btn btn-primary btn-small" data-name="' + p.name + '">Details</button>';
            container.appendChild(card);
        });

        // Attach Modal Event Listeners
        container.querySelectorAll('button[data-name]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var name = this.getAttribute('data-name');
                var product = products.find(function (p) { return p.name === name; });
                if (product) {
                    document.getElementById('modalImage').src = product.img;
                    document.getElementById('modalTitle').textContent = product.name;
                    document.getElementById('modalDesc').textContent = product.desc;
                    document.getElementById('modalPrice').textContent = product.priceText;
                    document.getElementById('productModal').classList.add('show');
                }
            });
        });
    }

    if (container) { renderProducts(products); }

    // 4. Search & Sort
    var searchInput = document.getElementById('searchInput');
    var sortSelect = document.getElementById('sortSelect');

    function applyFilters() {
        if (!container) return;
        var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        var sortValue = sortSelect ? sortSelect.value : 'default';

        var filtered = products.filter(function (p) {
            return p.name.toLowerCase().indexOf(query) !== -1 || p.desc.toLowerCase().indexOf(query) !== -1;
        });

        if (sortValue === 'priceLow') filtered.sort(function (a, b) { return a.price - b.price; });
        else if (sortValue === 'priceHigh') filtered.sort(function (a, b) { return b.price - a.price; });
        else if (sortValue === 'nameAZ') filtered.sort(function (a, b) { return a.name.localeCompare(b.name); });

        renderProducts(filtered);
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);

    // 5. Product Modal Close
    var modalClose = document.getElementById('modalClose');
    var productModal = document.getElementById('productModal');
    if (modalClose && productModal) {
        modalClose.addEventListener('click', function () { productModal.classList.remove('show'); });
        productModal.addEventListener('click', function (e) { if (e.target === productModal) productModal.classList.remove('show'); });
    }

    // 6. Leaflet Map
    var mapDiv = document.getElementById('map');
    if (mapDiv) {
        var map = L.map('map').setView([-26.1076, 28.0567], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);

        var branches = [
            { name: 'Bedfordview', coords: [-26.1794, 28.1339] },
            { name: 'Fourways', coords: [-26.0177, 28.0069] },
            { name: 'Sandton', coords: [-26.1076, 28.0567] }
        ];

        branches.forEach(function (b) {
            L.marker(b.coords).addTo(map).bindPopup('<strong>Sweet Heaven Bakery</strong><br>' + b.name);
        });
    }

    // 7. Lightbox Gallery
    var lightboxImages = document.querySelectorAll('.gallery-item img');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImage');

    if (lightboxImages.length > 0 && lightbox) {
        lightboxImages.forEach(function (img) {
            img.parentElement.addEventListener('click', function () {
                lightboxImg.src = img.src;
                lightbox.classList.add('show');
            });
        });

        document.getElementById('lightboxClose').addEventListener('click', function () { lightbox.classList.remove('show'); });
        lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.classList.remove('show'); });
    }

    // 8. Accordion
    var accordionHeaders = document.querySelectorAll('.accordion-header');
    if (accordionHeaders.length > 0) {
        accordionHeaders.forEach(function (header) {
            header.addEventListener('click', function () {
                this.parentElement.classList.toggle('open');
            });
        });
    }

    // 9. Form Helpers
    function showError(id, msg) {
        var field = document.getElementById(id);
        var error = document.getElementById(id + '-error');
        if (field) field.classList.add('invalid');
        if (error) { error.textContent = msg; error.classList.add('show'); }
    }

    // Character Counters
    ['message', 'contact-message'].forEach(function (id) {
        var field = document.getElementById(id);
        if (field) {
            var counter = document.getElementById(id + '-count');
            if (counter) {
                field.addEventListener('input', function () {
                    counter.textContent = this.value.length + ' / 500 characters';
                });
            }
        }
    });

    // 10. Enquiry Form Validation
    var enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function (e) {
            e.preventDefault();
            document.querySelectorAll('.error-message').forEach(function (el) { el.classList.remove('show'); });
            document.querySelectorAll('.invalid').forEach(function (el) { el.classList.remove('invalid'); });

            var valid = true;
            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var phone = document.getElementById('phone').value.trim();
            var type = document.getElementById('enquiry-type').value;
            var message = document.getElementById('message').value.trim();

            if (name.length < 2) { showError('name', 'Please enter your name.'); valid = false; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'Please enter a valid email.'); valid = false; }
            if (phone !== '' && !/^[0-9+\s()-]{10,15}$/.test(phone)) { showError('phone', 'Please enter a valid phone number.'); valid = false; }
            if (type === '') { showError('enquiry-type', 'Please choose an option.'); valid = false; }
            if (message.length < 10) { showError('message', 'Please write at least 10 characters.'); valid = false; }

            if (valid) {
                var box = document.getElementById('enquiryResponse');
                var cost = '';
                var avail = 'We usually have availability within 3–5 working days.';

                if (type === 'custom-cake') cost = 'Custom cakes start at R450. Final price depends on size and design.';
                else if (type === 'bulk-order') { cost = 'Bulk orders are quoted based on quantity.'; avail = 'Please allow at least 7 working days.'; }
                else if (type === 'general') cost = 'We will give you a full breakdown once we know more.';
                else if (type === 'feedback') { cost = 'No cost – we just appreciate your feedback!'; avail = 'We reply to feedback within 2 working days.'; }

                box.innerHTML = '<h3>Thanks, ' + name + '!</h3>' +
                    '<p>We got your enquiry. We\'ll reply to <strong>' + email + '</strong> within 24 hours.</p>' +
                    '<p><strong>Cost:</strong> ' + cost + '</p>' +
                    '<p><strong>Availability:</strong> ' + avail + '</p>';
                box.classList.add('show');
                enquiryForm.reset();
                document.getElementById('message-count').textContent = '0 / 500 characters';
            }
        });
    }

    // 11. Contact Form Validation & Email Compilation
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            document.querySelectorAll('.error-message').forEach(function (el) { el.classList.remove('show'); });
            document.querySelectorAll('.invalid').forEach(function (el) { el.classList.remove('invalid'); });

            var valid = true;
            var name = document.getElementById('contact-name').value.trim();
            var email = document.getElementById('contact-email').value.trim();
            var phone = document.getElementById('contact-phone').value.trim();
            var type = document.getElementById('contact-type').value;
            var message = document.getElementById('contact-message').value.trim();

            if (name.length < 2) { showError('contact-name', 'Please enter your name.'); valid = false; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('contact-email', 'Please enter a valid email.'); valid = false; }
            if (phone !== '' && !/^[0-9+\s()-]{10,15}$/.test(phone)) { showError('contact-phone', 'Please enter a valid phone number.'); valid = false; }
            if (type === '') { showError('contact-type', 'Please choose a message type.'); valid = false; }
            if (message.length < 10) { showError('contact-message', 'Please write at least 10 characters.'); valid = false; }

            if (valid) {
                var to = 'sweetheavenbakery25@gmail.com';
                var subject = encodeURIComponent('Website Message: ' + type);
                var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + (phone || 'Not provided') + '\nType: ' + type + '\n\nMessage:\n' + message);
                var mailto = 'mailto:' + to + '?subject=' + subject + '&body=' + body;

                var box = document.getElementById('contactResponse');
                box.innerHTML = '<h3>All set, ' + name + '!</h3>' +
                    '<p>Your message is ready to send. Click below to open your email app.</p>' +
                    '<p><a href="' + mailto + '" class="btn btn-primary" style="margin-top:10px;">Open Email App</a></p>';
                box.classList.add('show');
                contactForm.reset();
                document.getElementById('contact-message-count').textContent = '0 / 500 characters';
            }
        });
    }
});