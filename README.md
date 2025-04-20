# Simple express REST API

## Setup 

Allow nodeJS/express to listen on port 80 (otherwise it requires root rights or you have to choose a port above 1024)

```bash
$ sudo setcap 'cap_net_bind_service=+ep' `which node`
```

## Run

```bash
$ npm start
```


## VS Code

settings.json

```
{
    "workbench.colorTheme": "Default Light Modern",
    "editor.codeActionsOnSave": {
        "source.fixAll": "always"
    },
    "editor.formatOnSave": true
}
```

## Interacting with the REST-API with cURL
```
$ curl -w ", %{http_code}" localhost/api/v1/jobpostings/2

$ curl -X PUT -w ", %{http_code}" -H "Content-Type: application/json" -d "{\"title\":\"Max Mustermann\",\"description\":\"My Desc\",\"department\":\"DEPARTMENT1\",\"status\":\"DRAFT\"}" http://localhost/api/v1/jobpostings/3

$ curl -X POST -H "Content-Type: application/json" -d "{\"title\":\"Max Mustermann\",\"description\":\"My Desc\",\"department\":\"DEPARTMENT1\",\"status\":\"DRAFT\"}" http://localhost/api/v1/jobpostings

$ curl -X PATCH -w ", %{http_code}" -H "Content-Type: application/json" -d "{\"title\":\"Otto der Erste\"}" http://localhost/api/v1/jobpostings/3

$ curl -X DELETE -w ", %{http_code}" localhost/api/v1/jobpostings/2
```
