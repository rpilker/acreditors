/* eslint-disable no-param-reassign */
import '../style/main.styl';
import scrollMonitor from 'scrollmonitor';

class Tabs {
	constructor(selector) {
		this.element = document.querySelector(selector);
		[...this.element.querySelectorAll('.c-tab-item')].forEach((el, i, arr) => {
			if (!i) {
				this.setValue(el.dataset.value);
			}
			el.setAttribute('tabIndex', 0);
			el.addEventListener('click', () => {
				this.setValue(el.dataset.value);
			}, null);
			// el.addEventListener('mouseenter', () => {
			// 	this.setValue(el.dataset.value);
			// }, null);
			el.addEventListener('keydown', (event) => {
				// this.setValue(el.dataset.value);
				const focusNext = () => {
					if (arr[i + 1]) {
						arr[i + 1].focus();
					} else {
						arr[0].focus();
					}
				};
				const focusPrev = () => {
					if (arr[i - 1]) {
						arr[i - 1].focus();
					} else {
						arr[arr.length - 1].focus();
					}
				};
				switch (event.code) {
				case 'Space':
				case 'Enter':
					this.setValue(el.dataset.value);
					event.preventDefault();
					break;
				case 'ArrowDown':
					focusNext();
					event.preventDefault();
					break;
				case 'ArrowUp':
					focusPrev();
					event.preventDefault();
					break;
				default:
					console.log(event.code);
					break;
				}
			}, null);
		});
	}

	setValue(value) {
		this.value = value;
		this.current = this.element.querySelector(`.c-tab-item[data-value="${value}"]`);
		[...this.element.querySelectorAll('.-current')].forEach((el) => {
			el.classList.remove('-current');
			if (el.classList.contains('c-tab-item')) {
				el.setAttribute('aria-selected', 'false');
			} else {
				el.setAttribute('aria-hidden', 'true');
			}
		});
		this.element.querySelector(`.tab-content[data-value="${value}"]`).classList.add('-current');
		this.element.querySelector(`.tab-content[data-value="${value}"]`).setAttribute('aria-hidden', 'false');
		this.current.classList.add('-current');
		this.current.setAttribute('aria-selected', 'true');
	}
}

// eslint-disable-next-line no-new
new Tabs('.c-tab-nav');

Math.easeInOutQuad = (t, b, c, d) => {
	t /= d / 2;
	if (t < 1) return c / 2 * t * t + b;
	t -= 1;
	return -c / 2 * (t * (t - 2) - 1) + b;
};

const scrollTo = (to, duration, element = window) => {
	const start = element.scrollY || element.scrollTop;
	const change = to - start;
	let currentTime = 0;
	const increment = 20;

	const animateScroll = () => {
		currentTime += increment;
		const val = Math.easeInOutQuad(currentTime, start, change, duration);
		element.scrollTo(0, val);
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
			const headerHeight = document.querySelector('.l-header').clientHeight;
			// const headerHeight = 0;
			const anchor = document.querySelector(hasAnchor[0]);
			scrollTo((anchor.offsetTop + anchor.children[0].offsetTop) - headerHeight - 10, 500);
			event.preventDefault();
		}
	});
});

// const getSvgCenter = (path) => {
// 	const parent = path.parentNode;
// 	const ratio = parent.getBoundingClientRect().width / parent.getBBox().width;
// 	const bbox = path.getBBox();
// 	return [Math.round(bbox.x + (bbox.width / 2)), bbox.y, ratio];
// };

// const setTooltipPos = (tooltip, tooltipBack, { left, top }, fix = false) => {
// 	const padding = [3, 15, 7, 15];
// 	tooltip.setAttribute('x', left);
// 	tooltip.setAttribute('y', top);
// 	setTimeout(() => {
// 		const {
// 			y: textY, x: textX, width: textWidth, height: textHeight,
// 		} = tooltip.getBBox();
// 		if (!fix && textY - padding[0] < 10) {
// 			setTooltipPos(tooltip, tooltipBack, { left, top: padding[0] }, true);
// 		} else if (!fix && textX - (textWidth / 2) - padding[3] < 0) {
// 			setTooltipPos(tooltip, tooltipBack, { left: (textWidth / 2) + padding[3] + 1, top: top < 0 ? 0 : top }, true);
// 		} else if (!fix && textX + textWidth + padding[1] > tooltip.parentNode.getBBox().width) {
// 			setTooltipPos(tooltip, tooltipBack, { left: tooltip.parentNode.getBBox().width - (textWidth / 2) - padding[3] - 50, top: top < 0 ? 0 : top }, true);
// 		} else {
// 			tooltipBack.setAttribute('x', textX - padding[3]);
// 			tooltipBack.setAttribute('y', textY - padding[0]);
// 			tooltipBack.setAttribute('width', textWidth + padding[3] + padding[1]);
// 			tooltipBack.setAttribute('height', textHeight + padding[2] + padding[0]);
// 			tooltip.classList.add('-show');
// 			tooltipBack.classList.add('-show');
// 		}
// 	}, 10);
// };

[...document.querySelectorAll('[data-nome]')].forEach((path) => {
	path.addEventListener('mouseover', () => {
		if (!path.classList.contains('path-over')) {
			const hoverPath = document.querySelector('.path-over');
			hoverPath.setAttribute('d', path.getAttribute('d'));
			hoverPath.dataset.nome = path.dataset.nome;
			const row = [...document.querySelectorAll('.table tr')].find(rowEl => rowEl.innerText === path.dataset.nome);
			if (document.querySelector(('.table .-selected'))) {
				document.querySelector(('.table .-selected')).classList.remove('-selected');
			}
			row.classList.add('-selected');
		}
	});
	path.addEventListener('click', () => {
		const row = [...document.querySelectorAll('.table tr')].find(rowEl => rowEl.innerText === path.dataset.nome);
		if (row.offsetTop > row.parentNode.parentNode.parentNode.clientHeight - row.parentNode.parentNode.parentNode.scrollTop) {
			scrollTo(row.offsetTop, 100, row.parentNode.parentNode.parentNode);
		}
	});
});
[...document.querySelectorAll('.table tr')].forEach((row) => {
	row.addEventListener('mouseenter', () => {
		const path = document.querySelector(`.mapa path[data-nome="${row.innerText}"]`);
		const hoverPath = document.querySelector('.path-over');
		hoverPath.setAttribute('d', path.getAttribute('d'));
		if (document.querySelector(('.table .-selected'))) {
			document.querySelector(('.table .-selected')).classList.remove('-selected');
		}
		row.classList.add('-selected');
	});
});
document.querySelector('.mapa').addEventListener('mouseleave', () => {
	document.querySelector('.path-over').setAttribute('d', '');
});
document.querySelector('.mapa').addEventListener('mouseover', (e) => {
	if (e.path[0].tagName.toLowerCase() !== 'path') {
		document.querySelector('.path-over').setAttribute('d', '');
	}
});

(() => {
	[...document.querySelectorAll('.loading')].forEach(el => el.classList.add('loaded'));
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

document.querySelectorAll('.l-section h2').forEach((anchor) => {
	const section = anchor.parentNode;
	const watcher = scrollMonitor.create(anchor);

	watcher.fullyEnterViewport(() => {
		document.querySelectorAll('.-is-active').forEach(link => link.classList.remove('-is-active'));
		document.querySelectorAll(`a[href="#${section.id}"]`).forEach((link) => {
			link.classList.add('-is-active');
			if (link.classList.contains('-header')) {
				link.parentNode.parentNode.scrollLeft = link.parentNode.offsetLeft;
			}
		});
	});
});
