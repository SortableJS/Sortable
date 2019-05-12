import { _getRect, _css, _isScrolledPast, _matrix, _isRectEqual, _indexOfObject } from './utils.js';

export default function AnimationStateManager() {
	let animationStates = [],
		animationCallbackId;

	return {
		captureAnimationState() {
			animationStates = [];
			if (!this.options.animation) return;
			let children = [].slice.call(this.el.children);

			for (let i = 0; i < children.length; i++) {
				if (_css(children[i], 'display') === 'none') continue;
				animationStates.push({
					target: children[i],
					rect: _getRect(children[i])
				});
				let fromRect = _getRect(children[i]);

				// If animating: compensate for current animation
				if (children[i].thisAnimationDuration) {
					let matrix = _matrix(children[i], true);
					fromRect.top -= matrix.f;
					fromRect.left -= matrix.e;
				}

				children[i].fromRect = fromRect;
			}
		},

		addAnimationState(state) {
			animationStates.push(state);
		},

		removeAnimationState(target) {
			animationStates.splice(_indexOfObject(animationStates, { target }), 1);
		},

		animateAll(callback) {
			if (!this.options.animation) {
				clearTimeout(animationCallbackId);
				if (typeof(callback) === 'function') callback();
				return;
			}

			let animating = false,
				animationTime = 0;

			for (var i in animationStates) {
				var time = 0,
					animatingThis = false,
					target = animationStates[i].target,
					fromRect = target.fromRect,
					toRect = _getRect(target),
					prevFromRect = target.prevFromRect,
					prevToRect = target.prevToRect,
					animatingRect = animationStates[i].rect,
					targetMatrix = _matrix(target, true);


				// Compensate for current animation
				toRect.top -= targetMatrix.f;
				toRect.left -= targetMatrix.e;

				target.toRect = toRect;

				// If element is scrolled out of view: Do not animate
				if (
					(
						_isScrolledPast(target, toRect, 'bottom', 'top') ||
						_isScrolledPast(target, toRect, 'top', 'bottom') ||
						_isScrolledPast(target, toRect, 'right', 'left') ||
						_isScrolledPast(target, toRect, 'left', 'right')
					) &&
					(
						_isScrolledPast(target, animatingRect, 'bottom', 'top') ||
						_isScrolledPast(target, animatingRect, 'top', 'bottom') ||
						_isScrolledPast(target, animatingRect, 'right', 'left') ||
						_isScrolledPast(target, animatingRect, 'left', 'right')
					) &&
					(
						_isScrolledPast(target, fromRect, 'bottom', 'top') ||
						_isScrolledPast(target, fromRect, 'top', 'bottom') ||
						_isScrolledPast(target, fromRect, 'right', 'left') ||
						_isScrolledPast(target, fromRect, 'left', 'right')
					)
				) continue;


				if (target.thisAnimationDuration) {
					// Could also check if animatingRect is between fromRect and toRect
					if (
						_isRectEqual(prevFromRect, toRect) &&
						!_isRectEqual(fromRect, toRect) &&
						// Make sure animatingRect is on line between toRect & fromRect
						(animatingRect.top - toRect.top) /
						(animatingRect.left - toRect.left) ===
						(fromRect.top - toRect.top) /
						(fromRect.left - toRect.left)
					) {
						// If returning to same place as started from animation and on same axis
						time = calculateRealTime(animatingRect, prevFromRect, prevToRect, this.options);
					}
				}

				// if fromRect != toRect and not animating to same position as already animating: animate
				if (!_isRectEqual(toRect, fromRect)) {
					target.prevFromRect = fromRect;
					target.prevToRect = toRect;

					if (!time) {
						time = this.options.animation;
					}
					this.animate(
						target,
						animatingRect,
						time
					);
				}

				if (time) {
					animating = true;
					animationTime = Math.max(animationTime, time);
					clearTimeout(target.animationResetTimer);
					target.animationResetTimer = setTimeout((function() {
						this.animationStates[this.i].target.animationTime = 0;
						this.animationStates[this.i].target.prevFromRect = null;
						this.animationStates[this.i].target.fromRect = null;
						this.animationStates[this.i].target.prevToRect = null;
						this.animationStates[this.i].target.thisAnimationDuration = null;
					}).bind({ animationStates, i: Number(i) }), time);
					target.thisAnimationDuration = time;
				}
			}


			clearTimeout(animationCallbackId);
			if (!animating) {
				if (typeof(callback) === 'function') callback();
			} else {
				animationCallbackId = setTimeout(function() {
					if (typeof(callback) === 'function') callback();
				}, animationTime);
			}
			animationStates = [];
		},

		animate(target, prev, duration) {
			if (duration) {
				_css(target, 'transition', '');
				_css(target, 'transform', '');
				var currentRect = _getRect(target),
					matrix = _matrix(this.el),
					scaleX = matrix && matrix.a,
					scaleY = matrix && matrix.d,
					translateX = (prev.left - currentRect.left) / (scaleX || 1),
					translateY = (prev.top - currentRect.top) / (scaleY || 1);

				target.animatingX = !!translateX;
				target.animatingY = !!translateY;

				_css(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');

				repaint(target); // repaint

				_css(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
				_css(target, 'transform', 'translate3d(0,0,0)');
				(typeof target.animated === 'number') && clearTimeout(target.animated);
				target.animated = setTimeout(function () {
					_css(target, 'transition', '');
					_css(target, 'transform', '');
					target.animated = false;

					target.animatingX = false;
					target.animatingY = false;
				}, duration);
			}
		}
	};
}

function repaint(target) {
	return target.offsetWidth;
}


function calculateRealTime(animatingRect, fromRect, toRect, options) {
	return (
		Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) /
		Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2))
	) * options.animation;
}
