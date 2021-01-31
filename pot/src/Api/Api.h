#include <Arduino.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

#ifndef API_H
#define API_H
class Api
{
private:
    String baseUrl;
    WiFiClient client;
    HTTPClient http;

public:
    Api(String newBaseUrl);
    ~Api();

    String get(String endPoint);
    int registerDevice();
    String post(String endPoint, String data);
};
#endif