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
		for (let i in plugins) {
			if (!sortable[plugins[i].pluginName]) continue;
			// Fire global events if it exists in this sortable
			if (
				sortable[plugins[i].pluginName][eventNameGlobal]
			) {
				this.eventCanceled = !!sortable[plugins[i].pluginName][eventNameGlobal]({ sortable, ...evt });
			}

			// Only fire plugin event if plugin is enabled in this sortable,
			// and plugin has event defined
			if (
				sortable.options[plugins[i].pluginName] &&
				sortable[plugins[i].pluginName][eventName]
			) {
				this.eventCanceled = this.eventCanceled || !!sortable[plugins[i].pluginName][eventName]({ sortable, ...evt });
			}
		}
	},
	initializePlugins(sortable, el, defaults) {
		for (let i in plugins) {
			const pluginName = plugins[i].pluginName;
			if (!sortable.options[pluginName] && !plugins[i].initializeByDefault) continue;

			let initialized = new plugins[i](sortable, el);
			initialized.sortable = sortable;
			sortable[pluginName] = initialized;

			// Add default options from plugin
			Object.assign(defaults, initialized.options);
		}

		for (let option in sortable.options) {
			let modified = this.modifyOption(sortable, option, sortable.options[option]);
			if (typeof(modified) !== 'undefined') {
				sortable.options[option] = modified;
			}
		}
	},
	getEventOptions(name, sortable) {
		let eventOptions = {};
		for (let i in plugins) {
			if (typeof(plugins[i].eventOptions) !== 'function') continue;
			Object.assign(eventOptions, plugins[i].eventOptions.call(sortable, name));
		}
		return eventOptions;
	},
	modifyOption(sortable, name, value) {
		let modifiedValue;
		for (let i in plugins) {
			// Plugin must exist on the Sortable
			if (!sortable[plugins[i].pluginName]) continue;

			// If static option listener exists for this option, call in the context of the Sortable's instance of this plugin
			if (plugins[i].optionListeners && typeof(plugins[i].optionListeners[name]) === 'function') {
				modifiedValue = plugins[i].optionListeners[name].call(sortable[plugins[i].pluginName], value);
			}
		}
		return modifiedValue;
	}
};
