'use strict';

var gTrans = {
    'main-title': {
        en: 'Books-Shop | Admin Page',
        he: 'חנות ספרים | דף מנהלן',
    },
    logo: {
        en: 'Book Shop',
        he: 'חנות ספרים',
    },
    'add-book': {
        en: 'Add Book',
        he: 'הוספת ספר',
    },
    'enter-book-name': {
        en: 'Enter the Book Name',
        he: 'שם הספר',
    },
    'enter-book-price': {
        en: 'Enter the Book Price',
        he: 'מחיר הספר',
    },
    'add-book-form': {
        en: 'Add',
        he: 'הוספה',
    },
    'book-id': {
        en: 'ID',
        he: 'מזהה',
    },
    'book-name': {
        en: 'Book Name 🔽',
        he: 'שם הספר 🔽',
    },
    'book-price': {
        en: 'Price 🔽',
        he: 'מחיר 🔽',
    },
    actions: {
        en: 'Actions',
        he: 'פעולות',
    },
    'read-book': {
        en: 'Read',
        he: 'צפיה',
    },
    'update-book': {
        en: 'Update',
        he: 'עדכון',
    },
    'delete-book': {
        en: 'Delete',
        he: 'מחיקה',
    },
    'no-books': {
        en: 'No Books',
        he: 'אין ספרים קיימים',
    },
    'change-book-price': {
        en: 'Change Books Price',
        he: 'עדכן את מחיר הספר',
    },
    close: {
        en: 'Close',
        he: 'סגירה',
    },
    price: {
        en: 'price:',
        he: 'מחיר:',
    },
    next: {
        en: 'Next',
        he: 'הבא'
    },
    prev: {
        en: 'Prev',
        he: 'הקודם'
    },
}

var gCurrLang = 'en';

function getTrans(transKey) {
    // Get from gTrans an object by the key
    // Example: langTransMap => {en: "Add", he: "הוסף"}
    var langTransMap = gTrans[transKey]
        // If key is unknown return 'UNKNOWN'
    if (!langTransMap) return 'UNKNOWN';

    // If translation not found - use english
    var trans = langTransMap[gCurrLang]
    if (!trans) {
        trans = langTransMap['en']
    }
    return trans;
}

function doTrans() {
    //get all the elements with 'data-trans'
    var els = document.querySelectorAll('[data-trans]')
        // for each el:
        // get the data-trans and use getTrans to replace the innerText 
    els.forEach(el => {
        // data-trans="title" -> key: title
        const key = el.dataset.trans;
        const trans = getTrans(key)
            // support placeholder
        if (el.placeholder) el.placeholder = trans
        else el.innerText = trans
    })
}

function setLang(lang) {
    gCurrLang = lang;
}

function getCurrLang() {
    return gCurrLang;
}