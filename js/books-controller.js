'use strict';
var gBooksAmount = loadFromStorage(BOOKS_KEY).length;
var gBooksPerPage = 3;
var gCurrPage = 1;

function onInit() {
    renderBooks();
    createPaginationHtml();
}

// RENDER WITH PAGINATION
function renderBooks() {
    const books = getBooksForDisplay();
    const elNoBooks = document.querySelector('.no-books');
    if (!books || !books.length) {
        elNoBooks.classList.remove('d-none');
        elNoBooks.innerText = 'No Books!';
    } else {
        const isDnoneExsist = elNoBooks.classList.contains('d-none');
        if (!isDnoneExsist) elNoBooks.classList.add('d-none');
    }
    var strHTML = '';
    var start = ((gCurrPage - 1) * gBooksPerPage) + 1;
    var end = gCurrPage * gBooksPerPage;
    if (end > books.length) {
        end = books.length;
    }
    for (let i = start; i <= end; i++) {
        strHTML += getBookHTML(books[i - 1])
    }
    const elBooksContainer = document.querySelector('.books-container tbody');
    elBooksContainer.innerHTML = strHTML;

    const currLen = getCurrLang();
    if (currLen === 'he') doTrans();
}

// RENDER WITHOUT PAGINATION
// function renderBooks() {
//     const books = getBooksForDisplay();
//     const elNoBooks = document.querySelector('.no-books');
//     if (!books || !books.length) {
//         elNoBooks.classList.remove('d-none');
//         elNoBooks.innerText = 'No Books!';
//     } else {
//         const isDnoneExsist = elNoBooks.classList.contains('d-none');
//         if (!isDnoneExsist) elNoBooks.classList.add('d-none');
//     }
//     const strHTMLs = books.map(getBookHTML);
//     const strHTML = strHTMLs.join('');
//     const elBooksContainer = document.querySelector('.books-container tbody');
//     elBooksContainer.innerHTML = strHTML;
//     const currLen = getCurrLang();
//     if (currLen === 'he') doTrans();
// }

function getBookHTML(book) {
    return `
    <tr>
        <td class="cell" scope="row">${book.id}</td>
        <td class="cell" scope="row">${book.name}</td>
        <td class="cell" scope="row">${book.price}₪</td>
        <td class="cell scope="row" btns-container">
        <button type="button" class="btn read-btn btn-sm btn-outline-success" data-trans="read-book" data-toggle="modal" data-target="#bookModal" onclick="onReadBook('${book.id}')">Read</button>
        <button type="button" class="btn update-btn btn-sm btn-outline-warning"  data-trans="update-book" data-toggle="modal" data-target="#bookNameModal" onclick="onUpdateBook('${book.id}')">Update</button>
        <button type="button" class="btn remove-btn btn-sm btn-outline-danger" data-trans="delete-book" onclick="onRemoveBook('${book.id}')">Delete</button>
        </td>
    </tr>
    `
}

function onReadBook(id) {
    const book = getBookById(id);
    document.querySelector('.read-container').classList.add('block');

    var strHtml = `<div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title book-name" id="exampleModalLongTitle">${book.name}</h5>
            <button type="button" class="close" onclick="onCloseReadModal()" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <span class="book-info-container flex align-center column">
            <span class="book-image-container"><img class="book-image" src="${book.imageUrl}" alt="photo here"/></span>
            <div class="book-price-container">
                <span class="book-price-title" data-trans="price"></span>
                <span class="book-price">${book.price} ₪</span>
            </div>
            </span>
            <span class="rate-container flex align-center justify-center">
                <button type="button" onclick="onChangeRate(1,${id})" class="rate-btn rate-btn-plus btn btn-secondary">+</button>
                <p class="book-rate">${book.rate}</p>
                <button type="button" onclick="onChangeRate(-1,${id})" class="rate-btn rate-btn-minus btn btn-secondary">-</button>
            </span>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="onCloseReadModal()" data-trans="close" data-dismiss="modal">Close</button>
        </div>
    </div>
</div>`;
    document.querySelector('.read-container').innerHTML = strHtml;
}

