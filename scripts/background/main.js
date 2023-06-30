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
