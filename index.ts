// Main TypeScript file for the narrative visualization
// This will handle scene navigation and state management

import * as d3 from 'd3';
import * as topojson from 'topojson-client';

// D3 annotation types (declare since it doesn't have official types)
declare var d3Annotation: any;

interface SceneState {
    currentScene: string;
    parameters: { [key: string]: any };
}

class NarrativeVisualization {
    private state: SceneState;
    private scenes: string[];

    constructor() {
        this.state = {
            currentScene: 'scene1',
            parameters: {}
        };
        this.scenes = ['scene1', 'scene2', 'scene3'];
        this.initializeEventListeners();
        // Initialize navigation controls after DOM is ready
        setTimeout(() => this.updateNavigationControls(), 0);
    }

    private initializeEventListeners(): void {
        // Add event listeners for navigation tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (event) => {
                const target = event.target as HTMLElement;
                const sceneId = target.getAttribute('data-scene');
                if (sceneId) {
                    this.navigateToScene(sceneId);
                }
            });
        });

        // Add event listeners for Next/Previous buttons
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

    private navigateToScene(sceneId: string): void {
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

        // Update navigation controls
        this.updateNavigationControls();

        // Trigger scene-specific setup
        this.setupScene(sceneId);
    }

    private navigateToPreviousScene(): void {
        const currentIndex = this.scenes.indexOf(this.state.currentScene);
        if (currentIndex > 0) {
            const previousScene = this.scenes[currentIndex - 1];
            this.navigateToScene(previousScene);
        }
    }

    private navigateToNextScene(): void {
        const currentIndex = this.scenes.indexOf(this.state.currentScene);
        if (currentIndex < this.scenes.length - 1) {
            const nextScene = this.scenes[currentIndex + 1];
            this.navigateToScene(nextScene);
        }
    }

    private updateNavigationControls(): void {
        const currentIndex = this.scenes.indexOf(this.state.currentScene);
        const prevBtn = document.getElementById('prevBtn') as HTMLButtonElement;
        const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;
        const sceneIndicator = document.querySelector('.scene-indicator');

        // Update Previous button
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
        }

        // Update Next button
        if (nextBtn) {
            nextBtn.disabled = currentIndex === this.scenes.length - 1;
        }

        // Update scene indicator
        if (sceneIndicator) {
            sceneIndicator.textContent = `Scene ${currentIndex + 1} of ${this.scenes.length}`;
        }
    }

    private setupScene(sceneId: string): void {
        // This method will be expanded to set up D3 visualizations for each scene
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

    private setupScene1(): void {
        // Scene 1 specific setup
        console.log('Scene 1 setup - Introduction');
        // TODO: Add D3 visualization code here
        this.updateParameters({ scene: 'introduction', step: 1 });
    }

    private setupScene2(): void {
        // Scene 2 specific setup
        console.log('Scene 2 setup - Development');
        // TODO: Add D3 visualization code here
        this.updateParameters({ scene: 'development', step: 2 });
    }

    private setupScene3(): void {
        // Scene 3 specific setup
        console.log('Scene 3 setup - Conclusion');
        // TODO: Add D3 visualization code here
        this.updateParameters({ scene: 'conclusion', step: 3 });
    }

    private updateParameters(newParams: { [key: string]: any }): void {
        // Update state parameters
        this.state.parameters = { ...this.state.parameters, ...newParams };
        console.log('Updated parameters:', this.state.parameters);
    }

    public getCurrentScene(): string {
        return this.state.currentScene;
    }

    public getParameters(): { [key: string]: any } {
        return this.state.parameters;
    }
}

// Initialize the narrative visualization when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const narrativeViz = new NarrativeVisualization();
    
    // Make it globally accessible for debugging
    (window as any).narrativeViz = narrativeViz;
});
