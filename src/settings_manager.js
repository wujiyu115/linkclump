const CURRENT_VERSION = "5";
class SettingsManager {
  constructor() {}
  async load() {
    try {
      // load data from chrome storage
      const data = await chrome.storage.local.get(["settings"]);
      
      // attempt to parse, if no data exists then initialize
      if (!data.settings) {
        return this.init();
      }
      return JSON.parse(data.settings);
    } catch(error) {
      var settings = await this.init();
      settings.error = "Error: "+error;
      return settings;
    }
  }
  async save(settings) {
    // remove any error messages from object (shouldn't be there)
    if (settings.error !== undefined) {
      delete settings.error;
    }
    
    await chrome.storage.local.set({"settings": JSON.stringify(settings)});
  }
  async isInit() {
    const data = await chrome.storage.local.get(["version"]);
    return data.version !== undefined;
  }
  async isLatest() {
    const data = await chrome.storage.local.get(["version"]);
    return data.version === CURRENT_VERSION;
  }
  async init() {
    // create default settings for first time user
    var settings = {
      "actions": {
        "101": {
          "mouse": 0,  // left mouse button
          "key": 90,   // z key
          "action": "tabs",
          "color": "#FFA500",
          "options": {
            "smart": 0,
            "ignore": [0],
            "delay": 0,
            "close": 0,
            "block": true,
            "reverse": false,
            "end": false
          }
        }
      },
      "blocked": []
    };
    // save settings to store
    await chrome.storage.local.set({
      "settings": JSON.stringify(settings),
      "version": CURRENT_VERSION
    });
    
    return settings;
  }
}
