(function () {
	'use strict';

	function simulateEvent(el, type, options) {
		var event;
		var ownerDocument = el.ownerDocument;

		options = options || {};

		if (/^mouse/.test(type)) {
			event = ownerDocument.createEvent('MouseEvents');
			event.initMouseEvent(type, true, true, ownerDocument.defaultView,
				options.button, options.screenX, options.screenY, options.clientX, options.clientY,
				options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, el);
		} else {
			event = ownerDocument.createEvent('CustomEvent');

			event.initCustomEvent(type, true, true, ownerDocument.defaultView,
				options.button, options.screenX, options.screenY, options.clientX, options.clientY,
				options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, el);

			event.dataTransfer = {
				data: {},

				setData: function (type, val) {
					this.data[type] = val;
				},

				getData: function (type) {
					return this.data[type];
				}
			};
		}

		if (el.dispatchEvent) {
			el.dispatchEvent(event);
		} else if (el.fireEvent) {
			el.fireEvent('on' + type, event);
		}

		return event;
	}

	function getTraget(target) {
		var children = document.getElementById(target.el.substr(1)).children;
		return (
			children[target.index] ||
			children[target.index === 'first' ? 0 : -1] ||
			children[target.index === 'last' ? children.length - 1 : -1]
		);
	}

	function getRect(el) {
		var rect = el.getBoundingClientRect();
		var width = rect.right - rect.left;
		var height = rect.bottom - rect.top;

		return {
			x: rect.left,
			y: rect.top,
			cx: rect.left + width/2,
			cy: rect.top + height/2,
			w: width,
			h: height,
			hw: width/2,
			wh: height/2
		}
	}

	function simulateDrag(options, callback) {
		var fromEl = getTraget(options.from);
		var toEl = getTraget(options.to);

		var fromRect = getRect(fromEl);
		var toRect = getRect(toEl);

		var dotEl = document.createElement('div');

		dotEl.style.cssText = 'position: fixed; background: red; width: 10px; height: 10px; opacity: .4; margin: -5px 0 0 -5px; transition: all .3s; border-radius: 100%;';
		document.body.appendChild(dotEl);

		var startTime = new Date().getTime();
		var duration = options.duration || 1000;

		simulateEvent(fromEl, 'mousedown', {button: 0});
		simulateEvent(toEl, 'dragstart');

		requestAnimationFrame(function loop() {
			var progress = (new Date().getTime() - startTime)/duration;
			var x = fromRect.cx + (toRect.cx - fromRect.cx) * progress;
			var y = fromRect.cy + (toRect.cy - fromRect.cy) * progress;
			var overEl = fromEl.ownerDocument.elementFromPoint(x, y);

			dotEl.style.display = 'none';
			dotEl.style.left = x + 'px';
			dotEl.style.top = y + 'px';

			overEl && simulateEvent(overEl, 'dragover', {
				clientX: x,
				clientY: y
			});

			if (progress < 1) {
				dotEl.style.display = '';
				requestAnimationFrame(loop);
			} else {
				simulateEvent(toEl, 'drop');
				callback();
			}
		});
	}


	// Export
	window.simulateEvent = simulateEvent;
	window.simulateDrag = simulateDrag;
})();
