const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });

    const page2 = await browser.newPage();
    await page2.goto("https://www.facebook.com/events/" + 248054027165889);

    page2.waitFor(1000);

    const result2 = await page2.evaluate(() => {
        let header = document.querySelectorAll("[id=seo_h1_tag]");
        const headingList = [...header];
        const title = headingList.map(h => h.innerHTML);
        console.log('Printing object: titles', title);

        let Organizers = [...document.querySelectorAll("[class=profileLink]")];
        const OrganizersHref = Organizers.map(h => h.getAttribute("href"));

        const OrganizersTitle = Organizers.map(h => h.innerHTML);
        console.log('Printing object: OrganizersTitle', OrganizersTitle);
        console.log('Printing object: OrganizersHref', OrganizersHref);

        let Time = [...document.querySelectorAll(" #event_time_info > div > table > tbody > tr > td._51m-._4930._phw._51mw > div > div > div:nth-child(2) > div > div._2ycp._5xhk")];
        const timed = Time.map(h => h.getAttribute("content"));

        console.log("aaaa");

        let Image = [...document.querySelectorAll("#event_header_primary > div:nth-child(1) > div._3kwh > a > div > img")];
        const ImageAlt = Image.map(h => h.getAttribute("alt"));
        const ImageSrc = Image.map(h => h.getAttribute("src"));
        const ImagedataSrc = Image.map(h => h.getAttribute("data-src"));
        // const ids = links.filter(x => x.split("/")[1] == "events").map(y => y.split("/")[2]);


        let locationPuc = [...document.querySelectorAll("#event_summary > div > ul > li > div > table > tbody > tr > td > div > div > div > div:nth-child(2) > div > a")];
        let adress = [...document.querySelectorAll("#event_summary > div > ul > li > div > table > tbody > tr > td > div > div > div > div:nth-child(2) > div > div > a")];
        const locLink = locationPuc.map(h => h.getAttribute("href"));
        const locPubText2 = locationPuc.map(h => h.innerHTML);
        const addressPubText2 = adress.map(h => h.innerHTML);


        let locationPrv = [...document.querySelectorAll("#event_summary img")];
        const mapLink = locationPrv.map(h => h.getAttribute("src")).filter(x => x.includes("&markers="))[0];
        marker = mapLink.split("&markers=")[1].split("%2C");

        const description = [...document.querySelectorAll("#reaction_units > div > div > div > div > div:nth-child(2) > div > div > div > span")];
        const descriptionText = description.map(h => h.innerHTML);

        //         https://external.fnic2-2.fna.fbcdn.net/static_map.php?v=2019&ccb=4-4&size=240x132&center=34.71286962864%2C3
        // 3.167434432407&zoom=15&markers=34.71286963%2C33.16743443&language=el_GR'
        // const isOnline = 

        // if(isOnline) {

        // } else {

        // }




        return {
            image: {
                alt: ImageAlt,
                src: ImageSrc,
                dataSrc: ImagedataSrc
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
                    link: mapLink
                }
            }
        };
    })

    console.log('Printing object: result2', result2);

    setTimeout(async () => {
        await browser.close();
    }, 5000);

})();