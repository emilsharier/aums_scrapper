# AUMS SCRAPPER

A web scraping API to retrieve student information such as attendence, internal marks and semester grades from AUMS Mysuru website.
You need to have an AUMS account to use this service.

## Your usernames and passwords aren't getting stored anywhere in the server!

## Endpoints (POST methods)

**1. Getting attendance status of a particular semester**

    /getAttendance

You have to pass the following JSON data as the body of the request

    {
        "username" : "MY.SC.XXXXXXXXXX",
        "password" : "XXXXXXXXXXXX",
        "semester" : "<Some value between 1 and 10>"
    }

**2. Getting internal marks (aka internals)**

    /getInternalMarks

You have to pass the following JSON data as the body of the request

    {
        "username" : "MY.SC.XXXXXXXXXX",
        "password" : "XXXXXXXXXXXX",
        "semester" : "<Some value between 1 and 10>"
    }

**3. Getting name (Totally un-necessary but why not)**

    /getName

You have to pass the following JSON data as the body of the request

    {
        "username" : "MY.SC.XXXXXXXXXX",
        "password" : "XXXXXXXXXXXX"
    }

### How to use

1. Clone this repository
2. Make sure **npm** is installed and set up in your system
3. After cloning, go to the root directory, open up a terminal and run the following commands
```
npm install express puppeteer body-parser --save
npm install (This would take a while as the system will download and install a headerless chromium runtime)
node index.js
```
4. Once your server has started, use something like **Postman** to send *POST* requests.

#### How to contribute

1. Fork the repository
2. Make your changes
3. Open a Pull request

Cheers!