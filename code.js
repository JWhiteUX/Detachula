"use strict";
// Updated code.ts to use component name instead of nodeId
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.on('run', () => {
    if (!isComponentSelected()) {
        console.error('No component instance selected.');
        figma.closePlugin('Please select a component instance before running the plugin.');
        return;
    }
    const selectedNode = figma.currentPage.selection[0];
    console.log('Selected Node:', selectedNode);
    if (!(selectedNode === null || selectedNode === void 0 ? void 0 : selectedNode.name)) {
        console.error('Unable to determine the name of the selected component.');
        figma.closePlugin('Unable to determine the name of the selected component.');
        return;
    }
    figma.showUI(__html__, { width: 400, height: 250 });
    console.log('UI initialized with Component Name:', selectedNode.name);
    figma.ui.postMessage({ type: 'initialize', componentName: selectedNode.name });
});
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Message received from UI:', msg);
    if (msg.type === 'detachInstance') {
        yield processDetachment(msg);
    }
    else if (msg.type === 'cancel') {
        figma.closePlugin('Operation cancelled by the user.');
    }
});
function isComponentSelected() {
    const selectedNode = figma.currentPage.selection[0];
    console.log('Checking if component is selected:', selectedNode);
    return isInstanceNode(selectedNode);
}
function isInstanceNode(node) {
    return (node === null || node === void 0 ? void 0 : node.type) === 'INSTANCE';
}
function processDetachment(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Processing detachment with message:', msg);
        // Find the node in the current selection by layer name
        const selectedNode = figma.currentPage.selection.find((node) => node.type === 'INSTANCE' && node.name === msg.layerName);
        // Debugging logs for matching logic
        console.log('Looking for node with layer name:', msg.layerName);
        console.log('Current selection:', figma.currentPage.selection);
        // Check if we found a valid instance
        if (!selectedNode) {
            console.error(`No instance found with the layer name "${msg.layerName}" in the current selection.`);
            figma.closePlugin(`No valid instance found with the layer name "${msg.layerName}".`);
            return;
        }
        if (!isInstanceNode(selectedNode)) {
            console.error('The selected node is not a valid instance:', selectedNode);
            figma.closePlugin('Selected node is not a valid instance.');
            return;
        }
        try {
            const mainComponent = yield selectedNode.getMainComponentAsync();
            console.log('Main component retrieved:', mainComponent);
            if (!mainComponent) {
                console.error('Main component not found for the selected instance.');
                figma.closePlugin('Unable to detach: Main component not found.');
                return;
            }
            const metadata = collectMetadata(selectedNode, mainComponent, msg.rationale);
            console.log('Metadata collected:', metadata);
            selectedNode.detachInstance();
            console.log('Instance detached successfully:', selectedNode.name);
            yield saveToLocalFile(metadata);
            figma.notify('Instance detached and rationale saved.', { timeout: 2000 });
            figma.closePlugin();
        }
        catch (error) {
            console.error('Error during detachment:', error);
            figma.closePlugin('An error occurred while processing the detachment.');
        }
    });
}
function collectMetadata(node, mainComponent, rationale) {
    var _a;
    const fileKey = figma.fileKey;
    console.log('File Key:', fileKey);
    if (!fileKey) {
        console.error('File key is undefined.');
        throw new Error('File key is undefined. Ensure the plugin is running in a valid Figma file.');
    }
    return {
        name: node.name,
        timestamp: new Date().toISOString(),
        parentFrame: ((_a = node.parent) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown Frame',
        rationale: rationale || 'No rationale provided',
        detachedFrameLink: `https://www.figma.com/file/${fileKey}?node-id=${encodeURIComponent(node.id)}`,
        originalComponentLink: `https://www.figma.com/file/${fileKey}?node-id=${encodeURIComponent(mainComponent.id)}`,
    };
}
function saveToLocalFile(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Saving metadata locally:', data);
        const logsPage = findOrCreateLogsPage();
        yield appendLogToPage(logsPage, data);
    });
}
function findOrCreateLogsPage() {
    let logsPage = figma.root.children.find((page) => page.name === 'Detachment Logs');
    if (!logsPage) {
        logsPage = figma.createPage();
        logsPage.name = 'Detachment Logs';
        console.log('Created new logs page.');
    }
    return logsPage;
}
function appendLogToPage(page, data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Appending log to page:', page.name);
        yield figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
        console.log('Font loaded successfully.');
        const logText = figma.createText();
        logText.characters = `
      Component Detached:
      - Name: ${data.name}
      - Timestamp: ${data.timestamp}
      - Parent Frame: ${data.parentFrame}
      - Rationale: ${data.rationale}
      - Detached Frame: ${data.detachedFrameLink}
      - Original Component: ${data.originalComponentLink}
  `;
        page.appendChild(logText);
        console.log('Log added to page successfully.');
    });
}
