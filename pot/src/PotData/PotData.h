#include <Arduino.h>
#include "Api/Api.h"
#include "ArduinoJson.h"
#include "PlantReference/PlantReference.h"

#define REQUEST_INTERVAL 2000
#ifndef POTDATA_H
#define POTDATA_H
class PotData
{
public:
    float environment_temp;
    float environment_humidity;
    int soil_moisture;
    int tank_filled_ratio;
    int environment_light_density;
    int close_light_density;
    bool last_time_watered;
    bool is_lights_open;
    unsigned long universal_time;
    unsigned long last_sent_time;
    int pot_id;
    Api *api;
    PlantReference *plant_reference;
    PotData(Api *newapi, PlantReference *plant_ref);
    ~PotData();
    void setPotId(int id);
    void setIsWatering(bool val);
    DynamicJsonDocument sendPotData(bool force = false);
    String toString();
    void print();
};
#endif