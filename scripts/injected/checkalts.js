(() => {
	const images = document.getElementsByTagName('img');
	const number = images.length;

	if ( typeof browser !== 'undefined' ) {
		// Firefox
		browser.runtime.sendMessage({a11ycss_images_number: number});
	} else {
		// Edge, Chrome
		if (number === 0) {
			chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
				if (message.a11ycss_should_checkalts) {
					sendResponse('isUseless');
				}
			});
		}
	}

	collectImages = (reporter, images) => {
		const fragment = document.createDocumentFragment();
		const heading = document.createElement('h1');
		heading.innerText = chrome.i18n.getMessage("checkAltsHeading", String(images.length));
		fragment.append(heading);
		const list = document.createElement('ol');

		for (const image of images) {
			const target = `a11ycss-${Math.floor(Math.random() * Date.now()).toString(36)}`;
			const anchor = document.createRange().createContextualFragment(`<a id="${target}"></a>`);
			image.parentNode.insertBefore(anchor, image);

			let alt = '';
			let icon = '';
			switch (image.getAttribute('alt')) {
				case null:
					alt = chrome.i18n.getMessage("altMissing");
					icon = chrome.runtime.getURL("/icons/ko.svg");
					break;
				case '':
					alt = chrome.i18n.getMessage("altEmpty");
					icon = chrome.runtime.getURL("/icons/info.svg");
					break;
				default:
					alt = image.alt;
					icon = chrome.runtime.getURL("/icons/ok.svg");
					break;
			}

			let title = '';
			switch (image.getAttribute('title')) {
				case null:
					title = chrome.i18n.getMessage("altEmpty");
					break;
				case '':
					title = chrome.i18n.getMessage("altMissing");
					break;
				default:
					title = image.title;
					break;
			}

			const figure = `<li>
			<figure role="group">
				<img src="${image.src}" alt="">
				<figcaption style="--a11ycss-icon: url(${icon})">
					<dl>
						<dt><code>alt</code></dt>
						<dd>${alt}</dd>
						<dt><code>title</code></dt>
						<dd>${title}</dd>
					</dl>
					<a href="#${target}" title="${chrome.i18n.getMessage("scrollToImage")}">
						<span class="visually-hidden">${chrome.i18n.getMessage("scrollToImage")}</span>
					</a>
				</figcaption>
			</figure>
		</li>`;

			const item = document.createRange().createContextualFragment(figure);
			list.appendChild(item);
		}

		fragment.append(list);

		reporter.appendChild(fragment);
	}

	toggleReporter = (images) => {
		const reporter = document.getElementById('a11ycss-reporter');
		if (reporter) {
			reporter.innerHTML = '';
			document.body.removeChild(reporter);
			document.body.classList.remove('a11css-active');
		} else {
			const reporter = document.createElement('section');
			reporter.id = 'a11ycss-reporter';
			document.body.appendChild(reporter);
			document.body.classList.add('a11css-active');
			collectImages(reporter, images);
		}
	}

	chrome.runtime.onMessage.addListener(message => {
		if (message.a11ycss_action && message.a11ycss_action === "alt") {
			toggleReporter(images);
		}
	});
})();
