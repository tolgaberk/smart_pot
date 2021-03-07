#include "Lights.h"

#define ILLUMINATION_LIMIT 150

Lights::Lights(int pin, PotData *potData)
{
    this->pin = pin;
    pinMode(pin, OUTPUT);
    this->potData = potData;
}

void Lights::work()
{
    if (potData->close_light_density < ILLUMINATION_LIMIT)
    {
        isWorking = true;
        potData->is_lights_open = true;
        //
        digitalWrite(pin, HIGH);
        Serial.println("ISIK YANIYOR AMK");
        /// PRODUCE A PWM SIGNAL FOR LIGHTS
        ////

        // potData->sendPotData(true);
        //
    }
    else
    {
        Serial.println("ISIK SONUYOR AMK");
        digitalWrite(pin, LOW);
        isWorking = false;
        potData->is_lights_open = false;
    }
}

Lights::~Lights()
{
}
