Cada arquivo `.yml` corresponde a un proxecto, podendo ter este varias canles. Unha mesma autora ou autor pode ter varios proxectos distintos.

Plantilla:

```yml
title: "Nome do proxecto"
description: "Descripción do proxecto"
author: "Autor ou autora"
contact: "mail"
topics:
    - topic-1
    - topic-2
channels:
    - web:
        - url: url_web
        - rss: url_rss
    - youtube: url_channel_youtube
    - twitch: url_channel_twitch
    - instagram: username
    - twitter: username
    - tiktok: username
    - podcast: url_feed
    - newsletter:
        - url: url_newsletter
        - feed: url_newsletter_feed
```
