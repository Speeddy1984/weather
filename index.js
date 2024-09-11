const http = require("http");
require("dotenv").config();
const config = require("./config");

const city = process.argv[2] || config.DEFAULT_CITY;

if (!city) {
  console.error("Введите город");
  process.exit(1);
}

const url = `${config.WEATHERSTACK_API_URL}?access_key=${config.WEATHERSTACK_API_KEY}&query=${city}`;

http
  .get(url, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      try {
        const weatherData = JSON.parse(data);

        if (weatherData.error) {
          console.error("Ошибка получения данных:", weatherData.error.info);
        } else {
          const { temperature, weather_descriptions } = weatherData.current;
          const { name, country } = weatherData.location;
          console.log(`Погода в ${name}, ${country}:`);
          console.log(`Температура: ${temperature}°C`);
          console.log(`Описание: ${weather_descriptions.join(", ")}`);
        }
      } catch (error) {
        console.error("Ошибка получения данных:", error.message);
      }
    });
  })
  .on("error", (err) => {
    console.error("Ошибка запроса:", err.message);
  });
