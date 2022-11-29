let btnTextspacing = document.getElementById('btnTextspacing');

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

function storeTextSpacingStatus(strStatus, tab) {
	// Get a11y.css stored status
	chrome.storage.local.get("textSpacingStatus").then(
		// when we got something
		(item) => {
			let textSpacingStatus = [];
			if (item && item.textSpacingStatus) {
				textSpacingStatus = item.textSpacingStatus;
			}
			// Add or replace current tab's value
			textSpacingStatus[tab.id] = {"status": strStatus};
			// And set it back to the storage
			let setting = chrome.storage.local.set({ textSpacingStatus });
			setting.then(null, onError); // just in case
		}
	);
}

btnTextspacing.addEventListener('click', async (e) => {
	// @note Variant for injected scripts: why is this needed?
	let tab = await getCurrentTab();
	chrome.tabs.sendMessage(tab.id, {
		a11ycss_action: "textspacing"
	});
	let checked = e.target.getAttribute('aria-checked') === 'true' || false;
	e.target.setAttribute('aria-checked', String(!checked));
	storeTextSpacingStatus(!checked, tab);
});

function textSpacingOnload() {
	let getStatus = chrome.storage.local.get("textSpacingStatus");
	getStatus.then(
		// when we got something
		async (item) => {
			if (item && item.textSpacingStatus) {
				let tab = await getCurrentTab();
				// If a setting is found for this tab
				if (item.textSpacingStatus[tab.id]) {
					btnTextspacing.setAttribute('aria-checked', item.textSpacingStatus[tab.id].status);
				}
			}
		},
		// we got nothing
		onError
	);
}
textSpacingOnload();
