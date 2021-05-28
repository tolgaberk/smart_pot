#include "Pump.h"

#define WATERING_DURATION 2000
#define WATERING_INTERVAL_LIMIT 15000

#define MOISTURE_LEVEL_MAXED 800
#define MOISTURE_LEVEL_NOMINAL 400
#define MOISTURE_LEVEL_CRITICAL 200
#define MOISTURE_LEVEL_NO_MOISTURE 50

#define WATER_LEVEL_MAXED 900
#define WATER_LEVEL_NOMINAL 800
#define WATER_LEVEL_CRITICAL 200
#define WATER_LEVEL_NO_WATER 50

Pump::Pump()
{
}

void Pump::setup(int pin, PotData *potData)
{
    this->pin = pin;
    this->potData = potData;
    pinMode(pin, OUTPUT);
}

void Pump::turnOn()
{
    isWorking = true;
    potData->setIsWatering(true);
    digitalWrite(pin, HIGH);
}
void Pump::turnOff()
{
    isWorking = false;
    potData->setIsWatering(false);
    digitalWrite(pin, LOW);
    last_watered_at = millis();
}
void Pump::forceWork()
{
    this->turnOn();
    delay(WATERING_DURATION);
    this->turnOff();
}

void Pump::work()
{

    int min_moisture = this->potData->plant_reference->getMinMoisture();
    int max_moisture = this->potData->plant_reference->getMaxMoisture();
    int current_moisture = (this->potData->soil_moisture / MOISTURE_LEVEL_NOMINAL) * 100;

    bool shouldWater = current_moisture < min_moisture && current_moisture < max_moisture;

    bool canWater = this->potData->tank_filled_ratio > WATER_LEVEL_CRITICAL;

    if (canWater && shouldWater)
    {

        if ((millis() - last_watered_at) > WATERING_INTERVAL_LIMIT)
        {
            this->turnOn();
            delay(WATERING_DURATION);
            this->turnOff();
            Serial.println("Soil Moisture =>" + (String)potData->soil_moisture);
        }
    }
}

Pump::~Pump()
{
}
