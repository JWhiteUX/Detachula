// Updated code.ts to use component name instead of nodeId

figma.on('run', () => {
  if (!isComponentSelected()) {
      console.error('No component instance selected.');
      figma.closePlugin('Please select a component instance before running the plugin.');
      return;
  }

  const selectedNode = figma.currentPage.selection[0];
  console.log('Selected Node:', selectedNode);

  if (!selectedNode?.name) {
      console.error('Unable to determine the name of the selected component.');
      figma.closePlugin('Unable to determine the name of the selected component.');
      return;
  }

  figma.showUI(__html__, { width: 400, height: 250 });
  console.log('UI initialized with Component Name:', selectedNode.name);
  figma.ui.postMessage({ type: 'initialize', componentName: selectedNode.name });
});

figma.ui.onmessage = async (msg: { type: string; rationale?: string; componentName?: string }) => {
  console.log('Message received from UI:', msg);

  if (msg.type === 'detachInstance') {
      await processDetachment(msg);
  } else if (msg.type === 'cancel') {
      figma.closePlugin('Operation cancelled by the user.');
  }
};

function isComponentSelected(): boolean {
  const selectedNode = figma.currentPage.selection[0];
  console.log('Checking if component is selected:', selectedNode);
  return isInstanceNode(selectedNode);
}

function isInstanceNode(node: SceneNode | undefined): node is InstanceNode {
  return node?.type === 'INSTANCE';
}

async function processDetachment(msg: { rationale?: string; layerName?: string }) {
  console.log('Processing detachment with message:', msg);

  // Find the node in the current selection by layer name
  const selectedNode = figma.currentPage.selection.find(
      (node) => node.type === 'INSTANCE' && node.name === msg.layerName
  ) as InstanceNode;

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
      const mainComponent = await selectedNode.getMainComponentAsync();
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

      await saveToLocalFile(metadata);

      figma.notify('Instance detached and rationale saved.', { timeout: 2000 });
      figma.closePlugin();
  } catch (error) {
      console.error('Error during detachment:', error);
      figma.closePlugin('An error occurred while processing the detachment.');
  }
}

function collectMetadata(node: InstanceNode, mainComponent: ComponentNode, rationale: string | undefined): {
  name: string;
  timestamp: string;
  parentFrame: string;
  rationale: string;
  detachedFrameLink: string;
  originalComponentLink: string;
} {
  const fileKey = figma.fileKey;
  console.log('File Key:', fileKey);

  if (!fileKey) {
      console.error('File key is undefined.');
      throw new Error('File key is undefined. Ensure the plugin is running in a valid Figma file.');
  }

  return {
      name: node.name,
      timestamp: new Date().toISOString(),
      parentFrame: node.parent?.name || 'Unknown Frame',
      rationale: rationale || 'No rationale provided',
      detachedFrameLink: `https://www.figma.com/file/${fileKey}?node-id=${encodeURIComponent(node.id)}`,
      originalComponentLink: `https://www.figma.com/file/${fileKey}?node-id=${encodeURIComponent(mainComponent.id)}`,
  };
}

async function saveToLocalFile(data: {
  name: string;
  timestamp: string;
  parentFrame: string;
  rationale: string;
  detachedFrameLink: string;
  originalComponentLink: string;
}) {
  console.log('Saving metadata locally:', data);

  const logsPage = findOrCreateLogsPage();
  await appendLogToPage(logsPage, data);
}

function findOrCreateLogsPage(): PageNode {
  let logsPage = figma.root.children.find((page) => page.name === 'Detachment Logs') as PageNode;
  if (!logsPage) {
      logsPage = figma.createPage();
      logsPage.name = 'Detachment Logs';
      console.log('Created new logs page.');
  }
  return logsPage;
}

async function appendLogToPage(page: PageNode, data: {
  name: string;
  timestamp: string;
  parentFrame: string;
  rationale: string;
  detachedFrameLink: string;
  originalComponentLink: string;
}) {
  console.log('Appending log to page:', page.name);

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
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
}
