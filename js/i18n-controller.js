'use strict';

function onSetLang(lang) {
    setLang(lang);
    // if lang is hebrew add RTL class to document.body
    if (lang === 'he') {
        document.body.classList.add('rtl')
    } else document.body.classList.remove('rtl')
    doTrans();
    renderBooks();
}