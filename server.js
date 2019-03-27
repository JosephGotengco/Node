const express = require('express');
const axios = require('axios');
const hbs = require('hbs');

var app = express();

hbs.registerPartials(__dirname + '/public/partials');

app.set('views', __dirname + '/public');
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/public'));


//Slide Code
app.use((request, response, next) => {
    var time = new Date().toString();
    console.log(`${time}: ${request.method} ${request.url}`);
    // var log = `${time}: ${request.method} ${request.url}`;
    // fs.appendFile('server.log', log + '\n', (error) => {
    //     if (error) {
    //         console.log('Unable to log message');
    //     }
    // })
    // response.send("Site is down");
    next();
});
//Slide Code


// #----------- Helpers -----------# //

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
})

hbs.registerHelper('errorCheck', (base,rate,code,country) => {
    if (rate == undefined && code == undefined && base == undefined) {
        return `Sorry, invalid country name!`
    } else if (rate == undefined && base == undefined) {
        return `The exchangerates api cannot find a rate for currency code: ${code}`
    } else if (rate == undefined && code == undefined) {
        return `The exchangerates api does not support the country code ${base} as the base.`
    } else {
        return `One ${base} equals ${rate} ${code} (the currency of ${country}).`
    }
})


// #----------- Helpers -----------# //

// #----------- End Points -----------# //

app.get('/', (request, response) => {
    response.render('index_v1.hbs', {
        title: "Home Page",
        header: "Welcome to Home!",
        country_name: "Canada"
    });
});

app.get('/about', (request, response) => {
    response.render('about.hbs', {
        title: 'About Page',
        header: "This is about me!"
    });
});

app.get('/convert', (request, response) => {
    // response.render('api.hbs', {
    //     title: "API Page",
    //     header: "The conversion page!",
    // })
    var main = async() => {
        try {
            var country_name = "Cawdad";

            var code = await axios.get(`https://restcountries.eu/rest/v2/name/${country_name}?fullText=true`);
            var code = code.data[0].currencies[0].code;
            var base = "USD";
            var rate = await axios.get(`https://api.exchangeratesapi.io/latest?symbols=${code}&base=${base}`);

            var rate = rate.data.rates[code];
            var rate = JSON.stringify(Math.round(rate * 100) / 100)

            response.render('api.hbs', {
                title: "API Page",
                header: "The conversion page!",
                rate: rate,
                code: code,
                country: country_name,
                base: base
            })

        } catch(e) {
            // response.send("SORRY! APIs are not reachable!")
            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            
            newdate = year + "-0" + month + "-0" + day;
            if (e.response.data.status == 404) {
                console.log(`The restcountries api cannot find country with the name ${country_name}`);
                // response.send(`The restcountries api cannot find country with the name ${country_name}`);
                response.render('api.hbs', {
                    title: "API Page",
                    header: "The conversion page!",
                    rate: rate,
                    code: code,
                    country: country_name,
                    base: base
                })
            } else if (e.response.data.error == `Symbols '${code}' are invalid for date ${newdate}.`) {
                console.log(`The exchangerates api cannot find a rate for currency code: ${code}`);
                // response.send(`The exchangerates api cannot find a rate for currency code: ${code}`);
                response.render('api.hbs', {
                    title: "API Page",
                    header: "The conversion page!",
                    rate: rate,
                    code: code,
                    country: country_name,
                    base: base
                })
            } else if (e.response.data.error == `Base \'${base}\' is not supported.`) {
                console.log(`The exchangerates api does not support the country code ${base} as the base.`);
                // response.send(`The exchangerates api does not support the country code ${base} as the base.`);
                response.render('api.hbs', {
                    title: "API Page",
                    header: "The conversion page!",
                    rate: rate,
                    code: code,
                    country: country_name,
                    base: base
                })
            } else {
                response.render('api.hbs', {
                    title: "API Page",
                    header: "The conversion page!",
                    rate: rate,
                    code: code,
                    country: country_name,
                    base: base
                })
                console.log("Unhandled Error");
                console.log(e.response.data)
                response.send("Unhandled Error");
            }
        }
    }


    main();
});

app.get('/404', (request, response) => {
    response.send({
        error: 'Page not found'
    })
});

// #----------- End Points -----------# //


app.listen(8080);
console.log("Webapp is now operational!")