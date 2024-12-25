chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "fetchUniProt") {
    const geneId = message.geneId;

    // Fetch data from UniProt API
    fetch(
      `https://rest.uniprot.org/uniprotkb/search?query=id:${encodeURIComponent(
        geneId
      )}&fields=accession`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch UniProt data");
        }
        return response.json();
      })
      .then((data) => {
        if (data.results && data.results.length > 0) {
          sendResponse({ accession: data.results[0].primaryAccession });
        } else {
          sendResponse({ accession: null });
        }
      })
      .catch((error) => {
        console.error("Error fetching UniProt data:", error);
        sendResponse({ accession: null });
      });

    // Required for async responses
    return true;
  }
});
