import debounce from "lodash.debounce";
import { alert, error, defaultModules } from "@pnotify/core/dist/PNotify.js";
import * as PNotifyMobile from "@pnotify/mobile/dist/PNotifyMobile.js";

import "./css/styles.css";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

import singleCountryTemplate from "./singleCountry.hbs";
import multipleCountriesTemplate from "./multipleCountries.hbs";

defaultModules.set(PNotifyMobile, {});

const input = document.querySelector(".get-country");
const divContainer = document.querySelector(".country-box");
const urlCountries = `https://restcountries.eu/rest/v2/name/`;

input.addEventListener(
  "input",
  debounce(() => {
    const name = input.value;
    divContainer.innerHTML = "";
    if (!name) return;

    fetch(`${urlCountries}${name}`)
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          alert({ title: "Not found", hide: true, delay: 1000 });
        }
      })
      .then((data = []) => {
        if (data.length > 10) {
          return error({ text: "Make your request more specific" });
        }

        if (data.length === 1) {
          divContainer.insertAdjacentHTML(
            "afterbegin",
            singleCountryTemplate(data)
          );
        } else {
          divContainer.insertAdjacentHTML(
            "afterbegin",
            multipleCountriesTemplate(data)
          );
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, 500)
);