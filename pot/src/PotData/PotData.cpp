#include "PotData.h"
#include "ArduinoJson.h"

PotData::PotData(Api *newApi, PlantReference *plant_ref)
{
    api = newApi;
    last_sent_time = 0;
    universal_time = 0;
    plant_reference = plant_ref;
}

PotData::~PotData()
{
    environment_temp = 0;
    environment_humidity = 0;
    soil_moisture = 0;
    tank_filled_ratio = 0;
    environment_light_density = 0;
    close_light_density = 0;
}

void PotData::setPotIdAndCurrentPlant(DynamicJsonDocument doc)
{
    pot_id = doc["id"].as<int>();
    plant_reference->setAll(doc["flower"]);
}

void PotData::setIsWatering(bool val)
{
    bool oldVal = last_time_watered;
    last_time_watered = val;
    if (oldVal == false && val == true)
    {
        this->sendPotData(true);
    }
}

String PotData::toString(bool isForced)
{
    DynamicJsonDocument doc(1024);

    doc["environment_temp"] = this->environment_temp;
    doc["environment_humidity"] = this->environment_humidity;
    doc["soil_moisture"] = this->soil_moisture;
    doc["tank_filled_ratio"] = this->tank_filled_ratio;
    doc["environment_light_density"] = this->environment_light_density;
    doc["close_light_density"] = this->close_light_density;
    doc["last_time_watered"] = this->last_time_watered;
    doc["is_lights_open"] = this->is_lights_open;
    doc["pot_id"] = this->pot_id;
    if (isForced)
    {
        doc["is_forced"] = true;
    }

    String stringified;
    serializeJsonPretty(doc, stringified);
    return stringified;
}

DynamicJsonDocument PotData::sendPotData(bool force)
{
    if (((millis() - last_sent_time) > REQUEST_INTERVAL) || force)
    {
        String pot = this->toString(force);
        Serial.println(pot);
        this->last_sent_time = millis();
        digitalWrite(LED_BUILTIN, HIGH);
        DynamicJsonDocument doc = api->post("pot-data", pot);
        digitalWrite(LED_BUILTIN, LOW);
        double time = doc["time"];
        this->universal_time = (unsigned long)time;
        return doc;
    }
    DynamicJsonDocument doc(0);
    return doc;
}

void PotData::print()
{
    Serial.println(this->toString());
}
