#include <Arduino.h>
#include "Api/Api.h"

#define REQUEST_INTERVAL 5000
#ifndef POTDATA_H
#define POTDATA_H
class PotData
{
public:
    float environment_temp;
    float environment_humidity;
    float soil_moisture;
    float tank_filled_ratio;
    float environment_light_density;
    float close_light_density;
    bool last_time_watered;
    bool is_lights_open;
    unsigned long last_sent_time;
    int pot_id;
    Api *api;
    PotData(Api *newapi);
    ~PotData();
    void setPotId(int id);
    void setIsWatering(bool val);
    void sendPotData(bool force = false);
    String toString();
    void print();
};
#endif