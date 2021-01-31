#include "PotData.h"

PotData::PotData(Api *newApi)
{
    api = newApi;
    last_sent_time = 0;
}

PotData::~PotData()
{
}

void PotData::setPotId(int id)
{
    pot_id = id;
}

void PotData::setIsWatering(bool val)
{
    last_time_watered = val;
}

String PotData::toString()
{
    String stringified = "{ " +
                         (String) " \"environment_temp\" :" + (String)environment_temp +
                         ", \"environment_humidity\" :" + environment_humidity +
                         ", \"soil_moisture\" : " + soil_moisture +
                         ", \"tank_filled_ratio\" :" + tank_filled_ratio +
                         ", \"environment_light_density\" : " + environment_light_density +
                         ", \"close_light_density\" : " + close_light_density +
                         ", \"last_time_watered\" : " + last_time_watered +
                         ", \"is_lights_open\" : " + is_lights_open +
                         ", \"pot_id\" : " + pot_id +
                         "}";
    return stringified;
}

void PotData::sendPotData(bool force)
{
    if (((millis() - last_sent_time) > REQUEST_INTERVAL) || force)
    {
        String pot = this->toString();
        Serial.println(pot);
        last_sent_time = millis();
        api->post("pot-data", pot);
    }
}

void PotData::print()
{
    String stringified = "{ " +
                         (String) " \"environment_temp\" :" + (String)environment_temp +
                         ", \"environment_humidity\" :" + environment_humidity +
                         ", \"soil_moisture\" : " + soil_moisture +
                         ", \"tank_filled_ratio\" :" + tank_filled_ratio +
                         ", \"environment_light_density\" : " + environment_light_density +
                         ", \"close_light_density\" : " + close_light_density +
                         ", \"last_time_watered\" : " + last_time_watered +
                         ", \"is_lights_open\" : " + is_lights_open +
                         ", \"pot_id\" : " + pot_id +
                         "}";

    Serial.println(stringified);
}
