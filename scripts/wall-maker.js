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
        IGNORE_DECORATIVE: 'ignoreDecorative',
        CLIP_LIMIT: 'clipLimit',
        TILE_SIZE: 'tileSize'
    };

    static initialize() {
        this.registerSettings();
        this.registerHooks();
    }

    static registerSettings() {
        // Wall type choices for v12
        const wallTypeChoices = {
            "regular": "WALLS.TypeRegular",
            "ethereal": "WALLS.TypeEthereal",
            "invisible": "WALLS.TypeInvisible",
            "terrain": "WALLS.TypeTerrain",
            "sound": "WALLS.TypeSound",
            "door": "WALLS.TypeDoor"
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
            default: "regular"
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

        game.settings.register(this.ID, this.SETTINGS.CLIP_LIMIT, {
            name: "Clip Limit",
            hint: "Clip limit for histogram equalization",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 0,
                max: 4,
                step: 0.1
            },
            default: 2.0
        });

        game.settings.register(this.ID, this.SETTINGS.TILE_SIZE, {
            name: "Tile Size",
            hint: "Tile size for histogram equalization",
            scope: "world",
            config: true,
            type: Number,
            range: {
                min: 4,
                max: 16,
                step: 1
            },
            default: 8
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
        const currentScene = game.scenes.current;
        if (!currentScene) {
            ui.notifications.error("No active scene!");
            return;
        }

        const texturePath = currentScene.background?.src || currentScene.img;
        if (!texturePath) {
            ui.notifications.error("Scene has no background image!");
            return;
        }

        const progressBar = new this.ProgressBar({
            label: "Wall Maker",
            psteps: 5
        });

        try {
            progressBar.advance("Loading scene image...");
            const imageData = await this.loadSceneImage(texturePath);
            
            // Optimize image size for processing
            const maxDimension = 2000; // Maximum dimension for processing
            const scale = Math.min(1, maxDimension / Math.max(imageData.width, imageData.height));
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = imageData.width * scale;
            canvas.height = imageData.height * scale;
            ctx.putImageData(imageData, 0, 0);
            const scaledImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            progressBar.advance("Detecting edges...");
            const edges = await this.detectEdges(scaledImageData);

            progressBar.advance("Analyzing wall segments...");
            const walls = this.convertEdgesToWalls(edges);

            progressBar.advance("Creating walls...");
            await this.createWalls(walls, currentScene);

            progressBar.advance("Finalizing...");
            ui.notifications.notify("Walls created successfully!");
        } catch (error) {
            console.error("Wall Maker Error:", error);
            ui.notifications.error("An error occurred while creating walls. Check console for details.");
        } finally {
            progressBar.close();
        }
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
            
            img.onload = () => {
                // Create a canvas to ensure we have valid image data
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                try {
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    resolve(imageData);
                } catch (error) {
                    reject(new Error('Failed to get image data: ' + error.message));
                }
            };
            
            img.onerror = (error) => {
                reject(new Error('Failed to load image: ' + error.message));
            };
            
            try {
                img.src = src;
            } catch (error) {
                reject(new Error('Invalid image source: ' + error.message));
            }
        });
    }

    static async detectEdges(imageData, options = {}) {
        if (!imageData || !imageData.data || !imageData.width || !imageData.height) {
            throw new Error('WALL_MAKER_INVALID_IMAGE_DATA: Invalid image data provided. Must have valid data, width, and height.');
        }

        try {
            // Initialize WebGL context
            const canvas = document.createElement('canvas');
            canvas.width = imageData.width;
            canvas.height = imageData.height;
            const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
            
            if (!gl) {
                console.warn('WALL_MAKER_WEBGL_UNAVAILABLE: WebGL2 not available, falling back to CPU edge detection');
                return this.processEdgesCPU(imageData, options);
            }

            // Compile shaders
            const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, this.vertexShaderSource);
            const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, this.fragmentShaderSource);
            
            if (!vertexShader || !fragmentShader) {
                throw new Error('WALL_MAKER_SHADER_COMPILE_ERROR: Failed to compile shaders. Check shader source code.');
            }

            // Create and link program
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                throw new Error('WALL_MAKER_PROGRAM_LINK_ERROR: Failed to link shader program. Check shader compatibility.');
            }

            // Clean up WebGL resources
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteProgram(program);
            canvas.remove();

            return this.processEdgesCPU(imageData, options);
        } catch (error) {
            console.error('WALL_MAKER_EDGE_DETECTION_ERROR:', error);
            return this.processEdgesCPU(imageData, options);
        }
    }

    static processEdgesCPU(imageData, options = {}) {
        if (!imageData || !imageData.data || !imageData.width || !imageData.height) {
            throw new Error('WALL_MAKER_INVALID_IMAGE_DATA: Invalid image data provided. Must have valid data, width, and height.');
        }

        const { width, height } = imageData;
        const pixels = new Uint8Array(imageData.data);
        const edges = new Uint8Array(width * height);
        
        try {
            // Convert to grayscale with weighted RGB values
            const grayscale = new Uint8Array(width * height);
            for (let i = 0; i < pixels.length; i += 4) {
                grayscale[i / 4] = Math.round(
                    0.299 * pixels[i] +     // Red
                    0.587 * pixels[i + 1] + // Green
                    0.114 * pixels[i + 2]   // Blue
                );
            }

            // Apply Sobel operator
            const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
            const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    let gx = 0;
                    let gy = 0;

                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const idx = (y + ky) * width + (x + kx);
                            const weight = grayscale[idx];
                            gx += weight * sobelX[(ky + 1) * 3 + (kx + 1)];
                            gy += weight * sobelY[(ky + 1) * 3 + (kx + 1)];
                        }
                    }

                    const magnitude = Math.sqrt(gx * gx + gy * gy);
                    edges[y * width + x] = Math.min(255, magnitude);
                }
            }

            return edges;
        } catch (error) {
            console.error('WALL_MAKER_CPU_EDGE_DETECTION_ERROR:', error);
            throw new Error('WALL_MAKER_CPU_EDGE_DETECTION_ERROR: Failed to process edges on CPU. ' + error.message);
        }
    }

    static analyzeAdvancedPatterns(points) {
        if (!points || !Array.isArray(points) || points.length < 3) {
            throw new Error('WALL_MAKER_INVALID_POINTS: Invalid points array provided. Must be an array with at least 3 points.');
        }

        try {
            const patterns = {
                geometric: this.detectGeometricPatterns(points),
                structural: this.analyzeStructuralPatterns(points),
                spatial: this.analyzeSpatialDistribution(points)
            };

            return {
                patterns,
                confidence: this.calculatePatternConfidence(patterns),
                metadata: {
                    pointCount: points.length,
                    bounds: this.getSegmentBounds(points),
                    timestamp: Date.now()
                }
            };
        } catch (error) {
            console.error('WALL_MAKER_PATTERN_ANALYSIS_ERROR:', error);
            return {
                patterns: {},
                confidence: 0,
                metadata: {
                    error: {
                        code: 'WALL_MAKER_PATTERN_ANALYSIS_ERROR',
                        message: error.message,
                        timestamp: Date.now()
                    }
                }
            };
        }
    }

    static enhancePixel(gray, localHist, cumulativeHist, totalPixels) {
        const bin = Math.floor(gray);
        const localCDF = localHist.slice(0, bin + 1).reduce((sum, val) => sum + val, 0);
        const globalCDF = cumulativeHist[bin];
        const localMax = localHist.reduce((max, val) => Math.max(max, val), 0);
        const globalMax = cumulativeHist[255];
        
        // Combine local and global enhancement
        const localEnhanced = (localCDF / localMax) * 255;
        const globalEnhanced = (globalCDF / globalMax) * 255;
        
        return (localEnhanced * 0.7 + globalEnhanced * 0.3);
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

    static getSegmentBounds(points) {
        if (!points || points.length === 0) {
            return { x: 0, y: 0, width: 0, height: 0 };
        }

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const point of points) {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        }

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
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

        const midX = (bounds.x + bounds.width) / 2;
        const midY = (bounds.y + bounds.height) / 2;
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
                    x: bounds.x,
                    y: bounds.y,
                    width: midX - bounds.x,
                    height: midY - bounds.y
                }, depth + 1, maxDepth),
                ne: this.buildQuadtree(subPoints.ne, {
                    x: midX,
                    y: bounds.y,
                    width: bounds.width - (midX - bounds.x),
                    height: midY - bounds.y
                }, depth + 1, maxDepth),
                sw: this.buildQuadtree(subPoints.sw, {
                    x: bounds.x,
                    y: midY,
                    width: midX - bounds.x,
                    height: bounds.height - (midY - bounds.y)
                }, depth + 1, maxDepth),
                se: this.buildQuadtree(subPoints.se, {
                    x: midX,
                    y: midY,
                    width: bounds.width - (midX - bounds.x),
                    height: bounds.height - (midY - bounds.y)
                }, depth + 1, maxDepth)
            };
        } else {
            node.points = points;
        }

        return node;
    }

    static analyzeSpatialDistribution(points) {
        // Analyze point distribution using quadtree partitioning
        const bounds = WallMaker.getSegmentBounds(points);
        const quadtree = WallMaker.buildQuadtree(points, bounds);
        
        return {
            uniformity: WallMaker.calculateDistributionUniformity(quadtree),
            density: WallMaker.calculateSpatialDensity(quadtree),
            clustering: WallMaker.analyzeClustering(points)
        };
    }

    static calculateDistributionUniformity(quadtree) {
        if (!quadtree.children) {
            return 1.0; // Leaf node is perfectly uniform
        }

        const childUniformities = Object.values(quadtree.children)
            .map(child => WallMaker.calculateDistributionUniformity(child));
        
        const avgUniformity = childUniformities.reduce((a, b) => a + b, 0) / childUniformities.length;
        
        // Consider the distribution of points across children
        const totalPoints = Object.values(quadtree.children)
            .reduce((sum, child) => sum + (child.points ? child.points.length : 0), 0);
        
        const pointDistribution = Object.values(quadtree.children)
            .map(child => (child.points ? child.points.length : 0) / totalPoints);
        
        const distributionVariance = pointDistribution.reduce((sum, p) => 
            sum + Math.pow(p - 0.25, 2), 0) / 4;
        
        return avgUniformity * (1 - distributionVariance);
    }

    static calculateSpatialDensity(quadtree) {
        if (!quadtree.children) {
            const area = quadtree.bounds.width * quadtree.bounds.height;
            return area > 0 ? (quadtree.points.length / area) : 0;
        }

        const childDensities = Object.values(quadtree.children)
            .map(child => WallMaker.calculateSpatialDensity(child));
        
        return childDensities.reduce((a, b) => a + b, 0) / childDensities.length;
    }

    static analyzeClustering(points) {
        if (points.length < 2) return { clusters: [], density: 0 };

        const clusters = [];
        const visited = new Set();
        const threshold = 10; // pixels

        for (let i = 0; i < points.length; i++) {
            if (visited.has(i)) continue;

            const cluster = [points[i]];
            visited.add(i);

            // Find all points within threshold distance
            for (let j = 0; j < points.length; j++) {
                if (visited.has(j)) continue;

                const distance = this.pointDistance(points[i], points[j]);
                if (distance <= threshold) {
                    cluster.push(points[j]);
                    visited.add(j);
                }
            }

            if (cluster.length > 1) {
                clusters.push(cluster);
            }
        }

        // Calculate average cluster density
        const density = clusters.reduce((sum, cluster) => {
            const area = Math.PI * Math.pow(threshold, 2);
            return sum + (cluster.length / area);
        }, 0) / Math.max(1, clusters.length);

        return { clusters, density };
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
        if (!segments || !Array.isArray(segments)) {
            return {
                primaryDirections: [],
                groupedSegments: [],
                junctions: new Map(),
                rooms: [],
                scoredSegments: []
            };
        }

        try {
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
        } catch (error) {
            console.error('Error in structural pattern analysis:', error);
            return {
                primaryDirections: [],
                groupedSegments: [],
                junctions: new Map(),
                rooms: [],
                scoredSegments: []
            };
        }
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
        const BATCH_SIZE = 100; // Process walls in batches to prevent memory issues
        
        // Prepare wall data in batches
        const wallBatches = [];
        for (let i = 0; i < walls.length; i += BATCH_SIZE) {
            const batch = walls.slice(i, i + BATCH_SIZE).map(wall => {
                const baseData = {
                    c: [
                        wall.start.x,
                        wall.start.y,
                        wall.end.x,
                        wall.end.y
                    ],
                    type: wallType,
                    light: CONST.WALL_SENSE_TYPES.NORMAL,
                    sight: CONST.WALL_SENSE_TYPES.NORMAL,
                    sound: CONST.WALL_SENSE_TYPES.NORMAL,
                    move: CONST.WALL_MOVEMENT_TYPES.NORMAL,
                    dir: CONST.WALL_DIRECTIONS.BOTH
                };

                if (wallType === "door") {
                    baseData.ds = CONST.WALL_DOOR_STATES.CLOSED;
                }

                return baseData;
            });
            wallBatches.push(batch);
        }

        try {
            // Process batches in parallel with a concurrency limit
            const CONCURRENCY_LIMIT = 3;
            const results = [];
            
            for (let i = 0; i < wallBatches.length; i += CONCURRENCY_LIMIT) {
                const batchPromises = wallBatches
                    .slice(i, i + CONCURRENCY_LIMIT)
                    .map(batch => scene.walls.createDocuments(batch));
                
                const batchResults = await Promise.all(batchPromises);
                results.push(...batchResults);
            }

            ui.notifications.info(`Created ${walls.length} walls!`);
        } catch (error) {
            console.error("Wall Maker | Error creating walls:", error);
            ui.notifications.error("Error creating walls. Check the console for details.");
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

    // Add ProgressBar class
    static ProgressBar = class {
        constructor({label, psteps}) {
            this.label = label;
            this.psteps = psteps;
            this.currentStep = 0;
            this.element = null;
            this.initialize();
        }

        initialize() {
            // Clean up any existing progress bars
            const existingBars = document.querySelectorAll('.wall-maker-progress');
            existingBars.forEach(bar => bar.remove());

            // Create new progress bar
            const div = document.createElement("div");
            div.className = "wall-maker-progress";
            div.innerHTML = `
                <div class="progress-label">${this.label}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <div class="progress-text">Starting...</div>
            `;

            // Ensure the progress bar is added to Foundry's UI layer
            const uiTop = document.getElementById('ui-top');
            if (uiTop) {
                uiTop.appendChild(div);
            } else {
                document.body.appendChild(div);
            }
            this.element = div;

            // Force layout recalculation
            void this.element.offsetHeight;
        }

        advance(message) {
            if (!this.element) return;
            
            this.currentStep++;
            const percent = Math.min(100, Math.round((this.currentStep / this.psteps) * 100));
            
            const fill = this.element.querySelector('.progress-fill');
            const text = this.element.querySelector('.progress-text');
            
            if (fill && text) {
                fill.style.width = `${percent}%`;
                text.textContent = `${message} (${percent}%)`;
            }
        }

        close() {
            if (!this.element) return;
            
            this.element.style.opacity = '0';
            
            setTimeout(() => {
                if (this.element && this.element.parentNode) {
                    this.element.remove();
                }
            }, 300);
        }
    };

    static analyzeTextureDensity(points) {
        if (!points || points.length < 2) return 0;

        // Calculate average distance between points
        let totalDistance = 0;
        let count = 0;
        
        for (let i = 0; i < points.length - 1; i++) {
            for (let j = i + 1; j < points.length; j++) {
                totalDistance += this.pointDistance(points[i], points[j]);
                count++;
            }
        }

        const avgDistance = totalDistance / count;
        
        // Calculate area covered by points
        const bounds = this.getSegmentBounds(points);
        const area = bounds.width * bounds.height;
        
        // Return density measure (lower value = more dense)
        return area > 0 ? (avgDistance / Math.sqrt(area)) : 0;
    }

    static analyzeScaleInvariantFeatures(points) {
        if (!points || points.length < 3) return {};

        // Calculate relative distances and angles
        const features = [];
        const center = {
            x: points.reduce((sum, p) => sum + p.x, 0) / points.length,
            y: points.reduce((sum, p) => sum + p.y, 0) / points.length
        };

        // Calculate features relative to center
        for (const point of points) {
            const dx = point.x - center.x;
            const dy = point.y - center.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            
            features.push({
                distance,
                angle,
                relativeX: dx / distance,
                relativeY: dy / distance
            });
        }

        // Calculate feature statistics
        const distances = features.map(f => f.distance);
        const angles = features.map(f => f.angle);
        
        const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
        const distanceVariance = distances.reduce((sum, d) => 
            sum + Math.pow(d - avgDistance, 2), 0) / distances.length;
        
        return {
            features,
            avgDistance,
            distanceVariance,
            angleVariance: this.calculateAngleVariance(angles)
        };
    }

    static isValidRoom(room) {
        if (!room || !room.corners || room.corners.length < 3) return false;
        
        // Check if room is closed (first and last corners are the same)
        if (room.corners[0] !== room.corners[room.corners.length - 1]) return false;
        
        // Check if room has a reasonable area
        if (room.area < 100) return false; // Minimum area threshold
        
        // Check if room has reasonable proportions
        const bounds = this.getSegmentBounds(room.corners.map(c => c.point));
        const aspectRatio = bounds.width / bounds.height;
        if (aspectRatio < 0.2 || aspectRatio > 5) return false;
        
        return true;
    }

    static findNextRoomConnection(currentJunction, previousSegment, room) {
        if (!currentJunction || !currentJunction.segments) return null;
        
        const segments = Array.from(currentJunction.segments);
        let bestSegment = null;
        let bestJunction = null;
        let minAngleDiff = Math.PI;
        
        for (const segment of segments) {
            if (segment === previousSegment) continue;
            
            const otherJunction = this.getOtherJunction(segment, currentJunction);
            if (!otherJunction) continue;
            
            const angleDiff = this.calculateAngleDifference(
                previousSegment ? this.getSegmentAngle(previousSegment) : null,
                this.getSegmentAngle(segment)
            );
            
            if (angleDiff < minAngleDiff) {
                minAngleDiff = angleDiff;
                bestSegment = segment;
                bestJunction = otherJunction;
            }
        }
        
        return bestSegment ? { segment: bestSegment, junction: bestJunction } : null;
    }

    static calculatePolygonArea(points) {
        if (!points || points.length < 3) return 0;
        
        let area = 0;
        for (let i = 0; i < points.length; i++) {
            const j = (i + 1) % points.length;
            area += points[i].x * points[j].y;
            area -= points[j].x * points[i].y;
        }
        
        return Math.abs(area) / 2;
    }

    static groupSegmentsByDirection(segments, directions) {
        if (!segments || !directions || directions.length === 0) return [];
        
        const grouped = directions.map(() => []);
        const angleThreshold = Math.PI / 16; // 11.25 degrees
        
        for (const segment of segments) {
            const angle = this.calculateSegmentAngle(segment);
            
            // Find closest direction
            let minDiff = Math.PI;
            let bestIndex = 0;
            
            for (let i = 0; i < directions.length; i++) {
                const diff = this.calculateAngleDifference(angle, directions[i]);
                if (diff < minDiff) {
                    minDiff = diff;
                    bestIndex = i;
                }
            }
            
            if (minDiff < angleThreshold) {
                grouped[bestIndex].push(segment);
            }
        }
        
        return grouped;
    }

    static getOtherJunction(segment, junction) {
        if (!segment || !junction) {
            console.warn('WALL_MAKER_INVALID_JUNCTION: Invalid segment or junction provided');
            return null;
        }
        return segment.junction1 === junction ? segment.junction2 : segment.junction1;
    }

    static getSegmentAngle(segment) {
        if (!segment || !segment.points || segment.points.length < 2) {
            console.warn('WALL_MAKER_INVALID_SEGMENT: Invalid segment provided for angle calculation');
            return 0;
        }
        const dx = segment.points[1].x - segment.points[0].x;
        const dy = segment.points[1].y - segment.points[0].y;
        return Math.atan2(dy, dx);
    }

    static calculateAngleDifference(angle1, angle2) {
        if (angle1 === null) return 0;
        let diff = Math.abs(angle1 - angle2);
        return Math.min(diff, Math.PI * 2 - diff);
    }

    static calculatePatternConfidence(patterns) {
        if (!patterns) return 0;
        
        let confidence = 0;
        let weight = 0;
        
        // Geometric pattern confidence
        if (patterns.geometric) {
            const { lines, rectangles, regularShapes } = patterns.geometric;
            const geometricConfidence = (
                (lines?.length || 0) * 0.4 +
                (rectangles?.length || 0) * 0.3 +
                (regularShapes?.length || 0) * 0.3
            ) / Math.max(1, lines?.length + rectangles?.length + regularShapes?.length);
            confidence += geometricConfidence * 0.4;
            weight += 0.4;
        }
        
        // Structural pattern confidence
        if (patterns.structural) {
            const { scoredSegments, rooms } = patterns.structural;
            const structuralConfidence = (
                scoredSegments?.reduce((sum, s) => sum + s.structuralScore, 0) / Math.max(1, scoredSegments?.length) * 0.6 +
                (rooms?.length || 0) * 0.4
            );
            confidence += structuralConfidence * 0.4;
            weight += 0.4;
        }
        
        // Spatial pattern confidence
        if (patterns.spatial) {
            const { uniformity, density, clustering } = patterns.spatial;
            const spatialConfidence = (
                (uniformity || 0) * 0.4 +
                (density || 0) * 0.3 +
                (clustering?.density || 0) * 0.3
            );
            confidence += spatialConfidence * 0.2;
            weight += 0.2;
        }
        
        return weight > 0 ? confidence / weight : 0;
    }

    static isTexturePattern(patternFeatures) {
        if (!patternFeatures) return false;
        
        const { patterns, frequencies, periodicity } = patternFeatures;
        
        // Check for high frequency patterns
        const hasHighFrequency = Array.from(frequencies.values())
            .some(count => count > patterns.size * 0.3);
        
        // Check for regular periodicity
        const hasRegularPeriodicity = periodicity > 0.7;
        
        // Check for uniform distribution
        const hasUniformDistribution = this.calculateDistributionUniformity(patternFeatures) > 0.6;
        
        return hasHighFrequency || hasRegularPeriodicity || hasUniformDistribution;
    }

    static calculateShapeRegularity(angles) {
        if (!angles || angles.length < 2) return 0;
        
        // Calculate expected angle between points
        const expectedAngle = (Math.PI * 2) / angles.length;
        
        // Calculate angle differences
        const differences = angles.map((angle, i) => {
            const nextAngle = angles[(i + 1) % angles.length];
            return Math.abs(nextAngle - angle - expectedAngle);
        });
        
        // Calculate regularity score
        const maxDifference = Math.PI / 4; // 45 degrees
        const regularity = differences.reduce((sum, diff) => 
            sum + (1 - Math.min(diff, maxDifference) / maxDifference), 0) / differences.length;
        
        return regularity;
    }

    static findDominantFrequencies(frequencies) {
        if (!frequencies || frequencies.size === 0) return [];
        
        // Convert to array and sort by frequency
        const sortedFrequencies = Array.from(frequencies.entries())
            .sort((a, b) => b[1] - a[1]);
        
        // Find significant frequencies (more than 20% of max frequency)
        const maxFrequency = sortedFrequencies[0][1];
        const threshold = maxFrequency * 0.2;
        
        return sortedFrequencies
            .filter(([_, count]) => count >= threshold)
            .map(([distance]) => distance);
    }
}

Hooks.once('init', () => {
    WallMaker.initialize();
}); 