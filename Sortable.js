/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 */


(function (factory){
	"use strict";

	if( typeof define === "function" && define.amd ){
		define(factory);
	}
	else if( typeof module != "undefined" && typeof module.exports != "undefined" ){
		module.exports = factory();
	}
	else {
		window["Sortable"] = factory();
	}
})(function (){
	"use strict";

	var
		  dragEl
		, ghostEl
		, rootEl
		, nextEl

		, lastEl
		, lastCSS
		, lastRect

		, activeGroup

		, tapEvt
		, touchEvt

		, expando = 'Sortable' + (new Date).getTime()

		, win = window
		, document = win.document
		, parseInt = win.parseInt
		, _silent = false

		, _createEvent = function (event/**String*/, item/**HTMLElement*/){
			var evt = document.createEvent('Event');
			evt.initEvent(event, true, true);
			evt.item = item;
			return evt;
		}

		, noop = function (){}
		, slice = [].slice

		, touchDragOverListeners = []
	;


	/**
	 * @class  Sortable
	 * @param  {HTMLElement}  el
	 * @param  {Object}  [options]
	 * @constructor
	 */
	function Sortable(el, options){
		this.el = el; // root element
		this.options = options = (options || {});


		// Defaults
		options.group = options.group || Math.random();
		options.handle = options.handle || null;
		options.draggable = options.draggable || el.children[0] && el.children[0].nodeName || (/[uo]l/i.test(el.nodeName) ? 'li' : '*');
		options.ghostClass = options.ghostClass || 'sortable-ghost';

		options.onAdd = _bind(this, options.onAdd || noop);
		options.onUpdate = _bind(this, options.onUpdate || noop);
		options.onRemove = _bind(this, options.onRemove || noop);


		// Export group name
		el[expando] = options.group;


		// Bind all private methods
		for( var fn in this ){
			if( fn.charAt(0) === '_' ){
				this[fn] = _bind(this, this[fn]);
			}
		}


		// Bind events
		_on(el, 'add', options.onAdd);
		_on(el, 'update', options.onUpdate);
		_on(el, 'remove', options.onRemove);

		_on(el, 'mousedown', this._onTapStart);
		_on(el, 'touchstart', this._onTapStart);
		_on(el, 'selectstart', this._onTapStart);

		_on(el, 'dragover', this._onDragOver);
		_on(el, 'dragenter', this._onDragOver);

		touchDragOverListeners.push(this._onDragOver);
	}


	Sortable.prototype = {
		constructor: Sortable,


		_applyEffects: function (){
			_toggleClass(dragEl, this.options.ghostClass, true);
		},


		_onTapStart: function (evt/**Event|TouchEvent*/){
			var
				  touch = evt.touches && evt.touches[0]
				, target = (touch || evt).target
				, options =  this.options
				, el = this.el
			;

			if( options.handle ){
				target = _closest(target, options.handle, el);
			}

			target = _closest(target, options.draggable, el);

			// IE 9 Support
			if( target && evt.type == 'selectstart' ){
				if( target.tagName != 'A' && target.tagName != 'IMG'){
					target.dragDrop();
				}
			}

			if( target && !dragEl && (target.parentNode === el) ){
				tapEvt = evt;
				target.draggable = true;


				// Disable "draggable"
				_find(target, 'a', _disableDraggable);
				_find(target, 'img', _disableDraggable);


				if( touch ){
					// Touch device support
					tapEvt = {
						  target:  target
						, clientX: touch.clientX
						, clientY: touch.clientY
					};
					this._onDragStart(tapEvt, true);
					evt.preventDefault();
				}


				_on(this.el, 'dragstart', this._onDragStart);
				_on(this.el, 'dragend', this._onDrop);
				_on(document, 'dragover', _globalDragOver);


				try {
					if( document.selection ){
						document.selection.empty();
					} else {
						window.getSelection().removeAllRanges()
					}
				} catch (err){ }
			}
		},


		_emulateDragOver: function (){
			if( touchEvt ){
				_css(ghostEl, 'display', 'none');

				var
					  target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY)
					, parent = target
					, group = this.options.group
					, i = touchDragOverListeners.length
				;

				do {
					if( parent[expando] === group ){
						while( i-- ){
							touchDragOverListeners[i]({
								clientX: touchEvt.clientX,
								clientY: touchEvt.clientY,
								target: target,
								rootEl: parent
							});
						}
						break;
					}

					target = parent; // store last element
				}
				while( parent = parent.parentNode );

				_css(ghostEl, 'display', '');
			}
		},


		_onTouchMove: function (evt/**TouchEvent*/){
			if( tapEvt ){
				var
					  touch = evt.touches[0]
					, dx = touch.clientX - tapEvt.clientX
					, dy = touch.clientY - tapEvt.clientY
				;

				touchEvt = touch;
				_css(ghostEl, 'webkitTransform', 'translate3d('+dx+'px,'+dy+'px,0)');
			}
		},


		_onDragStart: function (evt/**Event*/, isTouch/**Boolean*/){
			var
				  target = evt.target
				, dataTransfer = evt.dataTransfer
			;

			rootEl = this.el;
			dragEl = target;
			nextEl = target.nextSibling;
			activeGroup = this.options.group;

			if( isTouch ){
				var
					  rect = target.getBoundingClientRect()
					, css = _css(target)
					, ghostRect
				;

				ghostEl = target.cloneNode(true);

				_css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
				_css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
				_css(ghostEl, 'width', rect.width);
				_css(ghostEl, 'height', rect.height);
				_css(ghostEl, 'opacity', '0.8');
				_css(ghostEl, 'position', 'fixed');
				_css(ghostEl, 'zIndex', '100000');

				rootEl.appendChild(ghostEl);

				// Fixing dimensions.
				ghostRect = ghostEl.getBoundingClientRect();
				_css(ghostEl, 'width', rect.width*2 - ghostRect.width);
				_css(ghostEl, 'height', rect.height*2 - ghostRect.height);

				// Bind touch events
				_on(document, 'touchmove', this._onTouchMove);
				_on(document, 'touchend', this._onDrop);

				this._loopId = setInterval(this._emulateDragOver, 150);
			}
			else {
				dataTransfer.effectAllowed = 'move';
				dataTransfer.setData('Text', target.textContent);

				_on(document, 'drop', this._onDrop);
			}

			setTimeout(this._applyEffects);
		},


		_onDragOver: function (evt/**Event*/){
			if( !_silent && (activeGroup === this.options.group) && (evt.rootEl === void 0 || evt.rootEl === this.el) ){
				var
					  el = this.el
					, target = _closest(evt.target, this.options.draggable, el)
				;

				if( el.children.length === 0 || el.children[0] === ghostEl || (el === evt.target) && _ghostInBottom(el, evt) ){
					el.appendChild(dragEl);
				}
				else if( target && target !== dragEl && (target.parentNode[expando] !== void 0) ){
					if( lastEl !== target ){
						lastEl = target;
						lastCSS = _css(target);
						lastRect = target.getBoundingClientRect();
					}


					var
						  rect = lastRect
						, width = rect.right - rect.left
						, height = rect.bottom - rect.top
						, floating = /left|right|inline/.test(lastCSS.cssFloat + lastCSS.display)
						, skew = (floating ? (evt.clientX - rect.left)/width : (evt.clientY - rect.top)/height) > .5
						, isWide = (target.offsetWidth > dragEl.offsetWidth)
						, isLong = (target.offsetHeight > dragEl.offsetHeight)
						, nextSibling = target.nextSibling
						, after
					;

					_silent = true;
					setTimeout(_unsilent, 30);

					if( floating ){
						after = (target.previousElementSibling === dragEl) && !isWide || (skew > .5) && isWide
					} else {
						after = (target.nextElementSibling !== dragEl) && !isLong || (skew > .5) && isLong;
					}

					if( after && !nextSibling ){
						el.appendChild(dragEl);
					} else {
						target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
					}
				}
			}
		},


		_onDrop: function (evt/**Event*/){
			clearInterval(this._loopId);

			// Unbind events
			_off(document, 'drop', this._onDrop);
			_off(document, 'dragover', _globalDragOver);

			_off(this.el, 'dragend', this._onDrop);
			_off(this.el, 'dragstart', this._onDragStart);
			_off(this.el, 'selectstart', this._onTapStart);

			_off(document, 'touchmove', this._onTouchMove);
			_off(document, 'touchend', this._onDrop);


			if( evt ){
				evt.preventDefault();
				evt.stopPropagation();

				if( ghostEl ){
					ghostEl.parentNode.removeChild(ghostEl);
				}

				if( dragEl ){
					_toggleClass(dragEl, this.options.ghostClass, false);

					if( !rootEl.contains(dragEl) ){
						// Remove event
						rootEl.dispatchEvent(_createEvent('remove', dragEl));

						// Add event
						dragEl.dispatchEvent(_createEvent('add', dragEl));
					}
					else if( dragEl.nextSibling !== nextEl ){
						// Update event
						dragEl.dispatchEvent(_createEvent('update', dragEl));
					}
				}

				// Set NULL
				rootEl =
				dragEl =
				ghostEl =
				nextEl =

				tapEvt =
				touchEvt =

				lastEl =
				lastCSS =

				activeGroup = null;
			}
		},


		destroy: function (){
			var el = this.el, options = this.options;

			_off(el, 'add', options.onAdd);
			_off(el, 'update', options.onUpdate);
			_off(el, 'remove', options.onRemove);

			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);
			_off(el, 'selectstart', this._onTapStart);

			_off(el, 'dragover', this._onDragOver);
			_off(el, 'dragenter', this._onDragOver);

			//remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function(el) {
				el.removeAttribute('draggable');
			});

			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

			this._onDrop();

			this.el = null;
		}
	};


	function _bind(ctx, fn){
		var args = slice.call(arguments, 2);
		return	fn.bind ? fn.bind.apply(fn, [ctx].concat(args)) : function (){
			return fn.apply(ctx, args.concat(slice.call(arguments)));
		};
	}


	function _closest(el, selector, ctx){
		if( selector === '*' ){
			return el;
		}
		else if( el ){
			ctx = ctx || document;
			selector = selector.split('.');

			var
				  tag = selector.shift().toUpperCase()
				, re = new RegExp('\\s('+selector.join('|')+')\\s', 'g')
			;

			do {
				if(
					   (tag === '' || el.nodeName == tag)
					&& (!selector.length || ((' '+el.className+' ').match(re) || []).length == selector.length)
				){
					return	el;
				}
			}
			while( el !== ctx && (el = el.parentNode) );
		}

		return	null;
	}


	function _globalDragOver(evt){
		evt.dataTransfer.dropEffect = 'move';
		evt.preventDefault();
	}


	function _on(el, event, fn){
		el.addEventListener(event, fn, false);
	}


	function _off(el, event, fn){
		el.removeEventListener(event, fn, false);
	}


	function _toggleClass(el, name, state){
		if( el ){
			if( el.classList ){
				el.classList[state ? 'add' : 'remove'](name);
			}
			else {
				var className = (' '+el.className+' ').replace(/\s+/g, ' ').replace(' '+name+' ', '');
				el.className = className + (state ? ' '+name : '')
			}
		}
	}


	function _css(el, prop, val){
		if( el && el.style ){
			if( val === void 0 ){
				if( document.defaultView && document.defaultView.getComputedStyle ){
					val = document.defaultView.getComputedStyle(el, '');
				}
				else if( el.currentStyle ){
					val	= el.currentStyle;
				}
				return	prop === void 0 ? val : val[prop];
			} else {
				el.style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}


	function _find(ctx, tagName, iterator){
		if( ctx ){
			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
			if( iterator ){
				for( ; i < n; i++ ){
					iterator(list[i], i);
				}
			}
			return	list;
		}
		return	[];
	}


	function _disableDraggable(el){
		return el.draggable = false;
	}


	function _unsilent(){
		_silent = false;
	}


	function _ghostInBottom(el, evt){
		var last = el.lastElementChild.getBoundingClientRect();
		return evt.clientY - (last.top + last.height) > 5; // min delta
	}



	// Export utils
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		bind: _bind,
		closest: _closest,
		toggleClass: _toggleClass
	};


	Sortable.version = '0.1.8';

	// Export
	return	Sortable;
});
