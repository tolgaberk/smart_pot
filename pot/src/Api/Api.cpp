
#include "Api.h"

Api::Api(String newBaseUrl)
{
    baseUrl = newBaseUrl;
    http.addHeader("Content-Type", "application/json");
}

int Api::registerDevice()
{
    String localIp = WiFi.localIP().toString();
    String MAC = WiFi.macAddress();
    DynamicJsonDocument doc(1024);
    doc["data"] = localIp + "&&" + MAC;
    String data;
    serializeJson(doc, data);
    Serial.println("Sending Register device with " + data);
    DynamicJsonDocument response = this->post("pots", data);

    if (!response["err"].isNull() && retryCount >= 0)
    {
        retryCount--;
        delay(100);
        this->registerDevice();
    }
    return response["id"].as<int>();
}

DynamicJsonDocument Api::get(String endPoint)
{

    http.begin(client, baseUrl + "/" + endPoint);
    http.addHeader("Content-Type", "application/json");
    int httpCode = http.GET();

    if (httpCode > 0)
    {
        String data = http.getString();
        DynamicJsonDocument doc(1024);
        deserializeJson(doc, data);
        Serial.println(data);
        http.end();
        return doc;
    }
    else
    {
        http.end();
        String data = http.getString();
        DynamicJsonDocument doc(1024);
        deserializeJson(doc, data);
        return doc;
    }
}

DynamicJsonDocument Api::post(String endPoint, String data)
{

    http.begin(client, baseUrl + "/" + endPoint);
    http.addHeader("Content-Type", "application/json");
    int httpCode = http.POST(data);

    if (httpCode > 0)
    {
        String data = http.getString();

        DynamicJsonDocument doc(1024);
        deserializeJson(doc, data);
        Serial.print("API POST RESPONSE => ");
        Serial.println(data);
        http.end();
        return doc;
    }
    else
    {
        http.end();
        String data = http.getString();
        DynamicJsonDocument doc(1024);
        deserializeJson(doc, data);
        Serial.print("API POST ERROR => ");
        Serial.println(data);
        return doc;
    }
}

Api::~Api()
{
}
