#include "PlantReference.h"
PlantReference::PlantReference(){};

int PlantReference::getMinTemp()
{
    return this->min_temp;
}
void PlantReference::setMinTemp(int val)
{
    this->min_temp = val;
}
int PlantReference::getMaxTemp()
{
    return this->max_temp;
}
void PlantReference::setMaxTemp(int val)
{
    this->max_temp = val;
}
int PlantReference::getMinLight_exposure()
{
    return this->min_light_exposure;
}
void PlantReference::setMinLight_exposure(int val)
{
    this->min_light_exposure = val;
}
int PlantReference::getMinMoisture()
{
    return this->min_moisture;
}
void PlantReference::setMinMoisture(int val)
{
    this->min_moisture = val;
}
int PlantReference::getMaxMoisture()
{
    return this->max_moisture;
}
void PlantReference::setMaxMoisture(int val)
{
    this->max_moisture = val;
}
void PlantReference::setAll(DynamicJsonDocument doc)
{
    min_temp = doc["min_temp"].as<int>();
    max_temp = doc["max_temp"].as<int>();
    min_light_exposure = doc["min_light_exposure"].as<int>();
    min_moisture = doc["min_moisture"].as<int>();
    max_moisture = doc["max_moisture"].as<int>();
}
PlantReference::~PlantReference() {}