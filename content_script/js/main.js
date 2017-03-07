"use strict";

// TODO: (Features)
// * Top highlight
// * Definition list
// * Bookmark
// Just make a widget in Vue that allows you to do all of this jQuery is unamangeable

let borderColors = ['#BBDEFB', '#D14E5D', '#FFD54F', '#6F83BA'];

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

    collapseLecturesandChapters();
}

function collapseLecturesandChapters() {
    let allLectureSections = document.getElementsByClassName('click-handler-lecture');
    for (let i=0; i<allLectureSections.length; i++) {
        $(allLectureSections[i]).click();
    }

    let allChapters = document.getElementsByClassName('appended-section-header-click-handler');
    for (let i=0; i<allChapters.length; i++) {
        $(allChapters[i]).click();
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

                let headerTxt = ($(body)[prop].textContent);
                let ele = $($(body)[prop]);
                //wrap it
                $("<div id='appendedSection" + modifySections + "' class='appended-section'></div>").insertBefore(ele);

                $("#appendedSection" + modifySections).before('<h1 id="sectionHeader' + modifySections + '" class="appended-section-header">'+ headerTxt +'</h1>' +
                                                                '<button class="appended-section-header-click-handler">Hide/Show Chapter</button>'
                );

                let color = borderColors[modifySections % (borderColors.length )]
                $("#sectionHeader" + modifySections).css('border-left', '10px solid ' + color);
                ele.hide();

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
    $(event.target).next().slideToggle();
});

$('body').on('click', '.appended-section-header-click-handler', (event) => {
    $(event.target).next().slideToggle();
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


function UIFixes() {
    $.fn.extend({
        toggleText: function(a, b){
            return this.text(this.text() == b ? a : b);
        }
    });

    $('.heading').hide();

    let newClassHeader = '<div id="newClassHeader"> ' +
        '<p class="new-class-header">CSCI-UA.202 Operating Systems</p>' +
        '<p class="new-class-sub-header">Spring 2017</p>' +
        '<p class="new-class-sub-header">Allan Gottlieb</p>' +
        '<p class="new-class-sub-header">TuTh: 3:30pm – 4:45pm</p>' +
        '<p class="new-class-sub-header">Room 109 CIWW</p>' +
        '<hr class="new-header-hr">' +
    '</div>';

    $('body').prepend(newClassHeader);
    $('.startLecture').first().hide();
    $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">');
}


UIFixes();
wrapSections();
