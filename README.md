# Wall Maker

A Foundry VTT module that automatically detects and creates walls from scene backgrounds using advanced pattern recognition and structural analysis.

## Features

- Automatic wall detection from scene images
- Advanced pattern recognition to identify real walls vs decorative elements
- Structural analysis for better wall placement
- Dark scene enhancement for improved detection in low-light images
- Customizable settings for fine-tuning wall detection
- Enhanced grayscale data handling for better dark scene processing
- Improved scene image handling for V12.7 compatibility
- Compatible with Foundry VTT v11 and v12.7

## Installation

1. Inside Foundry VTT, select the "Add-on Modules" tab in the Configuration and Setup menu
2. Click the "Install Module" button and enter the following URL:
   `https://raw.githubusercontent.com/LesosAI/Wall-Maker/main/module.json`
3. Click "Install" and wait for installation to complete
4. Don't forget to enable the module in your World using the "Manage Modules" menu

## Usage

1. Open a scene where you want to create walls
2. Click the "Walls" tool in the scene controls
3. Look for the magic wand icon in the walls toolbar
4. Click the icon to automatically generate walls based on the scene image

## Settings

The module provides several settings to customize wall detection:

- **Edge Detection Sensitivity**: Adjust how sensitive the detection is (1-100)
- **Wall Type**: Choose the type of walls to create (normal, ethereal, invisible, etc.)
- **Dark Scene Enhancement**: Automatically enhance dark scenes for better detection
- **Texture Filtering**: Filter out walls that appear to be textures or patterns
- **Wall Continuity**: Adjust how strongly to prefer continuous walls
- **Minimum Wall Length**: Set the minimum length for wall segments
- **Wall Relevance Threshold**: Set how strong an edge must be to be considered a wall

## Compatibility

- Requires Foundry VTT version 11 or higher
- Verified compatible with Foundry VTT version 12.7
- Maximum compatible version: 12

## Support

If you encounter any issues or have suggestions, please:
1. Check the [Issues](https://github.com/LesosAI/Wall-Maker/issues) page
2. Create a new issue if your problem isn't already reported

## License

This module is licensed under the MIT License. See the LICENSE file for details.

## Credits

Created by Lesos
Contact: Discord: Lesos 