# AzureDevOps Assistant

![AzureDevOps YAML Pipeline Navigator](logo.png)

The AzureDevOps Assistantr is a Microsoft Edge Extension that provides an easy way to navigate between various AzureDevOps APIs related to YAML pipelines. With this extension, users can access the Timeline API, Logs API, and view the full expanded YAML, making it convenient to view and interact with pipeline information.

## Features

- **Timeline API**: Explore the timeline of a YAML pipeline, including the sequence of tasks and their status.
- **Logs API**: View detailed logs for each task in the YAML pipeline.
- **Final YAML API**: Retrieve the final YAML definition for a pipeline run
- **Task Information**: Retrieve task information like the version of the task, and the version of the extension it was uploaded with.
- **Build Properties**: Retrieve the builds properties information for a pipeline run.
- **Bookmarking**: Bookmark commonly retrieved Azure DevOps accounts and Task Guids, for faster and easier access

In addition to the core features, this extension offers customization options for a more personalized experience. Users can specify certain AzureDevOps (ADO) accounts, Project information, and pipeline runId and retrieve navigate to the pipeline view.

## Installation

1. Clone or download this repository to your local machine.

   ```bash
   git clone https://github.com/crypticguy/ADODebugAssistant.git
   ```

2. Open Microsoft Edge and go to `edge://extensions`.

3. Enable the **Developer mode** toggle in the top right corner.

4. Click on **Load unpacked** and select the directory where you cloned/downloaded the repository.

5. The **AzureDevOps Assistant** extension should now be installed in your Microsoft Edge browser.

## Usage

1. Open Microsoft Edge and navigate to an AzureDevOps page with YAML pipeline information.

2. Click on the AzureDevOps YAML Pipeline Navigator extension icon in the browser toolbar.

3. The extension popup window will appear, displaying the available options:

   - **Timeline**: Click to view the timeline of the YAML pipeline.
   - **Logs**: Click to view detailed logs for each task in the pipeline.
   - **Final YAML**: Click to retrieve the final YAML definition for the pipeline run.
   - **Build Properties**: Click to view the Build Properties of the pipeline run.

4. Customize the extension behavior by specifying ADO accounts and task GUIDs:

   - **ADO Accounts**: Add ADO accounts for which you want to fetch task information.
   - **Task GUIDs**: Add specific task GUIDs for which you want to see versions and additional details.
   - **Target Environment**: You can maintain separate storage for both test and prod extensions

5. Click on the desired option, and the corresponding information will be displayed in a new tab.

## Contributing

Contributions to the AzureDevOps YAML Pipeline Navigator are welcome! To contribute, follow these steps:

1. Fork the repository.

2. Create a new branch for your feature/bug fix.

3. Make your changes and test them locally.

4. Commit your changes and push them to your forked repository.

5. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Microsoft Edge Extension API](https://docs.microsoft.com/en-us/microsoft-edge/extensions/)

## Disclaimer

This extension is provided as-is without any warranty. Use it at your own risk.

Please note that this extension is not officially endorsed or maintained by Microsoft or AzureDevOps. It is a community-driven project developed for convenience purposes.
