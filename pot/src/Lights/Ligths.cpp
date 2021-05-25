#include "Lights.h"

#define FULL_ILLUMINATION_LIMIT 200
#define START_ILLUMINATION_LIMIT 400
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
    int lightDensity = this->potData->close_light_density;
    if (this->forced)
    {
        this->potData->sendPotData(true);
        lightDensity = 0;
    }

    if (lightDensity < FULL_ILLUMINATION_LIMIT)
    {
        digitalWrite(pin, HIGH);
    }
    else
    {
        int closenessToFullIllumination = lightDensity - FULL_ILLUMINATION_LIMIT;

        int mappedVal = map(closenessToFullIllumination, 200, 0, 0, 1024);
        Serial.println(mappedVal);
        analogWrite(pin, mappedVal);
    }
};

void Lights::turnOff()
{
    this->isWorking = false;
    this->potData->is_lights_open = false;
    if (this->forced)
    {
        this->potData->sendPotData(true);
    }
    digitalWrite(pin, LOW);
};

void Lights::work()
{

    if (forced)
    {
        if (this->potData->universal_time - this->force_start_time > FORCE_TIMEOUT)
        {
            Serial.println("LIGHT FORCE SET TIMEOUTED");
            this->forced = false;

            bool should_be_on = this->potData->close_light_density < START_ILLUMINATION_LIMIT;

            if (should_be_on)
            {
                this->turnOn();
            }
            else
            {
                this->turnOff();
            }

            this->potData->sendPotData(true);
            this->force_start_time = 0;
        }
    }

    if (!forced)
    {
        bool should_be_on = this->potData->close_light_density < START_ILLUMINATION_LIMIT;

        if (should_be_on)
        {
            this->turnOn();
        }
        else
        {
            this->turnOff();
        }
    }
}

Lights::~Lights()
{
}
