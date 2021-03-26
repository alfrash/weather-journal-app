/* Global Variables */
// Personal API Key for OpenWeatherMap API
const baseUrl = "http://api.openweathermap.org/data/2.5/weather";
const apiKey = "da21abb861402a1256e4fa2b1692c1e5";


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

const userInfo = document.getElementById("userInfo");

// Event listener to add function to existing HTML DOM element
const generateBtn = document.getElementById("generate");
generateBtn.addEventListener("click", performAction);

/* Function called by event listener */
function performAction(e) {
  e.preventDefault();
  const zipCode = document.getElementById("zip").value;
  const content = document.getElementById("feelings").value;
  

  getWeatherData(baseUrl, apiKey, zipCode)
    .then(function (data) {
      postData("/add", {
        temp: convertKelvinToCelsius(data.main.temp),
        date: newDate,
        content: content,
      });
    })
    .then(function () {
      updateUI();
    })
    .catch(function (error) {
      console.log(error);
    });
}

/* Function to GET Web API Data*/

const getWeatherData = async (baseUrl, apiKey, zipCode) => {
  const res = await fetch(`${baseUrl}?q=${zipCode}&appid=${apiKey}`);

  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error = ", error);
  }
};

/* Function to POST data */
const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      temp: data.temp,
      date: data.date,
      content: data.content,
    }),
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log(error);
  }
};

const updateUI = async () => {
  const request = await fetch("/all");
  try {
    const allData = await request.json();
    console.log(allData);

    document.getElementById("date").innerHTML = allData.date;
    document.getElementById("temp").innerHTML = allData.temp + " degree C";
    document.getElementById("content").innerHTML = allData.content;
  } catch (error) {
    console.log("error", error);
  }
};

/* Function to GET Project Data */
function convertKelvinToCelsius(kelvin) {
  if (kelvin < 0) {
    return "below absolute zero (0 K)";
  } else {
    return (kelvin - 273.15).toFixed(2);
  }
}
