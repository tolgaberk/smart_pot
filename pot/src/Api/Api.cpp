
#include "Api.h"

Api::Api(String newBaseUrl)
{
    baseUrl = newBaseUrl;
}

int Api::registerDevice()
{
    String localIp = WiFi.localIP().toString();
    String remoteIp = WiFi.macAddress();
    String data = "{\"data\":\"" + localIp + "&&" + remoteIp + "\"}";
    Serial.println("Sending Register device with " + data);
    String response = this->post("pots", data);
    Serial.println("Response =>" + response);
    return response.toInt();
}

String Api::get(String endPoint)
{

    http.begin(client, baseUrl + "/" + endPoint);

    int httpCode = http.GET();

    if (httpCode > 0)
    {
        String data = http.getString();
        Serial.println(data);
        http.end();
        return data;
    }
    else
    {
        http.end();
        return "ERROR";
    }
}

String Api::post(String endPoint, String data)
{

    http.begin(client, baseUrl + "/" + endPoint);
    http.addHeader("Content-Type", "application/json");
    int httpCode = http.POST(data);

    if (httpCode > 0)
    {
        String data = http.getString();

        Serial.println(data);
        http.end();
        return data;
    }
    else
    {
        http.end();
        return "ERROR";
    }
}

Api::~Api()
{
}
