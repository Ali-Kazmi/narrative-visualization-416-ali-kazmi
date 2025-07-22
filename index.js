// The Electric Performance Revolution - Narrative Visualization
// CS 416 Project by Ali Kazmi
// Simplified version without external D3 dependency

class NarrativeVisualization {
    constructor() {
        this.state = {
            currentScene: 'scene1',
            parameters: {},
            data: null
        };
        this.scenes = ['scene1', 'scene2', 'scene3'];
        this.loadData();
        this.initializeEventListeners();
        setTimeout(() => this.updateNavigationControls(), 0);
    }

    async loadData() {
        try {
            const response = await fetch('electric_vehicles_spec_2025.csv');
            const csvText = await response.text();
            
            // Parse CSV manually
            const lines = csvText.split('\n');
            const headers = lines[0].split(',');
            
            const data = [];
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim()) {
                    const values = this.parseCSVLine(lines[i]);
                    if (values.length === headers.length) {
                        const row = {};
                        headers.forEach((header, index) => {
                            row[header.trim()] = values[index] ? values[index].trim() : '';
                        });
                        data.push(row);
                    }
                }
            }
            
            // Convert to our format
            this.state.data = data.map(d => ({
                brand: d.brand,
                model: d.model,
                topSpeed: this.parseNumber(d.top_speed_kmh),
                batteryCapacity: this.parseNumber(d.battery_capacity_kWh),
                torque: this.parseNumber(d.torque_nm),
                efficiency: this.parseNumber(d.efficiency_wh_per_km),
                range: this.parseNumber(d.range_km),
                acceleration: this.parseNumber(d.acceleration_0_100_s),
                fastCharging: this.parseNumber(d.fast_charging_power_kw_dc),
                towingCapacity: this.parseNumber(d.towing_capacity_kg),
                seats: this.parseNumber(d.seats),
                drivetrain: d.drivetrain,
                segment: d.segment,
                bodyType: d.car_body_type,
                length: this.parseNumber(d.length_mm),
                width: this.parseNumber(d.width_mm),
                height: this.parseNumber(d.height_mm)
            })).filter(d => 
                d.acceleration > 0 && 
                d.topSpeed > 0 && 
                d.range > 0 && 
                d.torque > 0
            );
            
