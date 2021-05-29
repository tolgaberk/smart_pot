#include "Lights.h"

#define FULL_POWERED_LIGHTS_THRESHOLD 1000
#define ILLUMINATION_START_TRESHOLD 600
#define FORCE_TIMEOUT 5

Lights::Lights()
{
}

void Lights::setup(int pin, PotData *potData)
{
    this->pin = pin;
    this->potData = potData;
    pinMode(this->pin, OUTPUT);
    force_start_time = 0;
    cumulative_light_exposure = 0;
    last_loop_time = 0;
    over_exposed = false;
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
    int darknessDensity = this->getDarknessDensity();

    if (this->forced)
    {
        this->potData->sendPotData(true);
        darknessDensity = 0;
    }

    if (darknessDensity > FULL_POWERED_LIGHTS_THRESHOLD)
    {
        digitalWrite(pin, HIGH);
    }
    else
    {

        int mappedVal = map(darknessDensity, ILLUMINATION_START_TRESHOLD, FULL_POWERED_LIGHTS_THRESHOLD, 0, 1024);
        // Serial.print(mappedVal);
        if (mappedVal < 20)
        {
            analogWrite(pin, 20);
        }
        else
        {
            analogWrite(pin, mappedVal);
        }
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

void Lights::checkDay()
{
    if (this->last_loop_time == 0)
    {
        this->last_loop_time = this->potData->universal_time;
    }
    unsigned long duration = this->potData->universal_time - this->last_loop_time;
    this->last_loop_time = this->potData->universal_time;

    this->cumulative_light_exposure += duration;

    this->over_exposed = this->cumulative_light_exposure / 60 / 60 > (unsigned long)this->potData->plant_reference->getMinLight_exposure();

    if (cumulative_light_exposure / 60 / 60 > 24)
    {
        this->cumulative_light_exposure = 0;
    }
}

int Lights::getDarknessDensity()
{
    return 1024 - ((this->potData->close_light_density + this->potData->environment_light_density) / 2);
}

void Lights::work()
{
    // Serial.print(this->sunlight_is_enough);
    // Serial.print("\t");
    // Serial.print(this->over_exposed);
    // Serial.print("\t");
    // Serial.print(this->last_loop_time);
    // Serial.print("\t");
    // Serial.print(this->cumulative_light_exposure);
    // Serial.print("\t");
    // Serial.print(this->isWorking);
    // Serial.print("\t");
    // Serial.print(this->getDarknessDensity());
    // Serial.print("\t");

    this->sunlight_is_enough = this->getDarknessDensity() < ILLUMINATION_START_TRESHOLD;

    if (forced)
    {
        if (this->potData->universal_time - this->force_start_time > FORCE_TIMEOUT)
        {
            Serial.println("LIGHT FORCE SET TIMEOUTED");
            this->forced = false;

            this->switchLights();

            this->potData->sendPotData(true);
            this->force_start_time = 0;
        }
    }

    if (!forced)
    {
        this->switchLights();
    }

    this->checkDay();

    // Serial.println("");
}

void Lights::switchLights()
{

    if (!this->sunlight_is_enough && !this->over_exposed)
    {
        this->turnOn();
    }
    else
    {
        this->turnOff();
    }
}

Lights::~Lights()
{
}
