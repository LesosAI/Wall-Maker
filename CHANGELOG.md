# Changelog

## [1.0.6] - 2024-04-19
### Added
- Enhanced edge detection with lookup table optimization for contrast enhancement
- Implemented direction difference caching for improved performance
- Added memory optimizations using typed arrays
- Improved edge detection accuracy with better noise reduction
- Optimized chunk-based processing for large scenes
- Enhanced V12 compatibility and performance
- Added structured error handling with error codes and detailed messages
- Implemented better error recovery mechanisms
- Added input validation for critical methods
- Enhanced WebGL error handling with specific error codes
- Improved error context and debugging information

### Fixed
- Improved contrast handling in dark scenes
- Enhanced edge strength calculation accuracy
- Better handling of isolated edges
- Optimized memory usage during edge detection
- Improved edge direction similarity detection
- Fixed inconsistent error handling patterns
- Resolved missing error context in error messages
- Fixed error recovery inconsistencies
- Improved type checking for input parameters
- Enhanced error propagation in CPU edge detection
- Fixed WebGL resource cleanup issues

### Changed
- Standardized error handling across all methods
- Improved error message formatting and detail
- Enhanced error recovery with fallback mechanisms
- Optimized error logging with better context
- Improved method parameter validation

## [1.0.5] - 2024-04-18
### Added
- Enhanced edge detection with improved WebGL shader error handling
- Optimized CPU-based edge detection with pre-calculated kernel offsets
- Added edge direction information to improve wall detection accuracy
- Improved sensitivity and edge strength threshold calculations

### Fixed
- Fixed WebGL shader compilation and program linking error handling
- Improved fallback mechanism when WebGL is unavailable
- Enhanced edge detection performance for large images

## [1.0.4] - 2024-04-18
### Added
- Enhanced edge detection with WebGL acceleration
- Configurable image processing pipeline with multiple enhancement options
- Optimized memory usage and processing performance
- Chunk-based image processing for better handling of large scenes
- Early exit conditions for improved performance

### Changed
- Improved edge detection algorithm with better noise reduction
- Enhanced dark scene handling with adaptive histogram equalization
- Optimized wall detection in low-contrast areas
- Better handling of texture patterns and decorative elements

### Fixed
- Fixed memory leaks in image processing
- Improved stability with large scene images
- Better error handling in edge detection
- Fixed issues with wall detection in dark scenes

## [1.0.3] - 2024-04-18
### Added
- Improved image enhancement methods with better constant handling
- Enhanced wall detection accuracy with optimized pattern recognition
- Added additional error handling for edge cases
### Fixed
- Resolved constant variable issues in image enhancement methods
- Improved code organization and documentation

## [1.0.2] - 2024-03-19
### Fixed
- Fixed TypeError in detectEdges method related to constant variable assignment
- Improved grayscale data handling in dark scene enhancement

## [1.0.1] - 2024-03-19
### Fixed
- Scene#data deprecation warning for V10+ compatibility
- Added missing calculateImageStats method
- Improved scene image handling for V12.7

## [1.0.0] - 2024-03-19
### Added
- Initial release
- Advanced wall detection with pattern recognition
- Structural analysis for better wall placement
- Dark scene enhancement features
- Customizable settings for detection parameters
- Full compatibility with Foundry VTT v11 and v12.7 