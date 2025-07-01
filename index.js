// Main TypeScript file for the narrative visualization
// This will handle scene navigation and state management
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var NarrativeVisualization = /** @class */ (function () {
    function NarrativeVisualization() {
        this.state = {
            currentScene: 'scene1',
            parameters: {}
        };
        this.scenes = ['scene1', 'scene2', 'scene3'];
        this.initializeEventListeners();
    }
    NarrativeVisualization.prototype.initializeEventListeners = function () {
        var _this = this;
        // Add event listeners for navigation tabs
        var navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(function (tab) {
            tab.addEventListener('click', function (event) {
                var target = event.target;
                var sceneId = target.getAttribute('data-scene');
                if (sceneId) {
                    _this.navigateToScene(sceneId);
                }
            });
        });
    };
    NarrativeVisualization.prototype.navigateToScene = function (sceneId) {
        // Hide current scene
        var currentSceneElement = document.getElementById(this.state.currentScene);
        if (currentSceneElement) {
            currentSceneElement.classList.remove('active');
        }
        // Remove active class from current tab
        var currentTab = document.querySelector("[data-scene=\"".concat(this.state.currentScene, "\"]"));
        if (currentTab) {
            currentTab.classList.remove('active');
        }
        // Show new scene
        var newSceneElement = document.getElementById(sceneId);
        if (newSceneElement) {
            newSceneElement.classList.add('active');
        }
        // Add active class to new tab
        var newTab = document.querySelector("[data-scene=\"".concat(sceneId, "\"]"));
        if (newTab) {
            newTab.classList.add('active');
        }
        // Update state
        this.state.currentScene = sceneId;
        // Trigger scene-specific setup
        this.setupScene(sceneId);
    };
    NarrativeVisualization.prototype.setupScene = function (sceneId) {
        // This method will be expanded to set up D3 visualizations for each scene
        console.log("Setting up ".concat(sceneId));
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
    };
    NarrativeVisualization.prototype.setupScene1 = function () {
        // Scene 1 specific setup
        console.log('Scene 1 setup - Introduction');
        // TODO: Add D3 visualization code here
        this.updateParameters({ scene: 'introduction', step: 1 });
    };
    NarrativeVisualization.prototype.setupScene2 = function () {
        // Scene 2 specific setup
        console.log('Scene 2 setup - Development');
        // TODO: Add D3 visualization code here
        this.updateParameters({ scene: 'development', step: 2 });
    };
    NarrativeVisualization.prototype.setupScene3 = function () {
        // Scene 3 specific setup
        console.log('Scene 3 setup - Conclusion');
        // TODO: Add D3 visualization code here
        this.updateParameters({ scene: 'conclusion', step: 3 });
    };
    NarrativeVisualization.prototype.updateParameters = function (newParams) {
        // Update state parameters
        this.state.parameters = __assign(__assign({}, this.state.parameters), newParams);
        console.log('Updated parameters:', this.state.parameters);
    };
    NarrativeVisualization.prototype.getCurrentScene = function () {
        return this.state.currentScene;
    };
    NarrativeVisualization.prototype.getParameters = function () {
        return this.state.parameters;
    };
    return NarrativeVisualization;
}());
// Initialize the narrative visualization when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    var narrativeViz = new NarrativeVisualization();
    // Make it globally accessible for debugging
    window.narrativeViz = narrativeViz;
});
