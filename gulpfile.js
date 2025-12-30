/* eslint-disable */
/**
 * @author Elijah Sawyers <elijahsawyers@gmail.com>
 */

'use strict';

const {dest, parallel, src, watch} = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');

const build = parallel(copyPython, copyTxt, copyHtml, copyStyles, copyAssets, copyPWA, bundle);

/**
 * Moves source python files into the distribution folder.
 *
 * @return {NodeJS.ReadWriteStream} the gulp stream so that the task
 * will finish before moving to the next task.
 */
function copyPython() {
  return src('src/**/*.py', { allowEmpty: true })
      .pipe(dest('dist'));
};

/**
 * Moves txt files into the distribution folder.
 *
 * @return {NodeJS.ReadWriteStream} the gulp stream so that the task
 * will finish before moving to the next task.
 */
function copyTxt() {
  return src('src/**/*.txt', { allowEmpty: true })
      .pipe(dest('dist'));
};

/**
 * Moves source html files into the distribution folder.
 *
 * @return {NodeJS.ReadWriteStream} the gulp stream so that the task
 * will finish before moving to the next task.
 */
function copyHtml() {
  return src('src/**/*.html', { allowEmpty: true })
      .pipe(dest('dist'));
};

/**
 * Moves source css files into the distribution folder.
 *
 * @return {NodeJS.ReadWriteStream} the gulp stream so that the task
 * will finish before moving to the next task.
 */
function copyStyles() {
  return src('src/static/styles/**/*.css', { allowEmpty: true })
      .pipe(dest('dist/static/styles'));
};

/**
 * Moves source asset files into the distribution folder.
 *
 * @return {NodeJS.ReadWriteStream} the gulp stream so that the task
 * will finish before moving to the next task.
 */
function copyAssets() {
  return src('src/static/assets/**', { allowEmpty: true })
      .pipe(dest('dist/static/assets'));
};

/**
 * Moves PWA files (service worker, manifest) into the distribution folder.
 *
 * @return {NodeJS.ReadWriteStream} the gulp stream so that the task
 * will finish before moving to the next task.
 */
function copyPWA() {
  return src(['src/static/service-worker.js', 'src/static/manifest.json'], { allowEmpty: true })
      .pipe(dest('dist/static'));
};

/**
 * Bundles all source typescript files into the distribution folder.
 *
 * @return {NodeJS.ReadWriteStream} the gulp stream so that the task
 * will finish before moving to the next task.
 */
function bundle() {
  return browserify()
      .add('src/static/scripts/main.ts')
      .plugin(tsify)
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(dest('dist/static/scripts'));
};

exports.default = build;
