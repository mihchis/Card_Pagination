const cards = [
    { "title": "Luxurious Modern Mansion", "description": "A luxurious modern mansion with state-of-the-art facilities.", "image": "assets/modern_mansion.png" },
    { "title": "Beachfront Property", "description": "A stunning beachfront property with breathtaking views.", "image": "assets/beachfront_property.jpg" },
    { "title": "Urban Loft", "description": "A modern urban loft in the heart of the city.", "image": "assets/urban_loft.jpg" },
    { "title": "Spacious Family Home", "description": "A spacious family home with a large backyard.", "image": "assets/family_home.jpg" },
    { "title": "Penthouse Suite", "description": "A luxurious penthouse with panoramic city views.", "image": "assets/penthouse_suite.jpg" },
    { "title": "Contemporary Villa", "description": "A contemporary villa with a minimalist design.", "image": "assets/contemporary_villa.jpg" }
];

const cardsElement = document.querySelector('.cards');
const itemsPerPage = 3;
let currentPage = Math.min(
    Math.max(parseInt(new URLSearchParams(window.location.search).get('page')) || 1, 1),
    Math.ceil(cards.length / itemsPerPage)
);

const totalPages = Math.ceil(cards.length / itemsPerPage);
const previousPageButton = document.getElementById('go-to-previous-page');
const nextPageButton = document.getElementById('go-to-next-page');
const pagesContainer = document.getElementById('pages');

const setButtonState = (button, isDisabled) => {
    button.disabled = isDisabled;
    button.classList.toggle('pagination button--disabled', isDisabled);
};

const changeCards = (cards, pageIndex, itemsPerPage) => {
    const startIndex = (pageIndex - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    cardsElement.innerHTML = cards.slice(startIndex, endIndex).map(card =>
        `<article>
            <figure>
                <img src="${card.image}" alt="${card.title}" onerror="this.src='assets/default.jpg'; this.alt='Image not available';">
            </figure>
            <div class="article-preview">
                <h2>${card.title}</h2>
                <p>${card.description}</p>
            </div>
        </article>`
    ).join('');
    currentPage = pageIndex;
    setButtonState(previousPageButton, currentPage === 1);
    setButtonState(nextPageButton, currentPage === totalPages);
    generatePageLinks();
};

const generatePageLinks = () => {
    pagesContainer.innerHTML = '';
    const maxVisiblePages = 5;
    let pages = [];

    if (totalPages <= maxVisiblePages + 2) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        if (start > 2) pages.push('...');
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
    }

    pages.forEach(page => {
        if (page === '...') {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.classList.add('pagination dots');
            pagesContainer.appendChild(dots);
        } else {
            const pageLink = document.createElement('a');
            pageLink.textContent = page;
            pageLink.href = `?page=${page}`;
            pageLink.classList.toggle('pagination link--active', currentPage === page);
            pageLink.addEventListener('click', (event) => {
                event.preventDefault();
                changeCards(cards, page, itemsPerPage);
            });
            pagesContainer.appendChild(pageLink);
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    changeCards(cards, currentPage, itemsPerPage);
});

// Logic for Previous and Next buttons
previousPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        changeCards(cards, currentPage - 1, itemsPerPage);
    } else {
        // If already on the first page, go to the last page
        changeCards(cards, totalPages, itemsPerPage);
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
        changeCards(cards, currentPage + 1, itemsPerPage);
    } else {
        // If already on the last page, go back to the first page
        changeCards(cards, 1, itemsPerPage);
    }
});

window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'arrowleft' && currentPage > 1) changeCards(cards, currentPage - 1, itemsPerPage);
    if (key === 'arrowright' && currentPage < totalPages) changeCards(cards, currentPage + 1, itemsPerPage);
});
