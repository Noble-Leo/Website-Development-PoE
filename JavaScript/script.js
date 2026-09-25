document.addEventListener('DOMContentLoaded', function () {

    // Mobile menu
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

    // Product data
    var products = [
        {
            name: "Cupcakes",
            desc: "Vanilla, chocolate, red velvet, carrot, lemon, strawberry. Buttercream or cream cheese frosting.",
            price: 35,
            priceText: "R35 each | R180 for 6",
            img: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&h=300&fit=crop&crop=center",
            alt: "Freshly baked cupcakes with buttercream frosting"
        },
        {
            name: "Butter Croissants",
            desc: "Flaky, golden and baked fresh every morning. Made with real butter.",
            price: 22,
            priceText: "R22 each",
            img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&crop=center",
            alt: "Golden butter croissants on a baking tray"
        },
        {
            name: "Custom Celebration Cakes",
            desc: "Made to order. Choose sponge, filling, frosting and design. For birthdays, weddings and more.",
            price: 450,
            priceText: "From R450",
            img: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop&crop=center",
            alt: "Custom decorated celebration cake"
        },
        {
            name: "Cookies & Biscuits",
            desc: "Chocolate chip, oat and raisin, buttery shortbread, and seasonal specials.",
            price: 18,
            priceText: "R18 each",
            img: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&h=300&fit=crop&crop=center",
            alt: "Homemade cookies on a plate"
        },
        {
            name: "Fruit Tarts",
            desc: "Buttery pastry shell, smooth vanilla custard, and fresh seasonal fruit on top.",
            price: 45,
            priceText: "R45 each",
            img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=300&fit=crop&crop=center",
            alt: "Fresh fruit tart with berries"
        },
        {
            name: "Chocolate Ganache Cake",
            desc: "Rich dark chocolate sponge covered in silky dark chocolate ganache.",
            price: 65,
            priceText: "R65 per slice",
            img: "https://images.unsplash.com/photo-1559629810-1e60f6ed6b6e?w=400&h=300&fit=crop&crop=center",
            alt: "Chocolate ganache cake slice"
        }
    ];

    // Render products
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
            card.className = 'product-card';
            card.innerHTML =
                '<img src="' + p.img + '" alt="' + p.alt + '">' +
                '<h3>' + p.name + '</h3>' +
                '<p>' + p.desc + '</p>' +
                '<span class="product-price">' + p.priceText + '</span>';
            container.appendChild(card);
        });
    }

    if (container) {
        renderProducts(products);
    }

    // Search and sort
    var searchInput = document.getElementById('searchInput');
    var sortSelect = document.getElementById('sortSelect');

    function applyFilters() {
        if (!container) return;

        var query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        var sortValue = sortSelect ? sortSelect.value : 'default';

        var filtered = products.filter(function (p) {
            return p.name.toLowerCase().indexOf(query) !== -1 ||
                   p.desc.toLowerCase().indexOf(query) !== -1;
        });

        if (sortValue === 'priceLow') {
            filtered.sort(function (a, b) { return a.price - b.price; });
        } else if (sortValue === 'priceHigh') {
            filtered.sort(function (a, b) { return b.price - a.price; });
        } else if (sortValue === 'nameAZ') {
            filtered.sort(function (a, b) { return a.name.localeCompare(b.name); });
        }

        renderProducts(filtered);
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);

    // Helper: show error
    function showError(id, msg) {
        var field = document.getElementById(id);
        var error = document.getElementById(id + '-error');
        if (field) field.classList.add('invalid');
        if (error) {
            error.textContent = msg;
            error.classList.add('show');
        }
    }

    // Enquiry form
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

            if (name.length < 2) {
                showError('name', 'Please enter your name.');
                valid = false;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('email', 'Please enter a valid email.');
                valid = false;
            }

            if (phone !== '' && !/^[0-9+\s()-]{10,15}$/.test(phone)) {
                showError('phone', 'Please enter a valid phone number.');
                valid = false;
            }

            if (type === '') {
                showError('enquiry-type', 'Please choose an option.');
                valid = false;
            }

            if (message.length < 10) {
                showError('message', 'Please write at least 10 characters.');
                valid = false;
            }

            if (valid) {
                var box = document.getElementById('enquiryResponse');
                var cost = '';
                var avail = 'We usually have availability within 3–5 working days.';

                if (type === 'custom-cake') {
                    cost = 'Custom cakes start at R450. Final price depends on size and design.';
                } else if (type === 'bulk-order') {
                    cost = 'Bulk orders are quoted based on quantity. Expect R18–R35 per item.';
                    avail = 'Please allow at least 7 working days.';
                } else if (type === 'general') {
                    cost = 'We will give you a full breakdown once we know more.';
                } else if (type === 'feedback') {
                    cost = 'No cost – we just appreciate your feedback!';
                    avail = 'We reply to feedback within 2 working days.';
                }

                box.innerHTML =
                    '<h3>Thanks, ' + name + '!</h3>' +
                    '<p>We got your enquiry. We\'ll reply to <strong>' + email + '</strong> within 24 hours.</p>' +
                    '<p><strong>Cost:</strong> ' + cost + '</p>' +
                    '<p><strong>Availability:</strong> ' + avail + '</p>' +
                    '<p>Need it urgently? Call us on +27 11 123 4567.</p>';
                box.classList.add('show');
                enquiryForm.reset();
            }
        });
    }

    // Contact form
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

            if (name.length < 2) {
                showError('contact-name', 'Please enter your name.');
                valid = false;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('contact-email', 'Please enter a valid email.');
                valid = false;
            }

            if (phone !== '' && !/^[0-9+\s()-]{10,15}$/.test(phone)) {
                showError('contact-phone', 'Please enter a valid phone number.');
                valid = false;
            }

            if (type === '') {
                showError('contact-type', 'Please choose a message type.');
                valid = false;
            }

            if (message.length < 10) {
                showError('contact-message', 'Please write at least 10 characters.');
                valid = false;
            }

            if (valid) {
                var to = 'sweetheavenbakery25@gmail.com';
                var subject = encodeURIComponent('Website Message: ' + type);
                var body = encodeURIComponent(
                    'Name: ' + name + '\n' +
                    'Email: ' + email + '\n' +
                    'Phone: ' + (phone || 'Not provided') + '\n' +
                    'Type: ' + type + '\n\n' +
                    'Message:\n' + message
                );

                var mailto = 'mailto:' + to + '?subject=' + subject + '&body=' + body;

                var box = document.getElementById('contactResponse');
                box.innerHTML =
                    '<h3>All set, ' + name + '!</h3>' +
                    '<p>Your message is ready to send. Click the button below to open your email app.</p>' +
                    '<p><a href="' + mailto + '" class="btn btn-primary" style="margin-top:10px;">Open Email App</a></p>';
                box.classList.add('show');

                window.location.href = mailto;
                contactForm.reset();
            }
        });
    }
});