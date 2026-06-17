const rect = (x, y, w, h) => ({ t: "rect", x, y, w, h });
const circle = (cx, cy, r) => ({ t: "circle", cx, cy, r });

const country = (record) => ({
  ...record,
  flag_asset: `assets/flags/${record.id}.svg`,
  ...(denseFlagMeta[record.id] || {}),
});

const denseFlagMeta = {
  'united-states': { ui_complexity: 'high', tap_density: 'high', zoom_required: true, easy_hidden: true },
  malaysia: { ui_complexity: 'very_high', tap_density: 'very_high', zoom_required: true, easy_hidden: true },
  greece: { ui_complexity: 'high', tap_density: 'high', zoom_required: true, easy_hidden: true },
  jamaica: { ui_complexity: 'high', tap_density: 'high', zoom_required: true, easy_hidden: true },
  'south-korea': { ui_complexity: 'high', tap_density: 'high', zoom_required: true, easy_hidden: true },
  china: { ui_complexity: 'high', tap_density: 'high', zoom_required: true, easy_hidden: true },
  'south-africa': { ui_complexity: 'very_high', tap_density: 'very_high', zoom_required: true, easy_hidden: true },
  cuba: { ui_complexity: 'high', tap_density: 'high', zoom_required: true, easy_hidden: true },
  philippines: { ui_complexity: 'high', tap_density: 'high', zoom_required: true, easy_hidden: true },
  kenya: { ui_complexity: 'high', tap_density: 'high', zoom_required: true, easy_hidden: true },
  india: { ui_complexity: 'high', tap_density: 'high', zoom_required: true, easy_hidden: true },
  bhutan: { ui_complexity: 'high', tap_density: 'high', zoom_required: true, easy_hidden: true },
  nepal: { ui_complexity: 'high', tap_density: 'high', zoom_required: true, easy_hidden: true },
  morocco: { ui_complexity: 'medium', tap_density: 'medium', zoom_required: true, easy_hidden: true },
  brazil: { ui_complexity: 'high', tap_density: 'high', zoom_required: true, easy_hidden: true },
  australia: { ui_complexity: 'high', tap_density: 'high', zoom_required: true, easy_hidden: true },
  'new-zealand': { ui_complexity: 'high', tap_density: 'high', zoom_required: true, easy_hidden: true },
};

