#!/bin/bash

curl -X POST http://localhost:3000/api/evaluate_mitigation_prediction \
  -H "Content-Type: application/json" \
  -d '{
  "method": "Kinetic impactor",
  "asteroidData":
  {
      "links": {
          "self": "http://api.nasa.gov/neo/rest/v1/neo/3830865?api_key="
      },
      "id": "3830865",
      "neo_reference_id": "3830865",
      "name": "(2018 SP1)",
      "nasa_jpl_url": "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=3830865",
      "absolute_magnitude_h": 23.1,
      "estimated_diameter": {
          "kilometers": {
              "estimated_diameter_min": 0.063760979,
              "estimated_diameter_max": 0.1425738833
          },
          "meters": {
              "estimated_diameter_min": 63.7609789875,
              "estimated_diameter_max": 142.5738833281
          },
          "miles": {
              "estimated_diameter_min": 0.0396192233,
              "estimated_diameter_max": 0.0885912765
          },
          "feet": {
              "estimated_diameter_min": 209.1895703015,
              "estimated_diameter_max": 467.7620993781
          }
      },
      "is_potentially_hazardous_asteroid": false,
      "close_approach_data": [
          {
              "close_approach_date": "2025-10-05",
              "close_approach_date_full": "2025-Oct-05 17:14",
              "epoch_date_close_approach": 1759684440000,
              "relative_velocity": {
                  "kilometers_per_second": "16.381588731",
                  "kilometers_per_hour": "58973.7194317699",
                  "miles_per_hour": "36643.9758324795"
              },
              "miss_distance": {
                  "astronomical": "0.0337028746",
                  "lunar": "13.1104182194",
                  "kilometers": "5041878.253037102",
                  "miles": "3132877.8729599276"
              },
              "orbiting_body": "Earth"
          }
      ],
      "is_sentry_object": false,
      "nasa_jpl_data": {
          "sat": [],
          "ca_data": [
              {
                  "v_inf": "16.570558136319",
                  "orbit_ref": "15",
                  "cd": "1904-May-30 12:26",
                  "dist": "0.11667911604115",
                  "body": "Venus",
                  "v_rel": "16.5716812506299",
                  "jd": "2416631.018295040",
                  "dist_min": "0.116668968772672",
                  "dist_max": "0.116689263397588",
                  "sigma_t": "1.320240798975",
                  "sigma_tf": "00:01"
              },
              {
                  "sigma_tf": "< 00:01",
                  "sigma_t": "0.53037129867905",
                  "dist_max": "0.0852379622269466",
                  "dist_min": "0.0852349782631845",
                  "v_rel": "13.2894180388935",
                  "jd": "2424321.007200518",
                  "body": "Venus",
                  "dist": "0.0852364702431445",
                  "cd": "1925-Jun-19 12:10",
                  "v_inf": "13.2875008325649",
                  "orbit_ref": "15"
              },
              {
                  "body": "Earth",
                  "orbit_ref": "15",
                  "v_inf": "22.0524432941569",
                  "cd": "1930-Mar-19 04:46",
                  "dist": "0.199163186852043",
                  "dist_max": "0.199164158042276",
                  "sigma_tf": "< 00:01",
                  "sigma_t": "0.557283830714225",
                  "jd": "2426054.698866329",
                  "v_rel": "22.05304994751",
                  "dist_min": "0.199162215663382"
              },
              {
                  "body": "Venus",
                  "v_inf": "13.967434539716",
                  "orbit_ref": "15",
                  "cd": "1937-Jan-10 18:36",
                  "dist": "0.0663180150700171",
                  "dist_max": "0.0663281790526209",
                  "sigma_t": "1.37005827458893",
                  "sigma_tf": "00:01",
                  "v_rel": "13.969778684002",
                  "jd": "2428544.274735639",
                  "dist_min": "0.0663078514835077"
              },
              {
                  "body": "Earth",
                  "cd": "1937-Mar-16 15:14",
                  "dist": "0.152415561588843",
                  "v_inf": "20.7049389497668",
                  "orbit_ref": "15",
                  "dist_max": "0.152419453999741",
                  "sigma_tf": "< 00:01",
                  "sigma_t": "0.934681849133226",
                  "dist_min": "0.152411669180016",
                  "v_rel": "20.7057832564698",
                  "jd": "2428609.134738168"
              },
              {
                  "dist_min": "0.0733452950946373",
                  "v_rel": "18.3112151440541",
                  "jd": "2431161.236084748",
                  "sigma_t": "0.867249012809245",
                  "sigma_tf": "< 00:01",
                  "dist_max": "0.0733505747025585",
                  "dist": "0.0733479348963193",
                  "cd": "1944-Mar-11 17:40",
                  "v_inf": "18.3092311935715",
                  "orbit_ref": "15",
                  "body": "Earth"
              },
              {
                  "body": "Earth",
                  "orbit_ref": "15",
                  "v_inf": "16.987931205313",
                  "cd": "1951-Mar-09 15:23",
                  "dist": "0.0294301758771464",
                  "dist_max": "0.0294305184168976",
                  "sigma_t": "0.615415353311054",
                  "sigma_tf": "< 00:01",
                  "v_rel": "16.9932597780558",
                  "jd": "2433715.141260891",
                  "dist_min": "0.0294298333454186"
              },
              {
                  "cd": "1956-Jan-12 11:11",
                  "dist": "0.0680991950302111",
                  "orbit_ref": "15",
                  "v_inf": "17.5028833413625",
                  "body": "Mars",
                  "dist_min": "0.0680955401349499",
                  "jd": "2435484.966183285",
                  "v_rel": "17.5031235295453",
                  "dist_max": "0.0681028502301542",
                  "sigma_tf": "< 00:01",
                  "sigma_t": "0.386255172130114"
              },
              {
                  "dist_min": "0.0810990258520252",
                  "jd": "2436275.235681464",
                  "v_rel": "18.5232302822034",
                  "dist_max": "0.0811046978636374",
                  "sigma_tf": "< 00:01",
                  "sigma_t": "0.390568420116597",
                  "cd": "1958-Mar-12 17:39",
                  "dist": "0.0811018618550168",
                  "v_inf": "18.5214565600093",
                  "orbit_ref": "15",
                  "body": "Earth"
              },
              {
                  "dist": "0.174390633774719",
                  "cd": "1965-Mar-17 21:18",
                  "v_inf": "21.3109706402685",
                  "orbit_ref": "15",
                  "body": "Earth",
                  "dist_min": "0.174386424012553",
                  "jd": "2438837.387430297",
                  "v_rel": "21.3116875734234",
                  "sigma_tf": "< 00:01",
                  "sigma_t": "0.296984296858727",
                  "dist_max": "0.174394843539632"
              },
              {
                  "body": "Mars",
                  "cd": "1999-Dec-09 15:50",
                  "dist": "0.0789185198414922",
                  "orbit_ref": "15",
                  "v_inf": "15.592621892995",
                  "dist_max": "0.0789193267610362",
                  "sigma_tf": "< 00:01",
                  "sigma_t": "0.137872471770629",
                  "dist_min": "0.0789177129219663",
                  "v_rel": "15.5928545439684",
                  "jd": "2451522.159979456"
              },
              {
                  "v_rel": "17.0058541615359",
                  "jd": "2454155.839065767",
                  "dist_min": "0.126805315151409",
                  "sigma_t": "0.222711463456803",
                  "sigma_tf": "< 00:01",
                  "dist_max": "0.126806699788348",
                  "v_inf": "17.0048471289464",
                  "orbit_ref": "15",
                  "dist": "0.126806007469111",
                  "cd": "2007-Feb-24 08:08",
                  "body": "Venus"
              },
              {
                  "v_inf": "18.8985038488843",
                  "orbit_ref": "15",
                  "dist": "0.102511335008571",
                  "cd": "2011-Sep-30 15:10",
                  "body": "Earth",
                  "v_rel": "18.8998791482473",
                  "jd": "2455835.131702948",
                  "dist_min": "0.102510900506184",
                  "sigma_tf": "< 00:01",
                  "sigma_t": "0.0552517567533229",
                  "dist_max": "0.102511769511145"
              },
              {
                  "dist_min": "0.0390615975913131",
                  "v_rel": "16.7438834904485",
                  "jd": "2458396.497850215",
                  "sigma_t": "0.0433386925596787",
                  "sigma_tf": "< 00:01",
                  "dist_max": "0.0390622626030154",
                  "dist": "0.0390619300971643",
                  "cd": "2018-Oct-04 23:57",
                  "v_inf": "16.7398091688421",
                  "orbit_ref": "15",
                  "body": "Earth"
              },
              {
                  "body": "Venus",
                  "dist": "0.118479329706841",
                  "cd": "2018-Nov-03 09:35",
                  "v_inf": "16.5252119999166",
                  "orbit_ref": "15",
                  "sigma_tf": "< 00:01",
                  "sigma_t": "0.218180490153223",
                  "dist_max": "0.118479605664207",
                  "dist_min": "0.118479053751368",
                  "jd": "2458425.899261197",
                  "v_rel": "16.5263210846924"
              },
              {
                  "body": "Earth",
                  "cd": "2025-Oct-05 17:14",
                  "dist": "0.0337028745711626",
                  "v_inf": "16.3767619968875",
                  "orbit_ref": "15",
                  "dist_max": "0.0337031802715423",
                  "sigma_tf": "< 00:01",
                  "sigma_t": "0.0542489152149798",
                  "dist_min": "0.0337025688707849",
                  "jd": "2460954.217741050",
                  "v_rel": "16.3815887310472"
              },
              {
                  "dist_max": "0.053523642835311",
                  "sigma_t": "0.0872658781677938",
                  "sigma_tf": "< 00:01",
                  "jd": "2463509.101235172",
                  "v_rel": "17.2801144054472",
                  "dist_min": "0.0535227386959208",
                  "body": "Earth",
                  "v_inf": "17.2772332946901",
                  "orbit_ref": "15",
                  "cd": "2032-Oct-03 14:26",
                  "dist": "0.053523190764157"
              },
              {
                  "dist": "0.138769581905224",
                  "cd": "2039-Sep-28 21:42",
                  "v_inf": "19.9862982435643",
                  "orbit_ref": "15",
                  "body": "Earth",
                  "dist_min": "0.138768596457055",
                  "v_rel": "19.9872589158805",
                  "jd": "2466060.404307941",
                  "sigma_tf": "< 00:01",
                  "sigma_t": "0.117008888727524",
                  "dist_max": "0.138770567354789"
              },
              {
                  "jd": "2470348.135663876",
                  "v_rel": "10.7459455401195",
                  "dist_min": "0.0409694194314779",
                  "dist_max": "0.0409717206433163",
                  "sigma_tf": "< 00:01",
                  "sigma_t": "0.563924022641057",
                  "v_inf": "10.7410120756174",
                  "orbit_ref": "15",
                  "cd": "2051-Jun-25 15:15",
                  "dist": "0.0409705700362571",
                  "body": "Venus"
              },
              {
                  "orbit_ref": "15",
                  "v_inf": "15.2566251289148",
                  "cd": "2058-Apr-01 08:56",
                  "dist": "0.0929763593530284",
                  "body": "Mars",
                  "jd": "2472819.872280820",
                  "v_rel": "15.256826952682",
                  "dist_min": "0.0929733419255087",
                  "dist_max": "0.0929793767940833",
                  "sigma_t": "0.269533371312356",
                  "sigma_tf": "< 00:01"
              },
              {
                  "dist": "0.061287660723999",
                  "cd": "2072-Jun-21 12:24",
                  "orbit_ref": "15",
                  "v_inf": "10.4012169188894",
                  "body": "Venus",
                  "dist_min": "0.0612858864357122",
                  "v_rel": "10.404622887536",
                  "jd": "2478015.016574348",
                  "sigma_t": "2.83407441381256",
                  "sigma_tf": "00:03",
                  "dist_max": "0.0612894355712651"
              },
              {
                  "body": "Mars",
                  "orbit_ref": "15",
                  "v_inf": "17.8084352885809",
                  "cd": "2082-Jan-20 18:43",
                  "dist": "0.0886546693152786",
                  "dist_max": "0.0886658246354532",
                  "sigma_tf": "< 00:01",
                  "sigma_t": "0.812706884304538",
                  "v_rel": "17.8086166214801",
                  "jd": "2481515.279712914",
                  "dist_min": "0.0886435149981228"
              },
              {
                  "orbit_ref": "15",
                  "v_inf": "20.8221383207574",
                  "dist": "0.158964729528844",
                  "cd": "2084-Mar-18 07:52",
                  "body": "Earth",
                  "jd": "2482302.827556174",
                  "v_rel": "20.822943287355",
                  "dist_min": "0.15894690840555",
                  "sigma_t": "1.2980812110508",
                  "sigma_tf": "00:01",
                  "dist_max": "0.158982550659855"
              },
              {
                  "orbit_ref": "15",
                  "v_inf": "17.4603404097194",
                  "dist": "0.0459504609807107",
                  "cd": "2091-Mar-12 13:47",
                  "body": "Earth",
                  "jd": "2484853.074158109",
                  "v_rel": "17.4636611008449",
                  "dist_min": "0.0459316020289204",
                  "sigma_t": "1.63986628399387",
                  "sigma_tf": "00:02",
                  "dist_max": "0.0459693200968808"
              },
              {
                  "v_inf": "15.3085176126152",
                  "orbit_ref": "15",
                  "cd": "2098-Mar-09 09:53",
                  "dist": "0.00634869030987913",
                  "body": "Moon",
                  "v_rel": "15.3088548197164",
                  "jd": "2487406.911775774",
                  "dist_min": "0.00634546754516095",
                  "dist_max": "0.00635191555907858",
                  "sigma_tf": "00:01",
                  "sigma_t": "1.07803531288221"
              },
              {
                  "body": "Earth",
                  "dist": "0.00804578832348428",
                  "cd": "2098-Mar-09 12:07",
                  "v_inf": "16.259537295496",
                  "orbit_ref": "15",
                  "sigma_t": "1.00628187392593",
                  "sigma_tf": "00:01",
                  "dist_max": "0.00804990213223039",
                  "dist_min": "0.00804167584473197",
                  "v_rel": "16.2798919539267",
                  "jd": "2487407.004835433"
              },
              {
                  "body": "Venus",
                  "dist": "0.126576423694043",
                  "cd": "2119-Feb-13 14:43",
                  "orbit_ref": "15",
                  "v_inf": "16.9124891490983",
                  "sigma_tf": "00:07",
                  "sigma_t": "6.65682598994846",
                  "dist_max": "0.126639314852996",
                  "dist_min": "0.126513534691321",
                  "v_rel": "16.913503517168",
                  "jd": "2495052.113485505"
              },
              {
                  "dist_min": "0.0800404890339099",
                  "jd": "2497551.634083029",
                  "v_rel": "15.5317319105262",
                  "dist_max": "0.0801346019126016",
                  "sigma_tf": "00:03",
                  "sigma_t": "3.11638542683768",
                  "cd": "2125-Dec-18 03:13",
                  "dist": "0.0800875416483217",
                  "v_inf": "15.5315017533279",
                  "orbit_ref": "15",
                  "body": "Mars"
              },
              {
                  "jd": "2499305.774983326",
                  "v_rel": "16.9228879065294",
                  "dist_min": "0.0463674815143725",
                  "dist_max": "0.0464493230595302",
                  "sigma_t": "5.84080792287344",
                  "sigma_tf": "00:06",
                  "v_inf": "16.9194948976257",
                  "orbit_ref": "15",
                  "cd": "2130-Oct-07 06:36",
                  "dist": "0.0464083811769855",
                  "body": "Earth"
              },
              {
                  "jd": "2499365.439684455",
                  "v_rel": "11.0419585513061",
                  "dist_min": "0.0648606417631938",
                  "dist_max": "0.0649005618441657",
                  "sigma_tf": "00:17",
                  "sigma_t": "16.7827293778422",
                  "v_inf": "11.0389269805632",
                  "orbit_ref": "15",
                  "cd": "2130-Dec-05 22:33",
                  "dist": "0.0648805836164176",
                  "body": "Venus"
              },
              {
                  "body": "Mars",
                  "dist": "0.0742825148044639",
                  "cd": "2135-May-09 11:52",
                  "orbit_ref": "15",
                  "v_inf": "17.8678935395604",
                  "sigma_t": "4.01298439510666",
                  "sigma_tf": "00:04",
                  "dist_max": "0.0743364176675405",
                  "dist_min": "0.074228624702893",
                  "v_rel": "17.8681092363182",
                  "jd": "2500980.994715200"
              },
              {
                  "body": "Earth",
                  "dist": "0.17258536986981",
                  "cd": "2137-Oct-29 20:17",
                  "v_inf": "11.6144830734414",
                  "orbit_ref": "15",
                  "sigma_tf": "00:22",
                  "sigma_t": "21.5630165058516",
                  "dist_max": "0.172645778015755",
                  "dist_min": "0.172524962250053",
                  "v_rel": "11.61581225297",
                  "jd": "2501885.345057061"
              },
              {
                  "jd": "2508759.330685159",
                  "v_rel": "16.7631992258866",
                  "dist_min": "0.127043441050519",
                  "dist_max": "0.127229242787232",
                  "sigma_tf": "00:10",
                  "sigma_t": "9.81613425185498",
                  "v_inf": "16.762180269641",
                  "orbit_ref": "15",
                  "cd": "2156-Aug-24 19:56",
                  "dist": "0.127136339480463",
                  "body": "Venus"
              },
              {
                  "dist_min": "0.103734276617189",
                  "jd": "2509677.164332277",
                  "v_rel": "12.961953746243",
                  "sigma_t": "13.7698576629281",
                  "sigma_tf": "00:14",
                  "dist_max": "0.103891656885186",
                  "dist": "0.103812966467168",
                  "cd": "2159-Feb-28 15:57",
                  "orbit_ref": "15",
                  "v_inf": "12.9599734805473",
                  "body": "Earth"
              },
              {
                  "orbit_ref": "15",
                  "v_inf": "18.8405111709969",
                  "cd": "2166-Mar-16 13:28",
                  "dist": "0.097296968017903",
                  "body": "Earth",
                  "jd": "2512250.061190967",
                  "v_rel": "18.8419646327785",
                  "dist_min": "0.0972542051526373",
                  "dist_max": "0.0973397310383876",
                  "sigma_t": "3.17134107703046",
                  "sigma_tf": "00:03"
              },
              {
                  "body": "Venus",
                  "orbit_ref": "15",
                  "v_inf": "10.2757719655111",
                  "dist": "0.061222536851274",
                  "cd": "2168-Jun-12 02:48",
                  "sigma_t": "6.60038936159251",
                  "sigma_tf": "00:07",
                  "dist_max": "0.0612264970627399",
                  "v_rel": "10.2792231664166",
                  "jd": "2513068.616776301",
                  "dist_min": "0.0612185801682938"
              },
              {
                  "body": "Earth",
                  "cd": "2191-Oct-06 04:32",
                  "dist": "0.0787551032836057",
                  "orbit_ref": "15",
                  "v_inf": "18.0081600820266",
                  "dist_max": "0.0788617553046846",
                  "sigma_tf": "00:11",
                  "sigma_t": "10.7225145475623",
                  "dist_min": "0.0786484905729994",
                  "jd": "2521584.689070799",
                  "v_rel": "18.0100387137699"
              },
              {
                  "body": "Venus",
                  "dist": "0.0544785036630928",
                  "cd": "2194-Mar-13 18:03",
                  "orbit_ref": "15",
                  "v_inf": "12.2255788262917",
                  "sigma_tf": "00:23",
                  "sigma_t": "22.6023320750027",
                  "dist_max": "0.0545522803452641",
                  "dist_min": "0.0544048634000808",
                  "jd": "2522474.252266877",
                  "v_rel": "12.2288388176271"
              },
              {
                  "v_inf": "12.3751319233146",
                  "orbit_ref": "15",
                  "cd": "2198-Oct-22 21:57",
                  "dist": "0.128853836269061",
                  "body": "Earth",
                  "v_rel": "12.3768027671053",
                  "jd": "2524158.414691654",
                  "dist_min": "0.128745573663608",
                  "dist_max": "0.128962105430235",
                  "sigma_t": "23.9015755451482",
                  "sigma_tf": "00:24"
              }
          ],
          "orbit_defs": {
              "jupobl": {
                  "description": "Jupiter oblatness model used in orbit determination (T/F)",
                  "units": null,
                  "title": null
              },
              "src": {
                  "description": "upper triangular square-root covariance matrix",
                  "title": null,
                  "units": null
              },
              "w": {
                  "description": "argument of perihelion",
                  "units": "deg",
                  "title": "peri"
              },
              "n_sat_obs_used": {
                  "description": "number of satellite observations used in fit",
                  "title": "# sat. obs. used",
                  "units": null
              },
              "epoch": {
                  "title": "epoch",
                  "units": "TDB",
                  "description": "epoch of osculation"
              },
              "comment": {
                  "description": "comment related to the orbit determination",
                  "units": null,
                  "title": null
              },
              "pha": {
                  "title": "PHA",
                  "units": null,
                  "description": "Potentially Hazardous Asteroid (moid<0.05 au, H<=22.0)"
              },
              "last_obs": {
                  "units": "UT",
                  "title": "last obs. used",
                  "description": "date of last observation used in the fit"
              },
              "eobl_lim": {
                  "description": "Range-to-Earth limit in au to turn on Earth oblateness",
                  "title": "Earth oblateness limit",
                  "units": "au"
              },
              "e": {
                  "description": "eccentricity",
                  "units": null,
                  "title": "e"
              },
              "two_body": {
                  "units": null,
                  "title": "two-body model",
                  "description": "2-body dynamics used in orbit determination (T/F)"
              },
              "rms_u": {
                  "units": "arcsec",
                  "title": null,
                  "description": "un-weighted RMS of the orbit determination residuals"
              },
              "ad": {
                  "units": "au",
                  "title": "Q",
                  "description": "aphelion distance"
              },
              "n_del_obs": {
                  "description": "number of radar delay observations available",
                  "units": null,
                  "title": "# delay obs. avail."
              },
              "n_dop_obs": {
                  "description": "number of radar Doppler observations available",
                  "units": null,
                  "title": "# Doppler obs. avail."
              },
              "jgsep": {
                  "units": null,
                  "title": null,
                  "description": "separate Galilean satellites from Jupiter model used in orbit determination (T/F)"
              },
              "rms": {
                  "description": "total normalized root-mean-square (RMS) residuals of the orbit fit",
                  "units": null,
                  "title": "norm. resid. RMS"
              },
              "neo": {
                  "title": "NEO",
                  "units": null,
                  "description": "Near-Earth Object (NEO)"
              },
              "soln_date": {
                  "title": "solution date",
                  "units": "local",
                  "description": "when orbit solution was computed (Pacific time)"
              },
              "om": {
                  "units": "deg",
                  "title": "node",
                  "description": "longitude of the ascending node"
              },
              "cov_kind": {
                  "title": null,
                  "units": null,
                  "description": "form of covariance (SRC, COV, etc.)"
              },
              "source": {
                  "description": "source of computed orbit parameters (e.g., JPL, MPC, SAO)",
                  "title": "source",
                  "units": null
              },
              "relativity": {
                  "description": "Relativity included in propagation (T/F)",
                  "title": "relativity",
                  "units": null
              },
              "t_jup": {
                  "title": "T_jup",
                  "units": null,
                  "description": "Jupiter Tisserand invariant"
              },
              "producer": {
                  "description": "name of person (or institution) who computed the orbit",
                  "units": null,
                  "title": "producer"
              },
              "q": {
                  "description": "perihelion distance",
                  "title": "q",
                  "units": "au"
              },
              "pe_used": {
                  "description": "JPL planetary ephemeris used in the orbit determination",
                  "title": "planetary ephem.",
                  "units": null
              },
              "n_obs_used": {
                  "description": "number of observations (all types) used in fit",
                  "title": "# obs. used (total)",
                  "units": null
              },
              "ma": {
                  "title": "M",
                  "units": "deg",
                  "description": "mean anomaly"
              },
              "n_opt_obs": {
                  "description": "number of optical observations available",
                  "units": null,
                  "title": "# optical obs. avail."
              },
              "n_opp": {
                  "description": "number of oppositions the object has been observed",
                  "title": "# oppositions",
                  "units": null
              },
              "first_obs": {
                  "description": "date of first observation used in the fit",
                  "title": "first obs. used",
                  "units": "UT"
              },
              "not_valid_before": {
                  "description": "date before which the orbit should not be used (e.g. date a new fragment formed)",
                  "title": null,
                  "units": "UT"
              },
              "h_value": {
                  "title": null,
                  "units": null,
                  "description": "absolute magnitude H (estimated by autocmod)"
              },
              "condition_code": {
                  "units": null,
                  "title": "condition code",
                  "description": "MPC \"U\" parameter: orbit uncertainty estimate 0-9, with 0 being good, and 9 being highly uncertain"
              },
              "perturbers": {
                  "units": null,
                  "title": "small-body ephem.",
                  "description": "compact list of perturbing bodies used"
              },
              "eihrel": {
                  "units": null,
                  "title": "EIH relativity",
                  "description": "EIH relativity formulation. F is EIH formulation is not used, T for full formulation, or list of bodies included"
              },
              "cov": {
                  "title": null,
                  "units": null,
                  "description": "upper triangular covariance matrix"
              },
              "moid_jup": {
                  "description": "minium distance from the orbit of Jupiter-barycenter",
                  "title": "Jupiter MOID",
                  "units": "au"
              },
              "eobl_mod": {
                  "description": "Earth spherical harmonics model, 2X0 is J2-only, 3X0 is J2 and J3, 4X0 is J2, J3, and J4, 4X4 is full 4x4",
                  "units": null,
                  "title": "Earth oblateness model"
              },
              "rms_w": {
                  "title": null,
                  "units": null,
                  "description": "weighted RMS of the orbit determination residuals (not normalized)"
              },
              "a": {
                  "title": "a",
                  "units": "au",
                  "description": "semi-major axis"
              },
              "moid": {
                  "description": "Earth MOID (Minimum Orbit Intersection Distance)",
                  "title": "Earth MOID",
                  "units": "au"
              },
              "not_valid_after": {
                  "units": "UT",
                  "title": null,
                  "description": "date after which the orbit should not be used (e.g. impact date for SL9)"
              },
              "cmod_version": {
                  "description": "CMOD version string",
                  "title": null,
                  "units": null
              },
              "n_opt_obs_used": {
                  "units": null,
                  "title": "# optical obs. used",
                  "description": "number of optical observations used in fit"
              },
              "constraint_vec": {
                  "units": null,
                  "title": null,
                  "description": "orbit determination constraint vector"
              },
              "sb_used": {
                  "title": "SB-pert. ephem.",
                  "units": null,
                  "description": "JPL small-body perturber ephemeris used in the orbit determination"
              },
              "per": {
                  "description": "sidereal orbital period",
                  "units": "d",
                  "title": "period"
              },
              "i": {
                  "description": "inclination; angle with respect to x-y ecliptic plane",
                  "units": "deg",
                  "title": "i"
              },
              "n_sat_obs": {
                  "description": "number of satellite observations available",
                  "units": null,
                  "title": "# sat. obs. avail."
              },
              "n": {
                  "title": "n",
                  "units": "deg/d",
                  "description": "mean motion"
              },
              "sobl_lim": {
                  "units": "au",
                  "title": "Earth oblateness limit",
                  "description": "Range-to-Sun limit in au to turn on Sun oblateness"
              },
              "jupj4": {
                  "title": null,
                  "units": null,
                  "description": "Jupiter J4 used in orbit determination (T/F)"
              },
              "data_arc": {
                  "units": "d",
                  "title": "data-arc span",
                  "description": "number of days spanned by the data-arc"
              },
              "h_sigma": {
                  "description": "formal 1-sigma for H (RMS of weighted residuals)",
                  "title": null,
                  "units": null
              },
              "emsep": {
                  "title": null,
                  "units": null,
                  "description": "Earth and Moon modeled separately in the orbit determination (T/F)"
              },
              "n_dop_obs_used": {
                  "title": "# Doppler obs. used",
                  "units": null,
                  "description": "number of radar Doppler observations used in fit"
              },
              "n_del_obs_used": {
                  "description": "number of radar delay observations used in fit",
                  "units": null,
                  "title": "# delay obs. used"
              },
              "tp": {
                  "description": "time of perihelion passage",
                  "title": "tp",
                  "units": "TDB"
              }
          },
          "vi_data": [],
          "phys_par": [
              {
                  "notes": "autocmod 2.6n",
                  "value": "23.1",
                  "units": null,
                  "title": "absolute magnitude",
                  "sigma": ".58593",
                  "name": "H",
                  "desc": "absolute magnitude (magnitude at 1 au from Sun and observer)",
                  "ref": "E2018T36"
              }
          ],
          "object": {
              "neo": true,
              "spkid": "3830865",
              "ov_par": "ma:359.2933931432568,e:.5965002367189352,ad:2.806865072244813,per:851.4854877006155,label:(2018 SP1),tp:2461002.171293011185,om:164.5628111516559,i:3.698365118852378,w:286.1977215452363,epoch:2461000.5,n:.4227905292574721,a:1.758136333266929,q:.7094075942890452",
              "des_alt": [],
              "orbit_id": "15",
              "fullname": "(2018 SP1)",
              "prefix": null,
              "orbit_class": {
                  "name": "Apollo",
                  "code": "APO"
              },
              "pha": false,
              "des": "2018 SP1",
              "kind": "au"
          },
          "discovery": {},
          "orbit": {
              "rms": ".49753",
              "equinox": "J2000",
              "sb_used": "SB441-N16",
              "orbit_id": "15",
              "not_valid_after": null,
              "two_body": null,
              "elements": [
                  {
                      "sigma": "3.606E-7",
                      "label": "e",
                      "name": "e",
                      "title": "eccentricity",
                      "value": ".5965002367189352",
                      "units": null
                  },
                  {
                      "title": "semi-major axis",
                      "value": "1.758136333266929",
                      "units": "au",
                      "sigma": "5.1182E-9",
                      "label": "a",
                      "name": "a"
                  },
                  {
                      "units": "au",
                      "title": "perihelion distance",
                      "value": ".7094075942890452",
                      "label": "q",
                      "name": "q",
                      "sigma": "6.3438E-7"
                  },
                  {
                      "sigma": "1.9566E-5",
                      "name": "i",
                      "label": "i",
                      "title": "inclination; angle with respect to x-y ecliptic plane",
                      "units": "deg",
                      "value": "3.698365118852378"
                  },
                  {
                      "label": "node",
                      "name": "om",
                      "sigma": "8.989E-5",
                      "units": "deg",
                      "title": "longitude of the ascending node",
                      "value": "164.5628111516559"
                  },
                  {
                      "title": "argument of perihelion",
                      "units": "deg",
                      "value": "286.1977215452363",
                      "sigma": ".00013183",
                      "label": "peri",
                      "name": "w"
                  },
                  {
                      "title": "mean anomaly",
                      "units": "deg",
                      "value": "359.2933931432568",
                      "sigma": "4.2864E-6",
                      "name": "ma",
                      "label": "M"
                  },
                  {
                      "sigma": "1.0143E-5",
                      "name": "tp",
                      "label": "tp",
                      "units": "TDB",
                      "title": "time of perihelion passage",
                      "value": "2461002.171293011185"
                  },
                  {
                      "label": "tp",
                      "sigma": null,
                      "name": "tp_cd",
                      "units": "TDB",
                      "value": "2025-Nov-22.67129301",
                      "title": "time of perihelion passage"
                  },
                  {
                      "name": "per",
                      "label": "period",
                      "sigma": "3.7182E-6",
                      "units": "d",
                      "title": "sidereal orbital period",
                      "value": "851.4854877006155"
                  },
                  {
                      "name": "n",
                      "label": "n",
                      "sigma": "1.8462E-9",
                      "title": "mean motion",
                      "units": "deg/d",
                      "value": ".4227905292574721"
                  },
                  {
                      "title": "aphelion distance",
                      "value": "2.806865072244813",
                      "units": "au",
                      "name": "ad",
                      "label": "Q",
                      "sigma": "8.1712E-9"
                  }
              ],
              "moid": ".00291919",
              "cov_epoch": "2460136.5",
              "last_obs": "2025-10-01",
              "comment": null,
              "moid_jup": "2.44923",
              "epoch": "2461000.5",
              "condition_code": "0",
              "n_del_obs_used": null,
              "epoch_cd": "2025-Nov-21.0",
              "n_dop_obs_used": null,
              "not_valid_before": null,
              "first_obs": "2018-09-12",
              "data_arc": "2576",
              "n_obs_used": 111,
              "pe_used": "DE441",
              "model_pars": [],
              "producer": "Otto Matic",
              "t_jup": "3.891",
              "source": "JPL",
              "soln_date": "2025-10-02 06:59:27"
          },
          "radar_obs": [],
          "signature": {
              "version": "1.3",
              "source": "NASA/JPL Small-Body Database (SBDB) API"
          },
          "alt_orbits": [],
          "neo_reference_id": "3830865"
      }
  }
 }'
