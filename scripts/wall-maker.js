class WallMaker {
    static ID = 'wall-maker';
    
    static SETTINGS = {
        SENSITIVITY: 'sensitivity',
        WALL_TYPE: 'wallType',
        MIN_EDGE_STRENGTH: 'minEdgeStrength',
        MAX_EDGE_STRENGTH: 'maxEdgeStrength',
        DARK_SCENE_ENHANCEMENT: 'darkSceneEnhancement',
        CONTRAST_BOOST: 'contrastBoost',
        DARK_THRESHOLD: 'darkThreshold',
        SHADOW_RECOVERY: 'shadowRecovery',
        LOCAL_CONTRAST: 'localContrast',
        NOISE_REDUCTION: 'noiseReduction',
        EDGE_PRESERVATION: 'edgePreservation',
        ENHANCEMENT_METHOD: 'enhancementMethod',
        WALL_MIN_LENGTH: 'wallMinLength',
        WALL_RELEVANCE_THRESHOLD: 'wallRelevanceThreshold',
        TEXTURE_FILTERING: 'textureFiltering',
        WALL_CONTINUITY: 'wallContinuity',
        IGNORE_DECORATIVE: 'ignoreDecorative'
    };

    static initialize() {
        this.registerSettings();
        this.registerHooks();
    }

    static registerSettings() {
        // Update wall type choices to match v12.7 terminology while maintaining v11 compatibility
        const wallTypeChoices = game.version >= "12" ? {
            "regular": "WALLS.TypeRegular",
            "ethereal": "WALLS.TypeEthereal",
            "invisible": "WALLS.TypeInvisible",
            "terrain": "WALLS.TypeTerrain",
            "sound": "WALLS.TypeSound"
        } : {
            "normal": "Normal",
            "ethereal": "Ethereal",
            "invisible": "Invisible",
            "terrain": "Terrain"
        };

        game.settings.register(this.ID, this.SETTINGS.SENSITIVITY, {
            name: "Edge Detection Sensitivity",
            hint: "Adjust the sensitivity of edge detection (higher values detect more edges)",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 1,
                max: 100,
                step: 1
            },
            default: 50
        });

        game.settings.register(this.ID, this.SETTINGS.MIN_EDGE_STRENGTH, {
            name: "Minimum Edge Strength",
            hint: "Minimum strength required to consider a pixel as an edge (reduces noise)",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 1,
                max: 100,
                step: 1
            },
            default: 20
        });

        game.settings.register(this.ID, this.SETTINGS.MAX_EDGE_STRENGTH, {
            name: "Maximum Edge Strength",
            hint: "Maximum strength threshold for strong edges",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 1,
                max: 100,
                step: 1
            },
            default: 80
        });

        game.settings.register(this.ID, this.SETTINGS.WALL_TYPE, {
            name: "Default Wall Type",
            hint: "The type of wall to create",
            scope: "world",
            config: true,
            type: String,
            choices: wallTypeChoices,
            default: game.version >= "12" ? "regular" : "normal"
        });

        game.settings.register(this.ID, this.SETTINGS.DARK_SCENE_ENHANCEMENT, {
            name: "Dark Scene Enhancement",
            hint: "Automatically enhance dark scenes for better wall detection",
            scope: "world",
            config: true,
            type: Boolean,
            default: true
        });

        game.settings.register(this.ID, this.SETTINGS.CONTRAST_BOOST, {
            name: "Contrast Boost",
            hint: "Increase contrast in dark areas (0-100)",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 0,
                max: 100,
                step: 5
            },
            default: 50
        });

        game.settings.register(this.ID, this.SETTINGS.DARK_THRESHOLD, {
            name: "Dark Region Threshold",
            hint: "Brightness level below which pixels are considered dark (0-255)",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 0,
                max: 255,
                step: 5
            },
            default: 128
        });

        game.settings.register(this.ID, this.SETTINGS.SHADOW_RECOVERY, {
            name: "Shadow Recovery Strength",
            hint: "How aggressively to brighten shadow areas (0-100)",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 0,
                max: 100,
                step: 5
            },
            default: 50
        });

        game.settings.register(this.ID, this.SETTINGS.LOCAL_CONTRAST, {
            name: "Local Contrast Enhancement",
            hint: "Strength of local contrast enhancement (0-100)",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 0,
                max: 100,
                step: 5
            },
            default: 50
        });

        game.settings.register(this.ID, this.SETTINGS.NOISE_REDUCTION, {
            name: "Noise Reduction Level",
            hint: "Amount of noise reduction in dark areas (0-100)",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 0,
                max: 100,
                step: 5
            },
            default: 30
        });

        game.settings.register(this.ID, this.SETTINGS.EDGE_PRESERVATION, {
            name: "Edge Preservation",
            hint: "How strongly to preserve edges during enhancement (0-100)",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 0,
                max: 100,
                step: 5
            },
            default: 75
        });

        game.settings.register(this.ID, this.SETTINGS.ENHANCEMENT_METHOD, {
            name: "Dark Region Enhancement Method",
            hint: "Choose the method for enhancing dark regions",
            scope: "world",
            config: true,
            type: String,
            choices: {
                "adaptive": "Adaptive Histogram Equalization",
                "exposure": "Exposure Compensation",
                "shadow": "Shadow Recovery",
                "multi": "Multi-Scale Enhancement",
                "combined": "Combined Methods"
            },
            default: "combined"
        });

        game.settings.register(this.ID, this.SETTINGS.WALL_MIN_LENGTH, {
            name: "Minimum Wall Length",
            hint: "Minimum length (in pixels) for a wall segment to be considered valid",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 5,
                max: 100,
                step: 5
            },
            default: 20
        });

        game.settings.register(this.ID, this.SETTINGS.WALL_RELEVANCE_THRESHOLD, {
            name: "Wall Relevance Threshold",
            hint: "How strong an edge must be to be considered a wall (higher values mean fewer walls)",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 1,
                max: 100,
                step: 5
            },
            default: 50
        });

        game.settings.register(this.ID, this.SETTINGS.TEXTURE_FILTERING, {
            name: "Texture Filtering",
            hint: "Filter out walls that appear to be textures or patterns",
            scope: "world",
            config: true,
            type: Boolean,
            default: true
        });

        game.settings.register(this.ID, this.SETTINGS.WALL_CONTINUITY, {
            name: "Wall Continuity",
            hint: "How strongly to prefer continuous walls over disconnected segments",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 1,
                max: 100,
                step: 5
            },
            default: 75
        });

        game.settings.register(this.ID, this.SETTINGS.IGNORE_DECORATIVE, {
            name: "Ignore Decorative Elements",
            hint: "Attempt to ignore decorative elements like furniture, symbols, or text",
            scope: "world",
            config: true,
            type: Boolean,
            default: true
        });
    }

    static registerHooks() {
        Hooks.on('getSceneControlButtons', (controls) => {
            const wallControls = controls.find(c => c.name === "walls");
            if (wallControls) {
                wallControls.tools.push({
                    name: "autowall",
                    title: "Auto Wall Generator",
                    icon: "fas fa-magic",
                    button: true,
                    onClick: () => this.handleAutoWall()
                });
            }
        });
    }

    static async handleAutoWall() {
        const currentScene = game.version >= "12" ? 
            (game.scenes.current || game.scenes.active) : 
            game.scenes.current;

        if (!currentScene) {
            ui.notifications.error("No active scene!");
            return;
        }

        // Updated scene image access for V10+ compatibility
        const texturePath = currentScene.background?.src || currentScene.img;

        if (!texturePath) {
            ui.notifications.error("Scene has no background image!");
            return;
        }

        const img = await this.loadSceneImage(texturePath);
        if (!img) {
            ui.notifications.error("Could not load scene image!");
            return;
        }

        ui.notifications.info("Processing image edges...");
        const edges = await this.detectEdges(img);
        const walls = this.convertEdgesToWalls(edges);
        await this.createWalls(walls, currentScene);
    }

    static calculateImageStats(grayscale) {
        let sum = 0;
        let min = Infinity;
        let max = -Infinity;
        const histogram = new Array(256).fill(0);

        // Calculate basic statistics
        for (let i = 0; i < grayscale.length; i++) {
            const value = grayscale[i];
            sum += value;
            min = Math.min(min, value);
            max = Math.max(max, value);
            histogram[Math.floor(value)] = (histogram[Math.floor(value)] || 0) + 1;
        }

        const meanBrightness = sum / grayscale.length;

        // Calculate median and standard deviation
        let count = 0;
        let median = 0;
        const midPoint = grayscale.length / 2;
        
        for (let i = 0; i < histogram.length; i++) {
            count += histogram[i];
            if (count >= midPoint && median === 0) {
                median = i;
            }
        }

        let variance = 0;
        for (let i = 0; i < grayscale.length; i++) {
            variance += Math.pow(grayscale[i] - meanBrightness, 2);
        }
        const stdDev = Math.sqrt(variance / grayscale.length);

        return {
            meanBrightness,
            median,
            stdDev,
            min,
            max,
            histogram
        };
    }

    static async loadSceneImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    static async detectEdges(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Convert to grayscale with enhanced dark region handling
        const grayscale = new Float32Array(width * height);
        const histogram = new Array(256).fill(0);
        let totalPixels = width * height;

        // First pass: calculate histogram and basic grayscale
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Enhanced grayscale conversion for dark scenes
            const gray = Math.pow(r * 0.299 + g * 0.587 + b * 0.114, 0.85);
            grayscale[i / 4] = gray;
            histogram[Math.floor(gray)]++;
        }

        // Calculate cumulative histogram for adaptive enhancement
        const cumulativeHist = new Array(256);
        cumulativeHist[0] = histogram[0];
        for (let i = 1; i < 256; i++) {
            cumulativeHist[i] = cumulativeHist[i - 1] + histogram[i];
        }

        // Enhanced dark region processing
        const darkThreshold = game.settings.get(this.ID, this.SETTINGS.DARK_THRESHOLD);
        const shadowRecovery = game.settings.get(this.ID, this.SETTINGS.SHADOW_RECOVERY) / 100;
        const localContrast = game.settings.get(this.ID, this.SETTINGS.LOCAL_CONTRAST) / 100;
        const noiseReduction = game.settings.get(this.ID, this.SETTINGS.NOISE_REDUCTION) / 100;
        const edgePreservation = game.settings.get(this.ID, this.SETTINGS.EDGE_PRESERVATION) / 100;
        const enhancementMethod = game.settings.get(this.ID, this.SETTINGS.ENHANCEMENT_METHOD);

        // Calculate image statistics
        const stats = this.calculateImageStats(grayscale);
        const isDarkScene = stats.meanBrightness < darkThreshold;

        if (isDarkScene && game.settings.get(this.ID, this.SETTINGS.DARK_SCENE_ENHANCEMENT)) {
            switch (enhancementMethod) {
                case "adaptive":
                    grayscale = this.adaptiveHistogramEqualization(grayscale, width, height, {
                        clipLimit: 4.0,
                        tileSize: 8,
                        edgePreservation
                    });
                    break;
                case "exposure":
                    grayscale = this.exposureCompensation(grayscale, stats, {
                        shadowRecovery,
                        localContrast
                    });
                    break;
                case "shadow":
                    grayscale = this.shadowRecoveryEnhancement(grayscale, stats, {
                        strength: shadowRecovery,
                        threshold: darkThreshold
                    });
                    break;
                case "multi":
                    grayscale = this.multiScaleEnhancement(grayscale, width, height, {
                        levels: 3,
                        strength: localContrast
                    });
                    break;
                case "combined":
                default:
                    grayscale = this.combinedEnhancement(grayscale, width, height, {
                        stats,
                        shadowRecovery,
                        localContrast,
                        noiseReduction,
                        edgePreservation
                    });
            }
        }

        // Apply noise reduction with edge preservation
        if (isDarkScene && noiseReduction > 0) {
            grayscale = this.edgeAwareDenoising(grayscale, width, height, {
                noiseReduction,
                edgePreservation
            });
        }

        // Apply local adaptive thresholding
        const adaptiveThreshold = this.computeAdaptiveThreshold(grayscale, width, height);
        
        // Apply enhanced Gaussian blur with dark region awareness
        const blurred = this.adaptiveGaussianBlur(grayscale, width, height, isDarkScene);

        // Enhanced directional operators
        const operators = {
            horizontal: {
                x: [-1, 0, 1, -2, 0, 2, -1, 0, 1],      // Sobel X
                y: [-1, -2, -1, 0, 0, 0, 1, 2, 1]       // Sobel Y
            },
            diagonal45: {
                x: [0, 1, 2, -1, 0, 1, -2, -1, 0],      // 45° diagonal
                y: [-2, -1, 0, -1, 0, 1, 0, 1, 2]
            },
            diagonal135: {
                x: [2, 1, 0, 1, 0, -1, 0, -1, -2],      // 135° diagonal
                y: [0, 1, 2, -1, 0, 1, -2, -1, 0]
            },
            vertical: {
                x: [-1, -2, -1, 0, 0, 0, 1, 2, 1],      // Vertical emphasis
                y: [1, 0, -1, 2, 0, -2, 1, 0, -1]
            }
        };

        // Calculate gradients for each direction
        const gradientMagnitude = new Float32Array(width * height);
        const gradientDirection = new Float32Array(width * height);

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = y * width + x;
                let maxGradient = 0;
                let maxDirection = 0;

                // Check each direction
                for (const [direction, operator] of Object.entries(operators)) {
                    let gradX = 0;
                    let gradY = 0;

                    // Apply operator
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const pixelIdx = (y + ky) * width + (x + kx);
                            const kernelIdx = (ky + 1) * 3 + (kx + 1);
                            gradX += blurred[pixelIdx] * operator.x[kernelIdx];
                            gradY += blurred[pixelIdx] * operator.y[kernelIdx];
                        }
                    }

                    // Calculate gradient magnitude for this direction
                    const gradient = Math.sqrt(gradX * gradX + gradY * gradY);
                    
                    // Keep track of strongest gradient
                    if (gradient > maxGradient) {
                        maxGradient = gradient;
                        maxDirection = Math.atan2(gradY, gradX);
                    }
                }

                gradientMagnitude[idx] = maxGradient;
                gradientDirection[idx] = maxDirection;
            }
        }

        // Enhanced non-maximum suppression
        const suppressed = this.enhancedNonMaxSuppression(gradientMagnitude, gradientDirection, width, height);

        // Adjust edge detection thresholds for dark scenes
        const sensitivity = game.settings.get(this.ID, this.SETTINGS.SENSITIVITY) / 100;
        const minEdgeStrength = game.settings.get(this.ID, this.SETTINGS.MIN_EDGE_STRENGTH) / 100;
        const maxEdgeStrength = game.settings.get(this.ID, this.SETTINGS.MAX_EDGE_STRENGTH) / 100;

        // Adaptive thresholds for dark scenes
        const lowThreshold = isDarkScene ? 
            255 * minEdgeStrength * sensitivity * 0.75 : // Lower threshold for dark scenes
            255 * minEdgeStrength * sensitivity;
        const highThreshold = isDarkScene ?
            255 * maxEdgeStrength * sensitivity * 0.85 : // Adjusted high threshold for dark scenes
            255 * maxEdgeStrength * sensitivity;

        const edges = [];
        const visited = new Set();

        // Find strong edges and trace them
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = y * width + x;
                if (suppressed[idx] >= highThreshold && !visited.has(idx)) {
                    this.traceEdge(x, y, suppressed, lowThreshold, width, height, visited, edges);
                }
            }
        }

        return edges;
    }

    static convertEdgesToWalls(edges) {
        const walls = [];
        const wallMinLength = game.settings.get(this.ID, this.SETTINGS.WALL_MIN_LENGTH);
        const relevanceThreshold = game.settings.get(this.ID, this.SETTINGS.WALL_RELEVANCE_THRESHOLD) / 100;
        const textureFiltering = game.settings.get(this.ID, this.SETTINGS.TEXTURE_FILTERING);
        const wallContinuity = game.settings.get(this.ID, this.SETTINGS.WALL_CONTINUITY) / 100;
        const ignoreDecorative = game.settings.get(this.ID, this.SETTINGS.IGNORE_DECORATIVE);

        // Group edges into potential wall segments
        let segments = this.groupEdgesIntoSegments(edges);

        // Filter out texture-like patterns
        if (textureFiltering) {
            segments = this.filterTexturePatterns(segments);
        }

        // Filter out likely decorative elements
        if (ignoreDecorative) {
            segments = this.filterDecorativeElements(segments);
        }

        // Analyze wall relevance and continuity
        segments = this.analyzeWallRelevance(segments, relevanceThreshold);
        
        // Connect and merge relevant wall segments
        const mergedWalls = this.mergeWallSegments(segments, {
            minLength: wallMinLength,
            continuityPreference: wallContinuity
        });

        return mergedWalls;
    }

    static filterTexturePatterns(segments) {
        const filtered = [];
        
        for (const segment of segments) {
            // Enhanced pattern analysis
            const patternFeatures = this.analyzeAdvancedPatterns(segment.points);
            
            // Only keep segments that don't match texture patterns
            if (!this.isTexturePattern(patternFeatures)) {
                filtered.push(segment);
            }
        }
        
        return filtered;
    }

    static analyzeAdvancedPatterns(points) {
        return {
            // Spatial distribution analysis
            spatial: this.analyzeSpatialDistribution(points),
            // Frequency analysis for repeating patterns
            frequency: this.analyzeFrequencyPatterns(points),
            // Geometric pattern detection
            geometric: this.detectGeometricPatterns(points),
            // Texture density analysis
            density: this.analyzeTextureDensity(points),
            // Scale-invariant feature analysis
            features: this.analyzeScaleInvariantFeatures(points)
        };
    }

    static analyzeSpatialDistribution(points) {
        // Analyze point distribution using quadtree partitioning
        const bounds = this.getSegmentBounds(points);
        const quadtree = this.buildQuadtree(points, bounds);
        
        return {
            uniformity: this.calculateDistributionUniformity(quadtree),
            density: this.calculateSpatialDensity(quadtree),
            clustering: this.analyzeClustering(points)
        };
    }

    static buildQuadtree(points, bounds, depth = 0, maxDepth = 4) {
        const node = {
            bounds,
            points: [],
            children: null,
            depth
        };

        if (depth === maxDepth) {
            node.points = points;
            return node;
        }

        const midX = (bounds.minX + bounds.maxX) / 2;
        const midY = (bounds.minY + bounds.maxY) / 2;
        const subPoints = {
            nw: [], ne: [], sw: [], se: []
        };

        for (const point of points) {
            if (point.x < midX) {
                if (point.y < midY) subPoints.nw.push(point);
                else subPoints.sw.push(point);
            } else {
                if (point.y < midY) subPoints.ne.push(point);
                else subPoints.se.push(point);
            }
        }

        if (points.length > 4) {
            node.children = {
                nw: this.buildQuadtree(subPoints.nw, {
                    minX: bounds.minX, maxX: midX,
                    minY: bounds.minY, maxY: midY
                }, depth + 1, maxDepth),
                ne: this.buildQuadtree(subPoints.ne, {
                    minX: midX, maxX: bounds.maxX,
                    minY: bounds.minY, maxY: midY
                }, depth + 1, maxDepth),
                sw: this.buildQuadtree(subPoints.sw, {
                    minX: bounds.minX, maxX: midX,
                    minY: midY, maxY: bounds.maxY
                }, depth + 1, maxDepth),
                se: this.buildQuadtree(subPoints.se, {
                    minX: midX, maxX: bounds.maxX,
                    minY: midY, maxY: bounds.maxY
                }, depth + 1, maxDepth)
            };
        } else {
            node.points = points;
        }

        return node;
    }

    static analyzeFrequencyPatterns(points) {
        // Perform 2D FFT-like analysis for repeating patterns
        const patterns = new Map();
        const frequencies = new Map();
        
        // Analyze point-to-point vectors
        for (let i = 0; i < points.length - 1; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const dx = points[j].x - points[i].x;
                const dy = points[j].y - points[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);
                
                // Quantize distances and angles
                const quantizedDist = Math.round(distance / 5) * 5;
                const quantizedAngle = Math.round(angle / (Math.PI / 8)) * (Math.PI / 8);
                
                const pattern = `${quantizedDist},${quantizedAngle}`;
                patterns.set(pattern, (patterns.get(pattern) || 0) + 1);
                
                // Record frequency components
                frequencies.set(quantizedDist, (frequencies.get(quantizedDist) || 0) + 1);
            }
        }
        
        return {
            patterns,
            frequencies,
            periodicity: this.calculatePeriodicity(frequencies),
            dominantFrequencies: this.findDominantFrequencies(frequencies)
        };
    }

    static detectGeometricPatterns(points) {
        return {
            lines: this.detectLinePatterns(points),
            rectangles: this.detectRectangularPatterns(points),
            regularShapes: this.detectRegularShapes(points)
        };
    }

    static detectLinePatterns(points) {
        const lines = [];
        const visited = new Set();
        const angleThreshold = Math.PI / 8;
        
        for (let i = 0; i < points.length - 2; i++) {
            if (visited.has(i)) continue;
            
            const linePoints = [points[i]];
            let currentAngle = null;
            
            for (let j = i + 1; j < points.length; j++) {
                if (visited.has(j)) continue;
                
                const lastPoint = linePoints[linePoints.length - 1];
                const angle = Math.atan2(
                    points[j].y - lastPoint.y,
                    points[j].x - lastPoint.x
                );
                
                if (currentAngle === null) {
                    currentAngle = angle;
                    linePoints.push(points[j]);
                    visited.add(j);
                } else if (Math.abs(angle - currentAngle) < angleThreshold) {
                    linePoints.push(points[j]);
                    visited.add(j);
                }
            }
            
            if (linePoints.length >= 3) {
                lines.push({
                    points: linePoints,
                    angle: currentAngle,
                    length: this.calculateSegmentLength(linePoints)
                });
            }
        }
        
        return lines;
    }

    static detectRectangularPatterns(points) {
        const rectangles = [];
        const lines = this.detectLinePatterns(points);
        
        // Find perpendicular line pairs
        for (let i = 0; i < lines.length - 1; i++) {
            for (let j = i + 1; j < lines.length; j++) {
                const angleDiff = Math.abs(lines[i].angle - lines[j].angle) % Math.PI;
                if (Math.abs(angleDiff - Math.PI/2) < Math.PI/8) {
                    // Check if lines intersect or are close
                    if (this.areLinesConnected(lines[i], lines[j])) {
                        rectangles.push({
                            line1: lines[i],
                            line2: lines[j],
                            angle: Math.min(lines[i].angle, lines[j].angle)
                        });
                    }
                }
            }
        }
        
        return rectangles;
    }

    static detectRegularShapes(points) {
        const shapes = [];
        const visited = new Set();
        const angleThreshold = Math.PI / 12;
        
        for (let i = 0; i < points.length - 2; i++) {
            if (visited.has(i)) continue;
            
            const shapePoints = [points[i]];
            const angles = [];
            
            for (let j = i + 1; j < points.length; j++) {
                if (visited.has(j)) continue;
                
                const lastPoint = shapePoints[shapePoints.length - 1];
                const angle = Math.atan2(
                    points[j].y - lastPoint.y,
                    points[j].x - lastPoint.x
                );
                
                if (angles.length === 0 || 
                    this.isAngleRegular(angle, angles[angles.length - 1])) {
                    shapePoints.push(points[j]);
                    angles.push(angle);
                    visited.add(j);
                }
            }
            
            if (shapePoints.length >= 4) {
                shapes.push({
                    points: shapePoints,
                    angles,
                    regularity: this.calculateShapeRegularity(angles)
                });
            }
        }
        
        return shapes;
    }

    static analyzeStructuralPatterns(segments) {
        const structuralFeatures = {
            walls: [],
            corners: [],
            intersections: [],
            rooms: []
        };

        // Find primary wall directions
        const directions = this.findPrimaryDirections(segments);
        
        // Group segments by direction
        const groupedSegments = this.groupSegmentsByDirection(segments, directions);
        
        // Detect corners and intersections
        const junctions = this.detectJunctions(segments);
        
        // Analyze potential rooms
        const rooms = this.detectRooms(segments, junctions);
        
        // Score segments based on structural importance
        const scoredSegments = segments.map(segment => ({
            ...segment,
            structuralScore: this.calculateStructuralImportance(
                segment,
                junctions,
                rooms,
                directions
            )
        }));

        return {
            primaryDirections: directions,
            groupedSegments,
            junctions,
            rooms,
            scoredSegments
        };
    }

    static findPrimaryDirections(segments) {
        const directions = new Map();
        const angleStep = Math.PI / 16; // 11.25 degrees
        
        segments.forEach(segment => {
            const angle = this.calculateSegmentAngle(segment);
            const quantizedAngle = Math.round(angle / angleStep) * angleStep;
            directions.set(quantizedAngle, (directions.get(quantizedAngle) || 0) + 1);
        });
        
        // Find dominant directions (usually orthogonal)
        return Array.from(directions.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([angle]) => angle);
    }

    static detectJunctions(segments) {
        const junctions = new Map();
        const proximityThreshold = 10; // pixels
        
        // Find segment endpoints
        segments.forEach(segment => {
            const endpoints = [
                segment.points[0],
                segment.points[segment.points.length - 1]
            ];
            
            endpoints.forEach(point => {
                const key = `${Math.round(point.x)},${Math.round(point.y)}`;
                if (!junctions.has(key)) {
                    junctions.set(key, {
                        point,
                        segments: new Set(),
                        type: 'endpoint'
                    });
                }
                junctions.get(key).segments.add(segment);
            });
        });
        
        // Classify junctions
        junctions.forEach(junction => {
            if (junction.segments.size === 2) {
                const segments = Array.from(junction.segments);
                const angle = Math.abs(
                    this.calculateSegmentAngle(segments[0]) -
                    this.calculateSegmentAngle(segments[1])
                ) % Math.PI;
                
                if (Math.abs(angle - Math.PI/2) < Math.PI/8) {
                    junction.type = 'corner';
                } else {
                    junction.type = 'continuation';
                }
            } else if (junction.segments.size > 2) {
                junction.type = 'intersection';
            }
        });
        
        return junctions;
    }

    static detectRooms(segments, junctions) {
        const rooms = [];
        const visited = new Set();
        
        // Find closed loops of segments that might form rooms
        Array.from(junctions.values())
            .filter(j => j.type === 'corner')
            .forEach(startJunction => {
                if (visited.has(startJunction)) return;
                
                const room = this.traceRoom(startJunction, junctions, visited);
                if (room && this.isValidRoom(room)) {
                    rooms.push(room);
                }
            });
        
        return rooms;
    }

    static traceRoom(startJunction, junctions, visited) {
        const room = {
            corners: [startJunction],
            segments: new Set(),
            area: 0
        };
        
        let currentJunction = startJunction;
        let previousSegment = null;
        
        while (true) {
            visited.add(currentJunction);
            
            // Find next segment and junction
            const nextConnection = this.findNextRoomConnection(
                currentJunction,
                previousSegment,
                room
            );
            
            if (!nextConnection) break;
            
            const { segment, junction } = nextConnection;
            
            // Check if we've completed the room
            if (junction === startJunction && room.corners.length > 2) {
                room.area = this.calculatePolygonArea(room.corners.map(c => c.point));
                return room;
            }
            
            // Add to room
            room.segments.add(segment);
            room.corners.push(junction);
            
            // Continue tracing
            previousSegment = segment;
            currentJunction = junction;
            
            // Prevent infinite loops
            if (room.corners.length > 50) break;
        }
        
        return null;
    }

    static calculateStructuralImportance(segment, junctions, rooms, primaryDirections) {
        let score = 0;
        
        // Alignment with primary directions
        const segmentAngle = this.calculateSegmentAngle(segment);
        const alignmentScore = primaryDirections.reduce((max, direction) => {
            const alignment = Math.abs(Math.cos(segmentAngle - direction));
            return Math.max(max, alignment);
        }, 0);
        score += alignmentScore * 0.3;
        
        // Junction importance
        const junctionScore = Array.from(segment.points)
            .filter(point => {
                const key = `${Math.round(point.x)},${Math.round(point.y)}`;
                const junction = junctions.get(key);
                return junction && (junction.type === 'corner' || junction.type === 'intersection');
            })
            .length / segment.points.length;
        score += junctionScore * 0.3;
        
        // Room boundary contribution
        const roomScore = rooms.reduce((sum, room) => {
            return sum + (room.segments.has(segment) ? 1 : 0);
        }, 0) / Math.max(1, rooms.length);
        score += roomScore * 0.4;
        
        return score;
    }

    static async createWalls(walls, scene) {
        const wallType = game.settings.get(this.ID, this.SETTINGS.WALL_TYPE);
        
        const wallData = walls.map(wall => {
            const baseData = {
                c: [
                    wall.start.x,
                    wall.start.y,
                    wall.end.x,
                    wall.end.y
                ]
            };

            if (game.version >= "12") {
                // v12.7 wall properties with full feature support
                baseData.type = wallType === "normal" ? "regular" : wallType;
                baseData.light = CONST.WALL_SENSE_TYPES.NORMAL;
                baseData.sight = CONST.WALL_SENSE_TYPES.NORMAL;
                baseData.sound = CONST.WALL_SENSE_TYPES.NORMAL;
                baseData.move = CONST.WALL_MOVEMENT_TYPES.NORMAL;
                baseData.dir = CONST.WALL_DIRECTIONS.BOTH;
                if (wallType === "door") {
                    baseData.ds = CONST.WALL_DOOR_STATES.CLOSED;
                }
            } else {
                // v11 wall properties
                baseData.type = wallType;
                if (wallType === "door") {
                    baseData.ds = 0;
                }
            }

            return baseData;
        });

        try {
            if (game.version >= "12") {
                await scene.walls.createDocuments(wallData);
            } else {
                await scene.createEmbeddedDocuments("Wall", wallData);
            }
            ui.notifications.info(`Created ${walls.length} walls!`);
        } catch (error) {
            console.error("Wall Maker | Error creating walls:", error);
            ui.notifications.error("Error creating walls. Check the console for details.");
        }
    }

    // Add helper methods for image enhancement
    static adaptiveHistogramEqualization(grayscale, width, height, options) {
        const { clipLimit = 4.0, tileSize = 8, edgePreservation = 0.75 } = options;
        // Implementation of adaptive histogram equalization
        // This is a placeholder - actual implementation would go here
        return grayscale;
    }

    static exposureCompensation(grayscale, stats, options) {
        const { shadowRecovery = 0.5, localContrast = 0.5 } = options;
        // Implementation of exposure compensation
        // This is a placeholder - actual implementation would go here
        return grayscale;
    }

    static shadowRecoveryEnhancement(grayscale, stats, options) {
        const { strength = 0.5, threshold = 128 } = options;
        // Implementation of shadow recovery
        // This is a placeholder - actual implementation would go here
        return grayscale;
    }

    static multiScaleEnhancement(grayscale, width, height, options) {
        const { levels = 3, strength = 0.5 } = options;
        // Implementation of multi-scale enhancement
        // This is a placeholder - actual implementation would go here
        return grayscale;
    }

    static combinedEnhancement(grayscale, width, height, options) {
        const { stats, shadowRecovery, localContrast, noiseReduction, edgePreservation } = options;
        // Implementation of combined enhancement methods
        // This is a placeholder - actual implementation would go here
        return grayscale;
    }

    static edgeAwareDenoising(grayscale, width, height, options) {
        const { noiseReduction = 0.3, edgePreservation = 0.75 } = options;
        // Implementation of edge-aware denoising
        // This is a placeholder - actual implementation would go here
        return grayscale;
    }

    static computeAdaptiveThreshold(grayscale, width, height) {
        // Implementation of adaptive thresholding
        // This is a placeholder - actual implementation would go here
        return grayscale;
    }

    static adaptiveGaussianBlur(grayscale, width, height, isDarkScene) {
        // Implementation of adaptive Gaussian blur
        // This is a placeholder - actual implementation would go here
        return grayscale;
    }

    static enhancedNonMaxSuppression(gradientMagnitude, gradientDirection, width, height) {
        // Implementation of enhanced non-maximum suppression
        // This is a placeholder - actual implementation would go here
        return gradientMagnitude;
    }

    static traceEdge(x, y, suppressed, lowThreshold, width, height, visited, edges) {
        // Implementation of edge tracing
        // This is a placeholder - actual implementation would go here
        edges.push({ x, y });
    }
}

Hooks.once('init', () => {
    WallMaker.initialize();
}); 