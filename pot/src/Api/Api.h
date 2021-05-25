#include <Arduino.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include "ArduinoJson.h"

#ifndef API_H
#define API_H
class Api
{
private:
    String baseUrl;
    WiFiClient client;
    HTTPClient http;
    int retryCount = 5;

public:
    Api(String newBaseUrl);
    ~Api();

    DynamicJsonDocument get(String endPoint);
    DynamicJsonDocument registerDevice();
    DynamicJsonDocument post(String endPoint, String data);
};
#endif