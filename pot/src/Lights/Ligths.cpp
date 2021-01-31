#include "Lights.h"

#define ILLUMINATION_LIMIT 150

Lights::Lights(int pin, PotData *potData)
{
    this->pin = pin;
    this->potData = potData;
}

void Lights::work()
{
    float illuminationAvg = (potData->close_light_density + potData->environment_light_density) / 2;
    if (illuminationAvg < ILLUMINATION_LIMIT)
    {
        isWorking = true;
        potData->is_lights_open = true;
        //
        digitalWrite(pin, HIGH);
        /// PRODUCE A PWM SIGNAL FOR LIGHTS
        ////
        digitalWrite(pin, LOW);
        potData->sendPotData(true);
        //
        potData->setIsWatering(false);
        isWorking = false;
    }
}

Lights::~Lights()
{
}
