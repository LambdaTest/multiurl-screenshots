//Include all the screenshot parameters in this configuration file
module.exports = {
     urllist_profiles: [{"url": "<Put Url 1>","profile_id": "<Respective added Profile>"}, {"url": "<Put Url 2>","profile_id": "<Respective added Profile>"}],
     BrowserConfigurations: {
        "windows 10": {
          "chrome": [
            "76",
            "75"
          ],
          "firefox": [
            "67",
            "66"
          ],
          "opera": [
            "58",
            "57"
          ],
          "ie": [
            "11"
          ]
        },
        "macos mojave": {
          "chrome": [
            "76",
            "75"
          ],
          "firefox": [
            "67",
            "66"
          ],
          "opera": [
            "58",
            "57"
          ],
          "safari": [
            "12"
          ]
        },
        "ios 12.0": {
          "devices": [
            "iphone xr",
            "iphone xs",
            "iphone xs max"
          ]
        },
        "android 9.0": {
          "devices": [
            "galaxy s9 plus"
          ]
        }
      },
     defer_time: 3,
     email: false,
     layout: "portrait",
     mac_res: "1024x768",
     win_res: "1366X768",
     smart_scroll: true
};
