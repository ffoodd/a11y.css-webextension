let btnTextspacing = document.getElementById('btnTextspacing');

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

function storeTextSpacingStatus(strStatus, tabId) {
	chrome.storage.local.get("textSpacingStatus").then(
		item => {
			let textSpacingStatus = [];
			if (item && item.textSpacingStatus) {
				textSpacingStatus = item.textSpacingStatus;
			}
			textSpacingStatus[tabId] = {"status": strStatus};
			let setting = chrome.storage.local.set({ textSpacingStatus });
			setting.then(null, onError);
		}
	);
}

btnTextspacing.addEventListener('click', () => {
	let checked = btnTextspacing.getAttribute('aria-checked') === 'true' || false;

	getCurrentTab()
		.then(tab => {
			chrome.tabs.sendMessage(tab.id, {
				a11ycss_action: "textspacing"
			});
		})
		.then(tab => {
			btnTextspacing.setAttribute('aria-checked', String(!checked));
			storeTextSpacingStatus(!checked, tab.id);
		});
});

function textSpacingOnload() {
	chrome.storage.local.get("textSpacingStatus").then(
		item => {
			if (item && item.textSpacingStatus) {
				getCurrentTab().then(tab => {
					if (item.textSpacingStatus[tab.id]) {
						btnTextspacing.setAttribute('aria-checked', item.textSpacingStatus[tab.id].status);
					}
				});
			}
		},
		onError
	);
}
textSpacingOnload();
