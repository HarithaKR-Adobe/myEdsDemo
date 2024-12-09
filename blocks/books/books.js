function loader() {
    const el = document.createElement("span");
    el.classList.add("loader");
    return el;
}

function renderPage(pgWrapper, booksWrapper, index, block) {
    booksWrapper.innerHTML = "";
    booksWrapper.appendChild(loader());
    fetch(`/books.json?limit=20&offset=${((index - 1) * 20) + 1}`)
    .then((resp) => {
        if (resp.ok) {
            return resp.json();
        }
    })
    .then((resp) => {
        const { data, offset } = { ...resp };
        updatePagination(pgWrapper, index);
        booksWrapper.innerHTML = "";
        data.forEach((book) => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("book-card");
            bookCard.innerHTML = `
                <img class="book-image" alt="${book.title}" src="${book.imageLink}" />
                <a href="${book.link}" target="_blank" title="${book.title}"><h4 class="book-title">${book.title}</h4></a>
                <span class="book-author">
                    <strong class="label">Author:</strong>
                    <span class="name">${book.author}</span> from <span class="country">${book.country}</span>
                </span>
                <span class="language"><strong class="label">language:</strong>${book.language}</span>
                <span class="page"><strong class="label">total pages:</strong>${book.pages}</span>
            `
            booksWrapper.appendChild(bookCard);
        });
    })
}

function renderPagination(pgWrapper, total, offset, block, booksWrapper) {
    for (let index = 1; index <= Math.ceil(total / 20); index++) {
        const span = document.createElement("span");
        span.classList.add("page-item");
        if (index === 1) {
            span.classList.add("active");
        }
        span.setAttribute("tabIndex", 0);
        span.innerHTML = index;
        span.addEventListener("click", (evt) => renderPage(pgWrapper, booksWrapper, index, block));
        pgWrapper.appendChild(span);
    }
}

function renderInitPage(header, pagination, wrapper, block) {
    const books = fetch("/books.json?limit=20&offset=0");
    books.then((resp) => {
        if (resp.ok) {
            return resp.json();
        }
    })
    .then((resp) => {
        const { data, offset } = { ...resp };
        const total = resp.total;
        renderPagination(pagination, total, offset, block, wrapper);
        header.appendChild(pagination);
        data.forEach((book) => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("book-card");
            bookCard.innerHTML = `
                <img class="book-image" alt="${book.title}" src="${book.imageLink}" />
                <a href="${book.link}" target="_blank" title="${book.title}"><h4 class="book-title">${book.title}</h4></a>
                <span class="book-author">
                    <strong class="label">Author:</strong>
                    <span class="name">${book.author}</span> from <span class="country">${book.country}</span>
                </span>
                <span class="language"><strong class="label">language:</strong>${book.language}</span>
                <span class="page"><strong class="label">total pages:</strong>${book.pages}</span>
            `
            wrapper.appendChild(bookCard);
        });
        block.appendChild(wrapper);

    })
    .catch((err) => {
        console.log(err);
    })
}

function updatePagination(pgWrapper, index) {
    const currentActiveItem = pgWrapper.querySelector(".active");
    currentActiveItem?.classList?.remove("active");
    pgWrapper.querySelectorAll(".page-item")[index - 1]?.classList.add("active");
}

export default function decorate(block) {
    const header = block.querySelector("h1");
    header.style.textAlign = "center"
    const pagination = document.createElement("div");
    const wrapper = document.createElement("div");
    wrapper.classList.add("books-wrapper");
    pagination.classList.add("pagination-wrapper");
    renderInitPage(header, pagination, wrapper, block);
}