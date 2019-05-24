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
			let canceled = false;

			// Fire global events if it exists in this sortable
			if (
				sortable[plugins[i].pluginName][eventNameGlobal]
			) {
				canceled = canceled || sortable[plugins[i].pluginName][eventNameGlobal]({ sortable, ...evt });
			}

			// Only fire plugin event if plugin is enabled in this sortable,
			// and plugin has event defined
			if (
				sortable.options[plugins[i].pluginName] &&
				sortable[plugins[i].pluginName][eventName]
			) {
				canceled = canceled || sortable[plugins[i].pluginName][eventName]({ sortable, ...evt });
			}
			if (canceled) {
				this.eventCanceled = true;
			}
		}
	},
	initializePlugins(sortable, el) {
		let initializedPlugins = {};
		for (let i in plugins) {
			if (!sortable.options[plugins[i].pluginName] && !plugins[i].initializeByDefault) continue;
			initializedPlugins[plugins[i].pluginName] = new plugins[i](sortable, el);
		}
		return initializedPlugins;
	},
	getEventOptions(name, sortable) {
		let eventOptions = {};
		for (let i in plugins) {
			if (typeof(plugins[i].eventOptions) !== 'function') continue;
			eventOptions = {
				...eventOptions,
				...plugins[i].eventOptions(name, sortable)
			};
		}
		return eventOptions;
	}
};
