let plugins = [];

const defaults = {
	initializeByDefault: true
};

export default {
	mount(plugin) {
		// Set default static properties
		for (let option in defaults) {
			!(option in plugin) && (plugin[option] = defaults[option]);
		}
		plugins.push(plugin);
	},
	pluginEvent(eventName, sortable, evt) {
		this.eventCanceled = false;
		const eventNameGlobal = eventName + 'Global';
		plugins.forEach(plugin => {
			if (sortable[plugin.pluginName]) {
				// Fire global events if it exists in this sortable
				if (
					sortable[plugin.pluginName][eventNameGlobal]
				) {
					this.eventCanceled = !!sortable[plugin.pluginName][eventNameGlobal]({sortable, ...evt});
				}

				// Only fire plugin event if plugin is enabled in this sortable,
				// and plugin has event defined
				if (
					sortable.options[plugin.pluginName] &&
					sortable[plugin.pluginName][eventName]
				) {
					this.eventCanceled = this.eventCanceled || !!sortable[plugin.pluginName][eventName]({sortable, ...evt});
				}
			}
		});
	},
	initializePlugins(sortable, el, defaults) {
		plugins.forEach(plugin => {
			const pluginName = plugin.pluginName;
			if (sortable.options[pluginName] || plugin.initializeByDefault) {

				let initialized = new plugin(sortable, el);
				initialized.sortable = sortable;
				sortable[pluginName] = initialized;

				// Add default options from plugin
				Object.assign(defaults, initialized.options);
			}
		});

		for (let option in sortable.options) {
			let modified = this.modifyOption(sortable, option, sortable.options[option]);
			if (typeof(modified) !== 'undefined') {
				sortable.options[option] = modified;
			}
		}
	},
	getEventOptions(name, sortable) {
		let eventOptions = {};
		plugins.forEach(plugin => {
			if (typeof(plugin.eventOptions) === 'function') {
				Object.assign(eventOptions, plugins[i].eventOptions.call(sortable, name));
			}
		});
		return eventOptions;
	},
	modifyOption(sortable, name, value) {
		return plugins.find(plugin => {
			// Plugin must exist on the Sortable
			if (sortable[plugin.pluginName]) {
				// If static option listener exists for this option, call in the context of the Sortable's instance of this plugin
				if (plugin.optionListeners && typeof (plugin.optionListeners[name]) === 'function') {
					return  plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
				}
			}
		});
	}
};
