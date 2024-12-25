// Create a tooltip element
const createTooltip = (message) => {
  let tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.backgroundColor = "black";
  tooltip.style.color = "white";
  tooltip.style.padding = "5px 10px";
  tooltip.style.borderRadius = "5px";
  tooltip.style.fontSize = "12px";
  tooltip.style.zIndex = "10000";
  tooltip.style.pointerEvents = "none";
  tooltip.textContent = message;
  document.body.appendChild(tooltip);
  return tooltip;
};

// Position the tooltip near the active element
const positionTooltip = (tooltip, element) => {
  const rect = element.getBoundingClientRect();
  tooltip.style.left = `${rect.left + window.scrollX}px`;
  tooltip.style.top = `${rect.top + window.scrollY - 30}px`; // Position above the element
};

// Remove the tooltip after a delay
const removeTooltip = (tooltip, delay = 2000) => {
  setTimeout(() => {
    if (tooltip && tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip);
    }
  }, delay);
};
document.addEventListener("keydown", async (event) => {
  // Check for Ctrl+Shift+R
  if (event.ctrlKey && event.shiftKey && event.key === "R") {

    // Prevent the page from intercepting this event
    event.preventDefault();
    event.stopPropagation();
    
    const activeElement = document.activeElement;

    // Ensure we're working on a textbox or content-editable element
    if (
      activeElement &&
      (activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "INPUT" ||
        activeElement.isContentEditable)
    ) {
      const isInputField = activeElement.value !== undefined; // Distinguish between input fields and content-editable elements
      const cursorPosition = isInputField
        ? activeElement.selectionStart
        : getCaretPosition(activeElement);

      let textBeforeCursor, textAfterCursor;
      if (isInputField) {
        // For input/textarea elements
        textBeforeCursor = activeElement.value.slice(0, cursorPosition);
        textAfterCursor = activeElement.value.slice(cursorPosition);
      } else {
        // For content-editable elements
        const content = activeElement.textContent || "";
        textBeforeCursor = content.slice(0, cursorPosition);
        textAfterCursor = content.slice(cursorPosition);
      }

      // Extract the last word before the cursor
      const words = textBeforeCursor.split(/\s+/);
      const lastWord = words.pop(); // Get the last word

      if (lastWord) {
        // Create and position the tooltip
        const tooltip = createTooltip("Looking up...");
        positionTooltip(tooltip, activeElement);

        // Send message to the background script
        chrome.runtime.sendMessage(
          { type: "fetchUniProt", geneId: lastWord },
          (response) => {
            if (response && response.accession) {
              // Replace the last word with the fetched accession
              words.push(response.accession);
              const updatedTextBeforeCursor = words.join(" ");

              const updatedText = updatedTextBeforeCursor + textAfterCursor;

              if (isInputField) {
                activeElement.value = updatedText;

                // Fix cursor position
                const newCursorPosition = updatedTextBeforeCursor.length;
                activeElement.setSelectionRange(newCursorPosition, newCursorPosition);
              } else {
                activeElement.textContent = updatedText;

                // Fix caret position
                const range = document.createRange();
                const selection = window.getSelection();
                range.setStart(activeElement.firstChild, updatedTextBeforeCursor.length);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
              }

              // Update tooltip with success message
              tooltip.textContent = "Replaced!";
            } else {
              // Update tooltip with error message
              tooltip.textContent = "No result found.";
            }

            // Remove the tooltip after 2 seconds
            removeTooltip(tooltip);
          }
        );
      }
    }
  }
},
true // Use capture phase
);

// Helper: Get caret position in content-editable elements
function getCaretPosition(element) {
  let caretOffset = 0;
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length;
  }
  return caretOffset;
}
