#include "Pump.h"

#define MOISTURE_LIMIT 150
#define WATERING_DURATION 2000
#define WATERING_INTERVAL_LIMIT 15000

Pump::Pump(int pin, PotData *potData)
{
    this->pin = pin;
    this->potData = potData;
}

void Pump::work()
{

    if (potData->soil_moisture < MOISTURE_LIMIT)
    {
        if ((millis() - last_watered_at) > WATERING_INTERVAL_LIMIT)
        {
            isWorking = true;
            potData->setIsWatering(true);
            //
            digitalWrite(pin, HIGH);
            delay(WATERING_DURATION);
            digitalWrite(pin, LOW);
            potData->sendPotData(true);
            //
            potData->setIsWatering(false);
            isWorking = false;
            last_watered_at = millis();
            Serial.println("Soil Moisture =>" + (String)potData->soil_moisture);
        }
    }
}

Pump::~Pump()
{
}
