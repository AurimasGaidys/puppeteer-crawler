const puppeteer = require("puppeteer");

(async() => {
    const timeout = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
    const onlyUnique = (value, index, self) => {
        return self.indexOf(value) === index;
    };
    const website = "https://www.facebook.com/events/";
    // const browser = await puppeteer.launch({ headless: false });

    const wsChromeEndpointurl =
        "ws://127.0.0.1:9222/devtools/browser/5892f1dd-f0bd-4e3c-9f2d-cbca60c5f07d";
    const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(website);

    let acontinue = 1;
    let interval = 5;
    const timeoutTime = interval * 1000;
    while (acontinue < 99) {
        await page.mouse.wheel({ deltaY: 2500 });
        console.log("aaaa", acontinue);
        acontinue++;
        await timeout(30);
    }

    setTimeout(async() => {
        const result = await page.evaluate(() => {
            let header = document.querySelectorAll("[role=link]");
            const headingList = [...header];
            const links = headingList.map((h) => h.getAttribute("href"));
            const ids = links
                .filter((x) => x.split("/")[1] == "events")
                .map((y) => y.split("/")[2]);

            return ids;
        });

        const eventIdList = result
            .filter((x) => x != "search" && !x.startsWith("?"))
            .filter(onlyUnique);

        var finalResult = eventIdList.map(async(eventId) => {
            const page2 = await browser.newPage();
            await page2.goto("https://www.facebook.com/events/" + eventId);

            page2.waitFor(1000);

            const result2 = await page2.evaluate(() => {
                let header = document.querySelectorAll("[id=seo_h1_tag]");
                const headingList = [...header];
                const title = headingList.map((h) => h.innerHTML);

                let Organizers = [...document.querySelectorAll("[class=profileLink]")];
                const OrganizersHref = Organizers.map((h) => h.getAttribute("href"));

                const OrganizersTitle = Organizers.map((h) => h.innerHTML);
                console.log("Organizer", OrganizersTitle, OrganizersHref);

                let Time = [
                    ...document.querySelectorAll(
                        " #event_time_info > div > table > tbody > tr > td._51m-._4930._phw._51mw > div > div > div:nth-child(2) > div > div._2ycp._5xhk"
                    ),
                ];
                const timed = Time.map((h) => h.getAttribute("content"));

                console.log("aaaa");

                let Image = [
                    ...document.querySelectorAll(
                        "#event_header_primary > div:nth-child(1) > div._3kwh > a > div > img"
                    ),
                ];
                const ImageAlt = Image.map((h) => h.getAttribute("alt"));
                const ImageSrc = Image.map((h) => h.getAttribute("src"));
                const ImagedataSrc = Image.map((h) => h.getAttribute("data-src"));
                // const ids = links.filter(x => x.split("/")[1] == "events").map(y => y.split("/")[2]);

                let locationPuc = [
                    ...document.querySelectorAll(
                        "#event_summary > div > ul > li > div > table > tbody > tr > td > div > div > div > div:nth-child(2) > div > a"
                    ),
                ];
                let adress = [
                    ...document.querySelectorAll(
                        "#event_summary > div > ul > li > div > table > tbody > tr > td > div > div > div > div:nth-child(2) > div > div > a"
                    ),
                ];
                const locLink = locationPuc.map((h) => h.getAttribute("href"));
                const locPubText2 = locationPuc.map((h) => h.innerHTML);
                const addressPubText2 = adress.map((h) => h.innerHTML);

                let locationPrv = [...document.querySelectorAll("#event_summary img")];
                const mapLink = locationPrv
                    .map((h) => h.getAttribute("src"))
                    .filter((x) => x.includes("&markers="))[0];
                marker = mapLink.split("&markers=")[1].split("%2C");

                const description = [
                    ...document.querySelectorAll(
                        "#reaction_units > div > div > div > div > div:nth-child(2) > div > div > div > span"
                    ),
                ];
                const descriptionText = description.map((h) => h.innerHTML);

                return {
                    image: {
                        alt: ImageAlt,
                        src: ImageSrc,
                        dataSrc: ImagedataSrc,
                    },
                    title: title,
                    description: descriptionText,
                    organizersTitle: OrganizersTitle,
                    OrganizersHref: OrganizersHref,
                    time: timed,
                    location: {
                        type: "",
                        title: locPubText2,
                        link: locLink,
                        address: addressPubText2,
                        onMap: {
                            lat: marker[0].slice(0, 7),
                            long: marker[1].slice(0, 7),
                            link: mapLink,
                        },
                    },
                };
            });

            console.log("Printing object: result2", result2);
            return result2.title;
        });

        Promise.all(finalResult).then((values) => {
            console.log(values);
        });
    }, timeoutTime);
    // await page.screenshot({ path: 'example.png' });
    // setTimeout(async () => {
    //     await browser.close();
    // }, 5000);
})();