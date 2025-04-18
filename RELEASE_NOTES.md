# Wall Maker v1.0.5 Release Notes

## Overview
Wall Maker v1.0.5 brings significant improvements to edge detection and processing capabilities, focusing on performance optimization and reliability. This release enhances the module's ability to handle various scene conditions while maintaining efficient processing speeds.

## New Features and Improvements

### Enhanced Edge Detection
- **WebGL Shader Improvements**
  - Improved error handling during shader compilation and program linking
  - Enhanced performance for large-scale scene processing
  - Better memory management during GPU operations

### Optimized Processing
- **CPU-based Processing**
  - Pre-calculated kernel offsets for faster edge detection
  - Improved fallback mechanism when WebGL is unavailable
  - Enhanced performance for systems without GPU acceleration

### Advanced Detection Features
- **Edge Direction Analysis**
  - Added edge direction information for more accurate wall placement
  - Improved detection of wall corners and intersections
  - Better handling of complex architectural features

### Performance Optimizations
- **Threshold Calculations**
  - Enhanced sensitivity calculations for better edge detection
  - Improved edge strength threshold adjustments
  - More accurate wall detection in varying lighting conditions

## Installation
1. In Foundry VTT, navigate to the Add-on Modules tab
2. Click "Install Module"
3. Search for "Wall Maker" or paste the following manifest URL:
   ```
   https://github.com/username/wall-maker/releases/download/v1.0.5/module.json
   ```

## Compatibility
- Foundry VTT Core Compatible Versions: v11 and v12.7
- Requires no additional module dependencies

## Known Issues
- In extremely large scenes (>8000x8000 pixels), initial processing may take longer
- Some systems may default to CPU processing if WebGL initialization fails

## Feedback and Support
- For bug reports: [GitHub Issues](https://github.com/username/wall-maker/issues)
- For support: [Foundry VTT Discord](https://discord.gg/foundryvtt)

## Credits
Special thanks to all contributors and testers who helped improve this release.

## License
This module is licensed under the MIT License. See the LICENSE file for details. 