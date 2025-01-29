import React, { useEffect, useState } from 'react';

// Add the districts data at the top of the file
const districtsData = {
  "districts": {
    "Nyarugenge": {
      "sectors": [
        ["Gitega", -1.9547, 30.0574],
        ["Kanyinya", -1.9425, 30.0234],
        ["Kigali", -1.9494, 30.0588],
        ["Kimisagara", -1.9569, 30.0397],
        ["Mageragere", -1.9872, 30.0089],
        ["Muhima", -1.9436, 30.0614],
        ["Nyakabanda", -1.9647, 30.0397],
        ["Nyamirambo", -1.975, 30.0397],
        ["Nyarugenge", -1.9508, 30.0556],
        ["Rwezamenyo", -1.9494, 30.0556]
      ]
    },
    "Gasabo": {
      "sectors": [
        ["Bumbogo", -1.8897, 30.1147],
        ["Gatsata", -1.9178, 30.0672],
        ["Gikomero", -1.8794, 30.1969],
        ["Gisozi", -1.9289, 30.0839],
        ["Jabana", -1.8961, 30.0506],
        ["Jali", -1.8897, 30.1672],
        ["Kacyiru", -1.9447, 30.0922],
        ["Kimihurura", -1.9536, 30.0922],
        ["Kimironko", -1.9494, 30.1191],
        ["Kinyinya", -1.9178, 30.1017],
        ["Ndera", -1.9178, 30.1672],
        ["Nduba", -1.8794, 30.1372],
        ["Remera", -1.9557, 30.1097],
        ["Rusororo", -1.9289, 30.1447],
        ["Rutunga", -1.8897, 30.1447]
      ]
    },
    "Kicukiro": {
      "sectors": [
        ["Gahanga", -2.0247, 30.1017],
        ["Gatenga", -1.9872, 30.0922],
        ["Gikondo", -1.975, 30.0756],
        ["Kagarama", -1.9935, 30.0922],
        ["Kanombe", -1.975, 30.1286],
        ["Kigarama", -2.0006, 30.1156],
        ["Masaka", -2.0247, 30.1447],
        ["Niboye", -1.9872, 30.1097],
        ["Nyarugunga", -1.9935, 30.1286],
        ["Kicukiro", -1.97, 30.1]
      ]
    },
    "Bugesera": {
      "sectors": [
        ["Gashora", -2.1733, 30.25],
        ["Juru", -2.1347, 30.2225],
        ["Kamabuye", -2.1153, 30.25],
        ["Mareba", -2.1347, 30.2775],
        ["Mayange", -2.1541, 30.2225],
        ["Musenyi", -2.1153, 30.2775],
        ["Mwogo", -2.1733, 30.2225],
        ["Ngeruka", -2.1541, 30.2775],
        ["Ntarama", -2.1153, 30.2225],
        ["Nyamata", -2.1347, 30.25],
        ["Nyarugenge", -2.1541, 30.25],
        ["Rilima", -2.1733, 30.2775],
        ["Ruhuha", -2.1733, 30.25],
        ["Sake", -2.1347, 30.2225],
        ["Shyara", -2.1153, 30.25]
      ]
    },
    "Gatsibo": {
      "sectors": [
        ["Gasange", -1.7117, 30.45],
        ["Gatsibo", -1.7117, 30.4775],
        ["Gitoki", -1.6925, 30.45],
        ["Kabarore", -1.6925, 30.4775],
        ["Kageyo", -1.6731, 30.45],
        ["Kiramuruzi", -1.6731, 30.4775],
        ["Kiziguro", -1.7117, 30.505],
        ["Muhura", -1.6925, 30.505],
        ["Murambi", -1.6731, 30.505],
        ["Ngarama", -1.7311, 30.45],
        ["Nyagihanga", -1.7311, 30.4775],
        ["Remera", -1.7311, 30.505],
        ["Rugarama", -1.7506, 30.45],
        ["Rwimbogo", -1.7506, 30.4775]
      ]
    },
    "Kayonza": {
      "sectors": [
        ["Gahini", -1.8561, 30.4775],
        ["Kabare", -1.8561, 30.505],
        ["Kabarondo", -1.8367, 30.4775],
        ["Mukarange", -1.8367, 30.505],
        ["Murama", -1.8172, 30.4775],
        ["Murundi", -1.8172, 30.505],
        ["Mwiri", -1.8561, 30.5325],
        ["Ndego", -1.8367, 30.5325],
        ["Nyamirama", -1.8172, 30.5325],
        ["Rukara", -1.8756, 30.4775],
        ["Ruramira", -1.8756, 30.505],
        ["Rwinkwavu", -1.8756, 30.5325]
      ]
    },
    "Kirehe": {
      "sectors": [
        ["Gahara", -2.2506, 30.65],
        ["Gatore", -2.2506, 30.6775],
        ["Kigarama", -2.2311, 30.65],
        ["Kigina", -2.2311, 30.6775],
        ["Kirehe", -2.2117, 30.65],
        ["Mahama", -2.2117, 30.6775],
        ["Mpanga", -2.2506, 30.705],
        ["Musaza", -2.2311, 30.705],
        ["Mushikiri", -2.2117, 30.705],
        ["Nasho", -2.27, 30.65],
        ["Nyamugali", -2.27, 30.6775],
        ["Nyarubuye", -2.27, 30.705]
      ]
    },
    "Ngoma": {
      "sectors": [
        ["Gashanda", -2.1733, 30.45],
        ["Jarama", -2.1733, 30.4775],
        ["Karembo", -2.1539, 30.45],
        ["Kazo", -2.1539, 30.4775],
        ["Kibungo", -2.1344, 30.45],
        ["Mugesera", -2.1344, 30.4775],
        ["Murama", -2.1733, 30.505],
        ["Mutenderi", -2.1539, 30.505],
        ["Remera", -2.1344, 30.505],
        ["Rukira", -2.1928, 30.45],
        ["Rukumberi", -2.1928, 30.4775],
        ["Rurenge", -2.1928, 30.505],
        ["Sake", -2.2122, 30.45],
        ["Zaza", -2.2122, 30.4775]
      ]
    },
    "Nyagatare": {
      "sectors": [
        ["Gatunda", -1.4478, 30.45],
        ["Karama", -1.4478, 30.4775],
        ["Katabagemu", -1.4283, 30.45],
        ["Karangazi", -1.4283, 30.4775],
        ["Kiyombe", -1.4089, 30.45],
        ["Matimba", -1.4089, 30.4775],
        ["Mimuri", -1.4478, 30.505],
        ["Mukama", -1.4283, 30.505],
        ["Musheri", -1.4089, 30.505],
        ["Nyagatare", -1.4672, 30.45],
        ["Rukomo", -1.4672, 30.4775],
        ["Rwempasha", -1.4672, 30.505],
        ["Rwimiyaga", -1.4867, 30.45],
        ["Tabagwe", -1.4867, 30.4775]
      ]
    },
    "Rwamagana": {
      "sectors": [
        ["Fumbwe", -1.9506, 30.35],
        ["Gahengeri", -1.9506, 30.3775],
        ["Gishali", -1.9311, 30.35],
        ["Karenge", -1.9311, 30.3775],
        ["Kigabiro", -1.9117, 30.35],
        ["Muhazi", -1.9117, 30.3775],
        ["Munyaga", -1.9506, 30.405],
        ["Munyiginya", -1.9311, 30.405],
        ["Mwulire", -1.9117, 30.405],
        ["Nyakariro", -1.97, 30.35],
        ["Nzige", -1.97, 30.3775],
        ["Rubona", -1.97, 30.405],
        ["Rukara", -1.9894, 30.35],
        ["Rweru", -1.9894, 30.3775]
      ]
    },
    "Burera": {
      "sectors": [
        ["Bungwe", -1.4478, 29.85],
        ["Butaro", -1.4478, 29.8775],
        ["Cyanika", -1.4283, 29.85],
        ["Cyeru", -1.4283, 29.8775],
        ["Gahunga", -1.4089, 29.85],
        ["Gatebe", -1.4089, 29.8775],
        ["Gitovu", -1.4478, 29.905],
        ["Kagogo", -1.4283, 29.905],
        ["Kinoni", -1.4089, 29.905],
        ["Kinyababa", -1.4672, 29.85],
        ["Kivuye", -1.4672, 29.8775],
        ["Nemba", -1.4672, 29.905],
        ["Rugarama", -1.4867, 29.85],
        ["Rugendabari", -1.4867, 29.8775],
        ["Ruhunde", -1.4867, 29.905],
        ["Rusarabuye", -1.5061, 29.85],
        ["Rwerere", -1.5061, 29.8775]
      ]
    },
    "Gakenke": {
      "sectors": [
        ["Coko", -1.7117, 29.85],
        ["Cyabingo", -1.7117, 29.8775],
        ["Gakenke", -1.6925, 29.85],
        ["Gashenyi", -1.6925, 29.8775],
        ["Janja", -1.6731, 29.85],
        ["Kamubuga", -1.6731, 29.8775],
        ["Karambo", -1.7117, 29.905],
        ["Kivuruga", -1.6925, 29.905],
        ["Mataba", -1.6731, 29.905],
        ["Minazi", -1.7311, 29.85],
        ["Mugunga", -1.7311, 29.8775],
        ["Muhondo", -1.6925, 29.8925],
        ["Muyongwe", -1.7506, 29.85],
        ["Muzo", -1.7506, 29.8775],
        ["Nemba", -1.7506, 29.905],
        ["Ruli", -1.77, 29.85],
        ["Rusasa", -1.77, 29.8775],
        ["Rushashi", -1.77, 29.905]
      ]
    },
    "Gicumbi": {
      "sectors": [
        ["Bukure", -1.5583, 30.1],
        ["Bwisige", -1.5583, 30.1275],
        ["Byumba", -1.5389, 30.1],
        ["Cyumba", -1.5389, 30.1275],
        ["Giti", -1.5194, 30.1],
        ["Kaniga", -1.5194, 30.1275],
        ["Manyagiro", -1.5583, 30.155],
        ["Miyove", -1.5389, 30.155],
        ["Mugambi", -1.5194, 30.155],
        ["Mukarange", -1.5778, 30.1],
        ["Muko", -1.5778, 30.1275],
        ["Mutete", -1.5778, 30.155],
        ["Nyamiyaga", -1.5972, 30.1],
        ["Nyankenke", -1.5972, 30.1275],
        ["Rubaya", -1.5972, 30.155],
        ["Rukomo", -1.6167, 30.1],
        ["Rushaki", -1.6167, 30.1275],
        ["Rutare", -1.6167, 30.155],
        ["Ruvune", -1.6361, 30.1],
        ["Rwamiko", -1.6361, 30.1275],
        ["Shangasha", -1.6361, 30.155]
      ]
    },
    "Musanze": {
      "sectors": [
        ["Busogo", -1.5583, 29.5561],
        ["Cyuve", -1.5389, 29.5561],
        ["Gacaca", -1.5583, 29.5836],
        ["Gashaki", -1.5389, 29.5836],
        ["Gataraga", -1.5194, 29.5561],
        ["Kimonyi", -1.5194, 29.5836],
        ["Kinigi", -1.5583, 29.6111],
        ["Muhoza", -1.5389, 29.6111],
        ["Muko", -1.5194, 29.6111],
        ["Musanze", -1.5778, 29.5561],
        ["Nkotsi", -1.5778, 29.5836],
        ["Nyange", -1.5778, 29.6111],
        ["Remera", -1.5972, 29.5561],
        ["Rwaza", -1.5972, 29.5836],
        ["Shingiro", -1.5972, 29.6111]
      ]
    },
    "Rulindo": {
      "sectors": [
        ["Base", -1.7311, 29.9931],
        ["Burega", -1.7311, 30.0206],
        ["Bushoki", -1.7117, 29.9931],
        ["Buyoga", -1.7117, 30.0206],
        ["Cyinzuzi", -1.6925, 29.9931],
        ["Cyungo", -1.6925, 30.0206],
        ["Kinihira", -1.7311, 30.0481],
        ["Kisaro", -1.7117, 30.0481],
        ["Kigabiro", -1.78, 30.05],
        ["Masoro", -1.6925, 30.0481],
        ["Mbogo", -1.7506, 29.9931],
        ["Murambi", -1.7506, 30.0206],
        ["Ngoma", -1.7506, 30.0481],
        ["Ntarabana", -1.77, 29.9931],
        ["Rukozo", -1.77, 30.0206],
        ["Rusiga", -1.77, 30.0481],
        ["Shyorongi", -1.7894, 29.9931],
        ["Tumba", -1.7894, 30.0206]
      ]
    },
    "Huye": {
      "sectors": [
        ["Gishamvu", -2.6284, 29.7453],
        ["Karama", -2.5942, 29.7897],
        ["Maraba", -2.5523, 29.7442],
        ["Mukura", -2.5831, 29.6789],
        ["Ngoma", -2.6173, 29.7564],
        ["Rusatira", -2.5789, 29.7654],
        ["Rwaniro", -2.5934, 29.7788],
        ["Simbi", -2.5677, 29.7345],
        ["Kinazi", -2.5845, 29.7567],
        ["Tumba", -2.6012, 29.7432],
        ["Mbazi", -2.5934, 29.7654],
        ["Ruhashya", -2.5878, 29.7789],
        ["Huye", -2.5967, 29.7567],
        ["Kigoma", -2.5845, 29.7432]
      ]
    },
    "Nyanza": {
      "sectors": [
        ["Busasamana", -2.3519, 29.7467],
        ["Cyabakamyi", -2.3228, 29.7892],
        ["Kigoma", -2.3744, 29.7564],
        ["Mukingo", -2.3853, 29.7231],
        ["Ntyazo", -2.3567, 29.7345],
        ["Nyagisozi", -2.3789, 29.7567],
        ["Rwabicuma", -2.3456, 29.7678],
        ["Kibirizi", -2.3678, 29.7789],
        ["Muyira", -2.3567, 29.7567],
        ["Nyanza", -2.3789, 29.7678]
      ]
    },
    "Gisagara": {
      "sectors": [
        ["Gikonko", -2.4672, 29.8564],
        ["Kibirizi", -2.4233, 29.8789],
        ["Mamba", -2.4458, 29.8453],
        ["Muganza", -2.4567, 29.8678],
        ["Mukindo", -2.4345, 29.8567],
        ["Musha", -2.4789, 29.8345],
        ["Ndora", -2.4234, 29.8567],
        ["Nyanza", -2.4567, 29.8789],
        ["Save", -2.4789, 29.8567],
        ["Kansi", -2.4567, 29.8345],
        ["Kigembe", -2.4789, 29.8678],
        ["Gishubi", -2.4567, 29.8789],
        ["Mugombwa", -2.4345, 29.8567]
      ]
    },
    "Nyaruguru": {
      "sectors": [
        ["Busanze", -2.7234, 29.6567],
        ["Cyahinda", -2.7456, 29.6678],
        ["Kibeho", -2.7567, 29.6789],
        ["Mata", -2.7678, 29.6567],
        ["Muganza", -2.7789, 29.6678],
        ["Munini", -2.7234, 29.6789],
        ["Ngera", -2.7456, 29.6567],
        ["Ngoma", -2.7567, 29.6678],
        ["Nyabimata", -2.7678, 29.6789],
        ["Nyagisozi", -2.7789, 29.6567],
        ["Ruheru", -2.7234, 29.6678],
        ["Ruramba", -2.7456, 29.6789],
        ["Rusenge", -2.7567, 29.6567],
        ["Kivu", -2.7678, 29.6678]
      ]
    },
    "Nyamagabe": {
      "sectors": [
        ["Buruhukiro", -2.4234, 29.5567],
        ["Cyanika", -2.4456, 29.5678],
        ["Gatare", -2.4567, 29.5789],
        ["Kaduha", -2.4678, 29.5567],
        ["Kamegeri", -2.4789, 29.5678],
        ["Kibirizi", -2.4234, 29.5789],
        ["Kibumbwe", -2.4456, 29.5567],
        ["Kitabi", -2.4567, 29.5678],
        ["Mbazi", -2.4678, 29.5789],
        ["Mugano", -2.4789, 29.5567],
        ["Musange", -2.4234, 29.5678],
        ["Mushubi", -2.4456, 29.5789],
        ["Nkomane", -2.4567, 29.5567],
        ["Tare", -2.4678, 29.5678],
        ["Gasaka", -2.4789, 29.5789],
        ["Uwinkingi", -2.4234, 29.5567],
        ["Rugano", -2.4456, 29.5678]
      ]
    },
    "Ruhango": {
      "sectors": [
        ["Bweramana", -2.2234, 29.7567],
        ["Byimana", -2.2456, 29.7678],
        ["Kabagari", -2.2567, 29.7789],
        ["Kinazi", -2.2678, 29.7567],
        ["Kinihira", -2.2789, 29.7678],
        ["Mbuye", -2.2234, 29.7789],
        ["Mwendo", -2.2456, 29.7567],
        ["Ntongwe", -2.2567, 29.7678],
        ["Ruhango", -2.2678, 29.7789],
        ["Byimana", -2.2789, 29.7567]
      ]
    },
    "Muhanga": {
      "sectors": [
        ["Cyeza", -2.1234, 29.7567],
        ["Kabacuzi", -2.1456, 29.7678],
        ["Kibangu", -2.1567, 29.7789],
        ["Kiyumba", -2.1678, 29.7567],
        ["Muhanga", -2.1789, 29.7678],
        ["Mushishiro", -2.1234, 29.7789],
        ["Nyabinoni", -2.1456, 29.7567],
        ["Nyamabuye", -2.1567, 29.7678],
        ["Nyarusange", -2.1678, 29.7789],
        ["Rongi", -2.1789, 29.7567],
        ["Rugendabari", -2.1234, 29.7678],
        ["Shyogwe", -2.1456, 29.7789]
      ]
    },
    "Kamonyi": {
      "sectors": [
        ["Gacurabwenge", -2.0234, 29.7567],
        ["Karama", -2.0456, 29.7678],
        ["Kayenzi", -2.0567, 29.7789],
        ["Kayumbu", -2.0678, 29.7567],
        ["Mugina", -2.0789, 29.7678],
        ["Musambira", -2.0234, 29.7789],
        ["Ngamba", -2.0456, 29.7567],
        ["Nyamiyaga", -2.0567, 29.7678],
        ["Nyarubaka", -2.0678, 29.7789],
        ["Rukoma", -2.0789, 29.7567],
        ["Runda", -2.0234, 29.7678],
        ["Rugarika", -2.0456, 29.7789]
      ]
    },

    "Karongi": {
      "sectors": [
        ["Bwishyura", -2.0789, 29.3453],
        ["Gishyita", -2.1234, 29.3789],
        ["Murambi", -2.0567, 29.3231],
        ["Rubengera", -2.0892, 29.3564],
        ["Gashari", -2.0678, 29.3456],
        ["Gitesi", -2.0789, 29.3567],
        ["Mubuga", -2.0567, 29.3678],
        ["Murundi", -2.0789, 29.3789],
        ["Mutuntu", -2.0567, 29.3567],
        ["Rwankuba", -2.0789, 29.3678],
        ["Rugabano", -2.0567, 29.3789],
        ["Ruganda", -2.0789, 29.3567],
        ["Twumba", -2.0567, 29.3678]
      ]
    },
    "Rubavu": {
      "sectors": [
        ["Gisenyi", -1.7023, 29.2564],
        ["Nyamyumba", -1.6789, 29.2789],
        ["Rugerero", -1.7231, 29.2453],
        ["Bugeshi", -1.6934, 29.2567],
        ["Busasamana", -1.7123, 29.2678],
        ["Cyanzarwe", -1.6845, 29.2789],
        ["Kanama", -1.7234, 29.2567],
        ["Kanzenze", -1.6956, 29.2678],
        ["Mudende", -1.7123, 29.2789],
        ["Nyakiriba", -1.6845, 29.2567],
        ["Nyundo", -1.7234, 29.2678],
        ["Rubavu", -1.6956, 29.2789]
      ]
    },
    "Rusizi": {
      "sectors": [
        ["Bugarama", -2.6789, 29.0453],
        ["Gihundwe", -2.6234, 29.0789],
        ["Kamembe", -2.6453, 29.0231],
        ["Butare", -2.6567, 29.0567],
        ["Bweyeye", -2.6789, 29.0678],
        ["Gikundamvura", -2.6234, 29.0789],
        ["Gashonga", -2.6453, 29.0567],
        ["Gitambi", -2.6567, 29.0678],
        ["Mururu", -2.6789, 29.0789],
        ["Nkanka", -2.6234, 29.0567],
        ["Nkombo", -2.6453, 29.0678],
        ["Nkungu", -2.6567, 29.0789],
        ["Nyakabuye", -2.6789, 29.0567],
        ["Nyakarenzo", -2.6234, 29.0678],
        ["Nzahaha", -2.6453, 29.0789],
        ["Rwimbogo", -2.6567, 29.0567],
        ["Muganza", -2.6789, 29.0678]
      ]
    },
    "Nyamasheke": {
      "sectors": [
        ["Kagano", -2.3234, 29.1567],
        ["Kanjongo", -2.3456, 29.1678],
        ["Karambi", -2.3567, 29.1789],
        ["Karengera", -2.3678, 29.1567],
        ["Kilimbi", -2.3789, 29.1678],
        ["Macuba", -2.3234, 29.1789],
        ["Mahembe", -2.3456, 29.1567],
        ["Nyabitekeri", -2.3567, 29.1678],
        ["Rangiro", -2.3678, 29.1789],
        ["Ruharambuga", -2.3789, 29.1567],
        ["Shangi", -2.3234, 29.1678],
        ["Bushekeri", -2.3456, 29.1789],
        ["Bushenge", -2.3567, 29.1567],
        ["Cyato", -2.3678, 29.1678]
      ]
    },
    "Nyabihu": {
      "sectors": [
        ["Bigogwe", -1.6234, 29.5567],
        ["Jenda", -1.6456, 29.5678],
        ["Jomba", -1.6567, 29.5789],
        ["Kabatwa", -1.6678, 29.5567],
        ["Karago", -1.6789, 29.5678],
        ["Kintobo", -1.6234, 29.5789],
        ["Mukamira", -1.6456, 29.5567],
        ["Muringa", -1.6567, 29.5678],
        ["Rambura", -1.6678, 29.5789],
        ["Rugera", -1.6789, 29.5567],
        ["Rurembo", -1.6234, 29.5678],
        ["Shyira", -1.6456, 29.5789]
      ]
    },
    "Ngororero": {
      "sectors": [
        ["Bwira", -1.8234, 29.6567],
        ["Gatumba", -1.8456, 29.6678],
        ["Hindiro", -1.8567, 29.6789],
        ["Kabaya", -1.8678, 29.6567],
        ["Kageyo", -1.8789, 29.6678],
        ["Kavumu", -1.8234, 29.6789],
        ["Matyazo", -1.8456, 29.6567],
        ["Muhanda", -1.8567, 29.6678],
        ["Muhororo", -1.8678, 29.6789],
        ["Ndaro", -1.8789, 29.6567],
        ["Ngororero", -1.8234, 29.6678],
        ["Nyange", -1.8456, 29.6789],
        ["Sovu", -1.8567, 29.6567]
      ]
    },
    "Rutsiro": {
      "sectors": [
        ["Boneza", -1.9234, 29.4567],
        ["Gihango", -1.9456, 29.4678],
        ["Kigeyo", -1.9567, 29.4789],
        ["Kivumu", -1.9678, 29.4567],
        ["Manihira", -1.9789, 29.4678],
        ["Mukura", -1.9234, 29.4789],
        ["Murunda", -1.9456, 29.4567],
        ["Musasa", -1.9567, 29.4678],
        ["Mushonyi", -1.9678, 29.4789],
        ["Mushubati", -1.9789, 29.4567],
        ["Nyabirasi", -1.9234, 29.4678],
        ["Ruhango", -1.9456, 29.4789],
        ["Rusebeya", -1.9567, 29.4567]
      ]
    }
  }
};

