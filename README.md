# UniProt ID Replacer Extension

A lightweight browser extension that enhances your workflow by replacing gene IDs in textboxes with UniProt accession numbers. Designed for scientists and researchers, this tool queries the UniProt API to fetch the primary accession number for any valid gene ID.

## Features
- Works in any standard textbox or content-editable field.
- Fetches UniProt accession numbers dynamically.
- Displays tooltips for status updates, such as "Looking up..." or "No result found."
- Keyboard shortcut: **Ctrl+Shift+R**.

## Installation
### For Firefox
1. Download the extension from the [Firefox Add-ons Store](https://addons.mozilla.org/).
2. Install it in your browser.

### Manual Installation
1. Download the ZIP file from the [releases page](#).
2. Go to `about:debugging#/runtime/this-firefox` in Firefox.
3. Click **Load Temporary Add-on** and select the `manifest.json` file.

## Usage
1. Open a webpage with a textbox or search box.
2. Type a valid gene ID (e.g., `BRCA1_HUMAN`).
3. Move the cursor to the gene ID or keep it at the end of the word.
4. Press **Ctrl+Shift+R**.
5. The gene ID will be replaced with the corresponding UniProt accession number.

### Example
- Input: `BRCA1_HUMAN`
- Output: `P38398`

## Permissions
This extension requires the following permissions:
- `activeTab`: To access the text input on the current page.
- `https://rest.uniprot.org/*`: To query the UniProt API.

## License
This project is licensed under the [MIT License](LICENSE).

## Contributing
Feel free to submit issues or pull requests for improvements and feature requests.

## Disclaimer
This extension is provided as-is and is not officially affiliated with UniProt.
