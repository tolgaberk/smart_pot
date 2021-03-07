#include "Sensor.h"

Sensor::Sensor(int pinNumber, int controlPinNumber, PotData *pot_data)
{
    pin = pinNumber;
    controlPin = controlPinNumber;
    pinMode(controlPin, OUTPUT);
    potData = pot_data;
    value = -1;
    last_read = millis();
}

float *Sensor::readValue()
{
    if ((millis() - last_read) > SAMPLING_INTERVAL)
    {
        digitalWrite(controlPin, HIGH);
        delayMicroseconds(100);
        last_read = millis();
        value = analogRead(pin);
        Serial.println("Pin Number: " + String(controlPin) + "  =>  " + String(value));
        delayMicroseconds(100);
        digitalWrite(controlPin, LOW);
    }
    return &value;
}

Sensor::~Sensor()
{
}
