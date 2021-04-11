#include "Lights.h"

#define ILLUMINATION_LIMIT 150

Lights::Lights()
{
}

void Lights::setup(int pin, PotData *potData)
{
    this->pin = pin;
    this->potData = potData;
    Serial.println("LightsPin");
    Serial.println(this->pin);
    pinMode(this->pin, OUTPUT);
}
void Lights::work()
{
    if (potData->close_light_density > ILLUMINATION_LIMIT)
    {
        isWorking = true;
        potData->is_lights_open = true;
        //
        digitalWrite(pin, HIGH);
        Serial.println("ISIK YANIYOR");
        /// PRODUCE A PWM SIGNAL FOR LIGHTS
        ////

        // potData->sendPotData(true);
        //
    }
    else
    {
        Serial.println("ISIK SONUYOR");
        digitalWrite(pin, LOW);
        isWorking = false;
        potData->is_lights_open = false;
    }
}

Lights::~Lights()
{
}
