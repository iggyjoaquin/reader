"use strict";

function wrapLectureSubSections(body) {
    let newSections = document.getElementsByClassName('appended-section');
    let modifyLectures = 0;

    for (let i=0; i<newSections.length; i++) {
        // in this section, lets find the lecture blocks

        let lectures = {};
        let lectureLines = [];
        let lectureCounter = 0;

        let sectionElements = $(newSections[i]).children();
        let inLecture = false;

        for (let prop in $(sectionElements)) {
            if ($(sectionElements).hasOwnProperty(prop)) {

                let propClass = $($(sectionElements)[prop]).attr('class');
                let nextPropClass = null;

                if (parseInt(prop) + 1 < $(sectionElements).length) {
                    nextPropClass = $($(sectionElements)[parseInt(prop) + 1]).attr('class');
                }

                if (propClass === 'startLecture' && !inLecture) {
                    //we have a start point
                    lectures[lectureCounter] = {};
                    lectures[lectureCounter].start = prop;
                    lectures[lectureCounter].ele = $(sectionElements)[prop].textContent;
                    inLecture = true;

                    let btnTxt = ($(sectionElements)[prop].textContent);
                    let ele = $($(sectionElements)[prop]);

                    $("<div id='appendedLecture" + modifyLectures + "' class='appended-lecture'></div>").insertAfter(ele);
                    $("#appendedLecture" + modifyLectures).before('<button class="click-handler-lecture">'+ btnTxt +'</button>')
                    ele.hide();
                    continue;
                }

                if (inLecture && nextPropClass !== null && nextPropClass === 'startLecture') {
                    //we've reached the end of a lecture
                    lectureLines.push($(sectionElements)[prop]);
                    lectures[lectureCounter].end = prop;
                    inLecture = false;
                    lectureCounter++;
                    addLectureLinesToNewLectureDiv(lectureLines, modifyLectures);
                    lectureLines = []
                    // increment global count for id's
                    modifyLectures++;
                    continue;
                }

                //check the last iteration
                if (parseInt(prop) === $(sectionElements).length - 1 && inLecture) {
                    // last element in section
                    // we now close our last lecture 'section'
                    lectureLines.push($(sectionElements)[prop]);
                    lectures[lectureCounter].end = prop;

                    addLectureLinesToNewLectureDiv(lectureLines, modifyLectures);
                    lectureLines = []
                    inLecture = false;
                    modifyLectures++;
                    // loop ends
                }

                if (inLecture) {
                    lectureLines.push($(sectionElements)[prop]);
                    continue;
                }
            }
        }



    }
}

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

    // done wrapping sections
    // proceeed to wrap lectures
    wrapLectureSubSections(body);
}



$('body').on('click', '.click-handler-lecture', (event) => {
    $(event.target).next().slideToggle()
});

function addLectureLinesToNewLectureDiv(lectureLines, id) {
    for (let i=0; i<lectureLines.length; i++) {
        $('#appendedLecture' + id).append($(lectureLines[i]));
    }
}

//helper function to push contnet to new section div
function addSectionLinesToNewDiv(sectionLines, id) {
    for (let i=0; i< sectionLines.length; i++) {
        $('#appendedSection' + id).append($(sectionLines[i]));
    }
}

wrapSections();
