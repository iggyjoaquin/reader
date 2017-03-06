"use strict";

function wrapSections() {
    let body = $(document.body).children();
    let startedSection = false;
    let sections = {};
    let sectionCounter = 0;


    // find sections
    for (let prop in $(body)) {
        if ($(body).hasOwnProperty(prop)) {
            let tag = $($(body)[prop])[0].tagName;

            if (tag === 'H1') {
                if (!startedSection) {
                    console.log(prop, '->',$(body)[prop]);
                    sections[sectionCounter] = {};
                    sections[sectionCounter].start = prop;
                    startedSection = true;
                }
            }

            //check the next tag
            let nextTag = null;

            if (parseInt(prop) + 1 < $(body).length) {
                nextTag =  $($(body)[parseInt(prop) + 1])[0].tagName;
            }

            if (nextTag !== null && nextTag === 'H1' && startedSection) {

                sections[sectionCounter].end = prop;
                sectionCounter++;
                startedSection = false;
            }

        }
    }

    let modifySections = 0;
    let inSection = false;
    let sectionLines = [];


    for (let prop in $(body)) {
        if ($(body).hasOwnProperty(prop)) {
            let section = sections[modifySections]
            if (section.start == prop) {
                inSection = true;

                let ele = $($(body)[prop]);
                //wrap it
                $("<div id='appendedSection" + modifySections + "' class='appended-section'></div>").insertBefore(ele);
                sectionLines.push($(body)[prop]);
            }

            if (section.end == prop) {
                sectionLines.push($(body)[prop]);
                addSectionLinesToNewDiv(sectionLines, modifySections);
                inSection = false;
                sectionLines = [];
                modifySections++;
            }

            if (inSection) {
                sectionLines.push($(body)[prop]);
            }
        }
    }
}

function addSectionLinesToNewDiv(sectionLines, id) {
    for (let i=0; i< sectionLines.length; i++) {
        $('#appendedSection' + id).append($(sectionLines[i]));
    }
}

wrapSections();
