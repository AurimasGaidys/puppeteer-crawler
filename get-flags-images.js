const puppeteer = require('puppeteer');
const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');

(async() => {
    const download = (url, dest, cb) => {
        const file = fs.createWriteStream(dest);

        const request = https.get(url, (response) => {
            // check if response is success
            if (response.statusCode !== 200) {
                return cb('Response status was ' + response.statusCode);
            }

            response.pipe(file);
        });

        // close() is async, call cb after close completes
        file.on('finish', () => file.close(cb));

        // check for request error too
        request.on('error', (err) => {
            fs.unlink(dest);
            return cb(err.message);
        });

        file.on('error', (err) => { // Handle errors
            fs.unlink(dest); // Delete the file async. (But we don't check the result) 
            return cb(err.message);
        });
    };

    const browser = await puppeteer.launch({ headless: false });

    console.log("Start");

    const page = await browser.newPage();
    await page.goto("https://www.worldatlas.com/countries");

    page.waitFor(1000);

    const result = await page.evaluate(() => {
        let header = document.querySelectorAll("#country_list img"); // #country_list > li:nth-child(1) > a > figure > img
        const headingList = [...header];
        const links = headingList.map(h => h.getAttribute("src"));
        // const ids = links.filter(x => x.split("/")[1] == "events").map(y => y.split("/")[2]);

        return links;
    })

    console.log("result:", result);

    // System will not create Folder
    // Create it manualy yourself
    result.forEach(x => {
        var name = x.split("flag/")[1];
        const file = fs.createWriteStream(name);
        // both work, v2 works nicer
        // v2
        download(x, "flags/" + name, () => { console.log("done") })
            // v1
            // const request = https.get(x, function(response) {
            //   response.pipe(file);
            // });
    });


    // await page.screenshot({ path: 'example.png' });
    setTimeout(async() => {
        await browser.close();
    }, 5000);

})();