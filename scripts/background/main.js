// Refresh tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		chrome.storage.local.clear();
	}

	if (['edge:', 'chrome:', 'about:'].some(browser => tab.url?.startsWith(browser))) {
		chrome.action.disable(tab.id);
	} else {
		chrome.action.enable(tab.id);
	}
});

chrome.tabs.onCreated.addListener(tab => {
	chrome.action.disable(tab.id);
	if (!['edge:', 'chrome:', 'about:'].some(browser => tab.url?.startsWith(browser))) {
		chrome.action.enable(tab.id);
	}
});


// Update extension
chrome.runtime.onInstalled.addListener(details => {
	if (details.reason === 'update') {
		chrome.storage.local.clear();
	}
});

// Restart extension
chrome.runtime.onStartup.addListener(() => {
	chrome.storage.local.clear();
});

// @note Debugging storage
// @see https://developer.chrome.com/docs/extensions/reference/storage/#synchronous-response-to-storage-updates
chrome.storage.onChanged.addListener((changes, namespace) => {
	for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
		console.log(
			`Storage key "${key}" in namespace "${namespace}" changed.`,
			`Old value was "${oldValue}", new value is "${newValue}".`
		);
	}
});
