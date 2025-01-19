# Component Detachment Tracker Plugin

## Overview
The **Component Detachment Tracker** is a Figma plugin designed to enhance the design workflow by tracking and documenting instances where components are detached from their origins. This tool helps product designers and design system teams identify gaps in design system coverage, capture insights during detachment, and streamline communication for component refinement.

---

## Problem Statement
Detaching components in Figma often signifies a limitation or gap in the design system, yet this critical action is rarely documented. Without tracking detachment events or capturing designer intent, teams miss opportunities to refine components or identify patterns of usage. Existing workflows lack a seamless way to capture this data and the rationale behind detachment.

---

## Solution
The **Component Detachment Tracker** addresses these challenges by:
1. **Tracking Detachments**: Automatically logs metadata like timestamps, component names, parent frames, and component origins.
2. **Capturing Context**: Provides a simple UI for designers to input rationale for detachment without leaving Figma.
3. **Storing Insights**: Offers options to store detachment data within the Figma file (on a dedicated page) or in external databases like Notion.
4. **Preparing for Future Integrations**: Supports extensibility for Slack, Teams, and Airtable alerts.

---

## Key Features
- **Intuitive UI**: User-friendly interface for logging rationale without disrupting workflows.
- **Automated Metadata Logging**: Captures component name, parent frame, timestamp, and origin details.
- **Flexible Data Storage**: Save detachment data locally within Figma or integrate with external platforms.
- **Future-Proof Architecture**: Scalable design for Slack, Teams, and Airtable integrations.

---

## Target Users
- **Product Designers**: Gain insights into component usage and streamline proposals for design system updates.
- **Design System Teams**: Analyze component detachment patterns to refine libraries.
- **UX Researchers**: Use detachment data to inform design decisions with actionable insights.

---

## Technical Stack
- **Figma Plugin API**: Core framework for plugin functionality.
- **TypeScript**: Ensures reliable and scalable codebase.
- **Data Handling**: Utilizes `layerName` and `nodeId` for component identification.
- **Storage Options**: Supports saving data locally or exporting to external platforms.

---

## Installation
1. Clone or download the repository.
2. Open Figma and navigate to **Plugins > Development > New Plugin**.
3. Select **Manifest File** and upload the `manifest.json` file from this repository.
4. Run the plugin within your Figma file.

---

## Usage
1. **Select a Component Instance**: Ensure a valid component instance is selected in your Figma file.
2. **Run the Plugin**: Launch the plugin from Figma's plugin menu.
3. **Provide Rationale**: Use the provided UI to log your reason for detaching the component.
4. **Review Logs**: Detachment data will be saved in a dedicated "Detachment Logs" page or sent to a connected database.

---

## Future Enhancements
- **Integrations**: Slack, Teams, and Airtable notifications for detachment events.
- **Advanced Analytics**: Insights into detachment trends and design system performance.
- **Custom Databases**: Support for additional platforms like Google Sheets and Trello.

---

## Contributing
We welcome contributions! Please:
1. Fork this repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with detailed changes.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact
For questions or feature requests, contact [Justin White](mailto:justin@0xfff.design).

Let’s revolutionize design systems with smarter component tracking!

---
---

## Basic Figma Plugin Setup
Below are the steps to get your plugin running. You can also find instructions at:

  https://www.figma.com/plugin-docs/plugin-quickstart-guide/

This plugin template uses Typescript and NPM, two standard tools in creating JavaScript applications.

First, download Node.js which comes with NPM. This will allow you to install TypeScript and other
libraries. You can find the download link here:

  https://nodejs.org/en/download/

Next, install TypeScript using the command:

  npm install -g typescript

Finally, in the directory of your plugin, get the latest type definitions for the plugin API by running:

  npm install --save-dev @figma/plugin-typings

If you are familiar with JavaScript, TypeScript will look very familiar. In fact, valid JavaScript code
is already valid Typescript code.

TypeScript adds type annotations to variables. This allows code editors such as Visual Studio Code
to provide information about the Figma API while you are writing code, as well as help catch bugs
you previously didn't notice.

For more information, visit https://www.typescriptlang.org/

Using TypeScript requires a compiler to convert TypeScript (code.ts) into JavaScript (code.js)
for the browser to run.

We recommend writing TypeScript code using Visual Studio code:

1. Download Visual Studio Code if you haven't already: https://code.visualstudio.com/.
2. Open this directory in Visual Studio Code.
3. Compile TypeScript to JavaScript: Run the "Terminal > Run Build Task..." menu item,
    then select "npm: watch". You will have to do this again every time
    you reopen Visual Studio Code.

That's it! Visual Studio Code will regenerate the JavaScript file every time you save.
