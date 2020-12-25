let plugins = [];

const defaults = {
  initializeByDefault: true,
};

const pluginManager = {
  mount(plugin) {
    // Set default static properties
    for (let option in defaults) {
      if (defaults.hasOwnProperty(option) && !(option in plugin)) {
        plugin[option] = defaults[option];
      }
    }

    //  only add plugins once, even if they're mounted multiple times
    if (!plugins.map((p) => p.name).includes(plugin.name)) {
      plugins.push(plugin);
    }
  },
  pluginEvent(eventName, sortable, evt) {
    this.eventCanceled = false;
    evt.cancel = () => {
      this.eventCanceled = true;
    };
    const eventNameGlobal = eventName + "Global";
    plugins.forEach((plugin) => {
      if (!sortable[plugin.pluginName]) return;
      // Fire global events if it exists in this sortable
      if (sortable[plugin.pluginName][eventNameGlobal]) {
        sortable[plugin.pluginName][eventNameGlobal]({ sortable, ...evt });
      }

      // Only fire plugin event if plugin is enabled in this sortable,
      // and plugin has event defined
      if (
        sortable.options[plugin.pluginName] &&
        sortable[plugin.pluginName][eventName]
      ) {
        sortable[plugin.pluginName][eventName]({ sortable, ...evt });
      }
    });
  },
  initializePlugins(sortable, el, defaults, options) {
    plugins.forEach((plugin) => {
      const pluginName = plugin.pluginName;
      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;

      let initialized = new plugin(sortable, el, sortable.options);
      initialized.sortable = sortable;
      initialized.options = sortable.options;
      sortable[pluginName] = initialized;

      // Add default options from plugin
      Object.assign(defaults, initialized.defaults);
    });

    for (let option in sortable.options) {
      if (!sortable.options.hasOwnProperty(option)) continue;
      let modified = this.modifyOption(
        sortable,
        option,
        sortable.options[option]
      );
      if (typeof modified !== "undefined") {
        sortable.options[option] = modified;
      }
    }
  },
  getEventProperties(name, sortable) {
    let eventProperties = {};
    plugins.forEach((plugin) => {
      if (typeof plugin.eventProperties !== "function") return;
      Object.assign(
        eventProperties,
        plugin.eventProperties.call(sortable[plugin.pluginName], name)
      );
    });

    return eventProperties;
  },
  modifyOption(sortable, name, value) {
    let modifiedValue;
    plugins.forEach((plugin) => {
      // Plugin must exist on the Sortable
      if (!sortable[plugin.pluginName]) return;

      // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin
      if (
        plugin.optionListeners &&
        typeof plugin.optionListeners[name] === "function"
      ) {
        modifiedValue = plugin.optionListeners[name].call(
          sortable[plugin.pluginName],
          value
        );
      }
    });

    return modifiedValue;
  },
};

export default pluginManager;
