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
        let grayscale = new Float32Array(width * height);
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
        const enhanced = new Uint8ClampedArray(grayscale);
        const tilesX = Math.ceil(width / tileSize);
        const tilesY = Math.ceil(height / tileSize);
        
        // Process each tile
        for (let ty = 0; ty < tilesY; ty++) {
            for (let tx = 0; tx < tilesX; tx++) {
                const startX = tx * tileSize;
                const startY = ty * tileSize;
                const endX = Math.min(startX + tileSize, width);
                const endY = Math.min(startY + tileSize, height);
                
                // Calculate histogram for this tile
                const histogram = new Array(256).fill(0);
                for (let y = startY; y < endY; y++) {
                    for (let x = startX; x < endX; x++) {
                        const idx = y * width + x;
                        histogram[Math.floor(grayscale[idx])]++;
                    }
                }
                
                // Clip histogram
                const clipThreshold = Math.floor(clipLimit * (endX - startX) * (endY - startY) / 256);
                let excess = 0;
                for (let i = 0; i < 256; i++) {
                    if (histogram[i] > clipThreshold) {
                        excess += histogram[i] - clipThreshold;
                        histogram[i] = clipThreshold;
                    }
                }
                
                // Redistribute excess
                const excessPerBin = Math.floor(excess / 256);
                for (let i = 0; i < 256; i++) {
                    histogram[i] += excessPerBin;
                }
                
                // Calculate cumulative distribution
                const cdf = new Array(256);
                cdf[0] = histogram[0];
                for (let i = 1; i < 256; i++) {
                    cdf[i] = cdf[i - 1] + histogram[i];
                }
                
                // Normalize and apply
                const cdfMin = Math.min(...cdf.filter(v => v > 0));
                const scale = 255 / (cdf[255] - cdfMin);
                
                for (let y = startY; y < endY; y++) {
                    for (let x = startX; x < endX; x++) {
                        const idx = y * width + x;
                        const value = Math.floor(grayscale[idx]);
                        const newValue = Math.round((cdf[value] - cdfMin) * scale);
                        enhanced[idx] = Math.min(255, Math.max(0, newValue));
                    }
                }
            }
        }
        
        return enhanced;
    }

    static exposureCompensation(grayscale, stats, options) {
        const { shadowRecovery = 0.5, localContrast = 0.5 } = options;
        const enhanced = new Uint8ClampedArray(grayscale);
        const { meanBrightness, stdDev } = stats;
        
        // Calculate adaptive exposure adjustment
        const targetBrightness = 128;
        const exposureAdjust = targetBrightness / meanBrightness;
        
        // Calculate local contrast enhancement factor
        const contrastFactor = 1 + (localContrast * stdDev / 128);
        
        // Apply exposure compensation with shadow recovery
        for (let i = 0; i < grayscale.length; i++) {
            const value = grayscale[i];
            let adjusted = value * exposureAdjust;
            
            // Enhanced shadow recovery
            if (value < meanBrightness) {
                const shadowBoost = shadowRecovery * (meanBrightness - value) / meanBrightness;
                adjusted = adjusted * (1 + shadowBoost);
            }
            
            // Apply local contrast
            const centered = adjusted - meanBrightness;
            adjusted = meanBrightness + centered * contrastFactor;
            
            enhanced[i] = Math.min(255, Math.max(0, Math.round(adjusted)));
        }
        
        return enhanced;
    }

    static shadowRecoveryEnhancement(grayscale, stats, options) {
        const { strength = 0.5, threshold = 128 } = options;
        const enhanced = new Uint8ClampedArray(grayscale);
        const { meanBrightness } = stats;
        
        // Calculate shadow regions
        for (let i = 0; i < grayscale.length; i++) {
            const value = grayscale[i];
            if (value < threshold) {
                // Calculate shadow boost based on darkness level
                const darkness = (threshold - value) / threshold;
                const boost = 1 + (strength * darkness);
                
                // Apply non-linear boost to preserve details
                const adjusted = value * boost;
                enhanced[i] = Math.min(255, Math.max(0, Math.round(adjusted)));
            } else {
                enhanced[i] = value;
            }
        }
        
        return enhanced;
    }

    static multiScaleEnhancement(grayscale, width, height, options) {
        const { levels = 3, strength = 0.5 } = options;
        const enhanced = new Uint8ClampedArray(grayscale);
        
        // Create Gaussian pyramid
        const pyramid = [grayscale];
        let currentWidth = width;
        let currentHeight = height;
        
        for (let level = 1; level < levels; level++) {
            currentWidth = Math.floor(currentWidth / 2);
            currentHeight = Math.floor(currentHeight / 2);
            const downsampled = new Uint8ClampedArray(currentWidth * currentHeight);
            
            // Downsample with Gaussian blur
            for (let y = 0; y < currentHeight; y++) {
                for (let x = 0; x < currentWidth; x++) {
                    const srcX = x * 2;
                    const srcY = y * 2;
                    const idx = y * currentWidth + x;
                    
                    // Simple 2x2 box filter
                    const sum = pyramid[level - 1][srcY * (currentWidth * 2) + srcX] +
                              pyramid[level - 1][srcY * (currentWidth * 2) + srcX + 1] +
                              pyramid[level - 1][(srcY + 1) * (currentWidth * 2) + srcX] +
                              pyramid[level - 1][(srcY + 1) * (currentWidth * 2) + srcX + 1];
                    downsampled[idx] = Math.round(sum / 4);
                }
            }
            
            pyramid.push(downsampled);
        }
        
        // Process each level
        for (let level = 0; level < levels; level++) {
            const levelWidth = Math.floor(width / Math.pow(2, level));
            const levelHeight = Math.floor(height / Math.pow(2, level));
            const levelStrength = strength * (1 - level / levels);
            
            // Apply local contrast enhancement
            for (let y = 0; y < levelHeight; y++) {
                for (let x = 0; x < levelWidth; x++) {
                    const idx = y * levelWidth + x;
                    const value = pyramid[level][idx];
                    
                    // Calculate local mean
                    let sum = 0;
                    let count = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const nx = x + kx;
                            const ny = y + ky;
                            if (nx >= 0 && nx < levelWidth && ny >= 0 && ny < levelHeight) {
                                sum += pyramid[level][ny * levelWidth + nx];
                                count++;
                            }
                        }
                    }
                    const localMean = sum / count;
                    
                    // Enhance contrast
                    const contrast = (value - localMean) * levelStrength;
                    pyramid[level][idx] = Math.min(255, Math.max(0, Math.round(localMean + contrast)));
                }
            }
        }
        
        // Upsample and combine
        for (let level = levels - 1; level > 0; level--) {
            const levelWidth = Math.floor(width / Math.pow(2, level));
            const levelHeight = Math.floor(height / Math.pow(2, level));
            
            for (let y = 0; y < levelHeight; y++) {
                for (let x = 0; x < levelWidth; x++) {
                    const srcIdx = y * levelWidth + x;
                    const dstX = x * 2;
                    const dstY = y * 2;
                    
                    // Simple 2x2 upsampling
                    const value = pyramid[level][srcIdx];
                    pyramid[level - 1][dstY * (levelWidth * 2) + dstX] = value;
                    pyramid[level - 1][dstY * (levelWidth * 2) + dstX + 1] = value;
                    pyramid[level - 1][(dstY + 1) * (levelWidth * 2) + dstX] = value;
                    pyramid[level - 1][(dstY + 1) * (levelWidth * 2) + dstX + 1] = value;
                }
            }
        }
        
        // Copy final result
        enhanced.set(pyramid[0]);
        return enhanced;
    }

    static combinedEnhancement(grayscale, width, height, options) {
        const { stats, shadowRecovery, localContrast, noiseReduction, edgePreservation } = options;
        const enhanced = new Uint8ClampedArray(grayscale);
        
        // First pass: shadow recovery
        const shadowEnhanced = this.shadowRecoveryEnhancement(grayscale, stats, {
            strength: shadowRecovery,
            threshold: stats.meanBrightness
        });
        
        // Second pass: local contrast
        const contrastEnhanced = this.exposureCompensation(shadowEnhanced, stats, {
            shadowRecovery: 0,
            localContrast
        });
        
        // Third pass: noise reduction with edge preservation
        const denoised = this.edgeAwareDenoising(contrastEnhanced, width, height, {
            noiseReduction,
            edgePreservation
        });
        
        // Final pass: adaptive histogram equalization
        const finalEnhanced = this.adaptiveHistogramEqualization(denoised, width, height, {
            clipLimit: 2.0,
            tileSize: 16,
            edgePreservation
        });
        
        enhanced.set(finalEnhanced);
        return enhanced;
    }

    static edgeAwareDenoising(grayscale, width, height, options) {
        const { noiseReduction = 0.3, edgePreservation = 0.75 } = options;
        const enhanced = new Uint8ClampedArray(grayscale);
        const kernelSize = 3;
        const halfKernel = Math.floor(kernelSize / 2);
        
        for (let y = halfKernel; y < height - halfKernel; y++) {
            for (let x = halfKernel; x < width - halfKernel; x++) {
                const idx = y * width + x;
                const centerValue = grayscale[idx];
                
                // Calculate local statistics
                let sum = 0;
                let sumSquared = 0;
                let count = 0;
                
                for (let ky = -halfKernel; ky <= halfKernel; ky++) {
                    for (let kx = -halfKernel; kx <= halfKernel; kx++) {
                        const nx = x + kx;
                        const ny = y + ky;
                        const nidx = ny * width + nx;
                        const value = grayscale[nidx];
                        
                        sum += value;
                        sumSquared += value * value;
                        count++;
                    }
                }
                
                const mean = sum / count;
                const variance = (sumSquared / count) - (mean * mean);
                const stdDev = Math.sqrt(variance);
                
                // Calculate edge strength
                const edgeStrength = Math.abs(centerValue - mean) / stdDev;
                const isEdge = edgeStrength > edgePreservation;
                
                // Apply adaptive filtering
                if (isEdge) {
                    // Preserve edge
                    enhanced[idx] = centerValue;
                } else {
                    // Apply noise reduction
                    const weight = 1 - (noiseReduction * (1 - edgeStrength));
                    enhanced[idx] = Math.round(centerValue * weight + mean * (1 - weight));
                }
            }
        }
        
        return enhanced;
    }

    static computeAdaptiveThreshold(grayscale, width, height) {
        const enhanced = new Uint8ClampedArray(grayscale);
        const blockSize = 11;
        const C = 2;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = y * width + x;
                
                // Calculate local mean
                let sum = 0;
                let count = 0;
                const halfBlock = Math.floor(blockSize / 2);
                
                for (let ky = -halfBlock; ky <= halfBlock; ky++) {
                    for (let kx = -halfBlock; kx <= halfBlock; kx++) {
                        const nx = x + kx;
                        const ny = y + ky;
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            sum += grayscale[ny * width + nx];
                            count++;
                        }
                    }
                }
                
                const mean = sum / count;
                enhanced[idx] = grayscale[idx] > (mean - C) ? 255 : 0;
            }
        }
        
        return enhanced;
    }

    static adaptiveGaussianBlur(grayscale, width, height, isDarkScene) {
        const enhanced = new Uint8ClampedArray(grayscale);
        const kernelSize = isDarkScene ? 5 : 3;
        const halfKernel = Math.floor(kernelSize / 2);
        const sigma = isDarkScene ? 1.5 : 1.0;
        
        // Precompute Gaussian kernel
        const kernel = [];
        let sum = 0;
        for (let y = -halfKernel; y <= halfKernel; y++) {
            for (let x = -halfKernel; x <= halfKernel; x++) {
                const value = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
                kernel.push(value);
                sum += value;
            }
        }
        
        // Normalize kernel
        for (let i = 0; i < kernel.length; i++) {
            kernel[i] /= sum;
        }
        
        // Apply Gaussian blur
        for (let y = halfKernel; y < height - halfKernel; y++) {
            for (let x = halfKernel; x < width - halfKernel; x++) {
                const idx = y * width + x;
                let sum = 0;
                let kernelIdx = 0;
                
                for (let ky = -halfKernel; ky <= halfKernel; ky++) {
                    for (let kx = -halfKernel; kx <= halfKernel; kx++) {
                        const nx = x + kx;
                        const ny = y + ky;
                        sum += grayscale[ny * width + nx] * kernel[kernelIdx++];
                    }
                }
                
                enhanced[idx] = Math.round(sum);
            }
        }
        
        return enhanced;
    }

    static enhancedNonMaxSuppression(gradientMagnitude, gradientDirection, width, height) {
        const enhanced = new Float32Array(gradientMagnitude);
        const angleStep = Math.PI / 8;
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = y * width + x;
                const angle = gradientDirection[idx];
                const magnitude = gradientMagnitude[idx];
                
                // Quantize angle to nearest 45 degrees
                const quantizedAngle = Math.round(angle / angleStep) * angleStep;
                
                // Determine neighbors to compare
                let nx1, ny1, nx2, ny2;
                if (Math.abs(quantizedAngle) < angleStep || Math.abs(quantizedAngle - Math.PI) < angleStep) {
                    // Horizontal
                    nx1 = x - 1; ny1 = y;
                    nx2 = x + 1; ny2 = y;
                } else if (Math.abs(quantizedAngle - Math.PI/2) < angleStep) {
                    // Vertical
                    nx1 = x; ny1 = y - 1;
                    nx2 = x; ny2 = y + 1;
                } else if (Math.abs(quantizedAngle - Math.PI/4) < angleStep) {
                    // Diagonal 45
                    nx1 = x - 1; ny1 = y - 1;
                    nx2 = x + 1; ny2 = y + 1;
                } else {
                    // Diagonal 135
                    nx1 = x - 1; ny1 = y + 1;
                    nx2 = x + 1; ny2 = y - 1;
                }
                
                // Suppress non-maximum values
                const mag1 = gradientMagnitude[ny1 * width + nx1];
                const mag2 = gradientMagnitude[ny2 * width + nx2];
                
                if (magnitude < mag1 || magnitude < mag2) {
                    enhanced[idx] = 0;
                }
            }
        }
        
        return enhanced;
    }

    static traceEdge(x, y, suppressed, lowThreshold, width, height, visited, edges) {
        const stack = [[x, y]];
        const currentEdge = [];
        
        while (stack.length > 0) {
            const [cx, cy] = stack.pop();
            const idx = cy * width + cx;
            
            if (visited.has(idx)) continue;
            visited.add(idx);
            
            if (suppressed[idx] >= lowThreshold) {
                currentEdge.push({ x: cx, y: cy });
                
                // Check 8-connected neighbors
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        if (kx === 0 && ky === 0) continue;
                        
                        const nx = cx + kx;
                        const ny = cy + ky;
                        
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            const nidx = ny * width + nx;
                            if (!visited.has(nidx) && suppressed[nidx] >= lowThreshold) {
                                stack.push([nx, ny]);
                            }
                        }
                    }
                }
            }
        }
        
        if (currentEdge.length > 0) {
            edges.push(currentEdge);
        }
    }

    static groupEdgesIntoSegments(edges) {
        const segments = [];
        const visited = new Set();
        
        // Process each edge
        for (let i = 0; i < edges.length; i++) {
            if (visited.has(i)) continue;
            
            const currentEdge = edges[i];
            const segment = {
                points: [...currentEdge],
                length: this.calculateSegmentLength(currentEdge),
                angle: this.calculateSegmentAngle(currentEdge)
            };
            
            visited.add(i);
            
            // Look for connecting edges
            for (let j = 0; j < edges.length; j++) {
                if (visited.has(j)) continue;
                
                const otherEdge = edges[j];
                if (this.areEdgesConnected(segment, otherEdge)) {
                    // Merge edges
                    segment.points.push(...otherEdge);
                    segment.length = this.calculateSegmentLength(segment.points);
                    segment.angle = this.calculateSegmentAngle(segment.points);
                    visited.add(j);
                }
            }
            
            segments.push(segment);
        }
        
        return segments;
    }

    static calculateSegmentLength(points) {
        let length = 0;
        for (let i = 1; i < points.length; i++) {
            const dx = points[i].x - points[i-1].x;
            const dy = points[i].y - points[i-1].y;
            length += Math.sqrt(dx * dx + dy * dy);
        }
        return length;
    }

    static calculateSegmentAngle(points) {
        if (points.length < 2) return 0;
        
        // Use first and last point for primary direction
        const dx = points[points.length - 1].x - points[0].x;
        const dy = points[points.length - 1].y - points[0].y;
        return Math.atan2(dy, dx);
    }

    static areEdgesConnected(segment, edge) {
        const threshold = 5; // pixels
        const segmentPoints = segment.points || segment;
        
        // Check if any points are close enough
        for (const point1 of segmentPoints) {
            for (const point2 of edge) {
                const dx = point1.x - point2.x;
                const dy = point1.y - point2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < threshold) {
                    return true;
                }
            }
        }
        
        return false;
    }

    static filterDecorativeElements(segments) {
        return segments.filter(segment => {
            // Calculate segment properties
            const length = segment.length;
            const pointCount = segment.points.length;
            const density = pointCount / length;
            
            // Filter out segments that are too short or too dense
            if (length < 20 || density > 0.5) {
                return false;
            }
            
            // Check for regular patterns that might indicate decoration
            const patterns = this.analyzePatternRegularity(segment.points);
            if (patterns.isRegular) {
                return false;
            }
            
            return true;
        });
    }

    static analyzePatternRegularity(points) {
        const distances = [];
        const angles = [];
        
        // Calculate point-to-point distances and angles
        for (let i = 1; i < points.length; i++) {
            const dx = points[i].x - points[i-1].x;
            const dy = points[i].y - points[i-1].y;
            distances.push(Math.sqrt(dx * dx + dy * dy));
            angles.push(Math.atan2(dy, dx));
        }
        
        // Analyze distance regularity
        const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
        const distanceVariance = distances.reduce((acc, d) => acc + Math.pow(d - avgDistance, 2), 0) / distances.length;
        
        // Analyze angle regularity
        const angleVariance = this.calculateAngleVariance(angles);
        
        return {
            isRegular: distanceVariance < 2 && angleVariance < 0.1,
            distanceVariance,
            angleVariance
        };
    }

    static calculateAngleVariance(angles) {
        // Normalize angles to [0, PI]
        const normalizedAngles = angles.map(a => ((a % Math.PI) + Math.PI) % Math.PI);
        
        // Calculate mean angle
        const sumX = normalizedAngles.reduce((acc, a) => acc + Math.cos(2 * a), 0);
        const sumY = normalizedAngles.reduce((acc, a) => acc + Math.sin(2 * a), 0);
        const meanAngle = Math.atan2(sumY, sumX) / 2;
        
        // Calculate circular variance
        return 1 - Math.sqrt(sumX * sumX + sumY * sumY) / angles.length;
    }

    static analyzeWallRelevance(segments, threshold) {
        return segments.map(segment => {
            // Calculate basic metrics
            const length = segment.length;
            const straightness = this.calculateStraightness(segment.points);
            const continuity = this.calculateContinuity(segment.points);
            
            // Calculate relevance score
            const relevanceScore = (
                (length * 0.4) +
                (straightness * 0.3) +
                (continuity * 0.3)
            ) / (0.4 + 0.3 + 0.3);
            
            return {
                ...segment,
                relevanceScore,
                isRelevant: relevanceScore >= threshold
            };
        }).filter(segment => segment.isRelevant);
    }

    static calculateStraightness(points) {
        if (points.length < 2) return 1;
        
        // Calculate end-to-end distance
        const dx = points[points.length - 1].x - points[0].x;
        const dy = points[points.length - 1].y - points[0].y;
        const endToEndDistance = Math.sqrt(dx * dx + dy * dy);
        
        // Calculate actual path length
        const pathLength = this.calculateSegmentLength(points);
        
        // Return ratio (1 = perfectly straight, < 1 = curved)
        return endToEndDistance / pathLength;
    }

    static calculateContinuity(points) {
        if (points.length < 3) return 1;
        
        let discontinuityCount = 0;
        const angleThreshold = Math.PI / 8; // 22.5 degrees
        
        // Check for sharp angles
        for (let i = 1; i < points.length - 1; i++) {
            const angle1 = Math.atan2(
                points[i].y - points[i-1].y,
                points[i].x - points[i-1].x
            );
            const angle2 = Math.atan2(
                points[i+1].y - points[i].y,
                points[i+1].x - points[i].x
            );
            
            const angleDiff = Math.abs(angle2 - angle1);
            if (angleDiff > angleThreshold && angleDiff < Math.PI - angleThreshold) {
                discontinuityCount++;
            }
        }
        
        // Return continuity score (1 = perfectly continuous, 0 = very discontinuous)
        return Math.max(0, 1 - (discontinuityCount / points.length));
    }

    static mergeWallSegments(segments, options) {
        const { minLength = 20, continuityPreference = 0.75 } = options;
        const walls = [];
        const visited = new Set();
        
        // Sort segments by length (process longer segments first)
        segments.sort((a, b) => b.length - a.length);
        
        for (let i = 0; i < segments.length; i++) {
            if (visited.has(i)) continue;
            
            const segment = segments[i];
            if (segment.length < minLength) continue;
            
            const wall = {
                start: segment.points[0],
                end: segment.points[segment.points.length - 1],
                length: segment.length
            };
            
            visited.add(i);
            
            // Look for connecting segments
            let modified;
            do {
                modified = false;
                
                for (let j = 0; j < segments.length; j++) {
                    if (visited.has(j)) continue;
                    
                    const otherSegment = segments[j];
                    if (this.canMergeWalls(wall, otherSegment, continuityPreference)) {
                        this.mergeWallWithSegment(wall, otherSegment);
                        visited.add(j);
                        modified = true;
                    }
                }
            } while (modified);
            
            walls.push(wall);
        }
        
        return walls;
    }

    static canMergeWalls(wall, segment, continuityPreference) {
        const threshold = 10; // pixels
        const angleThreshold = Math.PI / 6; // 30 degrees
        
        // Check distance between endpoints
        const d1 = this.pointDistance(wall.start, segment.points[0]);
        const d2 = this.pointDistance(wall.start, segment.points[segment.points.length - 1]);
        const d3 = this.pointDistance(wall.end, segment.points[0]);
        const d4 = this.pointDistance(wall.end, segment.points[segment.points.length - 1]);
        
        if (Math.min(d1, d2, d3, d4) > threshold) {
            return false;
        }
        
        // Check angle between segments
        const wallAngle = Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x);
        const segmentAngle = this.calculateSegmentAngle(segment.points);
        const angleDiff = Math.abs(wallAngle - segmentAngle) % Math.PI;
        
        return angleDiff < angleThreshold || angleDiff > Math.PI - angleThreshold;
    }

    static mergeWallWithSegment(wall, segment) {
        const points = [...segment.points];
        const d1 = this.pointDistance(wall.start, points[0]);
        const d2 = this.pointDistance(wall.start, points[points.length - 1]);
        
        // Determine which end of the wall to connect to
        if (d1 < d2) {
            if (this.pointDistance(wall.start, points[0]) < this.pointDistance(wall.end, points[0])) {
                wall.start = points[points.length - 1];
            } else {
                wall.end = points[points.length - 1];
            }
        } else {
            if (this.pointDistance(wall.start, points[points.length - 1]) < this.pointDistance(wall.end, points[points.length - 1])) {
                wall.start = points[0];
            } else {
                wall.end = points[0];
            }
        }
        
        // Update wall length
        wall.length = this.pointDistance(wall.start, wall.end);
    }

    static pointDistance(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

Hooks.once('init', () => {
    WallMaker.initialize();
}); 