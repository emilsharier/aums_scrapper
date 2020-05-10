const puppeteer = require('puppeteer')

const url = 'https://amritavidya-am-student.amrita.edu:8444/cas/login'

let l = 'lol'

let init = async (username, password) => {
    let name = {}
    let tName = ''
    let imageUrl = ''
    let id
    let details = []
    try {
        const browser = await puppeteer.launch({ headless: true })
        const context = await browser.createIncognitoBrowserContext()

        let page = await context.newPage()
        await page.goto(url, { waitUntil: "networkidle2" })
        await page.type('#username', username)
        await page.type('#password', password)
        await page.screenshot({ path: "screenshot.png" })
        await page.keyboard.press('Enter')
        await page.waitForNavigation()
        await page.goto('https://amritavidya-am-student.amrita.edu:8444/aums/Jsp/Core_Common/index.jsp')

        name = await page.evaluate(() => {
            let tempNameID = document.querySelector("td[class='style3']").innerText
            return {
                "nameID": tempNameID,
            }
        })

        await page.goto('https://amritavidya-am-student.amrita.edu:8444/aums/Jsp/Attendance/AttendanceReportStudent.jsp?action=UMS-ATD_INIT_ATDREPORTSTUD_SCREEN&isMenu=true&pagePostSerialID=16', { waitUntil: "domcontentloaded" })

        // await page.screenshot({ path: 'beforeclick.png' })
        await page.select('.combo', '363')

        await page.evaluate(() => {
            checkValuesSummary('UMS-ATD_SHOW_ATDSUMMARY_SCREEN')
        })

        await page.waitForNavigation()

        details = await page.evaluate(() => {
            let t = document.querySelectorAll('span[class=rowBG1]')
            let temp = []
            let tempMap = []
            for (let span of t)
                if (span.innerHTML != '&nbsp;')
                    temp.push(span.innerText)
            temp.splice(0, 10)

            for (let i = temp.length - 1; i > 0; i--) {
                if (temp[i] == 'Total' || temp[i] == 'Regular') {
                    temp.splice(i, 1)
                }
            }

            for (let index = 0; index < temp.length; index += 7)
                tempMap.push({
                    "paper_id": temp[index],
                    "paper_name": temp[index + 1],
                    "year": temp[index + 2],
                    "no_of_classes": temp[index + 3],
                    "attended": temp[index + 4],
                    "attendance_percent": temp[index + 5]
                })
            return tempMap
        })
        // await page.waitForFunction()
        // await page.waitForFunction()
        await page.screenshot({ path: 'afterclick.png' })

        console.log(details)

        id = name.nameID.slice(name.nameID.indexOf('('), name.nameID.indexOf(')')).replace('(', '').trim()
        tName = name.nameID.replace('Welcome ', '').replace('(' + id + ')', '').trim()

        name = {
            "name": tName,
            "id": id,
            "url": name.url
        }

        await browser.close()
        return name
    }

    catch (ex) {
        console.log('The error is ')
        console.log(ex)
    }
}

let getAttendance = async (username, password, semester) => {
    try {
        const browser = await puppeteer.launch({ headless: true })
        const context = await browser.createIncognitoBrowserContext()

        let page = await context.newPage()
        await page.goto(url, { waitUntil: "networkidle2" })
        await page.type('#username', username)
        await page.type('#password', password)
        await page.screenshot({ path: "screenshot.png" })
        await page.keyboard.press('Enter')
        await page.waitForNavigation()
        await page.goto('https://amritavidya-am-student.amrita.edu:8444/aums/Jsp/Core_Common/index.jsp')

        await page.goto('https://amritavidya-am-student.amrita.edu:8444/aums/Jsp/Attendance/AttendanceReportStudent.jsp?action=UMS-ATD_INIT_ATDREPORTSTUD_SCREEN&isMenu=true&pagePostSerialID=16', { waitUntil: "domcontentloaded" })

        await page.select('.combo', semester)

        await page.evaluate(() => {
            checkValuesSummary('UMS-ATD_SHOW_ATDSUMMARY_SCREEN')
        })

        await page.waitForNavigation()

        details = await page.evaluate(() => {
            let t = document.querySelectorAll('span[class=rowBG1]')
            let temp = []
            let tempMap = []
            for (let span of t)
                if (span.innerHTML != '&nbsp;')
                    temp.push(span.innerText)
            temp.splice(0, 10)

            for (let i = temp.length - 1; i > 0; i--) {
                if (temp[i] == 'Total' || temp[i] == 'Regular') {
                    temp.splice(i, 1)
                }
            }

            for (let index = 0; index < temp.length; index += 7)
                tempMap.push({
                    "paper_id": temp[index],
                    "paper_name": temp[index + 1],
                    "year": temp[index + 2],
                    "no_of_classes": temp[index + 3],
                    "attended": temp[index + 4],
                    "attendance_percent": temp[index + 5]
                })
            return tempMap
        })

        await browser.close()
        return details
    }

    catch (ex) {
        console.log('Ran into some error')
        console.log(ex)
    }
}

let getInternalMarks = async (username, password, semester) => {
    try {
        const browser = await puppeteer.launch({ headless: true })
        const context = await browser.createIncognitoBrowserContext()

        let page = await context.newPage()
        await page.goto(url, { waitUntil: "networkidle2" })
        await page.type('#username', username)
        await page.type('#password', password)
        await page.screenshot({ path: "screenshot.png" })
        await page.keyboard.press('Enter')
        await page.waitForNavigation()
        await page.goto('https://amritavidya-am-student.amrita.edu:8444/aums/Jsp/Core_Common/index.jsp')

        await page.goto('https://amritavidya-am-student.amrita.edu:8444/aums/Jsp/Marks/ViewPublishedMark.jsp?action=UMS-EVAL_STUDMARKVIEW_INIT_SCREEN&isMenu=true&pagePostSerialID=3', { waitUntil: "domcontentloaded" })

        await page.select('.combo', semester)

        await page.evaluate(() => {
            formSubmit('UMS-EVAL_STUDMARKVIEW_SELSEM_SCREEN')
        })

        await page.waitForNavigation()

        //Have to code form here!
        //Stopping point
        //Have to add internal marks, grades

        details = await page.evaluate(() => {
            let t = document.querySelectorAll('span[class=rowBG1]')
            let temp = []
            let tempMap = []
            for (let span of t)
                if (span.innerHTML != '&nbsp;')
                    temp.push(span.innerText)
            temp.splice(0, 10)

            for (let i = temp.length - 1; i > 0; i--) {
                if (temp[i] == 'Total' || temp[i] == 'Regular') {
                    temp.splice(i, 1)
                }
            }

            for (let index = 0; index < temp.length; index += 7)
                tempMap.push({
                    "paper_id": temp[index],
                    "paper_name": temp[index + 1],
                    "year": temp[index + 2],
                    "no_of_classes": temp[index + 3],
                    "attended": temp[index + 4],
                    "attendance_percent": temp[index + 5]
                })
            return tempMap
        })

        await browser.close()
        return details
    }

    catch (ex) {
        console.log('Ran into some error')
        console.log(ex)
    }
}

module.exports = { init, getAttendance, getInternalMarks }