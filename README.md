# /vrg/ Tierlist Auto Changelog

##### Prelude
I wanted to have a changelog for the tier list to keep track of who gets added, removed or changes their picture. Manually doing a changelog is annoying busywork for S so I made it automatically curl the site and keep an archive.
Install node and the following dependencies.
```
npm install puppeteer, cheerio, axios, node-fetch
```
You may need to set your browser path in grabvrg.js as it's set to the default windows path, see `executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'`

### Automatic Usage (recommended):
node autodiff.js 7
Clones today and compares it to an interval set by you (7 days recommended), appends changes to vrgchanges.txt
Sync this up with your cronjob (e.g. if your cronjob runs every 7 days, set it to autodiff.js 7)
Cronjob example:
```
0 0 * * 0 node autodiff.js 7
```
Don't forget to include the full path to `autodiff.js`. 
Also a bunch of paths are hardcoded lol expect to take a few minutes debugging.

### Manual usage:
To clone every image
```
node grabvrg.js
```
Will shit out every image on the tier list to your chosen path (default directoryPath = `C:\\vrgimages\\${today}`)
Appends today's date. Best used when added to a cronjob that runs once per week as it's not updated super regularly.
The total of all images tends to be ~30MB so consider after a year that's ~1.5GB, should be fine. 

To diff between folders
```
node diffvrg.js <date> <date2>
```
Example: 
```
node diffvrg.js 2024-05-03 2024-05-04
```


> Notes about the tier list
Every changed picture is requested, but not required to be the person themselves.
Every new person is requested or approved by themselves.
Be mindful of S hosting costs, don't spam this please.

**Original Author: Schiz N**
