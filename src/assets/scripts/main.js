/* eslint-disable no-param-reassign */
import '../style/main.styl';
import scrollMonitor from 'scrollmonitor';

class Tabs {
	constructor(selector) {
		this.element = document.querySelector(selector);
		[...this.element.querySelectorAll('.c-tab-item')].forEach((el, i) => {
			if (!i) {
				this.setValue(el.dataset.value);
			}
			el.addEventListener('click', () => {
				this.setValue(el.dataset.value);
			}, null);
		});
		// this.setValue(this.element.querySelector('.c-tab-item').dataset.value);
		this.element.classList.add('-navigation-ready');
	}

	setValue(value) {
		this.value = value;
		this.current = this.element.querySelector(`.c-tab-item[data-value="${value}"]`);
		[...this.element.querySelectorAll('.-current')].forEach(el => el.classList.remove('-current'));
		this.element.querySelector(`.tab-content[data-value="${value}"]`).classList.add('-current');
		this.current.classList.add('-current');
	}
}

Math.easeInOutQuad = (t, b, c, d) => {
	t /= d / 2;
	if (t < 1) return c / 2 * t * t + b;
	t -= 1;
	return -c / 2 * (t * (t - 2) - 1) + b;
};

const scrollTo = (to, duration) => {
	const start = window.scrollY;
	const change = to - start;
	let currentTime = 0;
	const increment = 20;

	const animateScroll = () => {
		currentTime += increment;
		const val = Math.easeInOutQuad(currentTime, start, change, duration);
		window.scrollTo(0, val);
		if (currentTime < duration) {
			setTimeout(animateScroll, increment);
		}
	};
	animateScroll();
};
[...document.querySelectorAll('.nav-link')].forEach((link) => {
	link.addEventListener('click', (event) => {
		const hasAnchor = /#[a-z-]+/.exec(link.href);
		if (hasAnchor) {
			scrollTo(document.querySelector(hasAnchor[0]).offsetTop, 500);
			// if (document.querySelector('.-is-active')) {
			// 	document.querySelector('.-is-active').classList.remove('-is-active');
			// }
			// link.classList.add('-is-active');
			event.preventDefault();
		}
	});
});

(() => {
	if (window.scrollY > window.innerHeight * 0.1) {
		document.querySelectorAll('.opening[data-opening]').forEach(element => element.classList.remove('opening'));
	} else {
		document.querySelectorAll('[data-opening]:not(.opening)').forEach(element => element.classList.add('opening'));
	}
	[...document.querySelectorAll('img[data-full-size]')].forEach((img) => {
		const defaultSrc = img.dataset.fullSize;
		// img.src = img.dataset.smallSize;
		const lazy = document.createElement('img');
		lazy.classList.add('l-lazy');
		lazy.src = defaultSrc;
		lazy.addEventListener('load', () => {
			img.src = lazy.src;
			img.classList.add('-loaded');
			img.parentNode.removeChild(lazy);
		}, null);
		img.parentNode.appendChild(lazy);
	});
})();

window.addEventListener('scroll', () => {
	if (window.scrollY > window.innerHeight * 0.1) {
		document.querySelectorAll('.opening[data-opening]').forEach(element => element.classList.remove('opening'));
	} else {
		document.querySelectorAll('[data-opening]:not(.opening)').forEach(element => element.classList.add('opening'));
	}
});

document.querySelectorAll('.l-section').forEach((section) => {
	const watcher = scrollMonitor.create(section);

	watcher.enterViewport(() => {
		document.querySelectorAll('.-is-active').forEach(link => link.classList.remove('-is-active'));
		document.querySelectorAll(`a[href="#${section.id}"]`).forEach(link => link.classList.add('-is-active'));
	});
});

// eslint-disable-next-line no-new
new Tabs('.c-tab-nav');
