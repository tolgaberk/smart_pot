#include <Arduino.h>
#include <WiFiManager.h>
#include <DHTesp.h>

#include "Sensor/Sensor.h"
#include "PotData/PotData.h"
#include "Api/Api.h"
#include "Pump/Pump.h"
#include "Lights/Lights.h"
#include "Multiplexer/Multiplexer.h"
#include "PlantReference/PlantReference.h"

Api api{"http://192.168.1.109:9876"};

PlantReference plant_info;

PotData globalPotData{&api, &plant_info};

Multiplexer mp{D5, D6};

Sensor closeLightSensor{0, &globalPotData, &mp};
Sensor soilMoistureSensor{1, &globalPotData, &mp};
Sensor tankWaterLevelSensor{3, &globalPotData, &mp};

Pump pump;

Lights lights;

DHTesp envTempHumidSensor;
WiFiManager wifiManager;

void setup()
{
  pinMode(A0, INPUT);

  Serial.begin(9600);
  wifiManager.autoConnect("Smart_Pot");

  lights.setup(D1, &globalPotData);
  pump.setup(D2, &globalPotData);

  globalPotData.setPotId(api.registerDevice());

  envTempHumidSensor.setup(D7, DHTesp::DHT11);
  mp.setup();
}

void loop()
{
  // mp.test();
  globalPotData.soil_moisture = *soilMoistureSensor.readValue();
  globalPotData.tank_filled_ratio = *tankWaterLevelSensor.readValue();
  globalPotData.close_light_density = *closeLightSensor.readValue();

  float envHumid = envTempHumidSensor.getHumidity();
  if (!isnan(envHumid))
  {
    globalPotData.environment_humidity = envHumid;
  }

  float envTemp = envTempHumidSensor.getTemperature();
  if (!isnan(envTemp))
  {
    globalPotData.environment_temp = envTemp;
  }

  lights.work();

  DynamicJsonDocument res = globalPotData.sendPotData();

  if (!res.isNull())
  {
    String command = res["command"].as<String>();
    if (command != "no-command")
    {
      if (command == "toggle_lights")
      {
        lights.toggle();
      }

      if (command == "water")
      {
        pump.forceWork();
      }

      if (command == "flower_change")
      {
        plant_info.setAll(res["args"]);
      }
    }
  }
}
