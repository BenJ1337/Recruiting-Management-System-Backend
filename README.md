# REST API with NestJS

## Setup 

Allow nodeJS to listen on port 80 (otherwise it requires root rights or you have to choose a port above 1023)

```bash
$ sudo setcap 'cap_net_bind_service=+ep' `which node`
```

## Interacting with the REST-API with cURL
```
$ curl -v localhost/api/v1/jobpostings/2

$ curl -X PUT -v -H "Content-Type: application/json" -d "{\"title\":\"Max Mustermann\",\"description\":\"My Desc\",\"department\":\"DEPARTMENT1\",\"status\":\"DRAFT\"}" http://localhost/api/v1/jobpostings/3

$ curl -X POST -v -H "Content-Type: application/json" -d "{\"title\":\"Max Mustermann\",\"description\":\"My Desc\",\"department\":\"DEPARTMENT1\",\"status\":\"DRAFT\"}" http://localhost/api/v1/jobpostings

$ curl -X PATCH -v -H "Content-Type: application/json" -d "{\"title\":\"Otto der Erste\"}" http://localhost/api/v1/jobpostings/3

$ curl -X DELETE -v localhost/api/v1/jobpostings/2
```
