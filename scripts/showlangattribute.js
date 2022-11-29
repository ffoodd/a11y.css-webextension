let btnShowLangAttribute = document.getElementById('btnShowLangAttribute');

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

function storeShowLangStatus(strStatus, tabId) {
	chrome.storage.local.get("showLangStatus").then(
		item => {
			let showLangStatus = [];
			if (item && item.showLangStatus) {
				showLangStatus = item.showLangStatus;
			}
			showLangStatus[tabId] = {"status": strStatus};
			let setting = chrome.storage.local.set({ showLangStatus });
			setting.then(null, onError);
		}
	);
}

btnShowLangAttribute.addEventListener('click', () => {
	let checked = btnShowLangAttribute.getAttribute('aria-checked') === 'true' || false;
	getCurrentTab()
		.then(tab => {
			if (checked) {
				chrome.scripting.removeCSS({
					target: {tabId: tab.id},
					files: ["/css/show-lang.css"]
				});

			} else {
				chrome.scripting.insertCSS({
					target: {tabId: tab.id},
					files: ["/css/show-lang.css"]
				});
			}
		})
		.then(tab => {
			btnShowLangAttribute.setAttribute('aria-checked', String(!checked));
			storeShowLangStatus(!checked, tab.id);
		});
});

function showLangOnload() {
	chrome.storage.local.get("showLangStatus").then(
		item => {
			if (item && item.showLangStatus) {
				getCurrentTab().then(tab => {
					if (item.showLangStatus[tab.id]) {
						btnShowLangAttribute.setAttribute('aria-checked', item.showLangStatus[tab.id].status);
					}
				});
			}
		},
		onError
	);
}
showLangOnload();
