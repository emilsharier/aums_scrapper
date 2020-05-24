const puppeteer = require('puppeteer')

const url = 'https://amritavidya-am-student.amrita.edu:8444/cas/login'

let years = ['2014', '2015', '2016', '2017', '2018', '2019', '2020']

let getName = async (username, password) => {
    return new Promise(async (resolve, reject) => {
        let name = {}
        let tName = ''
        let imageUrl = ''
        let id
        let details = []
        let page
        try {
            const browser = await puppeteer.launch({ headless: true })
            const context = await browser.createIncognitoBrowserContext()

            page = await context.newPage()
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

            id = name.nameID.slice(name.nameID.indexOf('('), name.nameID.indexOf(')')).replace('(', '').trim()
            tName = name.nameID.replace('Welcome ', '').replace('(' + id + ')', '').trim()

            name = {
                "name": tName,
                "id": id,
            }

            await browser.close()
            return name
        }

        catch (ex) {
            await page.screenshot({ path: 'error.png' })
            await browser.close();
            return 404
        }
    })
}

let getAttendance = async (username, password, semester) => {
    return new Promise(async (resolve, reject) => {
        let page
        let browser
        try {
            browser = await puppeteer.launch({ headless: true })
            const context = await browser.createIncognitoBrowserContext()

            page = await context.newPage()
            await page.goto(url, { waitUntil: "networkidle2" })
            await page.type('#username', username)
            await page.type('#password', password)
            await page.screenshot({ path: "screenshot.png" })
            await page.keyboard.press('Enter')
            await page.waitForNavigation({ waitUntil: ['domcontentloaded'] })
            await page.goto('https://amritavidya-am-student.amrita.edu:8444/aums/Jsp/Core_Common/index.jsp', { waitUntil: 'domcontentloaded' })

            await page.goto('https://amritavidya-am-student.amrita.edu:8444/aums/Jsp/Attendance/AttendanceReportStudent.jsp?action=UMS-ATD_INIT_ATDREPORTSTUD_SCREEN&isMenu=true&pagePostSerialID=16', { waitUntil: "domcontentloaded" })

            await page.select('.combo', semester)

            await page.evaluate(() => {
                checkValuesSummary('UMS-ATD_SHOW_ATDSUMMARY_SCREEN')
            })

            await page.waitForNavigation({ waitUntil: ['networkidle0'] })

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
            return resolve(details)
        }

        catch (ex) {
            console.log('Ran into some error')
            await browser.close()
            return reject(ex)
        }
    })
}

let getInternalMarks = async (username, password, semester) => {

    return new Promise(async (resolve, reject) => {
        let page
        let browser
        try {
            browser = await puppeteer.launch({ headless: true })
            const context = await browser.createIncognitoBrowserContext()

            page = await context.newPage()
            await page.goto(url, { waitUntil: "networkidle2" })
            await page.type('#username', username)
            await page.type('#password', password)
            
            await page.keyboard.press('Enter')
            await page.waitForNavigation({ waitUntil: ['domcontentloaded'] })
            await page.goto('https://amritavidya-am-student.amrita.edu:8444/aums/Jsp/Core_Common/index.jsp', { waitUntil: 'networkidle0' })

            await page.goto('https://amritavidya-am-student.amrita.edu:8444/aums/Jsp/Marks/ViewPublishedMark.jsp?action=UMS-EVAL_STUDMARKVIEW_INIT_SCREEN&isMenu=true', { waitUntil: 'networkidle0' })

            let fetchedSem = []
            fetchedSem = await page.evaluate((semester) => {
                let combo = document.getElementsByClassName('combo')[0].options[semester].value
                return combo
            }, semester)

            await page.select('.combo', fetchedSem)
            await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
            await page.evaluate(() => {
                formSubmit('UMS-EVAL_STUDMARKVIEW_SELSEM_SCREEN')
            })

            await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

            details = await page.evaluate(() => {
                let t = document.querySelectorAll('span[class=rowBG1]')
                let temp = []
                let subjects = []
                let tests = []
                let tempMap = {}
                let actualTests = {}
                for (let span of t)
                    if (span.innerHTML != '&nbsp;')
                        temp.push(span.innerText)
                temp.splice(0, 3)

                for (let i = temp.length - 1; i > 0; i--) {
                    if (temp[i] == 'Regular') {
                        temp.splice(i, 1)
                    }
                }

                let indexofAssignment = temp.indexOf('Assignment 1')
                if (indexofAssignment < 0)
                    indexofAssignment = temp.indexOf('Periodical Exam I')

                for (let i = 0; i < indexofAssignment; i++)
                    subjects.push(temp[i])
                temp.splice(0, indexofAssignment)

                for (let i = 0; i < temp.length; i += indexofAssignment) {
                    tests.push(temp[i])
                    temp.splice(i, 2)
                }

                for (let i = 0; i < tests.length; i++) {
                    tempMap = {}
                    for (j = 0; j < indexofAssignment; j++) {
                        tempMap[`${subjects[j]}`] = temp[j]
                    }
                    actualTests[`${tests[i]}`] = tempMap
                }

                return actualTests
            })

            await browser.close()
            return resolve(details)
        }

        catch (ex) {
            console.log('Ran into some error')
            await browser.close()
            return reject(ex)
        }
    })
}

module.exports = { getName, getAttendance, getInternalMarks }