// Make the data available globally
if (typeof window !== 'undefined') {
  window.districtsData = districtsData;
}

const RwandaMap = () => {
  const [map, setMap] = useState(null);
  const [sectorDetails, setSectorDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSectorDetails = async (district, sector) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/resource_allocation/district-sector-data/?district=${encodeURIComponent(district)}&sector=${encodeURIComponent(sector)}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch sector details');
      }
      
      const data = await response.json();
      setSectorDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const SectorDetailsCard = ({ details }) => {
    if (!details) return null;

    return (
      <div className="absolute right-4 top-4 w-96 bg-white rounded-lg shadow-lg p-4 z-[1000]">
        <h3 className="text-lg font-semibold mb-2 text-blue-700">{details.sector}, {details.district}</h3>
        
        {details.population_data && (
          <div className="mb-3">
            <h4 className="font-medium text-black">Population:</h4>
            <p className='text-gray-700'>{details.population_data.total_population?.toLocaleString() || 'N/A'}</p>
          </div>
        )}

        <div className="mb-3">
          <h4 className="font-medium text-black">Health Facilities:</h4>
          <p className='text-gray-700 mb-2'>Total Facilities: {details.health_facilities.total_count}</p>
          <p className='text-gray-700 mb-2'>Total Capacity: {details.health_facilities.total_capacity}</p>
          
          {details.health_facilities.grouped_by_type && (
            <div className="ml-2">
              {Object.entries(details.health_facilities.grouped_by_type).map(([type, facilities]) => (
                <div key={type} className="mb-2">
                  <h5 className="text-sm font-medium text-blue-600">{type}:</h5>
                  <ul className="list-disc ml-4">
                    {facilities.map((facility, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {facility.name} (Capacity: {facility.capacity})
                        {facility.specializations && (
                          <span className="block text-xs text-gray-500 ml-2">
                            Specializations: {facility.specializations.join(', ')}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-3">
          <h4 className="font-medium text-black">Accessibility:</h4>
          <p className='text-gray-700'>Avg. Travel Time: {details.accessibility_metrics.average_travel_time} min</p>
        </div>

        <div className="mb-3">
          <h4 className="font-medium text-black">Disease Incidents:</h4>
          <p className='text-gray-700'>Total Reports: {details.disease_incidents.total_count}</p>
        </div>

        <div>
          <h4 className="font-medium text-black">Resource Allocations:</h4>
          <p className='text-gray-700'>Total Allocations: {details.resource_allocations.total_count}</p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const L = window.L;
    if (!L) return;

    const rwandaBounds = L.latLngBounds(
      [-2.8, 28.8],
      [-1.0, 30.9]
    );

    const mapDiv = document.getElementById("map");
    if (!mapDiv._leaflet_id) {
      const newMap = L.map("map", {
        center: [-1.9441, 29.8739],
        zoom: 9,
        maxBounds: rwandaBounds,
        minZoom: 8,
        maxZoom: 12
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
        bounds: rwandaBounds
      }).addTo(newMap);

      Object.entries(window.districtsData?.districts || {}).forEach(([districtName, districtData]) => {
        const sectors = districtData.sectors;
        
        const centerLat = sectors.reduce((sum, sector) => sum + sector[1], 0) / sectors.length;
        const centerLon = sectors.reduce((sum, sector) => sum + sector[2], 0) / sectors.length;
        
        const districtMarker = L.circleMarker([centerLat, centerLon], {
          radius: 8,
          fillColor: "#3388ff",
          color: "#fff",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(newMap);

        sectors.forEach(sector => {
          const sectorMarker = L.circleMarker([sector[1], sector[2]], {
            radius: 4,
            fillColor: "#ff7800",
            color: "#fff",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
          }).addTo(newMap);

          // Add hover events for sectors
          sectorMarker.on('mouseover', () => {
            sectorMarker.setStyle({
              fillColor: "#ff0000",
              radius: 6
            });
            fetchSectorDetails(districtName, sector[0]);
          });

          sectorMarker.on('mouseout', () => {
            sectorMarker.setStyle({
              fillColor: "#ff7800",
              radius: 4
            });
            setSectorDetails(null);
          });

          sectorMarker.bindPopup(`
            <div>
              <strong>District:</strong> ${districtName}<br/>
              <strong>Sector:</strong> ${sector[0]}
            </div>
          `);
        });

        districtMarker.bindPopup(`
          <div>
            <strong>${districtName} District</strong><br/>
            Number of Sectors: ${sectors.length}
            <div style="margin-top: 8px;">
              <strong>Sectors:</strong><br/>
              ${sectors.map(s => s[0]).join(', ')}
            </div>
          </div>
        `);
      });

      const searchControl = L.Control.extend({
        options: {
          position: 'topleft'
        },

        onAdd: function(map) {
          const container = L.DomUtil.create('div', 'leaflet-control leaflet-control-search');
          container.style.backgroundColor = 'white';
          container.style.padding = '5px';
          container.style.borderRadius = '4px';

          const input = L.DomUtil.create('input', 'search-input', container);
          input.type = 'text';
          input.placeholder = 'Search districts...';
          input.style.padding = '4px';
          input.style.width = '200px';

          L.DomEvent.on(input, 'keyup', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const districts = window.districtsData?.districts || {};
            
            Object.entries(districts).forEach(([districtName, data]) => {
              if (districtName.toLowerCase().includes(searchTerm)) {
                const sectors = data.sectors;
                const centerLat = sectors.reduce((sum, sector) => sum + sector[1], 0) / sectors.length;
                const centerLon = sectors.reduce((sum, sector) => sum + sector[2], 0) / sectors.length;
                map.setView([centerLat, centerLon], 10);
              }
            });
          });

          return container;
        }
      });

      newMap.addControl(new searchControl());
      setMap(newMap);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]);

  return (
    <div className="w-full relative">
      <div className="text-xl font-bold mb-4">Rwanda Districts and Sectors Map</div>
      <div id="map" className="h-[600px] w-full rounded-lg shadow-lg" />
      {loading && (
        <div className="absolute right-4 top-4 bg-white p-4 rounded-lg shadow-lg">
          Loading sector details...
        </div>
      )}
      {error && (
        <div className="absolute right-4 top-4 bg-red-100 text-red-700 p-4 rounded-lg shadow-lg">
          Error: {error}
        </div>
      )}
      <SectorDetailsCard details={sectorDetails} />
      <div className="mt-4 text-sm text-gray-600">
        <p>• Blue markers represent district centers</p>
        <p>• Orange markers represent sectors</p>
        <p>• Hover over sector markers to view detailed information</p>
      </div>
    </div>
  );

};

export default RwandaMap;

