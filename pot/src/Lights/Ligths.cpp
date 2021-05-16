#include "Lights.h"

#define ILLUMINATION_LIMIT 150
#define FORCE_TIMEOUT 5

Lights::Lights()
{
}

void Lights::setup(int pin, PotData *potData)
{
    this->pin = pin;
    this->potData = potData;
    pinMode(this->pin, OUTPUT);
}

void Lights::toggle()
{
    this->forced = true;
    this->force_start_time = potData->universal_time;

    if (this->isWorking)
    {
        Serial.println("LIGHTS FORCEFULLY TURNED OFF");
        this->turnOff();
    }
    else
    {
        Serial.println("LIGHTS FORCEFULLY TURNED ON");
        this->turnOn();
    }
}
void Lights::turnOn()
{
    this->isWorking = true;
    this->potData->is_lights_open = true;
    digitalWrite(pin, HIGH);
};

void Lights::turnOff()
{
    this->isWorking = false;
    this->potData->is_lights_open = false;
    digitalWrite(pin, LOW);
};

void Lights::work()
{
    bool should_be_on = (this->potData->close_light_density < ILLUMINATION_LIMIT) && !this->forced;
    if (should_be_on)
    {
        this->turnOn();
    }
    else
    {
        this->turnOff();
    }

    if (forced)
    {
        if (this->potData->universal_time - this->force_start_time > FORCE_TIMEOUT)
        {
            Serial.println("LIGHT FORCE SET TIMEOUTED");
            this->forced = false;
            this->force_start_time = 0;
        }
    }
}

Lights::~Lights()
{
}
