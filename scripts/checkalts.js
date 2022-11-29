let btnCheckalts = document.getElementById('btnCheckalts');

// @todo Quite a fex duplicated things between files, there's probably a better way (in utils.js, maybe?)
// @note getCurrentTab()
// @note storeOptionStatus()
// @note optionOnLoad()
// @note Click handlers
async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

function storeCheckAltsStatus(strStatus, tabId) {
	chrome.storage.local.get("checkAltsStatus").then(
		item => {
			let checkAltsStatus = [];
			if (item && item.checkAltsStatus) {
				checkAltsStatus = item.checkAltsStatus;
			}
			checkAltsStatus[tabId] = {"status": strStatus};
			let setting = chrome.storage.local.set({ checkAltsStatus });
			setting.then(null, onError);
		}
	);
}

btnCheckalts.addEventListener('click', () => {
	let checked = btnCheckalts.getAttribute('aria-checked') === 'true' || false;
	let icons = {
		ok: chrome.runtime.getURL("/icons/ok.svg"),
		ko: chrome.runtime.getURL("/icons/ko.svg"),
		info: chrome.runtime.getURL("/icons/info.svg")
	};
	let strings = {
		ok: _t("altOK"),
		ko: _t("altMissing"),
		info: _t("altEmpty")
	};

	getCurrentTab()
		.then(tab => {
			chrome.tabs.sendMessage(tab.id, {
				a11ycss_action: "checkalts",
				icons: icons,
				strings: strings
			});
		})
		.then(tab => {
			btnCheckalts.setAttribute('aria-checked', String(!checked));
			storeCheckAltsStatus(!checked, tab.id);
		});
});

function checkAltsOnload() {
	chrome.storage.local.get("checkAltsStatus").then(
		item => {
			if (item && item.checkAltsStatus) {
				getCurrentTab().then(tab => {
					if (item.checkAltsStatus[tab.id]) {
						btnCheckalts.setAttribute('aria-checked', item.checkAltsStatus[tab.id].status);
					}
				})
			}
		},
		onError
	);
}
checkAltsOnload();
