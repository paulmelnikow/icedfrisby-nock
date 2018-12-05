# Changelog

## [Unreleased]

## [1.0.0]

- Compatible with icedfrisby 1.2.0, which officially supports plugins.

## [0.3.0]

- Clean up reliably, using `finally()` hooks
- Remove `enableNetConnect()` in favor of `networkOff()` and `networkOn()`.
  `networkOff()` is invoked automatically from `intercept()`.
- Compatible with icedfrisby 1.0.0
- Improve test coverage

## [0.2.0]

- Unfork icedfrisby, since this is compatible with 1.0.0
- Remove hacks needed for old version of icedfrisby

## 0.1.0

2017-04-12

Initial release.

[unreleased]: https://github.com/paulmelnikow/icedfrisby-nock/compare/1.0.0...HEAD
[1.0.0]: https://github.com/paulmelnikow/icedfrisby-nock/compare/1.0.0...0.3.0
[0.3.0]: https://github.com/paulmelnikow/icedfrisby-nock/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/paulmelnikow/icedfrisby-nock/compare/0.1.0...0.2.0
