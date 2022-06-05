'use strict';

/**
 * Constructor function for Course objects
 * @param {string} code course code (e.g., '01ABCDE')
 * @param {string} name course name
 * @param {number} credits number of credits (e.g., 6)
 * @param {number} maxStudent max number of student that can enroll in this course
 * @param {string} incompatibleWith this course is incopatible with another course
 * @param {string} preparatoryCourse this course need a previous course to be add in a study plan
 */
function Course (code, name, credits, maxStudent, numStudent, incompatibleWith, preparatoryCourse) {
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.maxStudent = maxStudent;
    this.numStudent = numStudent;
    this.incompatibleWith = incompatibleWith;
    this.preparatoryCourse = preparatoryCourse;  
}

exports.Course = Course;