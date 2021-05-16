#include <Arduino.h>
#include <ArduinoJson.h>

#ifndef PlantReference_H
#define PlantReference_H
class PlantReference
{
private:
    int min_temp;
    int max_temp;
    int min_light_exposure;
    int min_moisture;
    int max_moisture;

public:
    PlantReference();
    void setAll(DynamicJsonDocument doc);
    int getMinTemp();
    void setMinTemp(int val);
    int getMaxTemp();
    void setMaxTemp(int val);
    int getMinLight_exposure();
    void setMinLight_exposure(int val);
    int getMinMoisture();
    void setMinMoisture(int val);
    int getMaxMoisture();
    void setMaxMoisture(int val);
    ~PlantReference();
};

#endif