# timekeeping_tauri

![](./doc/screen.png)

This app is just a simple time keeper for work times build as an quasar tauri app. (I needed this for my current work place). It displays the current visible month with all days and allows to input the hour you worked on that day. It's also possible to sign a workday as a holiday (with the little Checkbox on the right side). The app calculates automatically, based on the configuration, your overtime and the rest of your vacation days.

To configure the app, the "Konfiguration" page is used. There you can input your weekly working hours, your yearly count of vacation days and if you want to change the default auto save time, the seconds when the app should auto save.

The auto save option can be enabled on the top right site.

If you need to calculate your working time you can use the "Zeitrechner" page. There you can input your start time, your break and your end time. The calculator will show you how many hours you worked.

All data is saved in different json files, located under (for windows) `C:\Users\User\AppData\Roaming\timekeeping_tauri\data`.
The `configuration.json` contains all the changed configuration data. The `data.json` contains all the input of the timekeeper.

Currently the app only uses the German locale. I will (maybe) add other locales later with a configuration option.

The app is based on the awesome quasar framework (which is using vue).

## dev

```bash
   yarn dev
```

## build

If you want to use the executable, then execute the following.

```bash
   yarn build
   yarn build:tauri
```

After build you can either use the msi installer under `.\timekeeping_tauri\src-tauri\target\release\bundle\timekeeping_tauri_0.1.0_x64_en-US.msi` or you can use the standalone executable under `.\timekeeping_tauri\src-tauri\target\release\timekeeping_tauri.exe`.
