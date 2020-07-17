const fetch = require('node-fetch');
var HTMLParser = require('node-html-parser');
var fs = require('fs');
var sleep = require('system-sleep');
import Emoji from './models/Emoji.js';

const emojisListUrls = [
    "https://emojipedia.org"
];

let categoryListUrls = [];
let allEmojisCategories = new Map();
let allEmojisByName = new Map();

const StringifyEmojiClass = m => {
    return Array.from(m).map( ([k,v]) => {return {[k]:v}} );
};
  
function loadEmojisCategories(urls) {
    const allRequests = urls.map((url, index) => 
        fetch(url).then(response => {
            let body = response.text();
            return body;
        }).then(body => {
            var root = HTMLParser.parse(body);
            var parsedEmojis = root.querySelectorAll('.sidebar')[0].childNodes[1].childNodes[3].childNodes;
            parsedEmojis.forEach(element => {
                var matchedHref = element.toString().match(/href="(.*?)"/g);

                if (matchedHref !== null && matchedHref.length > 0) {
                    matchedHref.forEach(match => {
                        var emojiCategoryRoute = match.replace('href="','').replace('/"','');
                        
                        allEmojisCategories.set(element.text, emojiCategoryRoute);
                    });
                }
            });
        })
    );
    
    return Promise.all(allRequests);
}

function loadCategoryEmojis(urls) {
    const allRequests = urls.map((url, index) => 
        fetch(url).then(response => {
            let body = response.text();
            return body;
        }).then(body => {
            var root = HTMLParser.parse(body);
            var parsedEmojis = root.querySelectorAll('.emoji-list')[0].childNodes;
            parsedEmojis.forEach(element => {
                var splittedEmojiAndEmojiDescription = element.text.toString().split(' ');
                var emojiIcon = splittedEmojiAndEmojiDescription[0];
                
                splittedEmojiAndEmojiDescription.shift();

                var matchedHref = element.toString().match(/href="(.*?)"/g);

                if (matchedHref !== null && matchedHref.length > 0) {
                    matchedHref.forEach(match => {
                        var emojiRoute = match.replace('href="','').replace('/"','');

                        var finalEmoji = new Emoji(emojiRoute, splittedEmojiAndEmojiDescription.join(' '), '', '', '', '');
                        
                        allEmojisByName.set(emojiIcon, finalEmoji);
                    });
                }
            });
        })
    );
    
    return Promise.all(allRequests);
}

function loadEmoji(url) {
    return new Promise((resolve, reject) => { // eslint-disable-line no-unused-vars
        fetch(url).then(response => {
            console.log('load emoji from url ->', url);
            let body = response.text();
            return body;
        }).then(body => {
            var root = HTMLParser.parse(body);
            
            var parsedEmojiDescription = root.querySelectorAll('.description')
            var finalDescription = '';

            if (parsedEmojiDescription.length > 0) {
                parsedEmojiDescription = parsedEmojiDescription[0].childNodes;

                parsedEmojiDescription.forEach(elem => {
                    finalDescription += elem.text;
                });
                finalDescription = finalDescription.replace(/[(\r\n|\n|\r)]+/gm,' ')
            }
            
            var parsedEmojiAliases = root.querySelectorAll('.aliases');
            var finalEmojiAliases = '';

            if (parsedEmojiAliases.length > 0) {
                parsedEmojiAliases = parsedEmojiAliases[0].childNodes;

                parsedEmojiAliases.slice(1).forEach(function(value, index) {
                    if ( index != 0 ) 
                    {
                        finalEmojiAliases += value.text;
                    }
                });
                finalEmojiAliases = finalEmojiAliases.replace(/^\n/gm,'').replace(/\n$/gm,'')    
            }
           
            var parsedEmojiShortcodes = root.querySelectorAll('.shortcodes');
            var finalEmojiShortcodes = '';
            
            if (parsedEmojiShortcodes.length > 0) {
                parsedEmojiShortcodes = parsedEmojiShortcodes[0].childNodes;
                parsedEmojiShortcodes.forEach(elem => {
                    finalEmojiShortcodes += elem.text;
                });
                finalEmojiShortcodes = finalEmojiShortcodes.replace(/^\n/gm,'').replace(/\n$/gm,'')
            }
            
            // TODO get code points

            var emojiFields = [];
            emojiFields.push(finalDescription);
            emojiFields.push(finalEmojiAliases);
            emojiFields.push(finalEmojiShortcodes);

            resolve(emojiFields);
        })
    });
}


const loadedEmojisCategories = loadEmojisCategories(emojisListUrls);
loadedEmojisCategories
    .then(res => {
        allEmojisCategories.forEach(emojiCategory => {
            categoryListUrls.push(emojisListUrls[0]+emojiCategory);
        });

        loadCategoryEmojis(categoryListUrls)
            .then(res2 => {

                var processEmojis = new Promise((resolve, reject) => {
                    var urlTotalCounter = 0;
                    var urlCounter = 0;

                    allEmojisByName.forEach((value, key, map) => {
                        var url = emojisListUrls[0]+value.getRoute();
                        urlCounter++;

                        console.log('current url -> ', url);

                        if (urlCounter == 20) {
                            urlCounter = 0;
                            console.log('sleeping started');
                            sleep(10*1000); // sleep for 10 seconds
                            console.log('sleeping ended');
                        }

                        loadEmoji(url)
                            .then(res3 => {
                                if (res3.length === 3) {
                                    value.setDescription(res3[0]);
                                    value.setAliases(res3[1]);
                                    value.setShortcodes(res3[2]);
                                }
            
                                value.setEmojiIcon(key);
                                console.log('updated emoji info ', key);
            
                                if (urlTotalCounter === map.size-1) {
                                    resolve();
                                }
                                else {
                                    urlTotalCounter++;
                                }
                            });
                    });

                    console.log('processsed ', urlTotalCounter, ' urls');
                });

                console.log('starting writing all scraped data....');

                processEmojis.then(() => {
                    var stream = fs.createWriteStream(`./Emojis/emojis.json`);
                    stream.once('open', function(fd) {
                        stream.write(JSON.stringify(StringifyEmojiClass(allEmojisByName)));
                        stream.end();
                    });

                    console.log('ended writing all scraped data');
                });
            })
    })
    .catch(err => console.log(err));

