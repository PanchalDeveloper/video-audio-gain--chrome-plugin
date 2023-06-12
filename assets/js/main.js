document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("options-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const videoInput = document.getElementById("video-input");
    const gainRange = document.getElementById("gain-range");
    const gainInput = document.getElementById("gain-input");

    const videoQuerySelector = videoInput.value;
    const gain = parseFloat(gainRange.value) || parseFloat(gainInput.value);

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(
      tab.id,
      { action: "applyGain", gain, videoQuerySelector },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else if (response && response.success) {
          console.log("Audio gain applied successfully.");
        } else if (response && response.message) {
          console.error(response.message);
        } else {
          console.error("Unknown error occurred.");
        }
      }
    );
  });

  const gainRange = document.getElementById("gain-range");
  const gainInput = document.getElementById("gain-input");

  gainRange.addEventListener("input", () => {
    gainInput.value = gainRange.value;
  });

  gainInput.addEventListener("input", () => {
    gainRange.value = gainInput.value;
  });
});
