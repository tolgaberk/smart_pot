#include <Arduino.h>
#include <WiFiManager.h>
#include <DHTesp.h>

#include "Sensor/Sensor.h"
#include "PotData/PotData.h"
#include "Api/Api.h"
#include "Pump/Pump.h"
#include "Lights/Lights.h"

Api api{"http://cuaracilar.tk:5555"};

PotData globalPotData{&api};

Sensor soilMoistureSensor{A0, D1, &globalPotData};
Sensor tankWaterLevelSensor{A0, D3, &globalPotData};
Sensor closeLightSensor{A0, D2, &globalPotData};
// Sensor environmentLightSensor{A0, D4, &globalPotData};

// Pump pump{D5, &globalPotData};

Lights lights{D5, &globalPotData};

DHTesp envTempHumidSensor;
WiFiManager wifiManager;

void setup()
{
  pinMode(A0, INPUT);
  pinMode(D0, INPUT);
  Serial.begin(9600);
  wifiManager.autoConnect("Smava_Smart_Pot");

  //

  globalPotData.setPotId(api.registerDevice());

  envTempHumidSensor.setup(D0, DHTesp::DHT11);
}

void loop()
{
  globalPotData.soil_moisture = *soilMoistureSensor.readValue();
  globalPotData.tank_filled_ratio = *tankWaterLevelSensor.readValue();
  globalPotData.close_light_density = *closeLightSensor.readValue();
  // globalPotData.environment_light_density = *environmentLightSensor.readValue();
  globalPotData.environment_humidity = envTempHumidSensor.getHumidity();
  globalPotData.environment_temp = envTempHumidSensor.getTemperature();

  // pump.work();
  lights.work();
  // globalPotData.print();
  globalPotData.sendPotData();
}
