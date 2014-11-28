#FeedHenry HTML to PDF service
This service mainly converting a HTML document to a PDF on the fly.

# Usage
Once the server is running, just simply post HTML doc to /api route.
The server will stream back PDF data.

For example:
```
  curl -X POST  -d "<h1 style='color:red'>aaa</h1>"  http://localhost:8001/api
```


## Parameters

Parameters are added using query strings. e.g.
```
POST /api?pageSize=A4&zoom=3
```

Following parameters are supported:

* pageSize: configure the size of generated PDF page. it could be "paperwidth\*paperheight" like 5in\*7.5in
, 10cm\*20cm, or "A4", "Letter"
* zoom: the factor to zoom out or in.
