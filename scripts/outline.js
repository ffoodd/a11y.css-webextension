let btnOutline = document.getElementById('btnOutline');

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

function storeOutlineStatus(strStatus, tabId) {
	chrome.storage.local.get("outlineStatus").then(
		item => {
			let outlineStatus = [];
			if (item && item.outlineStatus) {
				outlineStatus = item.outlineStatus;
			}
			outlineStatus[tabId] = {"status": strStatus};
			let setting = chrome.storage.local.set({ outlineStatus });
			setting.then(null, onError);
		}
	);
}

btnOutline.addEventListener('click', () => {
	let checked = btnOutline.getAttribute('aria-checked') === 'true' || false;
	getCurrentTab()
		.then(tab => {
			if (checked) {
				chrome.scripting.removeCSS({
					target: {tabId: tab.id},
					files: ["/css/outline.css"]
				});
			} else {
				chrome.scripting.insertCSS({
					target: {tabId: tab.id},
					files: ["/css/outline.css"]
				});
			}
		})
		.then(tab => {
			btnOutline.setAttribute('aria-checked', String(!checked));
			storeOutlineStatus(!checked, tab.id);
		});
});

function outlineOnload() {
	chrome.storage.local.get("outlineStatus").then(
		item => {
			if (item && item.outlineStatus) {
				getCurrentTab().then(tab => {
					if (item.outlineStatus[tab.id]) {
						btnOutline.setAttribute('aria-checked', item.outlineStatus[tab.id].status);
					}
				});
			}
		},
		onError
	);
}
outlineOnload();
