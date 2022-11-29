// collection of radio buttons
const level = document.getElementsByName('level');
const button = document.getElementById("a11ycssBtnApply");

console.log(level)

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	// `tab` will either be a `tabs.Tab` instance or `undefined`.
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

/**
 * Helper function for browser storage
 * @param {String} strLevel
 */
function storeA11ycss(strLevel, tab) {
	// Get a11y.css stored levels
	let getLevel = chrome.storage.local.get("a11ycssLevel");
	getLevel.then(
		// when we got something
		(item) => {
			let a11ycssLevel = [];
			if (item && item.a11ycssLevel) {
				a11ycssLevel = item.a11ycssLevel;
			}
			// Add or replace current tab's value
			a11ycssLevel[tab.id] = {"level": strLevel};
			// And set it back to the storage
			let setting = chrome.storage.local.set({ a11ycssLevel });
			setting.then(null, onError); // just in case
		}
	);
}

// store choice when one radio button is chosen
level.forEach(function (key) {
	key.addEventListener('click', async (event) => {
		let tab = await getCurrentTab();
		storeA11ycss(event.target.value, tab);
	});
});

function storeStatus(strStatus, tab) {
	// Get a11y.css stored levels
	let getStatus = chrome.storage.local.get("a11ycssStatus");
	getStatus.then(
		// when we got something
		(item) => {
			let a11ycssStatus = [];
			if (item && item.a11ycssStatus) {
				a11ycssStatus = item.a11ycssStatus;
			}
			// Add or replace current tab's value
			a11ycssStatus[tab.id] = {"status": strStatus};
			// And set it back to the storage
			let setting = chrome.storage.local.set({ a11ycssStatus });
			setting.then(null, onError); // just in case
		}
	);
}


// --------------------------------------
function addA11ycss() {
	let currentLevel = '';
	const level = document.getElementsByName('level');
	const locale = document.body.getAttribute('lang');
	level.forEach(function (key) {
		if (key.checked === true) {
			currentLevel = key.value;
		}
	});
	console.log(document);

	const file = `/css/a11y-${locale}_${currentLevel}.css`;
	let oldStylesheet = document.getElementById("a11ycss_stylechecker");
	if ( oldStylesheet ) { oldStylesheet.parentNode.removeChild(oldStylesheet) }
	let stylesheet = document.createElement("link");
	stylesheet.rel = "stylesheet";
	stylesheet.href = chrome.runtime.getURL(file);
	// @todo Could be a constant, passed as an argument to the function
	// @see https://developer.chrome.com/docs/extensions/mv3/mv3-migration/#cs-func
	stylesheet.id = "a11ycss_stylechecker";
	document.getElementsByTagName("head")[0].appendChild(stylesheet);
}

function removeA11ycss() {
	// @todo Could be a constant, passed as an argument to the function
	// @see https://developer.chrome.com/docs/extensions/mv3/mv3-migration/#cs-func
	let oldStylesheet = document.getElementById("a11ycss_stylechecker");
	if ( oldStylesheet ) { oldStylesheet.parentNode.removeChild(oldStylesheet) }
}

button.addEventListener('click', async (e) => {
	let checked = e.target.getAttribute('aria-checked') === 'true' || false;
	let tab = await getCurrentTab();
	if (checked) {
		chrome.scripting.executeScript({
			target: {tabId: tab.id},
			func: removeA11ycss
		});
		storeStatus('false', tab);
	} else {
		chrome.scripting.executeScript({
			target: {tabId: tab.id},
			func: addA11ycss
		});
		storeStatus('true', tab);
	}
	e.target.setAttribute('aria-checked', String(!checked));
});
// --------------------------------------

// on document load, if we have already chosen a level, give it back
// (the first option is checked in the popup's HTML by default)
function a11ycssOnload() {
	let getLevel = chrome.storage.local.get("a11ycssLevel");
	getLevel.then(
		// when we got something
		async (item) => {
			if (item && item.a11ycssLevel) {
				let tab = await getCurrentTab();
				// If a setting is found for this tab
				if (item.a11ycssLevel[tab.id]) {
					// a level was set already
					level.forEach(function (key) {
						key.checked = key.value === item.a11ycssLevel[tab.id].level;
					});
				}
			}
		},
		// we got nothing
		onError
	);

	let getStatus = chrome.storage.local.get("a11ycssStatus");
	getStatus.then(
		// when we got something
		async (item) => {
			if (item && item.a11ycssStatus) {
				let tab = await getCurrentTab();
				// If a setting is found for this tab
				if (item.a11ycssStatus[tab.id]) {
					button.setAttribute('aria-checked', item.a11ycssStatus[tab.id].status);
				}
			}
		},
		// we got nothing
		onError
	);
}
a11ycssOnload();
