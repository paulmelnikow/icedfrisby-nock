# Changelog

## 2.0.0 -- Jun. 25, 2019

- Require IcedFrisby 2.1+.

## 1.2.0 -- Jun. 25, 2019

- Add `hasIntercept` property for checking whether an intercept was requested.

## 1.1.0 -- Dec. 8, 2018

- Add `interceptIf()` function for conditionally intercepting.

## 1.0.0 -- May 3, 2017

- Compatible with icedfrisby 1.2.0, which officially supports plugins.

## 0.3.0 -- Apr. 18, 2017

- Clean up reliably, using `finally()` hooks
- Remove `enableNetConnect()` in favor of `networkOff()` and `networkOn()`.
  `networkOff()` is invoked automatically from `intercept()`.
- Compatible with icedfrisby 1.0.0
- Improve test coverage

## 0.2.0 -- Apr. 15, 2017

- Unfork icedfrisby, since this is compatible with 1.0.0
- Remove hacks needed for old version of icedfrisby

## 0.1.0 -- Apr. 12, 2017

Initial release.
