// @todo Use browser namespace when possible?
// @note If doing so, this is needed in every context
/*const browser = typeof browser === 'undefined'
	? chrome
	: browser; */

function onError(error) {
	console.error(`a11y.css error: ${error}`);
}

function onGot(item) {
	console.info(`a11y.css got`, item);
}

function onCleared() {
	console.info(`a11y.css storage.local cleared`);
}

chrome.action.onClicked.addListener((tab) => {

});

// Refresh tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
	if (changeInfo.status === 'complete') {
		chrome.storage.local.clear().then(onCleared, onError)
	}
});

// Update extension
chrome.runtime.onInstalled.addListener(details => {
	if (details.reason === 'update') {
		chrome.storage.local.clear().then(onCleared, onError);
	}
});

// Restart extension
chrome.runtime.onStartup.addListener(() => {
	chrome.storage.local.clear().then(onCleared, onError)
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
