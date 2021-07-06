/* eslint-disable no-param-reassign */
import '../style/main.styl';

let tabs;

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

(() => {
	[...document.querySelectorAll('.nav-link')].forEach((link) => {
		link.addEventListener('click', (event) => {
			const hasAnchor = /#[a-z-]+/.exec(link.href);
			if (hasAnchor) {
				scrollTo(document.querySelector(hasAnchor[0]).offsetTop, 500);
				if (document.querySelector('.-is-active')) {
					document.querySelector('.-is-active').classList.remove('-is-active');
				}
				if (hasAnchor[0] === '#abertura') {
					document.querySelector('.logo').classList.add('opening');
				} else {
					document.querySelector('.logo').classList.remove('opening');
				}
				link.classList.add('-is-active');
				event.preventDefault();
			}
		});
	});
	tabs = new Tabs('.c-tab-nav');
})();
