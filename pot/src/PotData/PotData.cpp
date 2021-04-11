#include "PotData.h"

PotData::PotData(Api *newApi)
{
    api = newApi;
    last_sent_time = 0;
}

PotData::~PotData()
{
    environment_temp = 0;
    environment_humidity = 0;
    soil_moisture = 0;
    tank_filled_ratio = 0;
    // environment_light_density = 0;
    close_light_density = 0;
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
    String stringified = "{ \n" +
                         (String) " \"environment_temp\" :" + (String)environment_temp +
                         ", \n\t\"environment_humidity\" :" + environment_humidity +
                         ", \n\t\"soil_moisture\" : " + soil_moisture +
                         ", \n\t\"tank_filled_ratio\" :" + tank_filled_ratio +
                         //  ", \n\t\"environment_light_density\" : " + environment_light_density +
                         ", \n\t\"close_light_density\" : " + close_light_density +
                         ", \n\t\"last_time_watered\" : " + last_time_watered +
                         ", \n\t\"is_lights_open\" : " + is_lights_open +
                         ", \n\t\"pot_id\" : " + pot_id +
                         "\n}";
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
    Serial.println(this->toString());
}
