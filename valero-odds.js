// Valero 2026 composite + odds update (parsed Mar 28)
// Patches into TOURNAMENT_DATA.valero

(function() {
    if (!TOURNAMENT_DATA || !TOURNAMENT_DATA.valero) return;

    // Updated composite from 7-model blend (TPC SA 5yr + comp 6mo/3yr + RH20 + RH21)
    TOURNAMENT_DATA.valero.composite = [
        { rank:1, name:"Russell Henley", comp:0.72, form:1.10, signal:"warm", app:0.60, ott:0.29, dd:-8.4, arg:0.29, putt:0.38, t10:14.5, spikes:"RH20#2 RH21#1", flag:"" },
        { rank:2, name:"Tommy Fleetwood", comp:0.70, form:1.08, signal:"warm", app:0.66, ott:0.49, dd:1.4, arg:0.33, putt:0.24, t10:16.2, spikes:"RH20#1 RH21#3", flag:"" },
        { rank:3, name:"Collin Morikawa", comp:0.68, form:1.08, signal:"caution", app:0.96, ott:0.73, dd:2.0, arg:0.05, putt:-0.04, t10:18.5, spikes:"RH20#4 RH21#4", flag:"BACK INJURY" },
        { rank:4, name:"Si Woo Kim", comp:0.66, form:1.15, signal:"warm", app:0.81, ott:0.66, dd:-2.7, arg:0.24, putt:-0.19, t10:16.8, spikes:"RH20#3 RH21#7", flag:"" },
        { rank:5, name:"Sepp Straka", comp:0.64, form:1.08, signal:"warm", app:0.60, ott:0.33, dd:-0.2, arg:0.05, putt:0.12, t10:13.5, spikes:"RH20#6 RH21#6", flag:"" },
        { rank:6, name:"Rickie Fowler", comp:0.62, form:0.88, signal:"cool", app:0.34, ott:0.46, dd:2.2, arg:0.00, putt:0.38, t10:12.8, spikes:"RH20#8 RH21#8", flag:"NEEDS MASTERS SPOT" },
        { rank:7, name:"Ludvig Aberg", comp:0.61, form:1.12, signal:"warm", app:0.59, ott:0.62, dd:12.2, arg:0.12, putt:0.29, t10:18.2, spikes:"RH21#5", flag:"" },
        { rank:8, name:"Hideki Matsuyama", comp:0.60, form:1.08, signal:"warm", app:0.62, ott:-0.01, dd:-0.9, arg:0.45, putt:0.28, t10:16.2, spikes:"RH20#10", flag:"" },
        { rank:9, name:"Maverick McNealy", comp:0.58, form:1.12, signal:"warm", app:0.44, ott:0.43, dd:6.8, arg:0.17, putt:0.29, t10:13.5, spikes:"RH20#7", flag:"" },
        { rank:10, name:"Ryo Hisatsune", comp:0.57, form:1.11, signal:"warm", app:0.47, ott:0.41, dd:0.3, arg:0.11, putt:-0.08, t10:8.8, spikes:"RH21#10", flag:"" },
        { rank:11, name:"Alex Noren", comp:0.56, form:1.08, signal:"warm", app:0.33, ott:-0.06, dd:-6.3, arg:0.28, putt:0.44, t10:11.2, spikes:"RH20#5", flag:"" },
        { rank:12, name:"Sudarshan Yellamaraju", comp:0.55, form:0.96, signal:"neutral", app:0.04, ott:0.26, dd:8.6, arg:-0.04, putt:0.09, t10:7.5, spikes:"", flag:"" },
        { rank:13, name:"Nicolai Hojgaard", comp:0.54, form:1.16, signal:"warm", app:0.52, ott:0.36, dd:14.3, arg:-0.01, putt:0.23, t10:14.2, spikes:"RH21#9", flag:"MAY WD IF MASTERS QUAL" },
        { rank:14, name:"Jordan Spieth", comp:0.53, form:1.02, signal:"neutral", app:0.38, ott:0.09, dd:6.1, arg:0.21, putt:0.29, t10:18.5, spikes:"RH20#9 TPC#1", flag:"TPC SA KING" },
        { rank:15, name:"Keith Mitchell", comp:0.52, form:1.19, signal:"warm", app:0.45, ott:0.56, dd:9.5, arg:-0.03, putt:-0.12, t10:12.8, spikes:"", flag:"" },
    ];

    // Odds board with DK prices
    TOURNAMENT_DATA.valero.oddsBoard = [
        { rank:1, name:"Tommy Fleetwood", fair:"+1200", best:"+1425 DK", b365:"TBD", form:"warm", edge:"-1.6%" },
        { rank:2, name:"Russell Henley", fair:"+1200", best:"+1550 DK", b365:"TBD", form:"warm", edge:"+2.5%" },
        { rank:3, name:"Ludvig Aberg", fair:"+1400", best:"+1600 DK", b365:"TBD", form:"warm", edge:"+1.2%" },
        { rank:4, name:"Si Woo Kim", fair:"+1400", best:"+1750 DK", b365:"TBD", form:"warm", edge:"+2.1%" },
        { rank:5, name:"Collin Morikawa", fair:"+1600", best:"+1800 DK", b365:"TBD", form:"caution", edge:"+1.0%" },
        { rank:6, name:"Jordan Spieth", fair:"+1500", best:"+1900 DK", b365:"TBD", form:"neutral", edge:"+2.2%" },
        { rank:7, name:"Hideki Matsuyama", fair:"+1800", best:"+2250 DK", b365:"TBD", form:"warm", edge:"+2.2%" },
        { rank:8, name:"Maverick McNealy", fair:"+2000", best:"+2350 DK", b365:"TBD", form:"warm", edge:"+1.6%" },
        { rank:9, name:"Rickie Fowler", fair:"+2200", best:"+2700 DK", b365:"TBD", form:"cool", edge:"+2.0%" },
        { rank:10, name:"Sepp Straka", fair:"+2500", best:"+3200 DK", b365:"TBD", form:"warm", edge:"+2.5%" },
        { rank:11, name:"Ryo Hisatsune", fair:"+3500", best:"+5200 DK", b365:"TBD", form:"warm", edge:"+4.2%" },
        { rank:12, name:"Daniel Berger", fair:"+3500", best:"+5400 DK", b365:"TBD", form:"warm", edge:"+4.5%" },
        { rank:13, name:"Marco Penge", fair:"+4000", best:"+5100 DK", b365:"TBD", form:"warm", edge:"+2.2%" },
        { rank:14, name:"Sudarshan Yellamaraju", fair:"+5000", best:"+14000 DK", b365:"TBD", form:"neutral", edge:"+11.8%" },
        { rank:15, name:"Will Zalatoris", fair:"+4500", best:"+7800 DK", b365:"TBD", form:"caution", edge:"+5.2%" },
    ];
})();
