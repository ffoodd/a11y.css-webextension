// collection of radio buttons
const level = document.getElementsByName('level');
const button = document.getElementById("a11ycssBtnApply");

async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

function storeA11ycss(strLevel, tabId) {
	chrome.storage.local.get("a11ycssLevel").then(
		item => {
			let a11ycssLevel = [];
			if (item && item.a11ycssLevel) {
				a11ycssLevel = item.a11ycssLevel;
			}
			a11ycssLevel[tabId] = {"level": strLevel};
			let setting = chrome.storage.local.set({ a11ycssLevel });
			setting.then(null, onError);
		}
	);
}

function storeStatus(strStatus, tabId) {
	chrome.storage.local.get("a11ycssStatus").then(
		item => {
			let a11ycssStatus = [];
			if (item && item.a11ycssStatus) {
				a11ycssStatus = item.a11ycssStatus;
			}
			a11ycssStatus[tabId] = {"status": strStatus};
			let setting = chrome.storage.local.set({ a11ycssStatus });
			setting.then(null, onError);
		}
	);
}

button.addEventListener('click', () => {
	let checked = button.getAttribute('aria-checked') === 'true' || false;
	let currentLevel = '';
	const level = document.getElementsByName('level');
	const locale = document.body.getAttribute('lang');
	level.forEach(function (key) {
		if (key.checked === true) {
			currentLevel = key.value;
		}
	});
	getCurrentTab()
		.then(tab => {
			if (checked) {
				chrome.scripting.removeCSS({
					target: {tabId: tab.id},
					files: [`/css/a11y-${locale}_${currentLevel}.css`]
				});
			} else {
				chrome.scripting.insertCSS({
					target: {tabId: tab.id},
					files: [`/css/a11y-${locale}_${currentLevel}.css`]
				});
			}
		})
		.then(tab => {
			button.setAttribute('aria-checked', String(!checked));
			storeStatus(!checked, tab.id);
			storeA11ycss(currentLevel, tab.id);
		});
});

function a11ycssOnload() {
	chrome.storage.local.get("a11ycssLevel").then(
		item => {
			if (item && item.a11ycssLevel) {
				getCurrentTab().then(tab => {
					if (item.a11ycssLevel[tab.id]) {
						level.forEach(function (key) {
							key.checked = key.value === item.a11ycssLevel[tab.id].level;
						});
					}
				})
			}
		},
		onError
	);

	chrome.storage.local.get("a11ycssStatus").then(
		item => {
			if (item && item.a11ycssStatus) {
				getCurrentTab().then(tab => {
					if (item.a11ycssStatus[tab.id]) {
						button.setAttribute('aria-checked', item.a11ycssStatus[tab.id].status);
					}
				})
			}
		},
		onError
	);
}
a11ycssOnload();
