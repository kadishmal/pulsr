# Pulsr Web App Framework Change Log

## Version 0.1.1 December 23, 2012

- Renamed a **base** controller to a **baseController**
- Added an `override` function which provides an easy way to override **baseController**.
- Added a **restController** which users can override to provide their own RESTful APIs.
- Users can indicate a **default** action for a RestController.
- Added a test case for RestController.
- Updated a sample **api.js** controller which handles RESTful requests.
- Updated docs.

## Version 0.1.0 December 18, 2012

- Retrieve layouts using fileCache as well.
- Added a test suit for a base controller.

## Version 0.0.9 December 18, 2012

- A fileCache module which caches files stat information. Uses async-cache module.
- Use fileCache module to get file stat information.
- Allow users to configure fileCache settings.

## Version 0.0.8 December 18, 2012

- Use Streams to stream static files instead of reading into memory.

## Version 0.0.7 December 15, 2012

- Initial release