            console.log(`Loaded ${this.state.data.length} valid EV records`);
            this.setupScene(this.state.currentScene);
        } catch (error) {
            console.error('Error loading data:', error);
            // Create sample data for demonstration
            this.createSampleData();
        }
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    }

    parseNumber(str) {
        const num = parseFloat(str);
        return isNaN(num) ? 0 : num;
    }

    createSampleData() {
        // Sample data based on the actual dataset for demonstration
        this.state.data = [
            { brand: 'Porsche', model: 'Taycan Turbo GT Weissach', acceleration: 2.2, topSpeed: 305, torque: 1340, range: 475, segment: 'F - Luxury', drivetrain: 'AWD' },
            { brand: 'Porsche', model: 'Taycan Turbo GT', acceleration: 2.3, topSpeed: 290, torque: 1340, range: 475, segment: 'F - Luxury', drivetrain: 'AWD' },
            { brand: 'Porsche', model: 'Taycan Turbo S', acceleration: 2.4, topSpeed: 260, torque: 1110, range: 525, segment: 'F - Luxury', drivetrain: 'AWD' },
            { brand: 'Lotus', model: 'Eletre R', acceleration: 2.9, topSpeed: 260, torque: 985, range: 455, segment: 'JF - Luxury', drivetrain: 'AWD' },
            { brand: 'Audi', model: 'e-tron GT RS', acceleration: 2.8, topSpeed: 250, torque: 865, range: 525, segment: 'F - Luxury', drivetrain: 'AWD' },
            { brand: 'Tesla', model: 'Model S Plaid', acceleration: 2.3, topSpeed: 282, torque: 0, range: 560, segment: 'F - Luxury', drivetrain: 'AWD' },
            { brand: 'BMW', model: 'i7 M70 xDrive', acceleration: 3.7, topSpeed: 250, torque: 1100, range: 490, segment: 'F - Luxury', drivetrain: 'AWD' },
            { brand: 'Mercedes-Benz', model: 'EQS AMG 53 4MATIC+', acceleration: 3.4, topSpeed: 250, torque: 1020, range: 585, segment: 'F - Luxury', drivetrain: 'AWD' },
            { brand: 'Lucid', model: 'Air Grand Touring', acceleration: 3.0, topSpeed: 270, torque: 1200, range: 665, segment: 'F - Luxury', drivetrain: 'AWD' },
            { brand: 'Tesla', model: 'Model 3 Performance', acceleration: 3.2, topSpeed: 262, torque: 741, range: 490, segment: 'D - Large', drivetrain: 'AWD' },
            { brand: 'Hyundai', model: 'IONIQ 5 N', acceleration: 3.4, topSpeed: 260, torque: 740, range: 390, segment: 'JC - Medium', drivetrain: 'AWD' },
            { brand: 'Kia', model: 'EV6 GT', acceleration: 3.5, topSpeed: 260, torque: 770, range: 385, segment: 'JC - Medium', drivetrain: 'AWD' },
            { brand: 'Genesis', model: 'GV60 Sport Plus', acceleration: 4.0, topSpeed: 235, torque: 700, range: 360, segment: 'JC - Medium', drivetrain: 'AWD' },
            { brand: 'Polestar', model: '4 Long Range Dual Motor', acceleration: 3.8, topSpeed: 200, torque: 686, range: 485, segment: 'E - Executive', drivetrain: 'AWD' },
            { brand: 'Volvo', model: 'EX30 Twin Motor Performance', acceleration: 3.6, topSpeed: 180, torque: 543, range: 340, segment: 'JB - Compact', drivetrain: 'AWD' }
        ];
        console.log('Using sample data for demonstration');
        this.setupScene(this.state.currentScene);
    }

    initializeEventListeners() {
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (event) => {
                const target = event.target;
                const sceneId = target.getAttribute('data-scene');
                if (sceneId) {
                    this.navigateToScene(sceneId);
                }
            });
        });

        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.navigateToPreviousScene();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.navigateToNextScene();
            });
        }
    }

    navigateToScene(sceneId) {
        // Hide current scene
        const currentSceneElement = document.getElementById(this.state.currentScene);
        if (currentSceneElement) {
            currentSceneElement.classList.remove('active');
        }

        // Remove active class from current tab
        const currentTab = document.querySelector(`[data-scene="${this.state.currentScene}"]`);
        if (currentTab) {
            currentTab.classList.remove('active');
        }

        // Show new scene
        const newSceneElement = document.getElementById(sceneId);
        if (newSceneElement) {
            newSceneElement.classList.add('active');
        }

        // Add active class to new tab
        const newTab = document.querySelector(`[data-scene="${sceneId}"]`);
        if (newTab) {
            newTab.classList.add('active');
        }

        // Update state
        this.state.currentScene = sceneId;
        this.updateNavigationControls();
        this.setupScene(sceneId);
    }

    navigateToPreviousScene() {
        const currentIndex = this.scenes.indexOf(this.state.currentScene);
        if (currentIndex > 0) {
            const previousScene = this.scenes[currentIndex - 1];
            this.navigateToScene(previousScene);
        }
    }

    navigateToNextScene() {
        const currentIndex = this.scenes.indexOf(this.state.currentScene);
        if (currentIndex < this.scenes.length - 1) {
            const nextScene = this.scenes[currentIndex + 1];
            this.navigateToScene(nextScene);
        }
    }

    updateNavigationControls() {
        const currentIndex = this.scenes.indexOf(this.state.currentScene);
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const sceneIndicator = document.querySelector('.scene-indicator');

        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
        }

        if (nextBtn) {
            nextBtn.disabled = currentIndex === this.scenes.length - 1;
        }

        if (sceneIndicator) {
            sceneIndicator.textContent = `Scene ${currentIndex + 1} of ${this.scenes.length}`;
        }
    }

    setupScene(sceneId) {
        if (!this.state.data) {
            console.log('Data not loaded yet, waiting...');
            return;
        }

        console.log(`Setting up ${sceneId}`);
        switch (sceneId) {
            case 'scene1':
                this.setupScene1();
                break;
            case 'scene2':
                this.setupScene2();
                break;
            case 'scene3':
                this.setupScene3();
                break;
        }
    }

    setupScene1() {
        // Scene 1: Breaking Stereotypes - Acceleration Performance
        console.log('Scene 1 setup - Breaking Stereotypes');
        this.updateParameters({ scene: 'breaking_stereotypes', step: 1 });
        
        const container = document.getElementById('scene1-viz');
        container.innerHTML = '';

        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 800 450');
        container.appendChild(svg);

        // Filter and sort data for top performers
        const performanceData = this.state.data
            .filter(d => d.acceleration < 8 && d.acceleration > 0)
            .sort((a, b) => a.acceleration - b.acceleration)
            .slice(0, 12);

        // Set up dimensions and scales
        const margin = { top: 50, right: 120, bottom: 80, left: 200 };
        const width = 800 - margin.left - margin.right;
        const height = 450 - margin.top - margin.bottom;

        // Create scales
        const maxAcceleration = Math.max(...performanceData.map(d => d.acceleration));
        const xScale = (value) => (value / (maxAcceleration + 0.5)) * width;
        const yScale = (index) => (index * (height / performanceData.length)) + (height / performanceData.length) * 0.1;
        const barHeight = (height / performanceData.length) * 0.8;

        // Color mapping
        const colorMap = {
            'F - Luxury': '#e74c3c',
            'G - Sports': '#f39c12',
            'E - Executive': '#9b59b6',
            'D - Large': '#3498db',
            'JE - Executive': '#1abc9c',
            'JD - Large': '#2ecc71',
            'JC - Medium': '#95a5a6',
            'JF - Luxury': '#e67e22'
        };

        // Create main group
        const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        mainGroup.setAttribute('transform', `translate(${margin.left}, ${margin.top})`);
        svg.appendChild(mainGroup);

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: absolute;
            background-color: rgba(0,0,0,0.9);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 13px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(tooltip);

        // Draw bars with animation
        performanceData.forEach((d, i) => {
            const barGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            
            // Create bar
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', '0');
            rect.setAttribute('y', yScale(i));
            rect.setAttribute('width', '0');
            rect.setAttribute('height', barHeight);
            rect.setAttribute('fill', colorMap[d.segment] || '#95a5a6');
            rect.setAttribute('opacity', '0.8');
            rect.setAttribute('rx', '4');
            rect.style.cursor = 'pointer';

            // Add hover effects
            rect.addEventListener('mouseenter', (event) => {
                rect.setAttribute('opacity', '1');
                rect.setAttribute('stroke', '#2c3e50');
                rect.setAttribute('stroke-width', '2');
                
                tooltip.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 8px;">${d.brand} ${d.model}</div>
                    <div><strong>Acceleration:</strong> ${d.acceleration}s (0-100 km/h)</div>
                    <div><strong>Top Speed:</strong> ${d.topSpeed} km/h</div>
                    <div><strong>Torque:</strong> ${d.torque} Nm</div>
                    <div><strong>Range:</strong> ${d.range} km</div>
                    <div><strong>Segment:</strong> ${d.segment}</div>
                    <div><strong>Drivetrain:</strong> ${d.drivetrain}</div>
                `;
                tooltip.style.opacity = '1';
                tooltip.style.left = (event.pageX + 15) + 'px';
                tooltip.style.top = (event.pageY - 10) + 'px';
            });

            rect.addEventListener('mouseleave', () => {
                rect.setAttribute('opacity', '0.8');
                rect.removeAttribute('stroke');
                tooltip.style.opacity = '0';
            });

            rect.addEventListener('mousemove', (event) => {
                tooltip.style.left = (event.pageX + 15) + 'px';
                tooltip.style.top = (event.pageY - 10) + 'px';
            });

            barGroup.appendChild(rect);

            // Add label
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', '-5');
            label.setAttribute('y', yScale(i) + barHeight / 2);
            label.setAttribute('dy', '0.35em');
            label.setAttribute('text-anchor', 'end');
            label.setAttribute('font-size', '11px');
            label.setAttribute('fill', '#2c3e50');
            label.setAttribute('font-weight', '500');
            label.textContent = this.truncateText(`${d.brand} ${d.model}`, 25);
            barGroup.appendChild(label);

            // Add value label
            const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            valueLabel.setAttribute('x', xScale(d.acceleration) + 5);
            valueLabel.setAttribute('y', yScale(i) + barHeight / 2);
            valueLabel.setAttribute('dy', '0.35em');
            valueLabel.setAttribute('font-size', '12px');
            valueLabel.setAttribute('font-weight', 'bold');
            valueLabel.setAttribute('fill', '#2c3e50');
            valueLabel.setAttribute('opacity', '0');
            valueLabel.textContent = `${d.acceleration}s`;
            barGroup.appendChild(valueLabel);

            mainGroup.appendChild(barGroup);

            // Animate bar
            setTimeout(() => {
                rect.style.transition = 'width 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                rect.setAttribute('width', xScale(d.acceleration));
                
                setTimeout(() => {
                    valueLabel.style.transition = 'opacity 0.8s';
                    valueLabel.setAttribute('opacity', '1');
                }, 600);
            }, i * 80);
        });

        // Add axes
        this.createAxis(mainGroup, width, height, maxAcceleration);

        // Add title
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', width / 2);
        title.setAttribute('y', -25);
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-size', '18px');
        title.setAttribute('font-weight', 'bold');
        title.setAttribute('fill', '#2c3e50');
        title.textContent = 'Top 12 Fastest Accelerating Electric Vehicles';
        mainGroup.appendChild(title);

        // Add legend
        this.createLegend(mainGroup, width, performanceData, colorMap);

        // Add annotations
        this.addAnnotations(mainGroup, performanceData, xScale, yScale, barHeight);
    }

    createAxis(group, width, height, maxAcceleration) {
        // X-axis
        const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        xAxis.setAttribute('transform', `translate(0, ${height})`);
        
        // X-axis line
        const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        xAxisLine.setAttribute('x1', '0');
        xAxisLine.setAttribute('y1', '0');
        xAxisLine.setAttribute('x2', width);
        xAxisLine.setAttribute('y2', '0');
        xAxisLine.setAttribute('stroke', '#333');
        xAxis.appendChild(xAxisLine);

        // X-axis ticks and labels
        for (let i = 0; i <= Math.ceil(maxAcceleration); i++) {
            const x = (i / (maxAcceleration + 0.5)) * width;
            
            const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            tick.setAttribute('x1', x);
            tick.setAttribute('y1', '0');
            tick.setAttribute('x2', x);
            tick.setAttribute('y2', '6');
            tick.setAttribute('stroke', '#333');
            xAxis.appendChild(tick);

            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', '20');
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('font-size', '12px');
            label.setAttribute('fill', '#2c3e50');
            label.textContent = i;
            xAxis.appendChild(label);
        }

        // X-axis title
        const xTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xTitle.setAttribute('x', width / 2);
        xTitle.setAttribute('y', '45');
        xTitle.setAttribute('text-anchor', 'middle');
        xTitle.setAttribute('font-size', '14px');
        xTitle.setAttribute('font-weight', 'bold');
        xTitle.setAttribute('fill', '#2c3e50');
        xTitle.textContent = 'Acceleration Time (0-100 km/h in seconds)';
        xAxis.appendChild(xTitle);

        group.appendChild(xAxis);
    }

    createLegend(group, width, data, colorMap) {
        const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        legend.setAttribute('transform', `translate(${width + 20}, 20)`);

        const segments = [...new Set(data.map(d => d.segment))];
        
        segments.forEach((segment, i) => {
            const legendItem = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            legendItem.setAttribute('transform', `translate(0, ${i * 25})`);

            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('width', '18');
            rect.setAttribute('height', '18');
            rect.setAttribute('rx', '3');
            rect.setAttribute('fill', colorMap[segment] || '#95a5a6');
            rect.setAttribute('opacity', '0.8');
            legendItem.appendChild(rect);

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', '25');
            text.setAttribute('y', '14');
            text.setAttribute('font-size', '11px');
            text.setAttribute('fill', '#2c3e50');
            text.setAttribute('font-weight', '500');
            text.textContent = segment;
            legendItem.appendChild(text);

            legend.appendChild(legendItem);
        });

        group.appendChild(legend);
    }

    addAnnotations(group, data, xScale, yScale, barHeight) {
        // Annotation for the fastest car
        const fastest = data[0];
        const annotation1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Arrow line
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', xScale(fastest.acceleration) + 5);
        line1.setAttribute('y1', yScale(0) + barHeight / 2);
        line1.setAttribute('x2', xScale(fastest.acceleration) + 100);
        line1.setAttribute('y2', yScale(0) + barHeight / 2 - 30);
        line1.setAttribute('stroke', '#e74c3c');
        line1.setAttribute('stroke-width', '2');
        annotation1.appendChild(line1);

        // Annotation text
        const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text1.setAttribute('x', xScale(fastest.acceleration) + 105);
        text1.setAttribute('y', yScale(0) + barHeight / 2 - 35);
        text1.setAttribute('font-size', '12px');
        text1.setAttribute('font-weight', 'bold');
        text1.setAttribute('fill', '#e74c3c');
        text1.textContent = 'Performance Leader';
        annotation1.appendChild(text1);

        const text2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text2.setAttribute('x', xScale(fastest.acceleration) + 105);
        text2.setAttribute('y', yScale(0) + barHeight / 2 - 20);
        text2.setAttribute('font-size', '11px');
        text2.setAttribute('fill', '#2c3e50');
        text2.textContent = 'Supercar-level acceleration';
        annotation1.appendChild(text2);

        group.appendChild(annotation1);
    }

    setupScene2() {
        // Scene 2: Range vs Performance Trade-offs
        console.log('Scene 2 setup - Range vs Performance');
        this.updateParameters({ scene: 'range_vs_performance', step: 2 });
        
        const container = document.getElementById('scene2-viz');
        container.innerHTML = '';

        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 800 450');
        container.appendChild(svg);

        // Filter data for scatter plot - only cars with good data
        const scatterData = this.state.data
            .filter(d => d.range > 200 && d.acceleration > 0 && d.acceleration < 10)
            .slice(0, 50); // Keep it simple with 50 cars

        // Simple scales - basic math
        const margin = { top: 50, right: 80, bottom: 80, left: 80 };
        const width = 800 - margin.left - margin.right;
        const height = 450 - margin.top - margin.bottom;

        const maxRange = Math.max(...scatterData.map(d => d.range));
        const maxAccel = Math.max(...scatterData.map(d => d.acceleration));
        
        // Basic scaling functions
        const xScale = (range) => (range / maxRange) * width;
        const yScale = (accel) => height - (accel / maxAccel) * height;

        // Create main group
        const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        mainGroup.setAttribute('transform', `translate(${margin.left}, ${margin.top})`);
        svg.appendChild(mainGroup);

        // Enhanced tooltip
        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: absolute;
            background-color: rgba(0,0,0,0.9);
            color: white;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 12px;
            pointer-events: none;
            opacity: 0;
            z-index: 1000;
            transition: opacity 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(tooltip);

        // Draw axes first (simple lines)
        const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        xAxis.setAttribute('x1', '0');
        xAxis.setAttribute('y1', height);
        xAxis.setAttribute('x2', width);
        xAxis.setAttribute('y2', height);
        xAxis.setAttribute('stroke', '#333');
        xAxis.setAttribute('stroke-width', '2');
        mainGroup.appendChild(xAxis);

        const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        yAxis.setAttribute('x1', '0');
        yAxis.setAttribute('y1', '0');
        yAxis.setAttribute('x2', '0');
        yAxis.setAttribute('y2', height);
        yAxis.setAttribute('stroke', '#333');
        yAxis.setAttribute('stroke-width', '2');
        mainGroup.appendChild(yAxis);

        // Add axis labels (simple)
        const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xLabel.setAttribute('x', width / 2);
        xLabel.setAttribute('y', height + 40);
        xLabel.setAttribute('text-anchor', 'middle');
        xLabel.setAttribute('font-size', '14px');
        xLabel.setAttribute('fill', '#333');
        xLabel.textContent = 'Range (km)';
        mainGroup.appendChild(xLabel);

        const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        yLabel.setAttribute('x', '-40');
        yLabel.setAttribute('y', height / 2);
        yLabel.setAttribute('text-anchor', 'middle');
        yLabel.setAttribute('font-size', '14px');
        yLabel.setAttribute('fill', '#333');
        yLabel.setAttribute('transform', `rotate(-90, -40, ${height / 2})`);
        yLabel.textContent = 'Acceleration (0-100 km/h)';
        mainGroup.appendChild(yLabel);

        // Add title
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', width / 2);
        title.setAttribute('y', -20);
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-size', '16px');
        title.setAttribute('font-weight', 'bold');
        title.setAttribute('fill', '#333');
        title.textContent = 'Range vs Acceleration Performance';
        mainGroup.appendChild(title);

        // Draw scatter points
        scatterData.forEach((d, i) => {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', xScale(d.range));
            circle.setAttribute('cy', yScale(d.acceleration));
            circle.setAttribute('r', '0');
            circle.setAttribute('fill', '#3498db');
            circle.setAttribute('opacity', '0.7');
            circle.setAttribute('stroke', '#2980b9');
            circle.setAttribute('stroke-width', '1');
            circle.style.cursor = 'pointer';

            // Simple hover effects
            circle.addEventListener('mouseenter', (event) => {
                circle.setAttribute('r', '8');
                circle.setAttribute('opacity', '1');
                
                tooltip.innerHTML = `
                    <div><strong>${d.brand} ${d.model}</strong></div>
                    <div>Range: ${d.range} km</div>
                    <div>0-100: ${d.acceleration}s</div>
                `;
                tooltip.style.opacity = '1';
                tooltip.style.left = (event.pageX + 10) + 'px';
                tooltip.style.top = (event.pageY - 10) + 'px';
            });

            circle.addEventListener('mouseleave', () => {
                circle.setAttribute('r', '5');
                circle.setAttribute('opacity', '0.7');
                tooltip.style.opacity = '0';
            });

            circle.addEventListener('mousemove', (event) => {
                tooltip.style.left = (event.pageX + 10) + 'px';
                tooltip.style.top = (event.pageY - 10) + 'px';
            });

            mainGroup.appendChild(circle);

            // Simple animation - just grow the circles
            setTimeout(() => {
                circle.style.transition = 'r 0.5s ease';
                circle.setAttribute('r', '5');
            }, i * 20);
        });

        // Add a simple trend line annotation
        const trendLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        trendLine.setAttribute('x1', '50');
        trendLine.setAttribute('y1', height - 50);
        trendLine.setAttribute('x2', width - 50);
        trendLine.setAttribute('y2', '50');
        trendLine.setAttribute('stroke', '#e74c3c');
        trendLine.setAttribute('stroke-width', '2');
        trendLine.setAttribute('stroke-dasharray', '5,5');
        trendLine.setAttribute('opacity', '0.6');
        mainGroup.appendChild(trendLine);

        // Simple annotation text
        const annotation = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        annotation.setAttribute('x', width - 100);
        annotation.setAttribute('y', '80');
        annotation.setAttribute('font-size', '12px');
        annotation.setAttribute('fill', '#e74c3c');
        annotation.setAttribute('font-weight', 'bold');
        annotation.textContent = 'Better performance';
        mainGroup.appendChild(annotation);

        const annotation2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        annotation2.setAttribute('x', width - 100);
        annotation2.setAttribute('y', '95');
        annotation2.setAttribute('font-size', '11px');
        annotation2.setAttribute('fill', '#666');
        annotation2.textContent = 'usually means less range';
        mainGroup.appendChild(annotation2);
    }

    setupScene3() {
        // Scene 3: The Future is Fast - Top Performance EVs
        console.log('Scene 3 setup - The Future is Fast');
        this.updateParameters({ scene: 'future_is_fast', step: 3 });
        
        const container = document.getElementById('scene3-viz');
        container.innerHTML = '';

        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 800 450');
        container.appendChild(svg);

        // Filter for elite performance cars - top performers across multiple metrics
        const eliteData = this.state.data
            .filter(d => 
                d.acceleration < 4 && 
                d.topSpeed > 200 && 
                d.range > 300 &&
                d.torque > 500
            )
            .sort((a, b) => a.acceleration - b.acceleration) // Sort by acceleration
            .slice(0, 8); // Top 8 elite EVs

        // Simple layout
        const margin = { top: 60, right: 60, bottom: 60, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 450 - margin.top - margin.bottom;

        // Create main group
        const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        mainGroup.setAttribute('transform', `translate(${margin.left}, ${margin.top})`);
        svg.appendChild(mainGroup);

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: absolute;
            background-color: rgba(0,0,0,0.9);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 12px;
            pointer-events: none;
            opacity: 0;
            z-index: 1000;
            max-width: 250px;
        `;
        document.body.appendChild(tooltip);

        // Add title
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', width / 2);
        title.setAttribute('y', -30);
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-size', '18px');
        title.setAttribute('font-weight', 'bold');
        title.setAttribute('fill', '#2c3e50');
        title.textContent = 'Elite Performance Electric Vehicles';
        mainGroup.appendChild(title);

        // Create a grid layout for the cars
        const cols = 4;
        const rows = 2;
        const cardWidth = width / cols - 10;
        const cardHeight = height / rows - 20;

        eliteData.forEach((d, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = col * (cardWidth + 10);
            const y = row * (cardHeight + 20);

            // Create card background
            const cardBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            cardBg.setAttribute('x', x);
            cardBg.setAttribute('y', y);
            cardBg.setAttribute('width', cardWidth);
            cardBg.setAttribute('height', cardHeight);
            cardBg.setAttribute('fill', '#f8f9fa');
            cardBg.setAttribute('stroke', '#e9ecef');
            cardBg.setAttribute('stroke-width', '2');
            cardBg.setAttribute('rx', '8');
            cardBg.style.cursor = 'pointer';

            // Add hover effect to card
            cardBg.addEventListener('mouseenter', (event) => {
                cardBg.setAttribute('fill', '#e3f2fd');
                cardBg.setAttribute('stroke', '#2196f3');
                
                tooltip.innerHTML = `
                    <div style="font-weight: bold; margin-bottom: 8px; color: #4ecdc4;">${d.brand} ${d.model}</div>
                    <div><strong>🏁 Performance:</strong></div>
                    <div style="margin-left: 10px;">• 0-100 km/h: ${d.acceleration}s</div>
                    <div style="margin-left: 10px;">• Top Speed: ${d.topSpeed} km/h</div>
                    <div style="margin-left: 10px;">• Torque: ${d.torque} Nm</div>
                    <div style="margin-left: 10px;">• Range: ${d.range} km</div>
                    <div style="margin-top: 8px;"><strong>🔋 Tech:</strong></div>
                    <div style="margin-left: 10px;">• Battery: ${d.batteryCapacity || 'N/A'} kWh</div>
                    <div style="margin-left: 10px;">• Efficiency: ${d.efficiency || 'N/A'} Wh/km</div>
                    <div style="margin-left: 10px;">• Segment: ${d.segment}</div>
                `;
                tooltip.style.opacity = '1';
                tooltip.style.left = (event.pageX + 15) + 'px';
                tooltip.style.top = (event.pageY - 10) + 'px';
            });

            cardBg.addEventListener('mouseleave', () => {
                cardBg.setAttribute('fill', '#f8f9fa');
                cardBg.setAttribute('stroke', '#e9ecef');
                tooltip.style.opacity = '0';
            });

            cardBg.addEventListener('mousemove', (event) => {
                tooltip.style.left = (event.pageX + 15) + 'px';
                tooltip.style.top = (event.pageY - 10) + 'px';
            });

            mainGroup.appendChild(cardBg);

            // Add car brand/model text
            const carName = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            carName.setAttribute('x', x + cardWidth / 2);
            carName.setAttribute('y', y + 25);
            carName.setAttribute('text-anchor', 'middle');
            carName.setAttribute('font-size', '13px');
            carName.setAttribute('font-weight', 'bold');
            carName.setAttribute('fill', '#2c3e50');
            carName.textContent = this.truncateText(`${d.brand}`, 12);
            mainGroup.appendChild(carName);

            const modelName = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            modelName.setAttribute('x', x + cardWidth / 2);
            modelName.setAttribute('y', y + 40);
            modelName.setAttribute('text-anchor', 'middle');
            modelName.setAttribute('font-size', '11px');
            modelName.setAttribute('fill', '#666');
            modelName.textContent = this.truncateText(d.model, 15);
            mainGroup.appendChild(modelName);

            // Add key metrics
            const metrics = [
                { label: '0-100', value: `${d.acceleration}s`, color: '#e74c3c' },
                { label: 'Speed', value: `${d.topSpeed}km/h`, color: '#f39c12' },
                { label: 'Range', value: `${d.range}km`, color: '#27ae60' },
                { label: 'Torque', value: `${d.torque}Nm`, color: '#8e44ad' }
            ];

            metrics.forEach((metric, idx) => {
                const metricY = y + 60 + (idx * 25);
                
                // Metric label
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', x + 10);
                label.setAttribute('y', metricY);
                label.setAttribute('font-size', '10px');
                label.setAttribute('fill', '#666');
                label.textContent = metric.label + ':';
                mainGroup.appendChild(label);

                // Metric value
                const value = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                value.setAttribute('x', x + cardWidth - 10);
                value.setAttribute('y', metricY);
                value.setAttribute('text-anchor', 'end');
                value.setAttribute('font-size', '11px');
                value.setAttribute('font-weight', 'bold');
                value.setAttribute('fill', metric.color);
                value.textContent = metric.value;
                mainGroup.appendChild(value);
            });

            // Add rank indicator
            const rankCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            rankCircle.setAttribute('cx', x + cardWidth - 15);
            rankCircle.setAttribute('cy', y + 15);
            rankCircle.setAttribute('r', '12');
            rankCircle.setAttribute('fill', '#3498db');
            rankCircle.setAttribute('opacity', '0.8');
            mainGroup.appendChild(rankCircle);

            const rankText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            rankText.setAttribute('x', x + cardWidth - 15);
            rankText.setAttribute('y', y + 15);
            rankText.setAttribute('dy', '0.35em');
            rankText.setAttribute('text-anchor', 'middle');
            rankText.setAttribute('font-size', '10px');
            rankText.setAttribute('font-weight', 'bold');
            rankText.setAttribute('fill', 'white');
            rankText.textContent = `#${i + 1}`;
            mainGroup.appendChild(rankText);

            // Simple animation - fade in cards
            setTimeout(() => {
                cardBg.style.transition = 'opacity 0.8s ease';
                cardBg.setAttribute('opacity', '1');
            }, i * 150);
        });

        // Add simple annotation
        const annotation = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        annotation.setAttribute('x', width / 2);
        annotation.setAttribute('y', height + 40);
        annotation.setAttribute('text-anchor', 'middle');
        annotation.setAttribute('font-size', '12px');
        annotation.setAttribute('fill', '#666');
        annotation.setAttribute('font-style', 'italic');
        annotation.textContent = 'Hover over each vehicle to see detailed specifications';
        mainGroup.appendChild(annotation);

        // Add performance badge
        const badge = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        badge.setAttribute('transform', `translate(${width - 120}, 10)`);

        mainGroup.appendChild(badge);
    }

    // Helper function to truncate text
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    updateParameters(newParams) {
        // Update state parameters
        this.state.parameters = { ...this.state.parameters, ...newParams };
        console.log('Updated parameters:', this.state.parameters);
    }

    getCurrentScene() {
        return this.state.currentScene;
    }

    getParameters() {
        return this.state.parameters;
    }
}

// Initialize the narrative visualization when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const narrativeViz = new NarrativeVisualization();
    // Make it globally accessible for debugging
    window.narrativeViz = narrativeViz;
});

export {};
