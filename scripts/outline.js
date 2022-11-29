let btnOutline = document.getElementById('btnOutline');

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

function addOutline() {
	let outlineStylesheet = document.getElementById("a11ycss_outline");
	if ( outlineStylesheet ) { outlineStylesheet.parentNode.removeChild(outlineStylesheet) }
	let stylesheet = document.createElement("link");
	stylesheet.rel = "stylesheet";
	stylesheet.href = chrome.runtime.getURL("/css/outline.css");
	stylesheet.id = "a11ycss_outline";
	document.getElementsByTagName("head")[0].appendChild(stylesheet);
}

function removeOutline() {
	console.log('remove!')
	let outlineStylesheet = document.getElementById("a11ycss_outline");
	if ( outlineStylesheet ) { outlineStylesheet.parentNode.removeChild(outlineStylesheet) }
}

function storeOutlineStatus(strStatus, tab) {
	// Get a11y.css stored status
	let getStatus = chrome.storage.local.get("outlineStatus");
	getStatus.then(
		// when we got something
		(item) => {
			let outlineStatus = [];
			if (item && item.outlineStatus) {
				outlineStatus = item.outlineStatus;
			}
			// Add or replace current tab's value
			outlineStatus[tab.id] = {"status": strStatus};
			// And set it back to the storage
			let setting = chrome.storage.local.set({ outlineStatus });
			setting.then(null, onError); // just in case
		}
	);
}

btnOutline.addEventListener('click', async (e) => {
	console.log(e)

	let checked = e.target.getAttribute('aria-checked') === 'true' || false;
	let tab = await getCurrentTab();
	console.info(tab)
	if (checked) {
		chrome.scripting.executeScript({
			target: {tabId: tab.id},
			func: removeOutline
		});
	} else {
		chrome.scripting.executeScript({
			target: {tabId: tab.id},
			func: addOutline
		});
	}
	e.target.setAttribute('aria-checked', String(!checked));
	storeOutlineStatus(!checked, tab);
});

function outlineOnload() {
	let getStatus = chrome.storage.local.get("outlineStatus");
	getStatus.then(
		// when we got something
		async (item) => {
			if (item && item.outlineStatus) {
				console.log(item)
				let tab = await getCurrentTab();
				// If a setting is found for this tab
				if (item.outlineStatus[tab.id]) {
					btnOutline.setAttribute('aria-checked', item.outlineStatus[tab.id].status);
				}
			}
		},
		// we got nothing
		onError
	);
}
outlineOnload();
console.log('hop')