function onToggleForm() {
    const elAddBookForm = document.querySelector('.add-book-form');
    const elAddBtn = document.querySelector('.add-book-btn');
    elAddBookForm.classList.toggle('block');
    if (elAddBookForm.classList.contains('block')) {
        elAddBtn.innerText = '❌'
    } else {
        // to keep the lang stay after clicking 'add book' twice (add-> x -> add)
        var currLen = getCurrLang();
        if (currLen === 'he')
            onSetLang(currLen);
        else
            elAddBtn.innerText = 'Add Book'
    }
}

function onAddBook(ev) {
    ev.preventDefault();
    const elNameInput = document.querySelector('.name-input');
    const elPriceInput = document.querySelector('.price-input');
    addBook(elNameInput.value, elPriceInput.value);
    elNameInput.value = '';
    elPriceInput.value = '';
    renderBooks();
    onToggleForm();
    gBooksAmount = loadFromStorage(BOOKS_KEY).length;
    createPaginationHtml();
}

function onChangeRate(diff, bookId) {
    if (bookId < 10) bookId = `0${bookId.toString()}`
    else bookId = bookId.toString();
    const updatedRate = changeRate(diff, bookId.toString());
    var elBookRate = document.querySelector('.book-rate');
    elBookRate.innerText = updatedRate;
}

function onCloseReadModal() {
    var elReadContainer = document.querySelector('.read-container');
    elReadContainer.classList.remove('block');
}

function onCloseUpdateModal() {
    var elUpdateContainer = document.querySelector('.update-container');
    elUpdateContainer.classList.remove('block');
}

function onRemoveBook(bookId) {
    var isSure = confirm('Are you sure?');
    if (!isSure) return;
    removeBook(bookId);
    renderBooks();
    gBooksAmount = loadFromStorage(BOOKS_KEY).length;
    createPaginationHtml();
}

function onUpdateBook(bookId) {
    document.querySelector('.update-container').classList.add('block');
    var strHtml = `<div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title book-name" id="exampleModalLongTitle" data-trans="change-book-price">Change Book Price</h5>
            <button type="button" class="close" onclick="onCloseUpdateModal()" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <span class="name-container flex column align-center justify-center">
            <form class="flex" onsubmit="updateBookPrice(event, '${bookId}')">
                <input class="input-group-text new-price" id="inputGroup-sizing-lg" type="text" placeholder="Enter book price...">
                <button class="btn btn-primary">Submit</button>
            </form> 
            <label class="update-msg"></label>
            </span>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="onCloseUpdateModal()" data-trans="close" data-dismiss="modal">Close</button>
        </div>
    </div>
</div>`;
    document.querySelector('.update-container').innerHTML = strHtml;
}

function updateBookPrice(ev, bookId) {
    ev.preventDefault();
    var newPrice = document.querySelector('.new-price').value;
    var book = getBookById(bookId);
    book.price = newPrice;
    updateBook(bookId, book);
    renderBooks();
    document.querySelector('.update-msg').innerText = "Updated Successfully!"
}


function onSortChange(sortBy) {
    sortChange(sortBy);
    renderBooks();
}

//PAGINATION

function createPaginationHtml() {
    var elPaginationContainer = document.querySelector('.pagination-container');
    var strHTML = `<button onclick="onMovePage(-1)" data-trans="next" class="btn btn-secondary next-prev-btn">Prev</button>`;
    var pages = Math.floor(gBooksAmount / gBooksPerPage);
    if (gBooksAmount / gBooksPerPage > Math.floor(gBooksAmount / gBooksPerPage)) pages++;
    for (var i = 1; i <= pages; i++) {
        strHTML += `<button onclick="onMovePage(${i})" class="btn page-btn btn-secondary">${i}</button>`
    }
    strHTML += `<button onclick="onMovePage(0)" data-trans="prev" class="btn btn-secondary next-prev-btn">Next</button>`;
    elPaginationContainer.innerHTML = strHTML;
}

function onMovePage(pageNum) {
    var lastpage = Math.floor(gBooksAmount / gBooksPerPage);
    if (lastpage < gBooksAmount / gBooksPerPage) lastpage++;
    // on press prev
    if (pageNum === -1) {
        if (gCurrPage !== 1) gCurrPage--;
        // return to last page on press prev in the first page
        else gCurrPage = lastpage;
        // on press next
    } else if (pageNum === 0) {
        if (gCurrPage < lastpage) gCurrPage++;
        // return to first page on press next in the last page
        else gCurrPage = 1;
    } // on press page number
    else gCurrPage = pageNum;
    renderBooks();
}