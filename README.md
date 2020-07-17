# Emoji Description Sentiment Analysis API Built With Koa and Node 
 
This repository provides a RESTful API that returns sentiment analysis result of a given utterance using Sentiment npm package. 

# Installation

Application will run on port 3000 by default and it can be modified via .env file using property PORT.

Run ```npm i``` (npm install) to install required packages. 
Run ```npm run scraper``` to generate full list of emojis scraped from https://emojipedia.org/.
Run ```npm start``` to launch nodemon server (RESTful api) to query your emoji's description and to obtain its sentiment analysis classification.

# Usage of WebScraper tool

You can fetch all available emojis persisted to Emojis.json file grouped by emoji icon and with all pertaining information such as its description, shortcodes, etc. The following shows all information regarding emoji 💦 scraped with this tool.

```
{
    "💦": {
        "route": "/sweat-droplets",
        "name": "Sweat Droplets",
        "description": " Three, light blue droplets, as sweat beads, splashing down to the right. Resembles plewds, stylized sweat droplets used in comics and animation to show characters working hard or feeling stressed. May be used to represent various types of liquids, including sexual fluids. May also be used to represent various liquid-based slang expressions  e.g., drip, “exceptional style, swagger\" . Not to be confused with 💧 Droplet, though their applications may overlap. Google, Microsoft, and Samsung's design previously featured two, upwardly directed droplets. Sweat Droplets was approved as part of Unicode 6.0 in 2010 under the name “Splashing Sweat Symbol” and added to Emoji 1.0 in 2015. Copy and paste this emoji: Copy ",
        "aliases": "💦 Plewds\n💦 Splashing Water\n💦 Water Drops",
        "shortcodes": ":sweat_drops:\n(Github, Slack)\n:sweat_droplets:\n(Emojipedia)",
        "emojiIcon": "💦"
    }
}
```

You can use this JSON mapping file to extract your emoji's description and query Emoji Description Sentiment Analysis API to determine if it's a positive/negative or neutral emoji.

# Usage of Emoji Description Sentiment Analysis API

You can download the required request at https://www.getpostman.com/collections/4f47568e0637053f4eb8

## GET Request 

To obtain all pertaining information of a certain emoji, "💦", you can do it with the following curl request via Postman or Insomnia.

```
curl --location --request GET 'http://127.0.0.1:3000/classify/emoji-description/💦'
```

## GET Response

```
{
    "route": "/sweat-droplets",
    "name": "Sweat Droplets",
    "description": " Three, light blue droplets, as sweat beads, splashing down to the right. Resembles plewds, stylized sweat droplets used in comics and animation to show characters working hard or feeling stressed. May be used to represent various types of liquids, including sexual fluids. May also be used to represent various liquid-based slang expressions  e.g., drip, “exceptional style, swagger\" . Not to be confused with 💧 Droplet, though their applications may overlap. Google, Microsoft, and Samsung's design previously featured two, upwardly directed droplets. Sweat Droplets was approved as part of Unicode 6.0 in 2010 under the name “Splashing Sweat Symbol” and added to Emoji 1.0 in 2015. Copy and paste this emoji: Copy ",
    "aliases": "💦 Plewds\n💦 Splashing Water\n💦 Water Drops",
    "shortcodes": ":sweat_drops:\n(Github, Slack)\n:sweat_droplets:\n(Emojipedia)",
    "emojiIcon": "💦"
}
```

As you can see it fetched the corresponding information from full list provided by the aforementioned Emojis.json file. Now you can invoke the second GET request to obtain its sentiment analysis.

## GET Request

To obtain sentiment analysis of the following emoji's description, "A yellow face with simple, open eyes and a broad, open smile, showing upper teeth and tongue on some platforms. Often conveys general pleasure and good cheer or humor.", you can do it with the following curl request via Postman or Insomnia.

```
curl --request GET --url 'http://127.0.0.1:3000/classify/emoji-description?utterance=A%20yellow%20face%20with%20simple%2C%20open%20eyes%20and%20a%20broad%2C%20open%20smile%2C%20showing%20upper%20teeth%20and%20tongue%20on%20some%20platforms.%20Often%20conveys%20general%20pleasure%20and%20good%20cheer%20or%20humor'
```

## GET Response

```
{
    "status": "success",
    "result": "Positive",
    "isPositive": true,
    "isNegative": false,
    "isNeutral": false,
    "classification": {
        "score": 12,
        "comparative": 0.41379310344827586,
        "calculation": [
            {
                "humor": 2
            },
            {
                "cheer": 2
            },
            {
                "good": 3
            },
            {
                "pleasure": 3
            },
            {
                "smile": 2
            }
        ],
        "tokens": [
            "a",
            "yellow",
            "face",
            "with",
            "simple",
            "open",
            "eyes",
            "and",
            "a",
            "broad",
            "open",
            "smile",
            "showing",
            "upper",
            "teeth",
            "and",
            "tongue",
            "on",
            "some",
            "platforms",
            "often",
            "conveys",
            "general",
            "pleasure",
            "and",
            "good",
            "cheer",
            "or",
            "humor"
        ],
        "words": [
            "humor",
            "cheer",
            "good",
            "pleasure",
            "smile"
        ],
        "positive": [
            "humor",
            "cheer",
            "good",
            "pleasure",
            "smile"
        ],
        "negative": []
    }
}
```

# Documentation and Related Information

* [Go to the Npm Web Site to see sentiment analysis package used here](https://www.npmjs.com/package/sentiment)
* [Go to the Npm Web Site to see web scraping package used here](https://www.npmjs.com/package/node-html-parser)
* [Get Insomnia app](https://insomnia.rest/)
* [Get Postman app](https://www.postman.com/)