export const COUNTRIES = [
  country({
    "id": "france",
    "iso2": "FR",
    "iso3": "FRA",
    "name": "France",
    "capital": "Paris",
    "continent": "Europe",
    "languages": [
      "French"
    ],
    "flag_asset": "assets/flags/france.svg",
    "theme_colors": [
      "#0055A4",
      "#FFFFFF",
      "#EF4135"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0055A4",
      "#FFFFFF",
      "#EF4135"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "italy",
    "iso2": "IT",
    "iso3": "ITA",
    "name": "Italy",
    "capital": "Rome",
    "continent": "Europe",
    "languages": [
      "Italian"
    ],
    "flag_asset": "assets/flags/italy.svg",
    "theme_colors": [
      "#009246",
      "#FFFFFF",
      "#CE2B37"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#009246",
      "#FFFFFF",
      "#CE2B37"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "ireland",
    "iso2": "IE",
    "iso3": "IRL",
    "name": "Ireland",
    "capital": "Dublin",
    "continent": "Europe",
    "languages": [
      "Irish",
      "English"
    ],
    "flag_asset": "assets/flags/ireland.svg",
    "theme_colors": [
      "#169B62",
      "#FFFFFF",
      "#FF883E"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#169B62",
      "#FFFFFF",
      "#FF883E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "belgium",
    "iso2": "BE",
    "iso3": "BEL",
    "name": "Belgium",
    "capital": "Brussels",
    "continent": "Europe",
    "languages": [
      "Dutch",
      "French",
      "German"
    ],
    "flag_asset": "assets/flags/belgium.svg",
    "theme_colors": [
      "#2D2926",
      "#FDDA24",
      "#EF3340"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#2D2926",
      "#FDDA24",
      "#EF3340"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "germany",
    "iso2": "DE",
    "iso3": "DEU",
    "name": "Germany",
    "capital": "Berlin",
    "continent": "Europe",
    "languages": [
      "German"
    ],
    "flag_asset": "assets/flags/germany.svg",
    "theme_colors": [
      "#2D2926",
      "#DD0000",
      "#FFCE00"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 133,
            "w": 300,
            "h": 67
          }
        ]
      }
    ],
    "flag_colors": [
      "#2D2926",
      "#DD0000",
      "#FFCE00"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "netherlands",
    "iso2": "NL",
    "iso3": "NLD",
    "name": "Netherlands",
    "capital": "Amsterdam",
    "continent": "Europe",
    "languages": [
      "Dutch"
    ],
    "flag_asset": "assets/flags/netherlands.svg",
    "theme_colors": [
      "#AE1C28",
      "#FFFFFF",
      "#21468B"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 133,
            "w": 300,
            "h": 67
          }
        ]
      }
    ],
    "flag_colors": [
      "#AE1C28",
      "#FFFFFF",
      "#21468B"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "poland",
    "iso2": "PL",
    "iso3": "POL",
    "name": "Poland",
    "capital": "Warsaw",
    "continent": "Europe",
    "languages": [
      "Polish"
    ],
    "flag_asset": "assets/flags/poland.svg",
    "theme_colors": [
      "#FFFFFF",
      "#DC143C"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 100
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 100,
            "w": 300,
            "h": 100
          }
        ]
      }
    ],
    "flag_colors": [
      "#FFFFFF",
      "#DC143C"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Zloty",
    "population": ""
  }),
  country({
    "id": "ukraine",
    "iso2": "UA",
    "iso3": "UKR",
    "name": "Ukraine",
    "capital": "Kyiv",
    "continent": "Europe",
    "languages": [
      "Ukrainian"
    ],
    "flag_asset": "assets/flags/ukraine.svg",
    "theme_colors": [
      "#0057B7",
      "#FFD700"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 100
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 100,
            "w": 300,
            "h": 100
          }
        ]
      }
    ],
    "flag_colors": [
      "#0057B7",
      "#FFD700"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Hryvnia",
    "population": ""
  }),
  country({
    "id": "austria",
    "iso2": "AT",
    "iso3": "AUT",
    "name": "Austria",
    "capital": "Vienna",
    "continent": "Europe",
    "languages": [
      "German"
    ],
    "flag_asset": "assets/flags/austria.svg",
    "theme_colors": [
      "#ED2939",
      "#FFFFFF"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "r2",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 133,
            "w": 300,
            "h": 67
          }
        ]
      }
    ],
    "flag_colors": [
      "#ED2939",
      "#FFFFFF"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "japan",
    "iso2": "JP",
    "iso3": "JPN",
    "name": "Japan",
    "capital": "Tokyo",
    "continent": "Asia",
    "languages": [
      "Japanese"
    ],
    "flag_asset": "assets/flags/japan.svg",
    "theme_colors": [
      "#FFFFFF",
      "#BC002D"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "disc",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 150,
            "cy": 100,
            "r": 60
          }
        ]
      }
    ],
    "flag_colors": [
      "#FFFFFF",
      "#BC002D"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Yen",
    "population": ""
  }),
  country({
    "id": "sweden",
    "iso2": "SE",
    "iso3": "SWE",
    "name": "Sweden",
    "capital": "Stockholm",
    "continent": "Europe",
    "languages": [
      "Swedish"
    ],
    "flag_asset": "assets/flags/sweden.svg",
    "theme_colors": [
      "#006AA7",
      "#FECC02"
    ],
    "flag_regions": [
      {
        "id": "blue_top_left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 90,
            "h": 82
          }
        ]
      },
      {
        "id": "blue_top_right",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 126,
            "y": 0,
            "w": 174,
            "h": 82
          }
        ]
      },
      {
        "id": "blue_bottom_left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 118,
            "w": 90,
            "h": 82
          }
        ]
      },
      {
        "id": "blue_bottom_right",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 126,
            "y": 118,
            "w": 174,
            "h": 82
          }
        ]
      },
      {
        "id": "yellow_cross",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 90,
            "y": 0,
            "w": 36,
            "h": 82
          },
          {
            "t": "rect",
            "x": 90,
            "y": 82,
            "w": 36,
            "h": 36
          },
          {
            "t": "rect",
            "x": 90,
            "y": 118,
            "w": 36,
            "h": 82
          },
          {
            "t": "rect",
            "x": 0,
            "y": 82,
            "w": 90,
            "h": 36
          },
          {
            "t": "rect",
            "x": 126,
            "y": 82,
            "w": 174,
            "h": 36
          }
        ]
      }
    ],
    "flag_colors": [
      "#006AA7",
      "#FECC02"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Krona",
    "population": ""
  }),
  country({
    "id": "denmark",
    "iso2": "DK",
    "iso3": "DNK",
    "name": "Denmark",
    "capital": "Copenhagen",
    "continent": "Europe",
    "languages": [
      "Danish"
    ],
    "flag_asset": "assets/flags/denmark.svg",
    "theme_colors": [
      "#C8102E",
      "#FFFFFF"
    ],
    "flag_regions": [
      {
        "id": "red_top_left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 90,
            "h": 82
          }
        ]
      },
      {
        "id": "red_top_right",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 126,
            "y": 0,
            "w": 174,
            "h": 82
          }
        ]
      },
      {
        "id": "red_bottom_left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 118,
            "w": 90,
            "h": 82
          }
        ]
      },
      {
        "id": "red_bottom_right",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 126,
            "y": 118,
            "w": 174,
            "h": 82
          }
        ]
      },
      {
        "id": "white_cross",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 90,
            "y": 0,
            "w": 36,
            "h": 82
          },
          {
            "t": "rect",
            "x": 90,
            "y": 82,
            "w": 36,
            "h": 36
          },
          {
            "t": "rect",
            "x": 90,
            "y": 118,
            "w": 36,
            "h": 82
          },
          {
            "t": "rect",
            "x": 0,
            "y": 82,
            "w": 90,
            "h": 36
          },
          {
            "t": "rect",
            "x": 126,
            "y": 82,
            "w": 174,
            "h": 36
          }
        ]
      }
    ],
    "flag_colors": [
      "#C8102E",
      "#FFFFFF"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Krone",
    "population": ""
  }),
  country({
    "id": "spain",
    "iso2": "ES",
    "iso3": "ESP",
    "name": "Spain",
    "capital": "Madrid",
    "continent": "Europe",
    "languages": [
      "Spanish"
    ],
    "flag_asset": "assets/flags/spain.svg",
    "theme_colors": [
      "#AA151B",
      "#F1BF00"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "r2",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 133,
            "w": 300,
            "h": 67
          }
        ]
      }
    ],
    "flag_colors": [
      "#AA151B",
      "#F1BF00"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "portugal",
    "iso2": "PT",
    "iso3": "PRT",
    "name": "Portugal",
    "capital": "Lisbon",
    "continent": "Europe",
    "languages": [
      "Portuguese"
    ],
    "flag_asset": "assets/flags/portugal.svg",
    "theme_colors": [
      "#006600",
      "#FF0000",
      "#FFD100"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 120,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 120,
            "y": 0,
            "w": 180,
            "h": 200
          }
        ]
      },
      {
        "id": "disc",
        "color": 2,
        "shapes": [
          {
            "t": "circle",
            "cx": 120,
            "cy": 100,
            "r": 34
          }
        ]
      }
    ],
    "flag_colors": [
      "#006600",
      "#FF0000",
      "#FFD100"
    ],
    "difficulty": "medium",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "switzerland",
    "iso2": "CH",
    "iso3": "CHE",
    "name": "Switzerland",
    "capital": "Bern",
    "continent": "Europe",
    "languages": [
      "German",
      "French",
      "Italian",
      "Romansh"
    ],
    "flag_asset": "assets/flags/switzerland.svg",
    "theme_colors": [
      "#D52B1E",
      "#FFFFFF"
    ],
    "flag_regions": [
      {
        "id": "red_top_left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 90,
            "h": 80
          }
        ]
      },
      {
        "id": "red_top_right",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 210,
            "y": 0,
            "w": 90,
            "h": 80
          }
        ]
      },
      {
        "id": "red_bottom_left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 120,
            "w": 90,
            "h": 80
          }
        ]
      },
      {
        "id": "red_bottom_right",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 210,
            "y": 120,
            "w": 90,
            "h": 80
          }
        ]
      },
      {
        "id": "white_cross",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 120,
            "y": 50,
            "w": 60,
            "h": 100
          },
          {
            "t": "rect",
            "x": 90,
            "y": 80,
            "w": 30,
            "h": 40
          },
          {
            "t": "rect",
            "x": 180,
            "y": 80,
            "w": 30,
            "h": 40
          }
        ]
      }
    ],
    "flag_colors": [
      "#D52B1E",
      "#FFFFFF"
    ],
    "difficulty": "medium",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Franc",
    "population": ""
  }),
  country({
    "id": "norway",
    "iso2": "NO",
    "iso3": "NOR",
    "name": "Norway",
    "capital": "Oslo",
    "continent": "Europe",
    "languages": [
      "Norwegian"
    ],
    "flag_asset": "assets/flags/norway.svg",
    "theme_colors": [
      "#BA0C2F",
      "#FFFFFF",
      "#00205B"
    ],
    "flag_regions": [
      {
        "id": "red_top_left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 84,
            "h": 76
          }
        ]
      },
      {
        "id": "red_top_right",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 132,
            "y": 0,
            "w": 168,
            "h": 76
          }
        ]
      },
      {
        "id": "red_bottom_left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 124,
            "w": 84,
            "h": 76
          }
        ]
      },
      {
        "id": "red_bottom_right",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 132,
            "y": 124,
            "w": 168,
            "h": 76
          }
        ]
      },
      {
        "id": "white_cross",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 84,
            "y": 0,
            "w": 48,
            "h": 76
          },
          {
            "t": "rect",
            "x": 84,
            "y": 76,
            "w": 48,
            "h": 48
          },
          {
            "t": "rect",
            "x": 84,
            "y": 124,
            "w": 48,
            "h": 76
          },
          {
            "t": "rect",
            "x": 0,
            "y": 76,
            "w": 84,
            "h": 48
          },
          {
            "t": "rect",
            "x": 132,
            "y": 76,
            "w": 168,
            "h": 48
          }
        ]
      },
      {
        "id": "blue_cross",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 96,
            "y": 0,
            "w": 24,
            "h": 76
          },
          {
            "t": "rect",
            "x": 96,
            "y": 76,
            "w": 24,
            "h": 48
          },
          {
            "t": "rect",
            "x": 96,
            "y": 124,
            "w": 24,
            "h": 76
          },
          {
            "t": "rect",
            "x": 0,
            "y": 88,
            "w": 96,
            "h": 24
          },
          {
            "t": "rect",
            "x": 120,
            "y": 88,
            "w": 180,
            "h": 24
          }
        ]
      }
    ],
    "flag_colors": [
      "#BA0C2F",
      "#FFFFFF",
      "#00205B"
    ],
    "difficulty": "medium",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Krone",
    "population": ""
  }),
  country({
    "id": "finland",
    "iso2": "FI",
    "iso3": "FIN",
    "name": "Finland",
    "capital": "Helsinki",
    "continent": "Europe",
    "languages": [
      "Finnish",
      "Swedish"
    ],
    "flag_asset": "assets/flags/finland.svg",
    "theme_colors": [
      "#FFFFFF",
      "#003580"
    ],
    "flag_regions": [
      {
        "id": "white_top_left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 90,
            "h": 82
          }
        ]
      },
      {
        "id": "white_top_right",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 126,
            "y": 0,
            "w": 174,
            "h": 82
          }
        ]
      },
      {
        "id": "white_bottom_left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 118,
            "w": 90,
            "h": 82
          }
        ]
      },
      {
        "id": "white_bottom_right",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 126,
            "y": 118,
            "w": 174,
            "h": 82
          }
        ]
      },
      {
        "id": "blue_cross",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 90,
            "y": 0,
            "w": 36,
            "h": 82
          },
          {
            "t": "rect",
            "x": 90,
            "y": 82,
            "w": 36,
            "h": 36
          },
          {
            "t": "rect",
            "x": 90,
            "y": 118,
            "w": 36,
            "h": 82
          },
          {
            "t": "rect",
            "x": 0,
            "y": 82,
            "w": 90,
            "h": 36
          },
          {
            "t": "rect",
            "x": 126,
            "y": 82,
            "w": 174,
            "h": 36
          }
        ]
      }
    ],
    "flag_colors": [
      "#FFFFFF",
      "#003580"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "iceland",
    "iso2": "IS",
    "iso3": "ISL",
    "name": "Iceland",
    "capital": "Reykjavik",
    "continent": "Europe",
    "languages": [
      "Icelandic"
    ],
    "flag_asset": "assets/flags/iceland.svg",
    "theme_colors": [
      "#003897",
      "#FFFFFF",
      "#D72828"
    ],
    "flag_regions": [
      {
        "id": "blue_top_left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 84,
            "h": 76
          }
        ]
      },
      {
        "id": "blue_top_right",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 132,
            "y": 0,
            "w": 168,
            "h": 76
          }
        ]
      },
      {
        "id": "blue_bottom_left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 124,
            "w": 84,
            "h": 76
          }
        ]
      },
      {
        "id": "blue_bottom_right",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 132,
            "y": 124,
            "w": 168,
            "h": 76
          }
        ]
      },
      {
        "id": "white_cross",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 84,
            "y": 0,
            "w": 48,
            "h": 76
          },
          {
            "t": "rect",
            "x": 84,
            "y": 76,
            "w": 48,
            "h": 48
          },
          {
            "t": "rect",
            "x": 84,
            "y": 124,
            "w": 48,
            "h": 76
          },
          {
            "t": "rect",
            "x": 0,
            "y": 76,
            "w": 84,
            "h": 48
          },
          {
            "t": "rect",
            "x": 132,
            "y": 76,
            "w": 168,
            "h": 48
          }
        ]
      },
      {
        "id": "red_cross",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 96,
            "y": 0,
            "w": 24,
            "h": 76
          },
          {
            "t": "rect",
            "x": 96,
            "y": 76,
            "w": 24,
            "h": 48
          },
          {
            "t": "rect",
            "x": 96,
            "y": 124,
            "w": 24,
            "h": 76
          },
          {
            "t": "rect",
            "x": 0,
            "y": 88,
            "w": 84,
            "h": 24
          },
          {
            "t": "rect",
            "x": 120,
            "y": 88,
            "w": 180,
            "h": 24
          }
        ]
      }
    ],
    "flag_colors": [
      "#003897",
      "#FFFFFF",
      "#D72828"
    ],
    "difficulty": "medium",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Krona",
    "population": ""
  }),
  country({
    "id": "greece",
    "iso2": "GR",
    "iso3": "GRC",
    "name": "Greece",
    "capital": "Athens",
    "continent": "Europe",
    "languages": [
      "Greek"
    ],
    "flag_asset": "assets/flags/greece.svg",
    "theme_colors": [
      "#0D5EAF",
      "#FFFFFF"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 22
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 22,
            "w": 300,
            "h": 22
          }
        ]
      },
      {
        "id": "r2",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 44,
            "w": 300,
            "h": 22
          }
        ]
      },
      {
        "id": "r3",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 66,
            "w": 300,
            "h": 22
          }
        ]
      },
      {
        "id": "r4",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 88,
            "w": 300,
            "h": 22
          }
        ]
      },
      {
        "id": "r5",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 110,
            "w": 300,
            "h": 22
          }
        ]
      },
      {
        "id": "r6",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 132,
            "w": 300,
            "h": 22
          }
        ]
      },
      {
        "id": "r7",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 154,
            "w": 300,
            "h": 22
          }
        ]
      },
      {
        "id": "r8",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 176,
            "w": 300,
            "h": 24
          }
        ]
      }
    ],
    "flag_colors": [
      "#0D5EAF",
      "#FFFFFF"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "croatia",
    "iso2": "HR",
    "iso3": "HRV",
    "name": "Croatia",
    "capital": "Zagreb",
    "continent": "Europe",
    "languages": [
      "Croatian"
    ],
    "flag_asset": "assets/flags/croatia.svg",
    "theme_colors": [
      "#FF0000",
      "#FFFFFF",
      "#171796"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 133,
            "w": 300,
            "h": 67
          }
        ]
      }
    ],
    "flag_colors": [
      "#FF0000",
      "#FFFFFF",
      "#171796"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "czech-republic",
    "iso2": "CZ",
    "iso3": "CZE",
    "name": "Czech Republic",
    "capital": "Prague",
    "continent": "Europe",
    "languages": [
      "Czech"
    ],
    "flag_asset": "assets/flags/czech-republic.svg",
    "theme_colors": [
      "#FFFFFF",
      "#D7141A",
      "#11457E"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 100
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 100,
            "w": 300,
            "h": 100
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "polygon",
            "points": "0,0 130,100 0,200"
          }
        ]
      }
    ],
    "flag_colors": [
      "#FFFFFF",
      "#D7141A",
      "#11457E"
    ],
    "difficulty": "medium",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Koruna",
    "population": ""
  }),
  country({
    "id": "romania",
    "iso2": "RO",
    "iso3": "ROU",
    "name": "Romania",
    "capital": "Bucharest",
    "continent": "Europe",
    "languages": [
      "Romanian"
    ],
    "flag_asset": "assets/flags/romania.svg",
    "theme_colors": [
      "#002B7F",
      "#FCD116",
      "#CE1126"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#002B7F",
      "#FCD116",
      "#CE1126"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Leu",
    "population": ""
  }),
  country({
    "id": "brazil",
    "iso2": "BR",
    "iso3": "BRA",
    "name": "Brazil",
    "capital": "Brasilia",
    "continent": "South America",
    "languages": [
      "Portuguese"
    ],
    "flag_asset": "assets/flags/brazil.svg",
    "theme_colors": [
      "#009C3B",
      "#FFDF00",
      "#002776"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "diamond",
        "color": 1,
        "shapes": [
          {
            "t": "polygon",
            "points": "150,30 250,100 150,170 50,100"
          }
        ]
      },
      {
        "id": "disc",
        "color": 2,
        "shapes": [
          {
            "t": "circle",
            "cx": 150,
            "cy": 100,
            "r": 42
          }
        ]
      }
    ],
    "flag_colors": [
      "#009C3B",
      "#FFDF00",
      "#002776"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Real",
    "population": ""
  }),
  country({
    "id": "argentina",
    "iso2": "AR",
    "iso3": "ARG",
    "name": "Argentina",
    "capital": "Buenos Aires",
    "continent": "South America",
    "languages": [
      "Spanish"
    ],
    "flag_asset": "assets/flags/argentina.svg",
    "theme_colors": [
      "#74ACDF",
      "#FFFFFF",
      "#F6B40E"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "r2",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 133,
            "w": 300,
            "h": 67
          }
        ]
      }
    ],
    "flag_colors": [
      "#74ACDF",
      "#FFFFFF",
      "#F6B40E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Peso",
    "population": ""
  }),
  country({
    "id": "chile",
    "iso2": "CL",
    "iso3": "CHL",
    "name": "Chile",
    "capital": "Santiago",
    "continent": "South America",
    "languages": [
      "Spanish"
    ],
    "flag_asset": "assets/flags/chile.svg",
    "theme_colors": [
      "#FFFFFF",
      "#D52B1E",
      "#0039A6"
    ],
    "flag_regions": [
      {
        "id": "top",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 100
          }
        ]
      },
      {
        "id": "bottom-left",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 100,
            "w": 300,
            "h": 100
          }
        ]
      },
      {
        "id": "canton",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 100
          }
        ]
      }
    ],
    "flag_colors": [
      "#FFFFFF",
      "#D52B1E",
      "#0039A6"
    ],
    "difficulty": "medium",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Peso",
    "population": ""
  }),
  country({
    "id": "peru",
    "iso2": "PE",
    "iso3": "PER",
    "name": "Peru",
    "capital": "Lima",
    "continent": "South America",
    "languages": [
      "Spanish",
      "Quechua",
      "Aymara"
    ],
    "flag_asset": "assets/flags/peru.svg",
    "theme_colors": [
      "#D91023",
      "#FFFFFF"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r2",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#D91023",
      "#FFFFFF"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Sol",
    "population": ""
  }),
  country({
    "id": "colombia",
    "iso2": "CO",
    "iso3": "COL",
    "name": "Colombia",
    "capital": "Bogota",
    "continent": "South America",
    "languages": [
      "Spanish"
    ],
    "flag_asset": "assets/flags/colombia.svg",
    "theme_colors": [
      "#FCD116",
      "#003893",
      "#CE1126"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 100
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 100,
            "w": 300,
            "h": 50
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 150,
            "w": 300,
            "h": 50
          }
        ]
      }
    ],
    "flag_colors": [
      "#FCD116",
      "#003893",
      "#CE1126"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Peso",
    "population": ""
  }),
  country({
    "id": "venezuela",
    "iso2": "VE",
    "iso3": "VEN",
    "name": "Venezuela",
    "capital": "Caracas",
    "continent": "South America",
    "languages": [
      "Spanish"
    ],
    "flag_asset": "assets/flags/venezuela.svg",
    "theme_colors": [
      "#F4D900",
      "#0038A8",
      "#EF3340"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 133,
            "w": 300,
            "h": 67
          }
        ]
      }
    ],
    "flag_colors": [
      "#F4D900",
      "#0038A8",
      "#EF3340"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Bolivar",
    "population": ""
  }),
  country({
    "id": "mexico",
    "iso2": "MX",
    "iso3": "MEX",
    "name": "Mexico",
    "capital": "Mexico City",
    "continent": "North America",
    "languages": [
      "Spanish"
    ],
    "flag_asset": "assets/flags/mexico.svg",
    "theme_colors": [
      "#006847",
      "#FFFFFF",
      "#CE1126"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#006847",
      "#FFFFFF",
      "#CE1126"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Peso",
    "population": ""
  }),
  country({
    "id": "guatemala",
    "iso2": "GT",
    "iso3": "GTM",
    "name": "Guatemala",
    "capital": "Guatemala City",
    "continent": "North America",
    "languages": [
      "Spanish"
    ],
    "flag_asset": "assets/flags/guatemala.svg",
    "theme_colors": [
      "#4997D0",
      "#FFFFFF"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r2",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#4997D0",
      "#FFFFFF"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Quetzal",
    "population": ""
  }),
  country({
    "id": "cuba",
    "iso2": "CU",
    "iso3": "CUB",
    "name": "Cuba",
    "capital": "Havana",
    "continent": "North America",
    "languages": [
      "Spanish"
    ],
    "flag_asset": "assets/flags/cuba.svg",
    "theme_colors": [
      "#002A8F",
      "#FFFFFF",
      "#CF142B"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 40
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 40,
            "w": 300,
            "h": 40
          }
        ]
      },
      {
        "id": "r2",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 80,
            "w": 300,
            "h": 40
          }
        ]
      },
      {
        "id": "r3",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 120,
            "w": 300,
            "h": 40
          }
        ]
      },
      {
        "id": "r4",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 160,
            "w": 300,
            "h": 40
          }
        ]
      },
      {
        "id": "triangle",
        "color": 2,
        "shapes": [
          {
            "t": "polygon",
            "points": "0,0 130,100 0,200"
          }
        ]
      }
    ],
    "flag_colors": [
      "#002A8F",
      "#FFFFFF",
      "#CF142B"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Peso",
    "population": ""
  }),
  country({
    "id": "jamaica",
    "iso2": "JM",
    "iso3": "JAM",
    "name": "Jamaica",
    "capital": "Kingston",
    "continent": "North America",
    "languages": [
      "English"
    ],
    "flag_asset": "assets/flags/jamaica.svg",
    "theme_colors": [
      "#009B3A",
      "#FED100",
      "#000000"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "cross-yellow-1",
        "color": 1,
        "shapes": [
          {
            "t": "polygon",
            "points": "0,0 120,0 150,70 120,100 0,100"
          }
        ]
      },
      {
        "id": "cross-yellow-2",
        "color": 1,
        "shapes": [
          {
            "t": "polygon",
            "points": "300,0 180,0 150,70 180,100 300,100"
          }
        ]
      },
      {
        "id": "cross-yellow-3",
        "color": 1,
        "shapes": [
          {
            "t": "polygon",
            "points": "0,200 120,200 150,130 120,100 0,100"
          }
        ]
      },
      {
        "id": "cross-yellow-4",
        "color": 1,
        "shapes": [
          {
            "t": "polygon",
            "points": "300,200 180,200 150,130 180,100 300,100"
          }
        ]
      },
      {
        "id": "cross-black-1",
        "color": 2,
        "shapes": [
          {
            "t": "polygon",
            "points": "0,0 140,100 0,100"
          }
        ]
      },
      {
        "id": "cross-black-2",
        "color": 2,
        "shapes": [
          {
            "t": "polygon",
            "points": "300,0 160,100 300,100"
          }
        ]
      },
      {
        "id": "cross-black-3",
        "color": 2,
        "shapes": [
          {
            "t": "polygon",
            "points": "0,200 140,100 0,100"
          }
        ]
      },
      {
        "id": "cross-black-4",
        "color": 2,
        "shapes": [
          {
            "t": "polygon",
            "points": "300,200 160,100 300,100"
          }
        ]
      }
    ],
    "flag_colors": [
      "#009B3A",
      "#FED100",
      "#000000"
    ],
    "difficulty": "expert",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Dollar",
    "population": ""
  }),
  country({
    "id": "united-states",
    "iso2": "US",
    "iso3": "USA",
    "name": "United States",
    "capital": "Washington, D.C.",
    "continent": "North America",
    "languages": [
      "English"
    ],
    "flag_asset": "assets/flags/united-states.svg",
    "theme_colors": [
      "#B22234",
      "#FFFFFF",
      "#3C3B6E"
    ],
    "flag_regions": [
      {
        "id": "stripe-0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 15,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-2",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 30,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-3",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 45,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-4",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 60,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-5",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 75,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-6",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 90,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-7",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 105,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-8",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 120,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-9",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 135,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-10",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 150,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-11",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 165,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-12",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 180,
            "w": 300,
            "h": 20
          }
        ]
      },
      {
        "id": "canton",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 120,
            "h": 105
          }
        ]
      }
    ],
    "flag_colors": [
      "#B22234",
      "#FFFFFF",
      "#3C3B6E"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Dollar",
    "population": ""
  }),
  country({
    "id": "canada",
    "iso2": "CA",
    "iso3": "CAN",
    "name": "Canada",
    "capital": "Ottawa",
    "continent": "North America",
    "languages": [
      "English",
      "French"
    ],
    "flag_asset": "assets/flags/canada.svg",
    "theme_colors": [
      "#FF0000",
      "#FFFFFF"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 75,
            "h": 200
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 75,
            "y": 0,
            "w": 150,
            "h": 200
          }
        ]
      },
      {
        "id": "r2",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 225,
            "y": 0,
            "w": 75,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#FF0000",
      "#FFFFFF"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Dollar",
    "population": ""
  }),
  country({
    "id": "china",
    "iso2": "CN",
    "iso3": "CHN",
    "name": "China",
    "capital": "Beijing",
    "continent": "Asia",
    "languages": [
      "Mandarin Chinese"
    ],
    "flag_asset": "assets/flags/china.svg",
    "theme_colors": [
      "#DE2910",
      "#FFDE00"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "star-main",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 60,
            "cy": 50,
            "r": 16
          }
        ]
      },
      {
        "id": "star-1",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 96,
            "cy": 28,
            "r": 7
          }
        ]
      },
      {
        "id": "star-2",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 118,
            "cy": 50,
            "r": 7
          }
        ]
      },
      {
        "id": "star-3",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 118,
            "cy": 84,
            "r": 7
          }
        ]
      },
      {
        "id": "star-4",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 96,
            "cy": 106,
            "r": 7
          }
        ]
      }
    ],
    "flag_colors": [
      "#DE2910",
      "#FFDE00"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Yuan",
    "population": ""
  }),
  country({
    "id": "south-korea",
    "iso2": "KR",
    "iso3": "KOR",
    "name": "South Korea",
    "capital": "Seoul",
    "continent": "Asia",
    "languages": [
      "Korean"
    ],
    "flag_asset": "assets/flags/south-korea.svg",
    "theme_colors": [
      "#FFFFFF",
      "#CD2E3A",
      "#0047A0",
      "#000000"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "yin",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 150,
            "cy": 100,
            "r": 34
          }
        ]
      },
      {
        "id": "yang",
        "color": 2,
        "shapes": [
          {
            "t": "circle",
            "cx": 150,
            "cy": 100,
            "r": 18
          }
        ]
      },
      {
        "id": "bar-1",
        "color": 3,
        "shapes": [
          {
            "t": "rect",
            "x": 40,
            "y": 36,
            "w": 48,
            "h": 12
          }
        ]
      },
      {
        "id": "bar-2",
        "color": 3,
        "shapes": [
          {
            "t": "rect",
            "x": 40,
            "y": 56,
            "w": 48,
            "h": 12
          }
        ]
      },
      {
        "id": "bar-3",
        "color": 3,
        "shapes": [
          {
            "t": "rect",
            "x": 212,
            "y": 132,
            "w": 48,
            "h": 12
          }
        ]
      },
      {
        "id": "bar-4",
        "color": 3,
        "shapes": [
          {
            "t": "rect",
            "x": 212,
            "y": 152,
            "w": 48,
            "h": 12
          }
        ]
      }
    ],
    "flag_colors": [
      "#FFFFFF",
      "#CD2E3A",
      "#0047A0",
      "#000000"
    ],
    "difficulty": "expert",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Won",
    "population": ""
  }),
  country({
    "id": "india",
    "iso2": "IN",
    "iso3": "IND",
    "name": "India",
    "capital": "New Delhi",
    "continent": "Asia",
    "languages": [
      "Hindi",
      "English"
    ],
    "flag_asset": "assets/flags/india.svg",
    "theme_colors": [
      "#FF9933",
      "#FFFFFF",
      "#138808",
      "#000080"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 133,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "wheel",
        "color": 3,
        "shapes": [
          {
            "t": "circle",
            "cx": 150,
            "cy": 100,
            "r": 16
          }
        ]
      }
    ],
    "flag_colors": [
      "#FF9933",
      "#FFFFFF",
      "#138808",
      "#000080"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Rupee",
    "population": ""
  }),
  country({
    "id": "thailand",
    "iso2": "TH",
    "iso3": "THA",
    "name": "Thailand",
    "capital": "Bangkok",
    "continent": "Asia",
    "languages": [
      "Thai"
    ],
    "flag_asset": "assets/flags/thailand.svg",
    "theme_colors": [
      "#A51931",
      "#FFFFFF",
      "#2D2A4A"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 40
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 40,
            "w": 300,
            "h": 40
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 80,
            "w": 300,
            "h": 80
          }
        ]
      },
      {
        "id": "r3",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 160,
            "w": 300,
            "h": 40
          }
        ]
      }
    ],
    "flag_colors": [
      "#A51931",
      "#FFFFFF",
      "#2D2A4A"
    ],
    "difficulty": "medium",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Baht",
    "population": ""
  }),
  country({
    "id": "vietnam",
    "iso2": "VN",
    "iso3": "VNM",
    "name": "Vietnam",
    "capital": "Hanoi",
    "continent": "Asia",
    "languages": [
      "Vietnamese"
    ],
    "flag_asset": "assets/flags/vietnam.svg",
    "theme_colors": [
      "#DA251D",
      "#FFDF00"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "star",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 150,
            "cy": 100,
            "r": 24
          }
        ]
      }
    ],
    "flag_colors": [
      "#DA251D",
      "#FFDF00"
    ],
    "difficulty": "medium",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Dong",
    "population": ""
  }),
  country({
    "id": "indonesia",
    "iso2": "ID",
    "iso3": "IDN",
    "name": "Indonesia",
    "capital": "Jakarta",
    "continent": "Asia",
    "languages": [
      "Indonesian"
    ],
    "flag_asset": "assets/flags/indonesia.svg",
    "theme_colors": [
      "#FF0000",
      "#FFFFFF"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 100
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 100,
            "w": 300,
            "h": 100
          }
        ]
      }
    ],
    "flag_colors": [
      "#FF0000",
      "#FFFFFF"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Rupiah",
    "population": ""
  }),
  country({
    "id": "philippines",
    "iso2": "PH",
    "iso3": "PHL",
    "name": "Philippines",
    "capital": "Manila",
    "continent": "Asia",
    "languages": [
      "Filipino",
      "English"
    ],
    "flag_asset": "assets/flags/philippines.svg",
    "theme_colors": [
      "#0038A8",
      "#CE1126",
      "#FFFFFF",
      "#FCD116"
    ],
    "flag_regions": [
      {
        "id": "top",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 100
          }
        ]
      },
      {
        "id": "bottom",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 100,
            "w": 300,
            "h": 100
          }
        ]
      },
      {
        "id": "triangle",
        "color": 2,
        "shapes": [
          {
            "t": "polygon",
            "points": "0,0 140,100 0,200"
          }
        ]
      },
      {
        "id": "sun",
        "color": 3,
        "shapes": [
          {
            "t": "circle",
            "cx": 50,
            "cy": 100,
            "r": 16
          }
        ]
      }
    ],
    "flag_colors": [
      "#0038A8",
      "#CE1126",
      "#FFFFFF",
      "#FCD116"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Peso",
    "population": ""
  }),
  country({
    "id": "malaysia",
    "iso2": "MY",
    "iso3": "MYS",
    "name": "Malaysia",
    "capital": "Kuala Lumpur",
    "continent": "Asia",
    "languages": [
      "Malay"
    ],
    "flag_asset": "assets/flags/malaysia.svg",
    "theme_colors": [
      "#CC0001",
      "#FFFFFF",
      "#010066",
      "#FFCC00"
    ],
    "flag_regions": [
      {
        "id": "stripe-0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 15,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-2",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 30,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-3",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 45,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-4",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 60,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-5",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 75,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-6",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 90,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-7",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 105,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-8",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 120,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-9",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 135,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-10",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 150,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "stripe-11",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 165,
            "w": 300,
            "h": 15
          }
        ]
      },
      {
        "id": "canton",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 120,
            "h": 105
          }
        ]
      },
      {
        "id": "star",
        "color": 3,
        "shapes": [
          {
            "t": "circle",
            "cx": 60,
            "cy": 52,
            "r": 18
          }
        ]
      }
    ],
    "flag_colors": [
      "#CC0001",
      "#FFFFFF",
      "#010066",
      "#FFCC00"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Ringgit",
    "population": ""
  }),
  country({
    "id": "singapore",
    "iso2": "SG",
    "iso3": "SGP",
    "name": "Singapore",
    "capital": "Singapore",
    "continent": "Asia",
    "languages": [
      "English",
      "Malay",
      "Mandarin Chinese",
      "Tamil"
    ],
    "flag_asset": "assets/flags/singapore.svg",
    "theme_colors": [
      "#EF3340",
      "#FFFFFF"
    ],
    "flag_regions": [
      {
        "id": "top",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 100
          }
        ]
      },
      {
        "id": "bottom",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 100,
            "w": 300,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#EF3340",
      "#FFFFFF"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Dollar",
    "population": ""
  }),
  country({
    "id": "egypt",
    "iso2": "EG",
    "iso3": "EGY",
    "name": "Egypt",
    "capital": "Cairo",
    "continent": "Africa",
    "languages": [
      "Arabic"
    ],
    "flag_asset": "assets/flags/egypt.svg",
    "theme_colors": [
      "#CE1126",
      "#FFFFFF",
      "#000000",
      "#C09300"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "r2",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 133,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "emblem",
        "color": 3,
        "shapes": [
          {
            "t": "circle",
            "cx": 150,
            "cy": 100,
            "r": 16
          }
        ]
      }
    ],
    "flag_colors": [
      "#CE1126",
      "#FFFFFF",
      "#000000",
      "#C09300"
    ],
    "difficulty": "medium",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Pound",
    "population": ""
  }),
  country({
    "id": "morocco",
    "iso2": "MA",
    "iso3": "MAR",
    "name": "Morocco",
    "capital": "Rabat",
    "continent": "Africa",
    "languages": [
      "Arabic",
      "Amazigh"
    ],
    "flag_asset": "assets/flags/morocco.svg",
    "theme_colors": [
      "#C1272D",
      "#006233"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "star",
        "color": 1,
        "shapes": [
          {
            "t": "polygon",
            "points": "150,60 165,95 203,95 172,118 184,154 150,132 116,154 128,118 97,95 135,95"
          }
        ]
      }
    ],
    "flag_colors": [
      "#C1272D",
      "#006233"
    ],
    "difficulty": "expert",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Dirham",
    "population": ""
  }),
  country({
    "id": "nigeria",
    "iso2": "NG",
    "iso3": "NGA",
    "name": "Nigeria",
    "capital": "Abuja",
    "continent": "Africa",
    "languages": [
      "English"
    ],
    "flag_asset": "assets/flags/nigeria.svg",
    "theme_colors": [
      "#008753",
      "#FFFFFF"
    ],
    "flag_regions": [
      {
        "id": "r0",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r1",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "r2",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#008753",
      "#FFFFFF"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Naira",
    "population": ""
  }),
  country({
    "id": "kenya",
    "iso2": "KE",
    "iso3": "KEN",
    "name": "Kenya",
    "capital": "Nairobi",
    "continent": "Africa",
    "languages": [
      "Swahili",
      "English"
    ],
    "flag_asset": "assets/flags/kenya.svg",
    "theme_colors": [
      "#000000",
      "#BB0000",
      "#006600",
      "#FFFFFF"
    ],
    "flag_regions": [
      {
        "id": "top",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "bot",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 133,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "shield",
        "color": 3,
        "shapes": [
          {
            "t": "rect",
            "x": 130,
            "y": 60,
            "w": 40,
            "h": 80
          }
        ]
      }
    ],
    "flag_colors": [
      "#000000",
      "#BB0000",
      "#006600",
      "#FFFFFF"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Shilling",
    "population": ""
  }),
  country({
    "id": "south-africa",
    "iso2": "ZA",
    "iso3": "ZAF",
    "name": "South Africa",
    "capital": "Pretoria",
    "continent": "Africa",
    "languages": [
      "Zulu",
      "Xhosa",
      "Afrikaans",
      "English"
    ],
    "flag_asset": "assets/flags/south-africa.svg",
    "theme_colors": [
      "#DE3831",
      "#007A4D",
      "#000000",
      "#FFB612",
      "#FFFFFF"
    ],
    "flag_regions": [
      {
        "id": "top",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "bot",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 133,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "chevron",
        "color": 3,
        "shapes": [
          {
            "t": "polygon",
            "points": "0,0 150,100 0,200 40,200 180,100 40,0"
          }
        ]
      },
      {
        "id": "accent",
        "color": 4,
        "shapes": [
          {
            "t": "polygon",
            "points": "0,0 160,100 0,200 20,200 170,100 20,0"
          }
        ]
      }
    ],
    "flag_colors": [
      "#DE3831",
      "#007A4D",
      "#000000",
      "#FFB612",
      "#FFFFFF"
    ],
    "difficulty": "expert",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Rand",
    "population": ""
  }),
  country({
    "id": "australia",
    "iso2": "AU",
    "iso3": "AUS",
    "name": "Australia",
    "capital": "Canberra",
    "continent": "Oceania",
    "languages": [
      "English"
    ],
    "flag_asset": "assets/flags/australia.svg",
    "theme_colors": [
      "#012169",
      "#FFFFFF",
      "#C8102E"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "canton",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 120,
            "h": 100
          }
        ]
      },
      {
        "id": "star",
        "color": 2,
        "shapes": [
          {
            "t": "circle",
            "cx": 200,
            "cy": 110,
            "r": 18
          }
        ]
      }
    ],
    "flag_colors": [
      "#012169",
      "#FFFFFF",
      "#C8102E"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Dollar",
    "population": ""
  }),
  country({
    "id": "new-zealand",
    "iso2": "NZ",
    "iso3": "NZL",
    "name": "New Zealand",
    "capital": "Wellington",
    "continent": "Oceania",
    "languages": [
      "English",
      "Maori"
    ],
    "flag_asset": "assets/flags/new-zealand.svg",
    "theme_colors": [
      "#012169",
      "#FFFFFF",
      "#C8102E"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "canton",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 120,
            "h": 100
          }
        ]
      },
      {
        "id": "star",
        "color": 2,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 90,
            "r": 18
          }
        ]
      }
    ],
    "flag_colors": [
      "#012169",
      "#FFFFFF",
      "#C8102E"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Dollar",
    "population": ""
  }),
  country({
    "id": "afghanistan",
    "iso2": "AF",
    "iso3": "AFG",
    "name": "Afghanistan",
    "capital": "Kabul",
    "continent": "Asia",
    "languages": [
      "Dari",
      "Pashto",
      "Turkmen"
    ],
    "theme_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Afghan afghani",
    "population": ""
  }),
  country({
    "id": "albania",
    "iso2": "AL",
    "iso3": "ALB",
    "name": "Albania",
    "capital": "Tirana",
    "continent": "Europe",
    "languages": [
      "Albanian"
    ],
    "theme_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Albanian lek",
    "population": ""
  }),
  country({
    "id": "algeria",
    "iso2": "DZ",
    "iso3": "DZA",
    "name": "Algeria",
    "capital": "Algiers",
    "continent": "Africa",
    "languages": [
      "Arabic"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Algerian dinar",
    "population": ""
  }),
  country({
    "id": "andorra",
    "iso2": "AD",
    "iso3": "AND",
    "name": "Andorra",
    "capital": "Andorra la Vella",
    "continent": "Europe",
    "languages": [
      "Catalan"
    ],
    "theme_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "angola",
    "iso2": "AO",
    "iso3": "AGO",
    "name": "Angola",
    "capital": "Luanda",
    "continent": "Africa",
    "languages": [
      "Portuguese"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Angolan kwanza",
    "population": ""
  }),
  country({
    "id": "antigua-and-barbuda",
    "iso2": "AG",
    "iso3": "ATG",
    "name": "Antigua and Barbuda",
    "capital": "Saint John's",
    "continent": "Americas",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#DC2626",
      "#1D4ED8",
      "#F97316"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#DC2626",
      "#1D4ED8",
      "#F97316"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Eastern Caribbean dollar",
    "population": ""
  }),
  country({
    "id": "armenia",
    "iso2": "AM",
    "iso3": "ARM",
    "name": "Armenia",
    "capital": "Yerevan",
    "continent": "Asia",
    "languages": [
      "Armenian"
    ],
    "theme_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Armenian dram",
    "population": ""
  }),
  country({
    "id": "azerbaijan",
    "iso2": "AZ",
    "iso3": "AZE",
    "name": "Azerbaijan",
    "capital": "Baku",
    "continent": "Asia",
    "languages": [
      "Azerbaijani",
      "Russian"
    ],
    "theme_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Azerbaijani manat",
    "population": ""
  }),
  country({
    "id": "bahamas",
    "iso2": "BS",
    "iso3": "BHS",
    "name": "Bahamas",
    "capital": "Nassau",
    "continent": "Americas",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#DC2626",
      "#1D4ED8",
      "#F97316"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#DC2626",
      "#1D4ED8",
      "#F97316"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Bahamian dollar",
    "population": ""
  }),
  country({
    "id": "bahrain",
    "iso2": "BH",
    "iso3": "BHR",
    "name": "Bahrain",
    "capital": "Manama",
    "continent": "Asia",
    "languages": [
      "Arabic"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Bahraini dinar",
    "population": ""
  }),
  country({
    "id": "bangladesh",
    "iso2": "BD",
    "iso3": "BGD",
    "name": "Bangladesh",
    "capital": "Dhaka",
    "continent": "Asia",
    "languages": [
      "Bengali"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Bangladeshi taka",
    "population": ""
  }),
  country({
    "id": "barbados",
    "iso2": "BB",
    "iso3": "BRB",
    "name": "Barbados",
    "capital": "Bridgetown",
    "continent": "Americas",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Barbadian dollar",
    "population": ""
  }),
  country({
    "id": "belarus",
    "iso2": "BY",
    "iso3": "BLR",
    "name": "Belarus",
    "capital": "Minsk",
    "continent": "Europe",
    "languages": [
      "Belarusian",
      "Russian"
    ],
    "theme_colors": [
      "#C81E1E",
      "#0E3A8A",
      "#F8FAFC"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#C81E1E",
      "#0E3A8A",
      "#F8FAFC"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Belarusian ruble",
    "population": ""
  }),
  country({
    "id": "belize",
    "iso2": "BZ",
    "iso3": "BLZ",
    "name": "Belize",
    "capital": "Belmopan",
    "continent": "Americas",
    "languages": [
      "Belizean Creole",
      "English",
      "Spanish"
    ],
    "theme_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Belize dollar",
    "population": ""
  }),
  country({
    "id": "benin",
    "iso2": "BJ",
    "iso3": "BEN",
    "name": "Benin",
    "capital": "Porto-Novo",
    "continent": "Africa",
    "languages": [
      "French"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "West African CFA franc",
    "population": ""
  }),
  country({
    "id": "bhutan",
    "iso2": "BT",
    "iso3": "BTN",
    "name": "Bhutan",
    "capital": "Thimphu",
    "continent": "Asia",
    "languages": [
      "Dzongkha"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "band-top",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 55
          }
        ]
      },
      {
        "id": "band-mid",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 55,
            "w": 300,
            "h": 90
          }
        ]
      },
      {
        "id": "emblem",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 170,
            "cy": 100,
            "r": 28
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "expert",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Bhutanese ngultrum",
    "population": ""
  }),
  country({
    "id": "bolivia",
    "iso2": "BO",
    "iso3": "BOL",
    "name": "Bolivia",
    "capital": "Sucre",
    "continent": "Americas",
    "languages": [
      "Aymara",
      "Guaraní",
      "Quechua",
      "Spanish"
    ],
    "theme_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Bolivian boliviano",
    "population": ""
  }),
  country({
    "id": "bosnia-and-herzegovina",
    "iso2": "BA",
    "iso3": "BIH",
    "name": "Bosnia and Herzegovina",
    "capital": "Sarajevo",
    "continent": "Europe",
    "languages": [
      "Bosnian",
      "Croatian",
      "Serbian"
    ],
    "theme_colors": [
      "#C81E1E",
      "#0E3A8A",
      "#F8FAFC"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#C81E1E",
      "#0E3A8A",
      "#F8FAFC"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Bosnia and Herzegovina convertible mark",
    "population": ""
  }),
  country({
    "id": "botswana",
    "iso2": "BW",
    "iso3": "BWA",
    "name": "Botswana",
    "capital": "Gaborone",
    "continent": "Africa",
    "languages": [
      "English",
      "Tswana"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Botswana pula",
    "population": ""
  }),
  country({
    "id": "brunei",
    "iso2": "BN",
    "iso3": "BRN",
    "name": "Brunei",
    "capital": "Bandar Seri Begawan",
    "continent": "Asia",
    "languages": [
      "Malay"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Brunei dollar",
    "population": ""
  }),
  country({
    "id": "bulgaria",
    "iso2": "BG",
    "iso3": "BGR",
    "name": "Bulgaria",
    "capital": "Sofia",
    "continent": "Europe",
    "languages": [
      "Bulgarian"
    ],
    "theme_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "burkina-faso",
    "iso2": "BF",
    "iso3": "BFA",
    "name": "Burkina Faso",
    "capital": "Ouagadougou",
    "continent": "Africa",
    "languages": [
      "French"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "West African CFA franc",
    "population": ""
  }),
  country({
    "id": "burundi",
    "iso2": "BI",
    "iso3": "BDI",
    "name": "Burundi",
    "capital": "Gitega",
    "continent": "Africa",
    "languages": [
      "French",
      "Kirundi"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Burundian franc",
    "population": ""
  }),
  country({
    "id": "cambodia",
    "iso2": "KH",
    "iso3": "KHM",
    "name": "Cambodia",
    "capital": "Phnom Penh",
    "continent": "Asia",
    "languages": [
      "Khmer"
    ],
    "theme_colors": [
      "#7C3AED",
      "#0F766E",
      "#F59E0B"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#7C3AED",
      "#0F766E",
      "#F59E0B"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Cambodian riel",
    "population": ""
  }),
  country({
    "id": "cameroon",
    "iso2": "CM",
    "iso3": "CMR",
    "name": "Cameroon",
    "capital": "Yaoundé",
    "continent": "Africa",
    "languages": [
      "English",
      "French"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Central African CFA franc",
    "population": ""
  }),
  country({
    "id": "cape-verde",
    "iso2": "CV",
    "iso3": "CPV",
    "name": "Cape Verde",
    "capital": "Praia",
    "continent": "Africa",
    "languages": [
      "Portuguese"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Cape Verdean escudo",
    "population": ""
  }),
  country({
    "id": "central-african-republic",
    "iso2": "CF",
    "iso3": "CAF",
    "name": "Central African Republic",
    "capital": "Bangui",
    "continent": "Africa",
    "languages": [
      "French",
      "Sango"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Central African CFA franc",
    "population": ""
  }),
  country({
    "id": "chad",
    "iso2": "TD",
    "iso3": "TCD",
    "name": "Chad",
    "capital": "N'Djamena",
    "continent": "Africa",
    "languages": [
      "Arabic",
      "French"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Central African CFA franc",
    "population": ""
  }),
  country({
    "id": "comoros",
    "iso2": "KM",
    "iso3": "COM",
    "name": "Comoros",
    "capital": "Moroni",
    "continent": "Africa",
    "languages": [
      "Arabic",
      "French",
      "Comorian"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Comorian franc",
    "population": ""
  }),
  country({
    "id": "congo",
    "iso2": "CG",
    "iso3": "COG",
    "name": "Congo",
    "capital": "Brazzaville",
    "continent": "Africa",
    "languages": [
      "French",
      "Kikongo",
      "Lingala"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Central African CFA franc",
    "population": ""
  }),
  country({
    "id": "costa-rica",
    "iso2": "CR",
    "iso3": "CRI",
    "name": "Costa Rica",
    "capital": "San José",
    "continent": "Americas",
    "languages": [
      "Spanish"
    ],
    "theme_colors": [
      "#F97316",
      "#DC2626",
      "#1D4ED8"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F97316",
      "#DC2626",
      "#1D4ED8"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Costa Rican colón",
    "population": ""
  }),
  country({
    "id": "cyprus",
    "iso2": "CY",
    "iso3": "CYP",
    "name": "Cyprus",
    "capital": "Nicosia",
    "continent": "Europe",
    "languages": [
      "Greek",
      "Turkish"
    ],
    "theme_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "djibouti",
    "iso2": "DJ",
    "iso3": "DJI",
    "name": "Djibouti",
    "capital": "Djibouti",
    "continent": "Africa",
    "languages": [
      "Arabic",
      "French"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Djiboutian franc",
    "population": ""
  }),
  country({
    "id": "dominica",
    "iso2": "DM",
    "iso3": "DMA",
    "name": "Dominica",
    "capital": "Roseau",
    "continent": "Americas",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Eastern Caribbean dollar",
    "population": ""
  }),
  country({
    "id": "dominican-republic",
    "iso2": "DO",
    "iso3": "DOM",
    "name": "Dominican Republic",
    "capital": "Santo Domingo",
    "continent": "Americas",
    "languages": [
      "Spanish"
    ],
    "theme_colors": [
      "#F97316",
      "#DC2626",
      "#1D4ED8"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#F97316",
      "#DC2626",
      "#1D4ED8"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Dominican peso",
    "population": ""
  }),
  country({
    "id": "dr-congo",
    "iso2": "CD",
    "iso3": "COD",
    "name": "DR Congo",
    "capital": "Kinshasa",
    "continent": "Africa",
    "languages": [
      "French",
      "Kikongo",
      "Lingala",
      "Tshiluba",
      "Swahili"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Congolese franc",
    "population": ""
  }),
  country({
    "id": "ecuador",
    "iso2": "EC",
    "iso3": "ECU",
    "name": "Ecuador",
    "capital": "Quito",
    "continent": "Americas",
    "languages": [
      "Spanish"
    ],
    "theme_colors": [
      "#F97316",
      "#DC2626",
      "#1D4ED8"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F97316",
      "#DC2626",
      "#1D4ED8"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "United States dollar",
    "population": ""
  }),
  country({
    "id": "el-salvador",
    "iso2": "SV",
    "iso3": "SLV",
    "name": "El Salvador",
    "capital": "San Salvador",
    "continent": "Americas",
    "languages": [
      "Spanish"
    ],
    "theme_colors": [
      "#DC2626",
      "#1D4ED8",
      "#F97316"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#DC2626",
      "#1D4ED8",
      "#F97316"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "United States dollar",
    "population": ""
  }),
  country({
    "id": "equatorial-guinea",
    "iso2": "GQ",
    "iso3": "GNQ",
    "name": "Equatorial Guinea",
    "capital": "Malabo",
    "continent": "Africa",
    "languages": [
      "French",
      "Portuguese",
      "Spanish"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Central African CFA franc",
    "population": ""
  }),
  country({
    "id": "eritrea",
    "iso2": "ER",
    "iso3": "ERI",
    "name": "Eritrea",
    "capital": "Asmara",
    "continent": "Africa",
    "languages": [
      "Arabic",
      "English",
      "Tigrinya"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Eritrean nakfa",
    "population": ""
  }),
  country({
    "id": "estonia",
    "iso2": "EE",
    "iso3": "EST",
    "name": "Estonia",
    "capital": "Tallinn",
    "continent": "Europe",
    "languages": [
      "Estonian"
    ],
    "theme_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "eswatini",
    "iso2": "SZ",
    "iso3": "SWZ",
    "name": "Eswatini",
    "capital": "Lobamba",
    "continent": "Africa",
    "languages": [
      "English",
      "Swazi"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Swazi lilangeni",
    "population": ""
  }),
  country({
    "id": "ethiopia",
    "iso2": "ET",
    "iso3": "ETH",
    "name": "Ethiopia",
    "capital": "Addis Ababa",
    "continent": "Africa",
    "languages": [
      "Amharic"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Ethiopian birr",
    "population": ""
  }),
  country({
    "id": "fiji",
    "iso2": "FJ",
    "iso3": "FJI",
    "name": "Fiji",
    "capital": "Suva",
    "continent": "Oceania",
    "languages": [
      "English",
      "Fijian",
      "Fiji Hindi"
    ],
    "theme_colors": [
      "#F43F5E",
      "#0F766E",
      "#60A5FA"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#F43F5E",
      "#0F766E",
      "#60A5FA"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Fijian dollar",
    "population": ""
  }),
  country({
    "id": "gabon",
    "iso2": "GA",
    "iso3": "GAB",
    "name": "Gabon",
    "capital": "Libreville",
    "continent": "Africa",
    "languages": [
      "French"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Central African CFA franc",
    "population": ""
  }),
  country({
    "id": "gambia",
    "iso2": "GM",
    "iso3": "GMB",
    "name": "Gambia",
    "capital": "Banjul",
    "continent": "Africa",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "dalasi",
    "population": ""
  }),
  country({
    "id": "georgia",
    "iso2": "GE",
    "iso3": "GEO",
    "name": "Georgia",
    "capital": "Tbilisi",
    "continent": "Asia",
    "languages": [
      "Georgian"
    ],
    "theme_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "lari",
    "population": ""
  }),
  country({
    "id": "ghana",
    "iso2": "GH",
    "iso3": "GHA",
    "name": "Ghana",
    "capital": "Accra",
    "continent": "Africa",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Ghanaian cedi",
    "population": ""
  }),
  country({
    "id": "grenada",
    "iso2": "GD",
    "iso3": "GRD",
    "name": "Grenada",
    "capital": "St. George's",
    "continent": "Americas",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Eastern Caribbean dollar",
    "population": ""
  }),
  country({
    "id": "guinea",
    "iso2": "GN",
    "iso3": "GIN",
    "name": "Guinea",
    "capital": "Conakry",
    "continent": "Africa",
    "languages": [
      "French"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Guinean franc",
    "population": ""
  }),
  country({
    "id": "guinea-bissau",
    "iso2": "GW",
    "iso3": "GNB",
    "name": "Guinea-Bissau",
    "capital": "Bissau",
    "continent": "Africa",
    "languages": [
      "Portuguese",
      "Upper Guinea Creole"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "West African CFA franc",
    "population": ""
  }),
  country({
    "id": "guyana",
    "iso2": "GY",
    "iso3": "GUY",
    "name": "Guyana",
    "capital": "Georgetown",
    "continent": "Americas",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#F97316",
      "#DC2626",
      "#1D4ED8"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#F97316",
      "#DC2626",
      "#1D4ED8"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Guyanese dollar",
    "population": ""
  }),
  country({
    "id": "haiti",
    "iso2": "HT",
    "iso3": "HTI",
    "name": "Haiti",
    "capital": "Port-au-Prince",
    "continent": "Americas",
    "languages": [
      "French",
      "Haitian Creole"
    ],
    "theme_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Haitian gourde",
    "population": ""
  }),
  country({
    "id": "honduras",
    "iso2": "HN",
    "iso3": "HND",
    "name": "Honduras",
    "capital": "Tegucigalpa",
    "continent": "Americas",
    "languages": [
      "Spanish"
    ],
    "theme_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Honduran lempira",
    "population": ""
  }),
  country({
    "id": "hungary",
    "iso2": "HU",
    "iso3": "HUN",
    "name": "Hungary",
    "capital": "Budapest",
    "continent": "Europe",
    "languages": [
      "Hungarian"
    ],
    "theme_colors": [
      "#C81E1E",
      "#0E3A8A",
      "#F8FAFC"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#C81E1E",
      "#0E3A8A",
      "#F8FAFC"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Hungarian forint",
    "population": ""
  }),
  country({
    "id": "iran",
    "iso2": "IR",
    "iso3": "IRN",
    "name": "Iran",
    "capital": "Tehran",
    "continent": "Asia",
    "languages": [
      "Persian (Farsi)"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Iranian rial",
    "population": ""
  }),
  country({
    "id": "iraq",
    "iso2": "IQ",
    "iso3": "IRQ",
    "name": "Iraq",
    "capital": "Baghdad",
    "continent": "Asia",
    "languages": [
      "Arabic",
      "Aramaic",
      "Sorani"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Iraqi dinar",
    "population": ""
  }),
  country({
    "id": "israel",
    "iso2": "IL",
    "iso3": "ISR",
    "name": "Israel",
    "capital": "Jerusalem",
    "continent": "Asia",
    "languages": [
      "Arabic",
      "Hebrew"
    ],
    "theme_colors": [
      "#7C3AED",
      "#0F766E",
      "#F59E0B"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#7C3AED",
      "#0F766E",
      "#F59E0B"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Israeli new shekel",
    "population": ""
  }),
  country({
    "id": "ivory-coast",
    "iso2": "CI",
    "iso3": "CIV",
    "name": "Ivory Coast",
    "capital": "Yamoussoukro",
    "continent": "Africa",
    "languages": [
      "French"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "West African CFA franc",
    "population": ""
  }),
  country({
    "id": "jordan",
    "iso2": "JO",
    "iso3": "JOR",
    "name": "Jordan",
    "capital": "Amman",
    "continent": "Asia",
    "languages": [
      "Arabic"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Jordanian dinar",
    "population": ""
  }),
  country({
    "id": "kazakhstan",
    "iso2": "KZ",
    "iso3": "KAZ",
    "name": "Kazakhstan",
    "capital": "Astana",
    "continent": "Asia",
    "languages": [
      "Kazakh",
      "Russian"
    ],
    "theme_colors": [
      "#7C3AED",
      "#0F766E",
      "#F59E0B"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#7C3AED",
      "#0F766E",
      "#F59E0B"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Kazakhstani tenge",
    "population": ""
  }),
  country({
    "id": "kiribati",
    "iso2": "KI",
    "iso3": "KIR",
    "name": "Kiribati",
    "capital": "South Tarawa",
    "continent": "Oceania",
    "languages": [
      "English",
      "Gilbertese"
    ],
    "theme_colors": [
      "#0F766E",
      "#60A5FA",
      "#F43F5E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0F766E",
      "#60A5FA",
      "#F43F5E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Australian dollar",
    "population": ""
  }),
  country({
    "id": "kuwait",
    "iso2": "KW",
    "iso3": "KWT",
    "name": "Kuwait",
    "capital": "Kuwait City",
    "continent": "Asia",
    "languages": [
      "Arabic"
    ],
    "theme_colors": [
      "#7C3AED",
      "#0F766E",
      "#F59E0B"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#7C3AED",
      "#0F766E",
      "#F59E0B"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Kuwaiti dinar",
    "population": ""
  }),
  country({
    "id": "kyrgyzstan",
    "iso2": "KG",
    "iso3": "KGZ",
    "name": "Kyrgyzstan",
    "capital": "Bishkek",
    "continent": "Asia",
    "languages": [
      "Kyrgyz",
      "Russian"
    ],
    "theme_colors": [
      "#7C3AED",
      "#0F766E",
      "#F59E0B"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#7C3AED",
      "#0F766E",
      "#F59E0B"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Kyrgyzstani som",
    "population": ""
  }),
  country({
    "id": "laos",
    "iso2": "LA",
    "iso3": "LAO",
    "name": "Laos",
    "capital": "Vientiane",
    "continent": "Asia",
    "languages": [
      "Lao"
    ],
    "theme_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Lao kip",
    "population": ""
  }),
  country({
    "id": "latvia",
    "iso2": "LV",
    "iso3": "LVA",
    "name": "Latvia",
    "capital": "Riga",
    "continent": "Europe",
    "languages": [
      "Latvian"
    ],
    "theme_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "lebanon",
    "iso2": "LB",
    "iso3": "LBN",
    "name": "Lebanon",
    "capital": "Beirut",
    "continent": "Asia",
    "languages": [
      "Arabic",
      "French"
    ],
    "theme_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Lebanese pound",
    "population": ""
  }),
  country({
    "id": "lesotho",
    "iso2": "LS",
    "iso3": "LSO",
    "name": "Lesotho",
    "capital": "Maseru",
    "continent": "Africa",
    "languages": [
      "English",
      "Sotho"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Lesotho loti",
    "population": ""
  }),
  country({
    "id": "liberia",
    "iso2": "LR",
    "iso3": "LBR",
    "name": "Liberia",
    "capital": "Monrovia",
    "continent": "Africa",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Liberian dollar",
    "population": ""
  }),
  country({
    "id": "libya",
    "iso2": "LY",
    "iso3": "LBY",
    "name": "Libya",
    "capital": "Tripoli",
    "continent": "Africa",
    "languages": [
      "Arabic"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Libyan dinar",
    "population": ""
  }),
  country({
    "id": "liechtenstein",
    "iso2": "LI",
    "iso3": "LIE",
    "name": "Liechtenstein",
    "capital": "Vaduz",
    "continent": "Europe",
    "languages": [
      "German"
    ],
    "theme_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Swiss franc",
    "population": ""
  }),
  country({
    "id": "lithuania",
    "iso2": "LT",
    "iso3": "LTU",
    "name": "Lithuania",
    "capital": "Vilnius",
    "continent": "Europe",
    "languages": [
      "Lithuanian"
    ],
    "theme_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "luxembourg",
    "iso2": "LU",
    "iso3": "LUX",
    "name": "Luxembourg",
    "capital": "Luxembourg",
    "continent": "Europe",
    "languages": [
      "German",
      "French",
      "Luxembourgish"
    ],
    "theme_colors": [
      "#C81E1E",
      "#0E3A8A",
      "#F8FAFC"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#C81E1E",
      "#0E3A8A",
      "#F8FAFC"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "madagascar",
    "iso2": "MG",
    "iso3": "MDG",
    "name": "Madagascar",
    "capital": "Antananarivo",
    "continent": "Africa",
    "languages": [
      "French",
      "Malagasy"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Malagasy ariary",
    "population": ""
  }),
  country({
    "id": "malawi",
    "iso2": "MW",
    "iso3": "MWI",
    "name": "Malawi",
    "capital": "Lilongwe",
    "continent": "Africa",
    "languages": [
      "English",
      "Chewa"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Malawian kwacha",
    "population": ""
  }),
  country({
    "id": "maldives",
    "iso2": "MV",
    "iso3": "MDV",
    "name": "Maldives",
    "capital": "Malé",
    "continent": "Asia",
    "languages": [
      "Maldivian"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Maldivian rufiyaa",
    "population": ""
  }),
  country({
    "id": "mali",
    "iso2": "ML",
    "iso3": "MLI",
    "name": "Mali",
    "capital": "Bamako",
    "continent": "Africa",
    "languages": [
      "French"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "West African CFA franc",
    "population": ""
  }),
  country({
    "id": "malta",
    "iso2": "MT",
    "iso3": "MLT",
    "name": "Malta",
    "capital": "Valletta",
    "continent": "Europe",
    "languages": [
      "English",
      "Maltese"
    ],
    "theme_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "marshall-islands",
    "iso2": "MH",
    "iso3": "MHL",
    "name": "Marshall Islands",
    "capital": "Majuro",
    "continent": "Oceania",
    "languages": [
      "English",
      "Marshallese"
    ],
    "theme_colors": [
      "#F43F5E",
      "#0F766E",
      "#60A5FA"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#F43F5E",
      "#0F766E",
      "#60A5FA"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "United States dollar",
    "population": ""
  }),
  country({
    "id": "mauritania",
    "iso2": "MR",
    "iso3": "MRT",
    "name": "Mauritania",
    "capital": "Nouakchott",
    "continent": "Africa",
    "languages": [
      "Arabic"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Mauritanian ouguiya",
    "population": ""
  }),
  country({
    "id": "mauritius",
    "iso2": "MU",
    "iso3": "MUS",
    "name": "Mauritius",
    "capital": "Port Louis",
    "continent": "Africa",
    "languages": [
      "English",
      "French",
      "Mauritian Creole"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Mauritian rupee",
    "population": ""
  }),
  country({
    "id": "micronesia",
    "iso2": "FM",
    "iso3": "FSM",
    "name": "Micronesia",
    "capital": "Palikir",
    "continent": "Oceania",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#0F766E",
      "#60A5FA",
      "#F43F5E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0F766E",
      "#60A5FA",
      "#F43F5E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "",
    "population": ""
  }),
  country({
    "id": "moldova",
    "iso2": "MD",
    "iso3": "MDA",
    "name": "Moldova",
    "capital": "Chișinău",
    "continent": "Europe",
    "languages": [
      "Moldavian"
    ],
    "theme_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Moldovan leu",
    "population": ""
  }),
  country({
    "id": "monaco",
    "iso2": "MC",
    "iso3": "MCO",
    "name": "Monaco",
    "capital": "Monaco",
    "continent": "Europe",
    "languages": [
      "French"
    ],
    "theme_colors": [
      "#C81E1E",
      "#0E3A8A",
      "#F8FAFC"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#C81E1E",
      "#0E3A8A",
      "#F8FAFC"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "mongolia",
    "iso2": "MN",
    "iso3": "MNG",
    "name": "Mongolia",
    "capital": "Ulan Bator",
    "continent": "Asia",
    "languages": [
      "Mongolian"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Mongolian tögrög",
    "population": ""
  }),
  country({
    "id": "montenegro",
    "iso2": "ME",
    "iso3": "MNE",
    "name": "Montenegro",
    "capital": "Podgorica",
    "continent": "Europe",
    "languages": [
      "Montenegrin"
    ],
    "theme_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "mozambique",
    "iso2": "MZ",
    "iso3": "MOZ",
    "name": "Mozambique",
    "capital": "Maputo",
    "continent": "Africa",
    "languages": [
      "Portuguese"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Mozambican metical",
    "population": ""
  }),
  country({
    "id": "myanmar",
    "iso2": "MM",
    "iso3": "MMR",
    "name": "Myanmar",
    "capital": "Naypyidaw",
    "continent": "Asia",
    "languages": [
      "Burmese"
    ],
    "theme_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Burmese kyat",
    "population": ""
  }),
  country({
    "id": "namibia",
    "iso2": "NA",
    "iso3": "NAM",
    "name": "Namibia",
    "capital": "Windhoek",
    "continent": "Africa",
    "languages": [
      "Afrikaans",
      "German",
      "English",
      "Herero",
      "Khoekhoe",
      "Kwangali",
      "Lozi",
      "Ndonga",
      "Tswana"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Namibian dollar",
    "population": ""
  }),
  country({
    "id": "nauru",
    "iso2": "NR",
    "iso3": "NRU",
    "name": "Nauru",
    "capital": "Yaren",
    "continent": "Oceania",
    "languages": [
      "English",
      "Nauru"
    ],
    "theme_colors": [
      "#60A5FA",
      "#F43F5E",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#60A5FA",
      "#F43F5E",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Australian dollar",
    "population": ""
  }),
  country({
    "id": "nepal",
    "iso2": "NP",
    "iso3": "NPL",
    "name": "Nepal",
    "capital": "Kathmandu",
    "continent": "Asia",
    "languages": [
      "Nepali"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "band-top",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 55
          }
        ]
      },
      {
        "id": "band-mid",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 55,
            "w": 300,
            "h": 90
          }
        ]
      },
      {
        "id": "emblem",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 170,
            "cy": 100,
            "r": 28
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "expert",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Nepalese rupee",
    "population": ""
  }),
  country({
    "id": "nicaragua",
    "iso2": "NI",
    "iso3": "NIC",
    "name": "Nicaragua",
    "capital": "Managua",
    "continent": "Americas",
    "languages": [
      "Spanish"
    ],
    "theme_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Nicaraguan córdoba",
    "population": ""
  }),
  country({
    "id": "niger",
    "iso2": "NE",
    "iso3": "NER",
    "name": "Niger",
    "capital": "Niamey",
    "continent": "Africa",
    "languages": [
      "French"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "West African CFA franc",
    "population": ""
  }),
  country({
    "id": "north-korea",
    "iso2": "KP",
    "iso3": "PRK",
    "name": "North Korea",
    "capital": "Pyongyang",
    "continent": "Asia",
    "languages": [
      "Korean"
    ],
    "theme_colors": [
      "#7C3AED",
      "#0F766E",
      "#F59E0B"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#7C3AED",
      "#0F766E",
      "#F59E0B"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "North Korean won",
    "population": ""
  }),
  country({
    "id": "north-macedonia",
    "iso2": "MK",
    "iso3": "MKD",
    "name": "North Macedonia",
    "capital": "Skopje",
    "continent": "Europe",
    "languages": [
      "Macedonian"
    ],
    "theme_colors": [
      "#C81E1E",
      "#0E3A8A",
      "#F8FAFC"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#C81E1E",
      "#0E3A8A",
      "#F8FAFC"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "denar",
    "population": ""
  }),
  country({
    "id": "oman",
    "iso2": "OM",
    "iso3": "OMN",
    "name": "Oman",
    "capital": "Muscat",
    "continent": "Asia",
    "languages": [
      "Arabic"
    ],
    "theme_colors": [
      "#7C3AED",
      "#0F766E",
      "#F59E0B"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#7C3AED",
      "#0F766E",
      "#F59E0B"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Omani rial",
    "population": ""
  }),
  country({
    "id": "pakistan",
    "iso2": "PK",
    "iso3": "PAK",
    "name": "Pakistan",
    "capital": "Islamabad",
    "continent": "Asia",
    "languages": [
      "English",
      "Urdu"
    ],
    "theme_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Pakistani rupee",
    "population": ""
  }),
  country({
    "id": "palau",
    "iso2": "PW",
    "iso3": "PLW",
    "name": "Palau",
    "capital": "Ngerulmud",
    "continent": "Oceania",
    "languages": [
      "English",
      "Palauan"
    ],
    "theme_colors": [
      "#60A5FA",
      "#F43F5E",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#60A5FA",
      "#F43F5E",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "United States dollar",
    "population": ""
  }),
  country({
    "id": "panama",
    "iso2": "PA",
    "iso3": "PAN",
    "name": "Panama",
    "capital": "Panama City",
    "continent": "Americas",
    "languages": [
      "Spanish"
    ],
    "theme_colors": [
      "#DC2626",
      "#1D4ED8",
      "#F97316"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#DC2626",
      "#1D4ED8",
      "#F97316"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Panamanian balboa",
    "population": ""
  }),
  country({
    "id": "papua-new-guinea",
    "iso2": "PG",
    "iso3": "PNG",
    "name": "Papua New Guinea",
    "capital": "Port Moresby",
    "continent": "Oceania",
    "languages": [
      "English",
      "Hiri Motu",
      "Tok Pisin"
    ],
    "theme_colors": [
      "#60A5FA",
      "#F43F5E",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#60A5FA",
      "#F43F5E",
      "#0F766E"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Papua New Guinean kina",
    "population": ""
  }),
  country({
    "id": "paraguay",
    "iso2": "PY",
    "iso3": "PRY",
    "name": "Paraguay",
    "capital": "Asunción",
    "continent": "Americas",
    "languages": [
      "Guaraní",
      "Spanish"
    ],
    "theme_colors": [
      "#DC2626",
      "#1D4ED8",
      "#F97316"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#DC2626",
      "#1D4ED8",
      "#F97316"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Paraguayan guaraní",
    "population": ""
  }),
  country({
    "id": "qatar",
    "iso2": "QA",
    "iso3": "QAT",
    "name": "Qatar",
    "capital": "Doha",
    "continent": "Asia",
    "languages": [
      "Arabic"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Qatari riyal",
    "population": ""
  }),
  country({
    "id": "russia",
    "iso2": "RU",
    "iso3": "RUS",
    "name": "Russia",
    "capital": "Moscow",
    "continent": "Europe",
    "languages": [
      "Russian"
    ],
    "theme_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Russian ruble",
    "population": ""
  }),
  country({
    "id": "rwanda",
    "iso2": "RW",
    "iso3": "RWA",
    "name": "Rwanda",
    "capital": "Kigali",
    "continent": "Africa",
    "languages": [
      "English",
      "French",
      "Kinyarwanda"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Rwandan franc",
    "population": ""
  }),
  country({
    "id": "saint-kitts-and-nevis",
    "iso2": "KN",
    "iso3": "KNA",
    "name": "Saint Kitts and Nevis",
    "capital": "Basseterre",
    "continent": "Americas",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#DC2626",
      "#1D4ED8",
      "#F97316"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#DC2626",
      "#1D4ED8",
      "#F97316"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Eastern Caribbean dollar",
    "population": ""
  }),
  country({
    "id": "saint-lucia",
    "iso2": "LC",
    "iso3": "LCA",
    "name": "Saint Lucia",
    "capital": "Castries",
    "continent": "Americas",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#F97316",
      "#DC2626",
      "#1D4ED8"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#F97316",
      "#DC2626",
      "#1D4ED8"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Eastern Caribbean dollar",
    "population": ""
  }),
  country({
    "id": "saint-vincent-and-the-grenadines",
    "iso2": "VC",
    "iso3": "VCT",
    "name": "Saint Vincent and the Grenadines",
    "capital": "Kingstown",
    "continent": "Americas",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#F97316",
      "#DC2626",
      "#1D4ED8"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#F97316",
      "#DC2626",
      "#1D4ED8"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Eastern Caribbean dollar",
    "population": ""
  }),
  country({
    "id": "samoa",
    "iso2": "WS",
    "iso3": "WSM",
    "name": "Samoa",
    "capital": "Apia",
    "continent": "Oceania",
    "languages": [
      "English",
      "Samoan"
    ],
    "theme_colors": [
      "#F43F5E",
      "#0F766E",
      "#60A5FA"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#F43F5E",
      "#0F766E",
      "#60A5FA"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Samoan tālā",
    "population": ""
  }),
  country({
    "id": "san-marino",
    "iso2": "SM",
    "iso3": "SMR",
    "name": "San Marino",
    "capital": "City of San Marino",
    "continent": "Europe",
    "languages": [
      "Italian"
    ],
    "theme_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "s-o-tom-and-pr-ncipe",
    "iso2": "ST",
    "iso3": "STP",
    "name": "São Tomé and Príncipe",
    "capital": "São Tomé",
    "continent": "Africa",
    "languages": [
      "Portuguese"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "São Tomé and Príncipe dobra",
    "population": ""
  }),
  country({
    "id": "saudi-arabia",
    "iso2": "SA",
    "iso3": "SAU",
    "name": "Saudi Arabia",
    "capital": "Riyadh",
    "continent": "Asia",
    "languages": [
      "Arabic"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Saudi riyal",
    "population": ""
  }),
  country({
    "id": "senegal",
    "iso2": "SN",
    "iso3": "SEN",
    "name": "Senegal",
    "capital": "Dakar",
    "continent": "Africa",
    "languages": [
      "French"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "West African CFA franc",
    "population": ""
  }),
  country({
    "id": "serbia",
    "iso2": "RS",
    "iso3": "SRB",
    "name": "Serbia",
    "capital": "Belgrade",
    "continent": "Europe",
    "languages": [
      "Serbian"
    ],
    "theme_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0E3A8A",
      "#F8FAFC",
      "#C81E1E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Serbian dinar",
    "population": ""
  }),
  country({
    "id": "seychelles",
    "iso2": "SC",
    "iso3": "SYC",
    "name": "Seychelles",
    "capital": "Victoria",
    "continent": "Africa",
    "languages": [
      "Seychellois Creole",
      "English",
      "French"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Seychellois rupee",
    "population": ""
  }),
  country({
    "id": "sierra-leone",
    "iso2": "SL",
    "iso3": "SLE",
    "name": "Sierra Leone",
    "capital": "Freetown",
    "continent": "Africa",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Sierra Leonean leone",
    "population": ""
  }),
  country({
    "id": "slovakia",
    "iso2": "SK",
    "iso3": "SVK",
    "name": "Slovakia",
    "capital": "Bratislava",
    "continent": "Europe",
    "languages": [
      "Slovak"
    ],
    "theme_colors": [
      "#C81E1E",
      "#0E3A8A",
      "#F8FAFC"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#C81E1E",
      "#0E3A8A",
      "#F8FAFC"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "slovenia",
    "iso2": "SI",
    "iso3": "SVN",
    "name": "Slovenia",
    "capital": "Ljubljana",
    "continent": "Europe",
    "languages": [
      "Slovene"
    ],
    "theme_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "solomon-islands",
    "iso2": "SB",
    "iso3": "SLB",
    "name": "Solomon Islands",
    "capital": "Honiara",
    "continent": "Oceania",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#60A5FA",
      "#F43F5E",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#60A5FA",
      "#F43F5E",
      "#0F766E"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Solomon Islands dollar",
    "population": ""
  }),
  country({
    "id": "somalia",
    "iso2": "SO",
    "iso3": "SOM",
    "name": "Somalia",
    "capital": "Mogadishu",
    "continent": "Africa",
    "languages": [
      "Arabic",
      "Somali"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Somali shilling",
    "population": ""
  }),
  country({
    "id": "south-sudan",
    "iso2": "SS",
    "iso3": "SSD",
    "name": "South Sudan",
    "capital": "Juba",
    "continent": "Africa",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "South Sudanese pound",
    "population": ""
  }),
  country({
    "id": "sri-lanka",
    "iso2": "LK",
    "iso3": "LKA",
    "name": "Sri Lanka",
    "capital": "Colombo",
    "continent": "Asia",
    "languages": [
      "Sinhala",
      "Tamil"
    ],
    "theme_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Sri Lankan rupee",
    "population": ""
  }),
  country({
    "id": "sudan",
    "iso2": "SD",
    "iso3": "SDN",
    "name": "Sudan",
    "capital": "Khartoum",
    "continent": "Africa",
    "languages": [
      "Arabic",
      "English"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Sudanese pound",
    "population": ""
  }),
  country({
    "id": "suriname",
    "iso2": "SR",
    "iso3": "SUR",
    "name": "Suriname",
    "capital": "Paramaribo",
    "continent": "Americas",
    "languages": [
      "Dutch"
    ],
    "theme_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Surinamese dollar",
    "population": ""
  }),
  country({
    "id": "syria",
    "iso2": "SY",
    "iso3": "SYR",
    "name": "Syria",
    "capital": "Damascus",
    "continent": "Asia",
    "languages": [
      "Arabic"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Syrian pound",
    "population": ""
  }),
  country({
    "id": "tajikistan",
    "iso2": "TJ",
    "iso3": "TJK",
    "name": "Tajikistan",
    "capital": "Dushanbe",
    "continent": "Asia",
    "languages": [
      "Russian",
      "Tajik"
    ],
    "theme_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Tajikistani somoni",
    "population": ""
  }),
  country({
    "id": "tanzania",
    "iso2": "TZ",
    "iso3": "TZA",
    "name": "Tanzania",
    "capital": "Dodoma",
    "continent": "Africa",
    "languages": [
      "English",
      "Swahili"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Tanzanian shilling",
    "population": ""
  }),
  country({
    "id": "timor-leste",
    "iso2": "TL",
    "iso3": "TLS",
    "name": "Timor-Leste",
    "capital": "Dili",
    "continent": "Asia",
    "languages": [
      "Portuguese",
      "Tetum"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "United States dollar",
    "population": ""
  }),
  country({
    "id": "togo",
    "iso2": "TG",
    "iso3": "TGO",
    "name": "Togo",
    "capital": "Lomé",
    "continent": "Africa",
    "languages": [
      "French"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "West African CFA franc",
    "population": ""
  }),
  country({
    "id": "tonga",
    "iso2": "TO",
    "iso3": "TON",
    "name": "Tonga",
    "capital": "Nuku'alofa",
    "continent": "Oceania",
    "languages": [
      "English",
      "Tongan"
    ],
    "theme_colors": [
      "#60A5FA",
      "#F43F5E",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#60A5FA",
      "#F43F5E",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Tongan paʻanga",
    "population": ""
  }),
  country({
    "id": "trinidad-and-tobago",
    "iso2": "TT",
    "iso3": "TTO",
    "name": "Trinidad and Tobago",
    "capital": "Port of Spain",
    "continent": "Americas",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#1D4ED8",
      "#F97316",
      "#DC2626"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Trinidad and Tobago dollar",
    "population": ""
  }),
  country({
    "id": "tunisia",
    "iso2": "TN",
    "iso3": "TUN",
    "name": "Tunisia",
    "capital": "Tunis",
    "continent": "Africa",
    "languages": [
      "Arabic"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Tunisian dinar",
    "population": ""
  }),
  country({
    "id": "t-rkiye",
    "iso2": "TR",
    "iso3": "TUR",
    "name": "Türkiye",
    "capital": "Ankara",
    "continent": "Asia",
    "languages": [
      "Turkish"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Turkish lira",
    "population": ""
  }),
  country({
    "id": "turkmenistan",
    "iso2": "TM",
    "iso3": "TKM",
    "name": "Turkmenistan",
    "capital": "Ashgabat",
    "continent": "Asia",
    "languages": [
      "Russian",
      "Turkmen"
    ],
    "theme_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Turkmenistan manat",
    "population": ""
  }),
  country({
    "id": "tuvalu",
    "iso2": "TV",
    "iso3": "TUV",
    "name": "Tuvalu",
    "capital": "Funafuti",
    "continent": "Oceania",
    "languages": [
      "English",
      "Tuvaluan"
    ],
    "theme_colors": [
      "#F43F5E",
      "#0F766E",
      "#60A5FA"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#F43F5E",
      "#0F766E",
      "#60A5FA"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Australian dollar",
    "population": ""
  }),
  country({
    "id": "uganda",
    "iso2": "UG",
    "iso3": "UGA",
    "name": "Uganda",
    "capital": "Kampala",
    "continent": "Africa",
    "languages": [
      "English",
      "Swahili"
    ],
    "theme_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#14532D",
      "#FACC15",
      "#B45309"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Ugandan shilling",
    "population": ""
  }),
  country({
    "id": "united-arab-emirates",
    "iso2": "AE",
    "iso3": "ARE",
    "name": "United Arab Emirates",
    "capital": "Abu Dhabi",
    "continent": "Asia",
    "languages": [
      "Arabic"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "United Arab Emirates dirham",
    "population": ""
  }),
  country({
    "id": "united-kingdom",
    "iso2": "GB",
    "iso3": "GBR",
    "name": "United Kingdom",
    "capital": "London",
    "continent": "Europe",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "British pound",
    "population": ""
  }),
  country({
    "id": "uruguay",
    "iso2": "UY",
    "iso3": "URY",
    "name": "Uruguay",
    "capital": "Montevideo",
    "continent": "Americas",
    "languages": [
      "Spanish"
    ],
    "theme_colors": [
      "#F97316",
      "#DC2626",
      "#1D4ED8"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F97316",
      "#DC2626",
      "#1D4ED8"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Uruguayan peso",
    "population": ""
  }),
  country({
    "id": "uzbekistan",
    "iso2": "UZ",
    "iso3": "UZB",
    "name": "Uzbekistan",
    "capital": "Tashkent",
    "continent": "Asia",
    "languages": [
      "Russian",
      "Uzbek"
    ],
    "theme_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F59E0B",
      "#7C3AED",
      "#0F766E"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Uzbekistani soʻm",
    "population": ""
  }),
  country({
    "id": "vanuatu",
    "iso2": "VU",
    "iso3": "VUT",
    "name": "Vanuatu",
    "capital": "Port Vila",
    "continent": "Oceania",
    "languages": [
      "Bislama",
      "English",
      "French"
    ],
    "theme_colors": [
      "#F43F5E",
      "#0F766E",
      "#60A5FA"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#F43F5E",
      "#0F766E",
      "#60A5FA"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Vanuatu vatu",
    "population": ""
  }),
  country({
    "id": "vatican-city",
    "iso2": "VA",
    "iso3": "VAT",
    "name": "Vatican City",
    "capital": "Vatican City",
    "continent": "Europe",
    "languages": [
      "Italian",
      "Latin"
    ],
    "theme_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#F8FAFC",
      "#C81E1E",
      "#0E3A8A"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Euro",
    "population": ""
  }),
  country({
    "id": "yemen",
    "iso2": "YE",
    "iso3": "YEM",
    "name": "Yemen",
    "capital": "Sana'a",
    "continent": "Asia",
    "languages": [
      "Arabic"
    ],
    "theme_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#0F766E",
      "#F59E0B",
      "#7C3AED"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Yemeni rial",
    "population": ""
  }),
  country({
    "id": "zambia",
    "iso2": "ZM",
    "iso3": "ZMB",
    "name": "Zambia",
    "capital": "Lusaka",
    "continent": "Africa",
    "languages": [
      "English"
    ],
    "theme_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "flag_regions": [
      {
        "id": "left",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "mid",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 100,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      },
      {
        "id": "right",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 200,
            "y": 0,
            "w": 100,
            "h": 200
          }
        ]
      }
    ],
    "flag_colors": [
      "#B45309",
      "#14532D",
      "#FACC15"
    ],
    "difficulty": "easy",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Zambian kwacha",
    "population": ""
  }),
  country({
    "id": "zimbabwe",
    "iso2": "ZW",
    "iso3": "ZWE",
    "name": "Zimbabwe",
    "capital": "Harare",
    "continent": "Africa",
    "languages": [
      "Chibarwe",
      "English",
      "Kalanga",
      "Khoisan",
      "Ndau",
      "Northern Ndebele",
      "Chewa",
      "Shona",
      "Sotho",
      "Tonga",
      "Tswana",
      "Tsonga",
      "Venda",
      "Xhosa",
      "Zimbabwean Sign Language"
    ],
    "theme_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "flag_regions": [
      {
        "id": "field",
        "color": 0,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 200
          }
        ]
      },
      {
        "id": "stripe-a",
        "color": 1,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 0,
            "w": 300,
            "h": 67
          }
        ]
      },
      {
        "id": "stripe-b",
        "color": 2,
        "shapes": [
          {
            "t": "rect",
            "x": 0,
            "y": 67,
            "w": 300,
            "h": 66
          }
        ]
      },
      {
        "id": "mark",
        "color": 1,
        "shapes": [
          {
            "t": "circle",
            "cx": 210,
            "cy": 120,
            "r": 22
          }
        ]
      }
    ],
    "flag_colors": [
      "#FACC15",
      "#B45309",
      "#14532D"
    ],
    "difficulty": "hard",
    "landmark": "",
    "foods": [],
    "animals": [],
    "fun_facts": [],
    "currency": "Botswana pula",
    "population": ""
  }),
];

export const COUNTRY_BY_ID = Object.fromEntries(COUNTRIES.map(country => [country.id, country]));
export const COUNTRY_BY_ISO2 = Object.fromEntries(COUNTRIES.map(country => [country.iso2, country]));

export const COLOR_THE_FLAG_COUNTRIES = COUNTRIES
  .filter(country => country.flag_regions.length > 0 && country.flag_colors.length > 0)
  .map(country => ({
    id: country.id,
    iso2: country.iso2,
    iso3: country.iso3,
    name: country.name,
    palette: country.flag_colors,
    regions: country.flag_regions,
    difficulty: country.difficulty,
  }));

export const COLOR_THE_FLAG_BY_ID = Object.fromEntries(
  COLOR_THE_FLAG_COUNTRIES.map(country => [country.id, country])
);
