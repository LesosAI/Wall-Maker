# Changelog

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